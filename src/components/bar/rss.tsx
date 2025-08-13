import {
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { cn } from "../../lib/utils";

export type RssItem = {
  id: string;
  title: string;
  link: string;
  published: number;
  source: string;
};

export type RssFeed = {
  url: string;
  maxItems?: number;
  maxAge?: number;
  useCorsProxy?: boolean;
};

export type RssOptions = {
  feeds?: RssFeed[];
  refreshInterval?: number;
  maxItemsPerFeed?: number;
  titleLength?: number;
  maxAge?: number;
  cleanupInterval?: number;
  corsProxyUrl?: string;
};

const SEEN_STORAGE_KEY = "zrp:rss:seen";
const CLEANUP_STORAGE_KEY = "zrp:rss:lastCleanup";

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

function cleanupOldSeen(maxAgeDays: number = 30) {
  try {
    const lastCleanup = localStorage.getItem(CLEANUP_STORAGE_KEY);
    const now = Date.now();
    const daysSinceCleanup = lastCleanup
      ? (now - parseInt(lastCleanup)) / (1000 * 60 * 60 * 24)
      : 999;

    if (daysSinceCleanup < 1) return;

    localStorage.setItem(CLEANUP_STORAGE_KEY, now.toString());
  } catch {}
}

function normalizeId(parts: (string | null | undefined)[]): string {
  return parts.filter(Boolean).join("|:");
}

export async function fetchFeed(
  url: string,
  useCorsProxy: boolean = true,
  corsProxyUrl: string = "https://corsproxy.io/?url="
): Promise<RssItem[]> {
  const out: RssItem[] = [];
  try {
    const fetchUrl = useCorsProxy
      ? `${corsProxyUrl}${encodeURIComponent(url)}`
      : url;
    const res = await fetch(fetchUrl);
    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "application/xml");

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

export default function Rss(props: { options?: RssOptions }) {
  const options = () => props.options ?? {};
  const [items, setItems] = createSignal<RssItem[]>([]);
  const [seen, setSeen] = createSignal<Set<string>>(loadSeen());

  const refreshInterval = () => options().refreshInterval ?? 5 * 60 * 1000;
  const titleLength = () => options().titleLength ?? 40;
  const globalMaxItems = () => options().maxItemsPerFeed ?? 30;
  const globalMaxAge = () => options().maxAge ?? null;
  const cleanupInterval = () => options().cleanupInterval ?? 30;
  const corsProxyUrl = () =>
    options().corsProxyUrl ?? "https://corsproxy.io/?url=";

  const feeds = createMemo(() =>
    (options().feeds ?? []).filter((feed) => feed.url)
  );

  async function refresh() {
    cleanupOldSeen(cleanupInterval());

    if (!feeds().length) {
      setItems([]);
      return;
    }

    const all = (
      await Promise.all(
        feeds().map((feed) => {
          const shouldUseCors = !!feed.useCorsProxy;
          return fetchFeed(feed.url, shouldUseCors, corsProxyUrl());
        })
      )
    )
      .flat()
      .sort((a, b) => b.published - a.published);

    const bySource = new Map<string, RssItem[]>();
    for (const item of all) {
      const feed = feeds().find((f) => f.url === item.source);
      if (!feed) continue;

      const maxAge = feed.maxAge ?? globalMaxAge();
      if (maxAge) {
        const cutoffDate = Date.now() - maxAge * 24 * 60 * 60 * 1000;
        if (item.published < cutoffDate) continue;
      }

      const list = bySource.get(item.source) ?? [];
      const limit = feed.maxItems ?? globalMaxItems();

      if (list.length < limit) {
        list.push(item);
        bySource.set(item.source, list);
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
    intervalId = window.setInterval(
      refresh,
      Math.max(15_000, refreshInterval())
    );
  });

  onCleanup(() => {
    if (intervalId) window.clearInterval(intervalId);
  });

  createEffect(() => {
    feeds();
    refresh();
  });

  const displayCount = createMemo(() => unseen().length);

  const openRssWindow = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("rss", "1");
      window.open(
        url.toString(),
        "_blank",
        "location=yes,height=500,width=600,scrollbars=yes,status=yes"
      );
    } catch {}
  };

  return (
    <button
      class={cn(
        "h-8 w-8 rounded-full flex items-center justify-center select-none",
        "text-[var(--rss)] bg-[var(--rss)]/10 hover:bg-[var(--rss)]/20 transition-colors"
      )}
      title="RSS"
      onClick={openRssWindow}
    >
      <span class="text-sm font-bold">{displayCount()}</span>
    </button>
  );
}
