/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import { createSignal, Show } from "solid-js";
import Base, { Layout } from "./base";
import ConfigMenu from "./components/config-menu";
import RssWindow from "./components/rss-window";

const defaultLayout: Layout = {
  topMargin: 4,
  xMargin: 4,
  columns: [
    {
      align: "left",
      width: 1,
      components: [
        {
          type: "direction",
        },
        {
          type: "memory",
        },
        {
          type: "cpu",
        },
        {
          type: "battery",
        },
      ],
    },
    {
      align: "center",
      width: "auto",
      components: [
        {
          type: "wm",
        },
        {
          type: "rss",
          options: {
            feeds: [
              {
                url: "https://hnrss.org/frontpage",
                maxItems: 20,
                maxAge: 7,
                useCorsProxy: false,
              },
              {
                url: "https://www.reddit.com/r/programming/.rss",
                maxItems: 40,
                maxAge: 14,
                useCorsProxy: true,
              },
            ],
            refreshInterval: 300000,
            maxItemsPerFeed: 30,
            titleLength: 60,
            maxAge: 7,
            cleanupInterval: 30,
            useCorsProxy: true,
            corsProxyUrl: "https://corsproxy.io/?url=",
          },
        },
      ],
    },
    {
      align: "right",
      width: 1,
      components: [
        {
          type: "media",
        },
        {
          type: "network",
        },
        {
          type: "datetime",
        },
      ],
    },
  ],
};

render(() => <App />, document.getElementById("root")!);

function App() {
  const persistKey = "zrp:layout:glazewm";
  let initial = defaultLayout;
  try {
    const saved = localStorage.getItem(persistKey);
    if (saved) initial = JSON.parse(saved) as Layout;
  } catch {}

  const [layout, setLayout] = createSignal<Layout>(initial);
  const searchParams = new URLSearchParams(window.location.search);
  const [configOpen, setConfigOpen] = createSignal(searchParams.has("config"));
  const [rssOpen, setRssOpen] = createSignal(searchParams.has("rss"));

  return (
    <>
      <Show when={rssOpen()}>
        <RssWindow />
      </Show>
      <Show when={!configOpen() && !rssOpen()}>
        <Base wm="glazewm" layout={layout()} setLayout={setLayout} />
      </Show>
      <ConfigMenu
        layout={layout()}
        onChange={setLayout}
        persistKey={persistKey}
        initialOpen={configOpen()}
        onOpenChange={setConfigOpen}
      />
    </>
  );
}
