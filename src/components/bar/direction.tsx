import { cn } from "../../utils";

function Direction(props: {
  direction: "vertical" | "horizontal";
  runCommand?: (command: string) => void;
}) {
  return (
    <button
      class={cn(
        "h-8 w-8 flex items-center justify-center text-[var(--icon)] bg-[var(--icon)]/10 rounded-full p-1 transition-all duration-300",
        {
          "rotate-90": props.direction === "vertical",
        }
      )}
      onClick={() => props.runCommand?.(`toggle-tiling-direction`)}
    >
      <i class="nf nf-md-flower_tulip text-lg"></i>
    </button>
  );
}

export default Direction;
