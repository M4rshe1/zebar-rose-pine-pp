import * as zebar from "zebar";
import { cn } from "../../utils";
import Background from "./background";
import { For } from "solid-js";

function Glazewm(props: { glazewm: zebar.GlazeWmOutput }) {
  return (
    <Background align="center">
      <For each={props.glazewm.currentWorkspaces}>
        {(workspace: zebar.GlazeWmOutput["currentWorkspaces"][number]) => (
          <button
            onClick={() =>
              props.glazewm.runCommand(`focus --workspace ${workspace.name}`)
            }
            class={cn(
              "flex items-center justify-center rounded-full p-1 group",
              {
                "bg-[var(--ws-1)]/10": workspace.name === "1",
                "bg-[var(--ws-2)]/10": workspace.name === "2",
                "bg-[var(--ws-3)]/10": workspace.name === "3",
                "bg-[var(--ws-4)]/10": workspace.name === "4",
                "bg-[var(--ws-5)]/10": workspace.name === "5",
                "bg-[var(--ws-6)]/10": workspace.name === "6",
                "bg-[var(--ws-7)]/10": workspace.name === "7",
                "bg-[var(--ws-8)]/10": workspace.name === "8",
                "bg-[var(--ws-9)]/10": workspace.name === "9",
                focused: workspace.hasFocus,
              }
            )}
          >
            <div
              id={workspace.name}
              class={cn(
                "flex items-center justify-center p-0.5 w-6 h-6 rounded-full border-3 bg-transparent font-extrabold",
                {
                  "text-[var(--ws-1)] border-[var(--ws-1)] group-[.focused]:bg-[var(--ws-1)]":
                    workspace.name === "1",
                  "text-[var(--ws-2)] border-[var(--ws-2)] group-[.focused]:bg-[var(--ws-2)]":
                    workspace.name === "2",
                  "text-[var(--ws-3)] border-[var(--ws-3)] group-[.focused]:bg-[var(--ws-3)]":
                    workspace.name === "3",
                  "text-[var(--ws-4)] border-[var(--ws-4)] group-[.focused]:bg-[var(--ws-4)]":
                    workspace.name === "4",
                  "text-[var(--ws-5)] border-[var(--ws-5)] group-[.focused]:bg-[var(--ws-5)]":
                    workspace.name === "5",
                  "text-[var(--ws-6)] border-[var(--ws-6)] group-[.focused]:bg-[var(--ws-6)]":
                    workspace.name === "6",
                  "text-[var(--ws-7)] border-[var(--ws-7)] group-[.focused]:bg-[var(--ws-7)]":
                    workspace.name === "7",
                  "text-[var(--ws-8)] border-[var(--ws-8)] group-[.focused]:bg-[var(--ws-8)]":
                    workspace.name === "8",
                  "text-[var(--ws-9)] border-[var(--ws-9)] group-[.focused]:bg-[var(--ws-9)]":
                    workspace.name === "9",
                  "text-[var(--rp-base)]": workspace.hasFocus,
                }
              )}
            >
              {workspace.displayName ?? workspace.name}
            </div>
          </button>
        )}
      </For>
    </Background>
  );
}

export default Glazewm;
