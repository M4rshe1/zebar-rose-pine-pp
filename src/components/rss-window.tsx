import {
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";

type RssItem = {
  id: string;
  title: string;
  link: string;
  published: number;
  source: string;
};

const SEEN_STORAGE_KEY = "zrp:rss:seen";

function loadSeen(): Set<string> {
  try {
    const raw = localStorage.getItem(SEEN_STORAGE_KEY);
    if (!raw) return new Set();
    const arr: string[] = JSON.parse(raw);
    return new Set(arr);
  } catch {
    return new Set();
  }
}

function persistSeen(seen: Set<string>) {
  try {
    localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify(Array.from(seen)));
  } catch {}
}

function normalizeId(parts: (string | null | undefined)[]): string {
  return parts.filter(Boolean).join("|:");
}

async function fetchFeed(url: string): Promise<RssItem[]> {
  const out: RssItem[] = [];
  try {
    const res = await fetch(url);
    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "application/xml");

    // RSS 2.0
    const items = Array.from(doc.getElementsByTagName("item"));
    if (items.length > 0) {
      for (const it of items) {
        const title =
          it.getElementsByTagName("title")[0]?.textContent?.trim() ??
          "Untitled";
        const link =
          it.getElementsByTagName("link")[0]?.textContent?.trim() ?? "";
        const guid =
          it.getElementsByTagName("guid")[0]?.textContent?.trim() ?? null;
        const pub =
          it.getElementsByTagName("pubDate")[0]?.textContent?.trim() ?? null;
        const published = pub ? Date.parse(pub) : Date.now();
        out.push({
          id: normalizeId([guid, link, title]),
          title,
          link,
          published: isNaN(published) ? Date.now() : published,
          source: url,
        });
      }
      return out;
    }

    // Atom
    const entries = Array.from(doc.getElementsByTagName("entry"));
    for (const it of entries) {
      const title =
        it.getElementsByTagName("title")[0]?.textContent?.trim() ?? "Untitled";
      const id = it.getElementsByTagName("id")[0]?.textContent?.trim() ?? null;
      const linkEl = it.getElementsByTagName("link")[0] as Element | undefined;
      const link = linkEl?.getAttribute("href") ?? "";
      const pub =
        it.getElementsByTagName("updated")[0]?.textContent?.trim() ??
        it.getElementsByTagName("published")[0]?.textContent?.trim() ??
        null;
      const published = pub ? Date.parse(pub) : Date.now();
      out.push({
        id: normalizeId([id, link, title]),
        title,
        link,
        published: isNaN(published) ? Date.now() : published,
        source: url,
      });
    }
    return out;
  } catch {
    return out;
  }
}

function loadRssOptions() {
  // Try to load RSS options from the saved layout
  try {
    const params = new URLSearchParams(window.location.search);
    const savedLayouts = [
      "zrp:layout:glazewm",
      "zrp:layout:komorebi",
      "zrp:layout:vanilla",
    ];

    for (const key of savedLayouts) {
      const saved = localStorage.getItem(key);
      if (saved) {
        const layout = JSON.parse(saved);
        for (const column of layout.columns || []) {
          for (const component of column.components || []) {
            if (component.type === "rss" && component.options) {
              return component.options;
            }
          }
        }
      }
    }
  } catch {}

  return {
    urls: [],
    refreshInterval: 5 * 60 * 1000,
    maxItemsPerFeed: 30,
    titleLength: 60,
  };
}

