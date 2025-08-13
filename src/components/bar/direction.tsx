import { cn } from "../../lib/utils";
import { createEffect, createSignal, Show } from "solid-js";
import { useProviders } from "../../lib/providers-context";
import * as zebar from "zebar";

function Direction() {
  const { glazewm } = useProviders();
  const [glazewmSig, setGlazewmSig] = createSignal<
    zebar.GlazeWmOutput | undefined
  >(undefined);

  return (
    <Show when={!!glazewm()?.tilingDirection}>
      <button
        class={cn(
          "h-8 w-8 flex items-center justify-center text-[var(--icon)] bg-[var(--icon)]/10 rounded-full p-1 transition-all duration-300",
          {
            "rotate-90": glazewm()?.tilingDirection === "vertical",
          }
        )}
        onClick={() => glazewm()?.runCommand(`toggle-tiling-direction`)}
      >
        <i class="nf nf-md-flower_tulip text-lg"></i>
      </button>
    </Show>
  );
}

export default Direction;
