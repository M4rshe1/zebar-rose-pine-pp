/* @refresh reload */
import "./index.css";
import { For, render } from "solid-js/web";
import { createStore } from "solid-js/store";
import * as zebar from "zebar";
import Glazewm from "./components/bar/glazewm";
import Direction from "./components/bar/direction";
import Background from "./components/bar/background";
import Memory from "./components/bar/memory";
import Cpu from "./components/bar/cpu";
import Battery from "./components/bar/battery";
import Media from "./components/bar/media";
import Datetime from "./components/bar/datetime";

const providers = zebar.createProviderGroup({
  cpu: { type: "cpu" },
  battery: { type: "battery" },
  memory: { type: "memory" },
  glazewm: { type: "glazewm" },
  media: { type: "media", refreshInterval: 1000 },
  date: { type: "date" },
  systray: { type: "systray" },
});

render(() => <App />, document.getElementById("root")!);

function App() {
  const [output, setOutput] = createStore(providers.outputMap);

  providers.onOutput((outputMap) => setOutput(outputMap));
  return (
    <div class="grid grid-cols-3 gap-2 pt-[4px]">
      <Background align="left">
        {output.glazewm && (
          <Direction
            direction={output.glazewm?.tilingDirection}
            runCommand={output.glazewm?.runCommand}
          />
        )}
        {output.memory && <Memory memory={output.memory} />}
        {output.cpu && <Cpu cpu={output.cpu} />}
        {output.battery && <Battery battery={output.battery} />}
      </Background>
      {output.glazewm && <Glazewm glazewm={output.glazewm} />}
      <Background align="right">
        {output.media && <Media media={output.media} />}
        {output.date && <Datetime datetime={output.date} />}
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
