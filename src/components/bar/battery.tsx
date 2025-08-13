import * as zebar from "zebar";
import { cn } from "../../lib/utils";
import { Match, Show, Switch } from "solid-js/web";
import { createEffect, createSignal } from "solid-js";

function Battery() {
  const providers = zebar.createProviderGroup({
    battery: { type: "battery" },
  });
  const [battery, setBattery] = createSignal<zebar.BatteryOutput | undefined>(
    providers.outputMap.battery
  );
  providers.onOutput((map) => setBattery(map.battery));

  const [isAnimating, setIsAnimating] = createSignal(false);

  createEffect(() => {
    const b = battery();
    setIsAnimating(!!b && b.isCharging && b.chargePercent < 100);
  });

  return (
    <Show when={battery()}>
      <div
        class={cn(
          "h-8 flex group items-center justify-center overflow-hidden gap-2 text-[var(--battery)] bg-[var(--battery)]/10 rounded-full pr-3 pl-4 relative",
          {
            "text-[var(--battery-low)] animate-flash":
              battery()!.chargePercent < 20,
            "text-[var(--battery-mid)]":
              battery()!.chargePercent > 20 && battery()!.chargePercent < 70,
            "text-[var(--battery-good)]":
              (battery()!.chargePercent >= 70 &&
                battery()!.chargePercent < 90) ||
              battery()!.isCharging,
          }
        )}
      >
        <Switch>
          <Match when={battery()!.isCharging && battery()!.chargePercent < 100}>
            <i class="ti ti-battery-charging text-2xl"></i>
          </Match>
          <Match when={battery()!.chargePercent > 90 && !battery()!.isCharging}>
            <i class="ti ti-battery-4 text-2xl"></i>
          </Match>
          <Match when={battery()!.chargePercent > 70 && !battery()!.isCharging}>
            <i class="ti ti-battery-3 text-2xl"></i>
          </Match>
          <Match when={battery()!.chargePercent > 40 && !battery()!.isCharging}>
            <i class="ti ti-battery-2 text-2xl"></i>
          </Match>
          <Match when={battery()!.chargePercent > 20 && !battery()!.isCharging}>
            <i class="ti ti-battery-1 text-2xl"></i>
          </Match>
          <Match when={battery()!.chargePercent > 0 && !battery()!.isCharging}>
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
              "--tw-battery-width": `${battery()!.chargePercent}%`,
              width: isAnimating() ? undefined : `${battery()!.chargePercent}%`,
            }}
          ></div>
        </div>
        <span class="transition-all -translate-y-6 duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 absolute left-12 text-base">
          {battery()!.chargePercent.toFixed(0)}%
        </span>
      </div>
    </Show>
  );
}

export default Battery;
