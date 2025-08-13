import { cn } from "../../lib/utils";
import { Show, createEffect, createSignal } from "solid-js";
import { useProviders } from "../../lib/providers-context";

function Cpu() {
  const { cpu } = useProviders();
  const [cpuSig, setCpuSig] = createSignal(cpu());
  createEffect(() => setCpuSig(cpu()));

  return (
    <Show when={cpuSig()}>
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
              width: `${cpuSig()!.usage}%`,
            }}
          ></div>
        </div>
        <span class="transition-all -translate-y-6 duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 absolute left-13 text-base">
          {cpuSig()!.usage.toFixed(0)}%
        </span>
      </div>
    </Show>
  );
}

export default Cpu;
