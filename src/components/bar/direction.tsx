import { cn } from "../../lib/utils";
import * as zebar from "zebar";
import { createSignal, Show } from "solid-js";

function Direction() {
  const providers = zebar.createProviderGroup({
    glazewm: { type: "glazewm" },
  });
  const [glazewm, setGlazewm] = createSignal<zebar.GlazeWmOutput | undefined>(
    providers.outputMap.glazewm
  );
  providers.onOutput((map) => setGlazewm(map.glazewm));

  return (
    <Show when={glazewm()}>
      <button
        class={cn(
          "h-8 w-8 flex items-center justify-center text-[var(--icon)] bg-[var(--icon)]/10 rounded-full p-1 transition-all duration-300",
          {
            "rotate-90": glazewm().tilingDirection === "vertical",
          }
        )}
        onClick={() => glazewm().runCommand(`toggle-tiling-direction`)}
      >
        <i class="nf nf-md-flower_tulip text-lg"></i>
      </button>
    </Show>
  );
}

export default Direction;
