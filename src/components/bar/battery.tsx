import * as zebar from "zebar";
import { cn } from "../../utils";
import { Match, Switch } from "solid-js/web";
import { createEffect, createSignal } from "solid-js";

function Battery(props: { battery: zebar.BatteryOutput }) {
  const [isAnimating, setIsAnimating] = createSignal(false);

  createEffect(() => {
    setIsAnimating(
      props.battery.isCharging && props.battery.chargePercent < 100
    );
  });

  return (
    <div
      class={cn(
        "h-8 flex group items-center justify-center overflow-hidden gap-2 text-[var(--battery)] bg-[var(--battery)]/10 rounded-full pr-3 pl-4 relative",
        {
          "text-[var(--battery-low)] animate-flash":
            props.battery.chargePercent < 20,
          "text-[var(--battery-mid)]":
            props.battery.chargePercent > 20 &&
            props.battery.chargePercent < 70,
          "text-[var(--battery-good)]":
            (props.battery.chargePercent >= 70 &&
              props.battery.chargePercent < 90) ||
            props.battery.isCharging,
        }
      )}
    >
      <Switch>
        <Match
          when={props.battery.isCharging && props.battery.chargePercent < 100}
        >
          <i class="ti ti-battery-charging text-2xl"></i>
        </Match>
        <Match
          when={props.battery.chargePercent > 90 && !props.battery.isCharging}
        >
          <i class="ti ti-battery-4 text-2xl"></i>
        </Match>
        <Match
          when={props.battery.chargePercent > 70 && !props.battery.isCharging}
        >
          <i class="ti ti-battery-3 text-2xl"></i>
        </Match>
        <Match
          when={props.battery.chargePercent > 40 && !props.battery.isCharging}
        >
          <i class="ti ti-battery-2 text-2xl"></i>
        </Match>
        <Match
          when={props.battery.chargePercent > 20 && !props.battery.isCharging}
        >
          <i class="ti ti-battery-1 text-2xl"></i>
        </Match>
        <Match
          when={props.battery.chargePercent > 0 && !props.battery.isCharging}
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
            "--tw-battery-width": `${props.battery.chargePercent}%`,
            width: isAnimating()
              ? undefined
              : `${props.battery.chargePercent}%`,
          }}
        ></div>
      </div>
      <span class="transition-all -translate-y-6 duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 absolute left-12 text-base">
        {props.battery.chargePercent.toFixed(0)}%
      </span>
    </div>
  );
}

export default Battery;
