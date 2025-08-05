import * as zebar from "zebar";
import { cn } from "../../utils";

function Cpu(props: { cpu: zebar.CpuOutput }) {
  return (
    <div
      class={cn(
        "h-8 flex group items-center justify-center overflow-hidden gap-2 text-[var(--cpu)] bg-[var(--cpu)]/10 rounded-full pr-3 pl-4 relative"
      )}
    >
      <i class="nf nf-oct-cpu text-lg"></i>
      <div class="w-12 h-2 bg-[var(--cpu)]/40 rounded-full relative overflow-hidden group-hover:translate-y-6 group-hover:opacity-0 transition-all duration-300">
        <div
          class="h-full bg-[var(--cpu)] rounded-full"
          style={{
            width: `${props.cpu.usage}%`,
          }}
        ></div>
      </div>
      <span class="transition-all translate-y-6 duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 absolute left-13 text-lg">
        {props.cpu.usage.toFixed(0)}%
      </span>
    </div>
  );
}

export default Cpu;
