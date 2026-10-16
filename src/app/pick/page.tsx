import TimePicker from "./TimePicker";

export default function PickPage(): React.JSX.Element {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl ring-1 ring-orange-100">
        <div className="text-center text-6xl" aria-hidden>
          🎉
        </div>
        <h1 className="mt-4 text-center text-2xl font-bold">
          What time works for you?
        </h1>
        <p className="mb-6 mt-2 text-center text-stone-600">
          Pick a time for coffee next Sunday (October 25)
        </p>
        <TimePicker />
      </div>
    </main>
  );
}
