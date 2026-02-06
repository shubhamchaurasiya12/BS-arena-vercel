import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DeleteSubjectButton from "@/components/DeleteSubjectButton";
import AuthUserSync from "@/components/AuthUserSync";

type DashboardData = {
  user: {
    id: string;
    name: string;
    email: string;
    total_points: number;
    active_subject_count: number;
  };
  subjects: {
    subject_id: string;
    subjects: {
      name: string;
    };
  }[];
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/dashboard`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (res.status === 401) {
    redirect("/login");
  }

  const data: DashboardData = await res.json();

  return (
    <main className="min-h-screen p-6 bg-gray-100">
      {/* 🔑 CRITICAL LINE */}
      <AuthUserSync user={data.user} />

      <h1 className="text-3xl font-bold mb-6">
        Welcome, {data.user.name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">
            Your Stats
          </h2>
          <p>Total Points: {data.user.total_points}</p>
          <p>Active Subjects: {data.user.active_subject_count}</p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Subjects</h2>

        <div className="grid grid-cols-2 gap-4">
          {data.subjects.map((s) => (
            <div
              key={s.subject_id}
              className="relative bg-white p-4 rounded shadow hover:bg-blue-50"
            >
              <a href={`/notes?subjectId=${s.subject_id}`}>
                <h3 className="font-semibold">
                  {s.subjects.name}
                </h3>
              </a>

              <DeleteSubjectButton subjectId={s.subject_id} />
            </div>
          ))}

          {Array.from({ length: 4 - data.subjects.length }).map((_, i) => (
            <a
              key={`empty-${i}`}
              href="/subject-selection"
              className="bg-gray-100 p-4 rounded border-2 border-dashed
                         flex items-center justify-center text-gray-400"
            >
              + Add Subject
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}