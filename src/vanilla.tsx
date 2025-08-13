/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import Base, { Layout } from "./base";
import ConfigMenu from "./components/config-menu";
import { createSignal, Show } from "solid-js";

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
          type: "datetime",
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
      ],
    },
  ],
};

render(() => <App />, document.getElementById("root")!);

function App() {
  const persistKey = "zrp:layout:vanilla";
  let initial = defaultLayout;
  try {
    const saved = localStorage.getItem(persistKey);
    if (saved) initial = JSON.parse(saved) as Layout;
  } catch {}

  const [layout, setLayout] = createSignal<Layout>(initial);
  const [configOpen, setConfigOpen] = createSignal(
    new URLSearchParams(window.location.search).has("config")
  );

  return (
    <>
      <Show when={!configOpen()}>
        <Base wm="vanilla" layout={layout()} setLayout={setLayout} />
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
