/* @refresh reload */
import "./index.css";
import { For, render } from "solid-js/web";
import { createStore } from "solid-js/store";
import * as zebar from "zebar";
import Direction from "./components/bar/direction";
import Background from "./components/bar/background";
import Memory from "./components/bar/memory";
import Cpu from "./components/bar/cpu";
import Battery from "./components/bar/battery";
import Media from "./components/bar/media";
import Datetime from "./components/bar/datetime";
import Network from "./components/bar/network";
import Komorebi from "./components/bar/komorebi";

const providers = zebar.createProviderGroup({
  cpu: { type: "cpu" },
  battery: { type: "battery" },
  memory: { type: "memory" },
  komorebi: { type: "komorebi" },
  media: { type: "media" },
  network: { type: "network" },
  systray: { type: "systray" },
});

render(() => <App />, document.getElementById("root")!);

function App() {
  const [output, setOutput] = createStore(providers.outputMap);

  providers.onOutput((outputMap) => setOutput(outputMap));
  return (
    <div class="grid grid-cols-[1fr_auto_1fr] gap-2 pt-1 px-1">
      <Background align="left">
        {output.komorebi && <Direction direction={"horizontal"} />}
        {output.memory && <Memory memory={output.memory} />}
        {output.cpu && <Cpu cpu={output.cpu} />}
        {output.battery && <Battery battery={output.battery} />}
      </Background>
      {output.komorebi && <Komorebi komorebi={output.komorebi} />}
      <Background align="right">
        {output.media && <Media media={output.media} />}
        {output.network && <Network network={output.network} />}
        <Datetime />
      </Background>
      {/* {output.systray && (
        <div class="flex flex-row gap-2">
          <For each={output.systray.icons}>
            {(icon) => (
              <img
                class="systray-icon"
                src={icon.iconUrl}
                title={icon.tooltip}
                onClick={(e) => {
                  e.preventDefault();
                  output.systray.onLeftClick(icon.id);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  output.systray.onRightClick(icon.id);
                }}
              />
            )}
          </For>
        </div>
      )} */}
    </div>
  );
}
