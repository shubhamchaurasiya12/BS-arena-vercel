// D:\BS-arena-NextJS\lib\quiz.service.ts
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

/* ================================
   CONSTANTS
================================ */
const QUESTION_COUNT = 10;
const MIN_POOL_SIZE = 20;
const TIME_LIMIT_SECONDS = 3600;

/* ================================
   TYPES
================================ */
type QuestionRow = {
  id: string;
  question: string;
  options: string[];
  correct_option: number;
};

type SelectedQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;     // used internally
  questionOrder: number;   // used internally
};

type StartQuizArgs = {
  userId: string;
  quizId: string;
  bet: number;
};

type AttemptArgs = {
  userId: string;
  attemptId: string;
};

type SubmitArgs = {
  userId: string;
  attemptId: string;
  answers: Record<string, number>;
};

/* ================================
   HELPERS
================================ */
function shuffleArray<T>(array: T[]): T[] {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

function getElapsedSeconds(startTime: string): number {
  let timeStr = startTime;
  if (!timeStr.endsWith("Z") && !timeStr.includes("+")) {
    timeStr += "Z";
  }
  const start = new Date(timeStr).getTime();
  const now = Date.now();
  return Math.floor((now - start) / 1000);
}

// Clean LaTeX escaping from PostgreSQL JSONB
function cleanLatex(text: string): string {
  return text.replace(/\\\\/g, '\\');
}

/* ================================
   ▶️ START QUIZ
================================ */
export async function startQuizAttempt({
  userId,
  quizId,
  bet,
}: StartQuizArgs) {
  const { data: quiz } = await supabase
    .from("quizzes")
    .select("id")
    .eq("id", quizId)
    .single();

  if (!quiz) {
    throw { status: 404, message: "Quiz not found" };
  }

  const { data: activeAttempt } = await supabase
    .from("quiz_attempts")
    .select("id")
    .eq("user_id", userId)
    .eq("quiz_id", quizId)
    .eq("status", "IN_PROGRESS")
    .maybeSingle();

  if (activeAttempt) {
    throw { status: 409, message: "Quiz already in progress" };
  }

  if (!bet || bet <= 0) {
    throw { status: 400, message: "Invalid bet amount" };
  }

  const { data: user } = await supabase
    .from("users")
    .select("total_points")
    .eq("id", userId)
    .single();

  if (!user || bet > user.total_points) {
    throw { status: 400, message: "Insufficient points" };
  }

  const { data: pool } = await supabase
    .from("questions")
    .select("id, question, options, correct_option")
    .eq("quiz_id", quizId);

  if (!pool || pool.length < MIN_POOL_SIZE) {
    throw {
      status: 500,
      message: `Not enough questions (need ${MIN_POOL_SIZE})`,
    };
  }

  const typedPool = pool as QuestionRow[];
  const selected = shuffleArray(typedPool).slice(0, QUESTION_COUNT);

  const finalizedQuestions: SelectedQuestion[] = selected.map(
    (q, index) => {
      const shuffledOptions = shuffleArray(q.options);
      const correctValue = q.options[q.correct_option] ?? "";
      const correctIndex = shuffledOptions.indexOf(correctValue);

      return {
        id: q.id,
        question: q.question,
        options: shuffledOptions,
        correctIndex,
        questionOrder: index,
      };
    }
  );

  await supabase
    .from("users")
    .update({ total_points: user.total_points - bet })
    .eq("id", userId);

  await supabase.from("points_history").insert({
    id: uuidv4(),
    user_id: userId,
    change: -bet,
    reason: "Quiz bet placed",
  });

  const attemptId = uuidv4();
  const startTime = new Date().toISOString();

  await supabase.from("quiz_attempts").insert({
    id: attemptId,
    user_id: userId,
    quiz_id: quizId,
    bet,
    selected_questions: finalizedQuestions,
    answers: {},
    score: null,
    status: "IN_PROGRESS",
    tab_switch_count: 0,
    start_time: startTime,
    time_limit: TIME_LIMIT_SECONDS,
    points_applied: false,
  });

  return {
    attemptId,
    quiz: {
      id: quizId,
      timeLimit: TIME_LIMIT_SECONDS,
      startTime,
    },
    questions: finalizedQuestions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
    })),
  };
}

