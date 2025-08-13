import { cn } from "../../lib/utils";
import { createSignal, createEffect, onCleanup } from "solid-js";

function Datetime(props: { noIcon?: boolean }) {
  const [now, setNow] = createSignal(new Date());

  createEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    onCleanup(() => clearInterval(interval));
  });

  // Format: ddd dd MMM hh:mm
  function formattedDateTime() {
    const date = now();
    const weekday = date.toLocaleDateString(undefined, { weekday: "short" });
    const day = date.toLocaleDateString(undefined, { day: "2-digit" });
    const month = date.toLocaleDateString(undefined, { month: "short" });
    const hour = date.toLocaleTimeString(undefined, {
      hour12: false,
      hour: "2-digit",
    });
    let minute = date.getMinutes();
    const minuteStr = minute < 10 ? `0${minute}` : `${minute}`;

    return `${weekday} ${day} ${month} ${hour}:${minuteStr}`;
  }

  return (
    <div
      class={cn(
        "h-8 flex items-center transition-all duration-300 justify-center overflow-hidden gap-2 text-[var(--memory)] bg-[var(--memory)]/10 rounded-full pr-3 pl-4 relative"
      )}
    >
      {!props.noIcon && <i class="ti ti-clock text-lg"></i>}
      <div class="rounded-full text-base font-semibold">
        {formattedDateTime()}
      </div>
    </div>
  );
}

export default Datetime;
