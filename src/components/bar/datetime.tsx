import * as zebar from "zebar";
import { cn } from "../../utils";
import { createSignal, createEffect, onCleanup } from "solid-js";

function Datetime(props: { noIcon?: boolean }) {
  const [now, setNow] = createSignal(new Date());

  createEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    onCleanup(() => clearInterval(interval));
  });

  const timeString = () =>
    now().toLocaleTimeString(undefined, {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

  const dateString = () =>
    now().toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div
      class={cn(
        "h-8 flex group items-center transition-all duration-300 justify-center overflow-hidden gap-2 text-[var(--memory)] bg-[var(--memory)]/10 rounded-full pr-3 pl-4 relative"
      )}
      style={{
        width: `calc(${timeString().length}ch + 4rem)`,
        "--datetime-date-width": `calc(${dateString().length}ch + 0.5rem)`,
        "--datetime-time-width": `calc(${timeString().length}ch + 0.5rem)`,
      }}
    >
      {!props.noIcon && (
        <>
          <i class="ti ti-clock text-lg group-hover:hidden"></i>
          <i class="ti ti-calendar text-lg group-hover:block hidden"></i>
        </>
      )}
      <div
        class="rounded-full text-base relative group-hover:absolute overflow-hidden group-hover:opacity-0 transition-all duration-300"
        style={{
          width: "var(--datetime-time-width)",
        }}
      >
        {timeString()}
      </div>

      <span class="transition-all duration-300 absolute group-hover:relative text-base opacity-0 group-hover:opacity-100 whitespace-nowrap">
        {dateString()}
      </span>
      <style>
        {`
          .group:hover {
            width: calc(var(--datetime-date-width) + 5rem) !important;
          }
        `}
      </style>
    </div>
  );
}

export default Datetime;