/* ================================
   🔁 FETCH ATTEMPT
================================ */
export async function getQuizAttempt({
  userId,
  attemptId,
}: AttemptArgs) {
  const { data: attempt } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("id", attemptId)
    .single();

  if (!attempt) {
    throw { status: 404, message: "Quiz attempt not found" };
  }

  if (attempt.user_id !== userId) {
    throw { status: 403, message: "Access denied" };
  }

  const elapsed = getElapsedSeconds(attempt.start_time);
  const remainingTime = Math.max(attempt.time_limit - elapsed, 0);

  const questions = (attempt.selected_questions as SelectedQuestion[]).map(
    (q) => ({
      id: q.id,
      question: cleanLatex(q.question),
      options: q.options.map(opt => cleanLatex(opt)),
    })
  );

  return {
    attemptId: attempt.id,
    quiz: {
      id: attempt.quiz_id,
      timeLimit: attempt.time_limit,
      remainingTime,
      status: attempt.status,
    },
    questions,
    answers: (attempt.answers ?? {}) as Record<string, number>,
  };
}

/* ================================
   📤 SUBMIT QUIZ
================================ */
export async function submitQuizAttempt({
  userId,
  attemptId,
  answers,
}: SubmitArgs) {
  const { data: attempt } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("id", attemptId)
    .single();

  if (!attempt) {
    throw { status: 404, message: "Quiz attempt not found" };
  }

  if (attempt.user_id !== userId) {
    throw { status: 403, message: "Access denied" };
  }

  if (attempt.status !== "IN_PROGRESS") {
    return {
      attemptId,
      score: attempt.score || 0,
      status: attempt.status,
      message: "Quiz already submitted",
    };
  }

  const questions = attempt.selected_questions as SelectedQuestion[];
  let correct = 0;

  for (const q of questions) {
    if (answers[q.id] === q.correctIndex) correct++;
  }

  const percentage = Math.round((correct / questions.length) * 100);
  const elapsed = getElapsedSeconds(attempt.start_time);
  const isLate = elapsed > attempt.time_limit + 60;

  const status =
    percentage >= 80
      ? "COMPLETED"
      : isLate
      ? "AUTO_SUBMITTED"
      : "FAILED_SCORE";

  await supabase
    .from("quiz_attempts")
    .update({ answers, score: percentage, status })
    .eq("id", attemptId);

  return {
    attemptId,
    score: percentage,
    correct,
    total: questions.length,
    status,
  };
}

/* ================================
   🛡 TAB SWITCH
================================ */
export async function recordTabSwitch({
  userId,
  attemptId,
}: AttemptArgs) {
  const { data: attempt } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("id", attemptId)
    .single();

  if (!attempt || attempt.user_id !== userId) {
    throw { status: 403, message: "Access denied" };
  }

  if (attempt.status !== "IN_PROGRESS") {
    return { status: attempt.status };
  }

  const newCount = (attempt.tab_switch_count || 0) + 1;

  await supabase
    .from("quiz_attempts")
    .update({ tab_switch_count: newCount })
    .eq("id", attemptId);

  if (newCount >= 3) {
    await supabase
      .from("quiz_attempts")
      .update({ status: "FAILED_CHEATING" })
      .eq("id", attemptId);

    return {
      status: "FAILED_CHEATING",
      tabSwitchCount: newCount,
      message: "Quiz failed due to tab switching",
    };
  }

  return {
    status: "IN_PROGRESS",
    tabSwitchCount: newCount,
    warning: true,
    message: `⚠️ Warning ${newCount}/2: Do not switch tabs!`,
  };
}

