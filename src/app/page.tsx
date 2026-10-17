import Link from "next/link";
import NotInterestedSheet from "./NotInterestedSheet";

export default function Home(): React.JSX.Element {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 text-center sm:p-8 shadow-xl ring-1 ring-orange-100">
        <div className="animate-float text-7xl" aria-hidden>
          ☕
        </div>

        <h1 className="mt-6 text-2xl font-bold leading-snug sm:text-3xl">
          Alvin wants to meet you.
        </h1>
        <p className="mt-2 text-lg text-stone-600">
          Are you up for coffee on Sunday, October 25?
        </p>

        <div className="mt-8 flex gap-3">
          <NotInterestedSheet />
          <Link
            href="/pick"
            className="flex-1 rounded-full bg-orange-500 px-4 py-3 sm:px-6 font-semibold text-white shadow-md shadow-orange-200 transition hover:scale-105 hover:bg-orange-600"
          >
            Yes
          </Link>
        </div>
      </div>
    </main>
  );
}
