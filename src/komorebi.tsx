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
  const [layout, setLayout] = createSignal<Layout>(defaultLayout);
  const searchParams = new URLSearchParams(window.location.search);
  const [configOpen, setConfigOpen] = createSignal(searchParams.has("config"));
  const [rssOpen, setRssOpen] = createSignal(searchParams.has("rss"));

  return (
    <>
      <Show when={rssOpen()}>
        <RssWindow />
      </Show>
      <Show when={!configOpen() && !rssOpen()}>
        <Base wm="komorebi" layout={layout()} setLayout={setLayout} />
      </Show>
      <ConfigMenu
        layout={layout()}
        onChange={setLayout}
        persistKey={`zrp:layout:komorebi`}
        initialOpen={configOpen()}
        onOpenChange={setConfigOpen}
      />
    </>
  );
}
