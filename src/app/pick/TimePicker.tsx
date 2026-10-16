"use client";

import { useActionState, useState } from "react";
import { savePickedTime } from "@/app/actions";
import { formatTime, to24h } from "@/lib/time";
import WheelColumn from "./WheelColumn";

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
const PERIODS = ["AM", "PM"];

export default function TimePicker(): React.JSX.Element {
  const [hourIdx, setHourIdx] = useState(8); // 09
  const [minuteIdx, setMinuteIdx] = useState(0); // 00
  const [periodIdx, setPeriodIdx] = useState(0); // AM
  const [state, action, pending] = useActionState(savePickedTime, null);

  const time = to24h(
    hourIdx + 1,
    minuteIdx,
    PERIODS[periodIdx] as "AM" | "PM",
  );

  return (
    <form action={action}>
      <input type="hidden" name="time" value={time} />

      <div className="flex items-center justify-center gap-1">
        <WheelColumn
          label="Hour"
          options={HOURS}
          index={hourIdx}
          onChange={setHourIdx}
          loop
          className="w-20"
        />
        <span className="pb-1 text-3xl font-bold text-stone-400">:</span>
        <WheelColumn
          label="Minute"
          options={MINUTES}
          index={minuteIdx}
          onChange={setMinuteIdx}
          loop
          className="w-20"
        />
        <WheelColumn
          label="AM or PM"
          options={PERIODS}
          index={periodIdx}
          onChange={setPeriodIdx}
          className="ml-2 w-20"
        />
      </div>

      <p className="mt-4 text-center text-stone-600">
        October 25, Sunday at{" "}
        <span className="font-bold text-orange-600">{formatTime(time)}</span>
      </p>

      {state?.error && (
        <p role="alert" className="mt-3 text-center text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 w-full rounded-full bg-orange-500 px-6 py-3 font-semibold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600 disabled:opacity-60"
      >
        {pending ? "Saving..." : "Proceed"}
      </button>
    </form>
  );
}
