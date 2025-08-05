import * as zebar from "zebar";
import { cn } from "../../utils";

function Media(props: { media: zebar.MediaOutput | undefined }) {
  return (
    <div
      class={cn(
        "h-8 flex group items-center justify-center overflow-hidden gap-2 text-[var(--media)] bg-[var(--media)]/10 rounded-full pr-3 pl-4 relative"
      )}
    >
      <i class="nf nf-cod-music text-lg"></i>
      <div class="flex items-center gap-1 group-hover:translate-y-6 group-hover:opacity-0 transition-all duration-300">
        <div class="flex items-center gap-1">
          <span class="text-sm">{props.media?.currentSession.artist}</span>
          <span class="text-sm">-</span>
          <span class="text-sm">
            {props.media?.currentSession.title.slice(0, 25).trim() +
              (props.media?.currentSession.title.length > 25 ? "..." : "")}
          </span>
        </div>
        <div class="w-12 h-2 bg-[var(--media)]/40 rounded-full relative overflow-hidden">
          <div
            class="h-full bg-[var(--media)] rounded-full"
            style={{
              width: `${
                (props.media?.currentSession.position /
                  props.media?.currentSession.endTime) *
                100
              }%`,
            }}
          ></div>
        </div>
      </div>
      <div class="transition-all translate-y-6 duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 absolute left-12 right-0 w-auto">
        <div class="flex flex-1 w-full h-full text-lg items-center gap-1 justify-between">
          <button
            onClick={() => props.media?.previous()}
            class="flex-1 min-w-0 w-full h-8 aspect-square hover:bg-current/10 rounded-full flex items-center justify-center transition-all duration-300"
          >
            <i class="ti ti-player-skip-back text-xl"></i>
          </button>
          <button
            onClick={() => props.media?.pause()}
            class={cn(
              "flex-1 min-w-0 w-full h-8 aspect-square hover:bg-current/10 rounded-full transition-all duration-300",
              {
                hidden: !props.media?.currentSession.isPlaying,
                "flex items-center justify-center":
                  props.media?.currentSession.isPlaying,
              }
            )}
          >
            <i class="ti ti-player-pause text-xl"></i>
          </button>
          <button
            onClick={() => props.media?.play()}
            class={cn(
              "flex-1 min-w-0 w-full h-8 aspect-square hover:bg-current/10 rounded-full transition-all duration-300",
              {
                hidden: props.media?.currentSession.isPlaying,
                "flex items-center justify-center":
                  !props.media?.currentSession.isPlaying,
              }
            )}
          >
            <i class="ti ti-player-play text-xl"></i>
          </button>
          <button
            onClick={() => props.media?.next()}
            class="flex-1 min-w-0 w-full h-8 aspect-square hover:bg-current/10 rounded-full flex items-center justify-center transition-all duration-300"
          >
            <i class="ti ti-player-skip-forward text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Media;