/* ================================
   💰 APPLY POINTS (CORRECT LOGIC)
================================ */
export async function applyQuizPoints({
  userId,
  attemptId,
}: {
  userId: string;
  attemptId: string;
}) {
  // ============================
  // 1️⃣ Fetch Attempt
  // ============================

  const { data: attempt, error: attemptError } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("id", attemptId)
    .single();

  if (attemptError || !attempt) {
    throw new Error("Attempt not found");
  }

  if (attempt.user_id !== userId) {
    throw new Error("Unauthorized");
  }

  if (attempt.points_applied) {
    return {
      success: true,
      newTotalPoints: null,
      message: "Points already applied",
    };
  }

  const won = attempt.score >= 80;

  // ============================
  // 2️⃣ Fetch user
  // ============================

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("total_points, active_subject_count")
    .eq("id", userId)
    .single();

  if (userError || !user) {
    throw new Error("User not found");
  }

  let newTotalPoints = user.total_points;

  // ============================
  // 3️⃣ Apply Win Logic
  // ============================

  if (won) {
    const reward = attempt.bet * 2;

    newTotalPoints = user.total_points + reward;

    await supabase.from("points_history").insert({
      id: uuidv4(),
      user_id: userId,
      change: reward,
      reason: "Quiz win reward",
    });
  }

  // ============================
  // 4️⃣ Update user
  // ============================

  await supabase
    .from("users")
    .update({ total_points: newTotalPoints })
    .eq("id", userId);

  // ============================
  // 5️⃣ Mark points applied
  // ============================

  await supabase
    .from("quiz_attempts")
    .update({ points_applied: true })
    .eq("id", attemptId);

  // ============================
  // 6️⃣ Recalculate group stats
  // ============================

  const { data: membership } = await supabase
    .from("group_members")
    .select("group_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (membership) {
    await recalculateGroupStats(membership.group_id);
  }

  return {
    success: true,
    newTotalPoints,
  };
}



/* ================================
   📊 GET RESULT
================================ */
export async function getQuizResult({
  userId,
  attemptId,
}: AttemptArgs) {
  const { data: attempt } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("id", attemptId)
    .single();

  if (!attempt || attempt.user_id !== userId) {
    throw { status: 403, message: "Access denied" };
  }

  if (attempt.status === "IN_PROGRESS") {
    throw { status: 400, message: "Quiz not submitted" };
  }

  const selectedQuestions = attempt.selected_questions as SelectedQuestion[];
  const userAnswers = attempt.answers as Record<string, number>;

  const questions = selectedQuestions.map((q) => ({
    id: q.id,
    question: cleanLatex(q.question),
    options: q.options.map(opt => cleanLatex(opt)),
    correctIndex: q.correctIndex,
    userAnswer:
      userAnswers[q.id] !== undefined ? userAnswers[q.id] : null,
    isCorrect: userAnswers[q.id] === q.correctIndex,
  }));

  const correct = questions.filter((q) => q.isCorrect).length;
  const percentage =
    attempt.score ?? Math.round((correct / questions.length) * 100);

  return {
    attemptId,
    score: percentage,
    correct,
    total: questions.length,
    won: percentage >= 80,
    bet: attempt.bet,
    pointsChange: percentage >= 80 ? attempt.bet * 2 : 0,
    status: attempt.status,
    questions,
    tabSwitchCount: attempt.tab_switch_count || 0,
  };
}

export async function recalculateGroupStats(groupId: string) {
  const { data: members } = await supabase
    .from("group_members")
    .select("user_id")
    .eq("group_id", groupId);

  if (!members || members.length === 0) return;

  let totalPoints = 0;
  let totalLP = 0;

  for (const member of members) {
    const { data: user } = await supabase
      .from("users")
      .select("total_points, active_subject_count")
      .eq("id", member.user_id)
      .single();

    // Add null check for user
    if (!user) continue;

    const lp =
      user.total_points /
      Math.max(user.active_subject_count, 1);

    totalPoints += user.total_points;
    totalLP += lp;
  }

  const totalMembers = members.length;

  await supabase
    .from("group_stats")
    .update({
      total_points: totalPoints,
      total_leaderboard_points: totalLP,
      total_members: totalMembers,
      updated_at: new Date(),
    })
    .eq("group_id", groupId);

  await supabase
    .from("groups")
    .update({
      is_active: totalMembers >= 2,
    })
    .eq("id", groupId);
}
