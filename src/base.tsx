import Background from "./components/bar/background";
import Direction from "./components/bar/direction";
import Memory from "./components/bar/memory";
import Cpu from "./components/bar/cpu";
import Battery from "./components/bar/battery";
import Media from "./components/bar/media";
import Network from "./components/bar/network";
import Datetime from "./components/bar/datetime";
import Glazewm from "./components/bar/glazewm";
import { createMemo, Index, Match, Switch } from "solid-js";
import Komorebi from "./components/bar/komorebi";
import { cn } from "./lib/utils";

export interface Layout {
  topMargin: number;
  xMargin: number;
  columns: {
    align: "left" | "right" | "center";
    rounded?: ("top-left" | "top-right" | "bottom-left" | "bottom-right")[];
    width?: "auto" | number;
    components: {
      type:
        | "direction"
        | "memory"
        | "cpu"
        | "battery"
        | "media"
        | "network"
        | "datetime"
        | "wm"
        | "systray";
      options?: { [key: string]: any };
    }[];
  }[];
}

export type Type = "glazewm" | "komorebi" | "vanilla";

const Base = (props: { wm: Type; layout: Layout }) => {
  const { columns } = props.layout;

  const gridTemplateColumns = createMemo(() =>
    columns
      .map((col) => {
        if (col.width === "auto") return "auto";
        if (typeof col.width === "number") return `${col.width}fr`;
        return "auto";
      })
      .join(" ")
  );

  return (
    <div
      class="grid gap-2"
      style={{
        "margin-top": `${props.layout.topMargin}px`,
        "margin-left": `${props.layout.xMargin}px`,
        "margin-right": `${props.layout.xMargin}px`,
        "grid-template-columns": gridTemplateColumns(),
      }}
    >
      <Index each={columns}>
        {(column) => (
          <div
            class={cn("flex items-center gap-2", {
              "justify-start": column().align === "left",
              "justify-end": column().align === "right",
              "justify-center": column().align === "center",
            })}
          >
            <Background align={column().align} corners={column().rounded}>
              <Index each={column().components}>
                {(component) => (
                  <Switch>
                    <Match
                      when={component().type === "wm" && props.wm === "glazewm"}
                    >
                      <Glazewm />
                    </Match>
                    <Match
                      when={
                        component().type === "wm" && props.wm === "komorebi"
                      }
                    >
                      <Komorebi />
                    </Match>
                    <Match when={component().type === "direction"}>
                      <Direction />
                    </Match>
                    <Match when={component().type === "memory"}>
                      <Memory />
                    </Match>
                    <Match when={component().type === "cpu"}>
                      <Cpu />
                    </Match>
                    <Match when={component().type === "battery"}>
                      <Battery />
                    </Match>
                    <Match when={component().type === "media"}>
                      <Media />
                    </Match>
                    <Match when={component().type === "network"}>
                      <Network />
                    </Match>
                    <Match when={component().type === "datetime"}>
                      <Datetime />
                    </Match>
                  </Switch>
                )}
              </Index>
            </Background>
          </div>
        )}
      </Index>
    </div>
  );
};

export default Base;
