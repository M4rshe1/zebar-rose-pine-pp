import { cn } from "../../lib/utils";
import { Match, Switch } from "solid-js/web";
import { Show, createEffect, createSignal } from "solid-js";
import { useProviders } from "../../lib/providers-context";

function Network() {
  const { network } = useProviders();
  const [networkSig, setNetworkSig] = createSignal(network());
  createEffect(() => setNetworkSig(network()));

  const getSignalStrength = () => {
    if (!networkSig()!.defaultGateway?.signalStrength) return 0;
    return networkSig()!.defaultGateway!.signalStrength!;
  };

  const getNetworkType = () => {
    if (
      networkSig()!.defaultInterface?.type === "ethernet" ||
      (networkSig()!.interfaces.length > 0 &&
        networkSig()!.interfaces[0].type === "ethernet" &&
        networkSig()!.defaultInterface?.type !== "wifi")
    ) {
      return "ethernet";
    } else if (
      networkSig()!.defaultInterface?.type === "wifi" ||
      (networkSig()!.interfaces.length > 0 &&
        networkSig()!.interfaces[0].type === "wifi")
    ) {
      return "wifi";
    }
    return "disconnected";
  };

  return (
    <Show when={networkSig()}>
      <div
        class={cn(
          "h-8 flex",
          getNetworkType() === "ethernet" ? "" : "group",
          "items-center justify-center overflow-hidden gap-2 text-[var(--network)] bg-[var(--network)]/10 rounded-full px-2 relative"
        )}
      >
        <Switch>
          <Match when={getNetworkType() === "ethernet"}>
            <i class="ti ti-plug text-lg"></i>
          </Match>
          <Match when={getNetworkType() === "wifi"}>
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
          <Match when={getNetworkType() === "disconnected"}>
            <i class="ti ti-antenna-bars-off text-lg"></i>
          </Match>
        </Switch>

        {getNetworkType() === "wifi" && (
          <div
            class={cn(
              "flex items-center gap-2",
              "group-hover:translate-y-6 group-hover:opacity-0 transition-all duration-300"
            )}
          >
            <span class="text-sm">
              {networkSig()!.defaultGateway?.ssid || ""}
            </span>
          </div>
        )}

        {getNetworkType() === "wifi" && (
          <span
            class={cn(
              "transition-all -translate-y-6 duration-300 opacity-0 absolute left-12 text-base",
              "group-hover:opacity-100 group-hover:translate-y-0"
            )}
          >
            {networkSig()!.defaultGateway?.signalStrength
              ? `${networkSig()!.defaultGateway!.signalStrength!}%`
              : ""}
          </span>
        )}
      </div>
    </Show>
  );
}

export default Network;
