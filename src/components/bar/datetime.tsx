import * as zebar from "zebar";
import { cn } from "../../utils";

function Datetime(props: { datetime: zebar.DateOutput }) {
  // Format time as HH:mm:ss
  const timeString = props.datetime.new.toLocaleTimeString("en-US", {
    hour12: false,
  });
  // Format date as e.g. "Mon, 1. Jan 2024"
  const dateString = props.datetime.new.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      class={cn(
        "h-8 flex group items-center justify-center overflow-hidden gap-2 text-[var(--memory)] bg-[var(--memory)]/10 rounded-full pr-3 pl-4 relative"
      )}
    >
      <i class="ti ti-clock text-lg w-fit"></i>
      <div class="w-fit rounded-full text-md relative overflow-hidden group-hover:translate-y-6 group-hover:opacity-0 transition-all duration-300">
        {timeString}
      </div>

      <span class="transition-all duration-300 absolute left-12 text-lg opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0">
        {dateString}
      </span>
    </div>
  );
}

export default Datetime;
