//D:\BS-arena-NextJS\app\api\quiz\[quizID]\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/Supabase';

export async function GET(
  req: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    const { quizId } = params;
    const supabase = createClient();

    const { data: quiz, error } = await supabase
      .from('quizzes')
      .select('id, subject_id, phase, week, time_limit, published, total_questions')
      .eq('id', quizId)
      .single();

    if (error) throw error;

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}