export default function RssWindow() {
  const options = loadRssOptions();
  const [items, setItems] = createSignal<RssItem[]>([]);
  const [seen, setSeen] = createSignal<Set<string>>(loadSeen());

  const refreshInterval = options.refreshInterval ?? 5 * 60 * 1000;
  const titleLength = options.titleLength ?? 60;
  const maxItemsPerFeed = options.maxItemsPerFeed ?? 30;

  const urls = createMemo(() => (options.urls ?? []).filter(Boolean));

  async function refresh() {
    if (!urls().length) {
      setItems([]);
      return;
    }
    const all = (await Promise.all(urls().map((u) => fetchFeed(u))))
      .flat()
      .sort((a, b) => b.published - a.published);

    // Limit per feed to avoid memory bloat
    const bySource = new Map<string, RssItem[]>();
    for (const it of all) {
      const list = bySource.get(it.source) ?? [];
      if (list.length < maxItemsPerFeed) {
        list.push(it);
        bySource.set(it.source, list);
      }
    }
    setItems(Array.from(bySource.values()).flat());
  }

  function markSeen(id: string) {
    const next = new Set(seen());
    next.add(id);
    setSeen(next);
    persistSeen(next);
  }

  function markAllSeen() {
    const next = new Set(seen());
    for (const it of items()) next.add(it.id);
    setSeen(next);
    persistSeen(next);
  }

  const unseen = createMemo(() => items().filter((it) => !seen().has(it.id)));

  let intervalId: number | undefined;

  onMount(() => {
    refresh();
    intervalId = window.setInterval(refresh, Math.max(15_000, refreshInterval));
  });

  onCleanup(() => {
    if (intervalId) window.clearInterval(intervalId);
  });

  const displayCount = createMemo(() => unseen().length);

  return (
    <div class="h-full w-full overflow-auto bg-neutral-900 p-4 text-neutral-200">
      <div class="mx-auto max-w-4xl">
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <i class="ti ti-rss text-2xl text-[var(--rss)]"></i>
            <h1 class="text-xl font-bold">RSS Feeds</h1>
            <span class="text-sm text-neutral-400">
              Unread: {displayCount()}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="rounded bg-neutral-800 px-3 py-1 text-sm hover:bg-neutral-700"
              onClick={refresh}
            >
              Refresh
            </button>
            <button
              class="rounded bg-neutral-800 px-3 py-1 text-sm hover:bg-neutral-700"
              onClick={markAllSeen}
            >
              Mark all as seen
            </button>
          </div>
        </div>

        <Show
          when={urls().length > 0}
          fallback={
            <div class="rounded border border-neutral-800 bg-neutral-800/30 p-6 text-center">
              <i class="ti ti-rss text-4xl text-neutral-500 mb-3"></i>
              <h2 class="text-lg font-medium text-neutral-300 mb-2">
                No RSS feeds configured
              </h2>
              <p class="text-sm text-neutral-400">
                Add RSS feed URLs via the widget options in the config menu.
              </p>
            </div>
          }
        >
          <Show
            when={unseen().length > 0}
            fallback={
              <div class="rounded border border-neutral-800 bg-neutral-800/30 p-6 text-center">
                <i class="ti ti-check text-4xl text-green-500 mb-3"></i>
                <h2 class="text-lg font-medium text-neutral-300 mb-2">
                  All caught up!
                </h2>
                <p class="text-sm text-neutral-400">
                  No unread items in your RSS feeds.
                </p>
              </div>
            }
          >
            <div class="space-y-3">
              <For each={unseen()}>
                {(it) => (
                  <div class="rounded border border-neutral-800 bg-neutral-800/30 p-4 hover:bg-neutral-800/50 transition-colors">
                    <div class="mb-2">
                      <a
                        class="text-base font-medium text-neutral-200 hover:text-[var(--rss)] hover:underline transition-colors"
                        href={it.link}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => markSeen(it.id)}
                      >
                        {it.title.length > titleLength
                          ? it.title.slice(0, titleLength).trim() + "..."
                          : it.title}
                      </a>
                    </div>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3 text-xs text-neutral-500">
                        <span>{new URL(it.source).hostname}</span>
                        <span>•</span>
                        <span>
                          {new Date(it.published).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        class="text-xs text-neutral-400 hover:text-neutral-200 rounded bg-neutral-700 px-2 py-1 hover:bg-neutral-600 transition-colors"
                        onClick={() => markSeen(it.id)}
                      >
                        Mark as seen
                      </button>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </Show>
      </div>
    </div>
  );
}
