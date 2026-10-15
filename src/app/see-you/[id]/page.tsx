import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { formatTime } from "@/lib/time";

export const dynamic = "force-dynamic";

export default async function SeeYouPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<React.JSX.Element> {
  const { id } = await params;

  const { data, error } = await getSupabase()
    .from("date_plans")
    .select("picked_time")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-orange-100">
        <div className="animate-float text-7xl" aria-hidden>
          ☕
        </div>
        <h1 className="mt-6 text-2xl font-bold sm:text-3xl">
          See you on Sunday {formatTime(data.picked_time)}
        </h1>
      </div>
    </main>
  );
}
