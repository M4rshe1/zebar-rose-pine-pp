import {
  Accessor,
  JSX,
  createContext,
  createSignal,
  useContext,
} from "solid-js";
import * as zebar from "zebar";

export interface ProvidersValue {
  cpu: Accessor<zebar.CpuOutput | undefined>;
  memory: Accessor<zebar.MemoryOutput | undefined>;
  battery: Accessor<zebar.BatteryOutput | undefined>;
  media: Accessor<zebar.MediaOutput | undefined>;
  network: Accessor<zebar.NetworkOutput | undefined>;
  glazewm: Accessor<zebar.GlazeWmOutput | undefined>;
  komorebi: Accessor<zebar.KomorebiOutput | undefined>;
}

const ProvidersContext = createContext<ProvidersValue>();

export function ProvidersProvider(props: { children: JSX.Element }) {
  const providers = zebar.createProviderGroup({
    cpu: { type: "cpu" },
    memory: { type: "memory" },
    battery: { type: "battery" },
    media: { type: "media", refreshInterval: 1000 },
    network: { type: "network" },
    glazewm: { type: "glazewm" },
    komorebi: { type: "komorebi" },
  });

  const [cpu, setCpu] = createSignal<zebar.CpuOutput | undefined>(
    providers.outputMap.cpu
  );
  const [memory, setMemory] = createSignal<zebar.MemoryOutput | undefined>(
    providers.outputMap.memory
  );
  const [battery, setBattery] = createSignal<zebar.BatteryOutput | undefined>(
    providers.outputMap.battery
  );
  const [media, setMedia] = createSignal<zebar.MediaOutput | undefined>(
    providers.outputMap.media
  );
  const [network, setNetwork] = createSignal<zebar.NetworkOutput | undefined>(
    providers.outputMap.network
  );
  const [glazewm, setGlazewm] = createSignal<zebar.GlazeWmOutput | undefined>(
    providers.outputMap.glazewm
  );
  const [komorebi, setKomorebi] = createSignal<
    zebar.KomorebiOutput | undefined
  >(providers.outputMap.komorebi);

  providers.onOutput((map) => {
    if ("cpu" in map) setCpu(map.cpu);
    if ("memory" in map) setMemory(map.memory);
    if ("battery" in map) setBattery(map.battery);
    if ("media" in map) setMedia(map.media);
    if ("network" in map) setNetwork(map.network);
    if ("glazewm" in map) setGlazewm(map.glazewm);
    if ("komorebi" in map) setKomorebi(map.komorebi);
  });

  const value: ProvidersValue = {
    cpu,
    memory,
    battery,
    media,
    network,
    glazewm,
    komorebi,
  };

  return (
    <ProvidersContext.Provider value={value}>
      {props.children}
    </ProvidersContext.Provider>
  );
}

export function useProviders(): ProvidersValue {
  const ctx = useContext(ProvidersContext);
  if (!ctx)
    throw new Error("useProviders must be used within ProvidersProvider");
  return ctx;
}
