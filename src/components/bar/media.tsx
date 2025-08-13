import { cn } from "../../lib/utils";
import { Match, Show, Switch, createEffect, createSignal } from "solid-js";
import { useProviders } from "../../lib/providers-context";

function Media() {
  const { media } = useProviders();
  const [mediaSig, setMediaSig] = createSignal(media());
  createEffect(() => setMediaSig(media()));

  return (
    <Show when={mediaSig()}>
      <div
        class={cn(
          "h-8 flex group items-center justify-center overflow-hidden gap-2 text-[var(--media)] bg-[var(--media)]/10 rounded-full pr-3 pl-4 relative"
        )}
      >
        <Switch>
          <Match when={mediaSig()!.currentSession.isPlaying}>
            <i class="nf nf-md-music text-lg"></i>
          </Match>
          <Match when={!mediaSig()!.currentSession.isPlaying}>
            <i class="nf nf-md-music_off text-lg"></i>
          </Match>
        </Switch>
        <div class="flex items-center gap-2 group-hover:translate-y-6 group-hover:opacity-0 transition-all duration-300">
          <div class="flex items-center gap-1">
            <span class="text-sm">{mediaSig()!.currentSession.artist}</span>
            <span class="text-sm">-</span>
            <span class="text-sm">
              {mediaSig()!.currentSession.title.slice(0, 25).trim() +
                (mediaSig()!.currentSession.title.length > 25 ? "..." : "")}
            </span>
          </div>
          <div class="w-12 h-2 bg-[var(--media)]/40 rounded-full relative overflow-hidden">
            <div
              class="h-full bg-[var(--media)] rounded-full"
              style={{
                width: `${
                  (mediaSig()!.currentSession.position /
                    mediaSig()!.currentSession.endTime) *
                  100
                }%`,
              }}
            ></div>
          </div>
        </div>
        <div class="transition-all -translate-y-6 duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 absolute left-12 right-0 w-auto">
          <div class="flex flex-1 w-full h-full text-lg items-center gap-1 justify-between">
            <button
              onClick={() => mediaSig()!.previous()}
              class="flex-1 min-w-0 w-full h-8 aspect-square hover:bg-current/10 rounded-full flex items-center justify-center transition-all duration-300"
            >
              <i class="ti ti-player-skip-back text-xl"></i>
            </button>
            <button
              onClick={() => mediaSig()!.pause()}
              class={cn(
                "flex-1 min-w-0 w-full h-8 aspect-square hover:bg-current/10 rounded-full transition-all duration-300",
                {
                  hidden: !mediaSig()!.currentSession.isPlaying,
                  "flex items-center justify-center":
                    mediaSig()!.currentSession.isPlaying,
                }
              )}
            >
              <i class="ti ti-player-pause text-xl"></i>
            </button>
            <button
              onClick={() => mediaSig()!.play()}
              class={cn(
                "flex-1 min-w-0 w-full h-8 aspect-square hover:bg-current/10 rounded-full transition-all duration-300",
                {
                  hidden: mediaSig()!.currentSession.isPlaying,
                  "flex items-center justify-center":
                    !mediaSig()!.currentSession.isPlaying,
                }
              )}
            >
              <i class="ti ti-player-play text-xl"></i>
            </button>
            <button
              onClick={() => mediaSig()!.next()}
              class="flex-1 min-w-0 w-full h-8 aspect-square hover:bg-current/10 rounded-full flex items-center justify-center transition-all duration-300"
            >
              <i class="ti ti-player-skip-forward text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
}

export default Media;
