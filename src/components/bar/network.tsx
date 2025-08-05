import * as zebar from "zebar";
import { cn } from "../../utils";
import { Match, Switch } from "solid-js/web";

function Network(props: { network: zebar.NetworkOutput }) {
  const getSignalStrength = () => {
    if (!props.network.defaultGateway?.signalStrength) return 0;
    return props.network.defaultGateway.signalStrength;
  };

  const getNetworkType = () => {
    if (
      props.network.defaultInterface?.type === "ethernet" ||
      (props.network.interfaces.length > 0 &&
        props.network.interfaces[0].type === "ethernet" &&
        props.network.defaultInterface?.type !== "wifi")
    ) {
      return "ethernet";
    } else if (
      props.network.defaultInterface?.type === "wifi" ||
      (props.network.interfaces.length > 0 &&
        props.network.interfaces[0].type === "wifi")
    ) {
      return "wifi";
    }
    return "disconnected";
  };

  const networkType = getNetworkType();
  const isEthernet = networkType === "ethernet";
  const isWifi = networkType === "wifi";
  const isDisconnected = networkType === "disconnected";

  return (
    <div
      class={cn(
        "h-8 flex",
        isEthernet ? "" : "group",
        "items-center justify-center overflow-hidden gap-2 text-[var(--network)] bg-[var(--network)]/10 rounded-full px-2 relative"
      )}
    >
      <Switch>
        <Match when={isEthernet}>
          <i class="ti ti-plug text-lg"></i>
        </Match>
        <Match when={isWifi}>
          <Switch>
            <Match when={getSignalStrength() < 25}>
              <i class="ti ti-antenna-bars-1 text-lg"></i>
            </Match>
            <Match when={getSignalStrength() < 40}>
              <i class="ti ti-antenna-bars-2 text-lg"></i>
            </Match>
            <Match when={getSignalStrength() < 65}>
              <i class="ti ti-antenna-bars-3 text-lg"></i>
            </Match>
            <Match when={getSignalStrength() < 80}>
              <i class="ti ti-antenna-bars-4 text-lg"></i>
            </Match>
            <Match when={getSignalStrength() >= 80}>
              <i class="ti ti-antenna-bars-5 text-lg"></i>
            </Match>
          </Switch>
        </Match>
        <Match when={isDisconnected}>
          <i class="ti ti-antenna-bars-off text-lg"></i>
        </Match>
      </Switch>

      {isWifi && (
        <div
          class={cn(
            "flex items-center gap-2",
            "group-hover:translate-y-6 group-hover:opacity-0 transition-all duration-300"
          )}
        >
          <span class="text-sm">
            {props.network.defaultGateway?.ssid || ""}
          </span>
        </div>
      )}

      {isWifi && (
        <span
          class={cn(
            "transition-all -translate-y-6 duration-300 opacity-0 absolute left-12 text-base",
            "group-hover:opacity-100 group-hover:translate-y-0"
          )}
        >
          {props.network.defaultGateway?.signalStrength
            ? `${props.network.defaultGateway.signalStrength}%`
            : ""}
        </span>
      )}
    </div>
  );
}

export default Network;
