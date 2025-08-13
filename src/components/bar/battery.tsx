import { cn } from "../../lib/utils";
import { Match, Show, Switch } from "solid-js/web";
import { createEffect, createSignal } from "solid-js";
import { useProviders } from "../../lib/providers-context";

function Battery() {
  const { battery } = useProviders();
  const [batterySig, setBatterySig] = createSignal(battery());
  createEffect(() => setBatterySig(battery()));

  const [isAnimating, setIsAnimating] = createSignal(false);

  createEffect(() => {
    const b = batterySig();
    setIsAnimating(!!b && b.isCharging && b.chargePercent < 100);
  });

  return (
    <Show when={batterySig()}>
      <div
        class={cn(
          "h-8 flex group items-center justify-center overflow-hidden gap-2 text-[var(--battery)] bg-[var(--battery)]/10 rounded-full pr-3 pl-4 relative",
          {
            "text-[var(--battery-low)] animate-flash":
              batterySig()!.chargePercent < 20,
            "text-[var(--battery-mid)]":
              batterySig()!.chargePercent > 20 &&
              batterySig()!.chargePercent < 70,
            "text-[var(--battery-good)]":
              (batterySig()!.chargePercent >= 70 &&
                batterySig()!.chargePercent < 90) ||
              batterySig()!.isCharging,
          }
        )}
      >
        <Switch>
          <Match
            when={batterySig()!.isCharging && batterySig()!.chargePercent < 100}
          >
            <i class="ti ti-battery-charging text-2xl"></i>
          </Match>
          <Match
            when={batterySig()!.chargePercent > 90 && !batterySig()!.isCharging}
          >
            <i class="ti ti-battery-4 text-2xl"></i>
          </Match>
          <Match
            when={batterySig()!.chargePercent > 70 && !batterySig()!.isCharging}
          >
            <i class="ti ti-battery-3 text-2xl"></i>
          </Match>
          <Match
            when={batterySig()!.chargePercent > 40 && !batterySig()!.isCharging}
          >
            <i class="ti ti-battery-2 text-2xl"></i>
          </Match>
          <Match
            when={batterySig()!.chargePercent > 20 && !batterySig()!.isCharging}
          >
            <i class="ti ti-battery-1 text-2xl"></i>
          </Match>
          <Match
            when={batterySig()!.chargePercent > 0 && !batterySig()!.isCharging}
          >
            <i class="ti ti-battery-exclamation text-lg text-current"></i>
          </Match>
        </Switch>
        <div class="w-12 h-2 bg-current/40 rounded-full relative overflow-hidden group-hover:translate-y-6 group-hover:opacity-0 transition-all duration-300">
          <div
            class={cn(
              "h-full bg-current rounded-full transition-all duration-300",
              {
                "animate-charging": isAnimating(),
              }
            )}
            style={{
              "--tw-battery-width": `${batterySig()!.chargePercent}%`,
              width: isAnimating()
                ? undefined
                : `${batterySig()!.chargePercent}%`,
            }}
          ></div>
        </div>
        <span class="transition-all -translate-y-6 duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 absolute left-12 text-base">
          {batterySig()!.chargePercent.toFixed(0)}%
        </span>
      </div>
    </Show>
  );
}

export default Battery;
