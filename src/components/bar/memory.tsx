import * as zebar from "zebar";
import { cn } from "../../lib/utils";
import { createSignal, Show } from "solid-js";

function Memory() {
  const providers = zebar.createProviderGroup({
    memory: { type: "memory" },
  });
  const [memory, setMemory] = createSignal<zebar.MemoryOutput | undefined>(
    providers.outputMap.memory
  );
  providers.onOutput((map) => setMemory(map.memory));

  return (
    <Show when={memory()}>
      <div
        class={cn(
          "h-8 flex group items-center justify-center overflow-hidden gap-2 text-[var(--memory)] bg-[var(--memory)]/10 rounded-full pr-3 pl-4 relative"
        )}
      >
        <i class="nf nf-fa-memory text-lg"></i>
        <div class="w-12 h-2 bg-[var(--memory)]/40 rounded-full relative overflow-hidden group-hover:translate-y-6 group-hover:opacity-0 transition-all duration-300">
          <div
            class="h-full bg-[var(--memory)] rounded-full"
            style={{
              width: `${(memory()!.usedMemory / memory()!.totalMemory) * 100}%`,
            }}
          ></div>
        </div>
        <span class="transition-all -translate-y-6 duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 absolute left-12 text-base">
          {(memory()!.usedMemory / 1000000000).toFixed(0)}GB
        </span>
      </div>
    </Show>
  );
}

export default Memory;
