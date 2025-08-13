/* @refresh reload */
import "./index.css";
import { render } from "solid-js/web";
import Base, { Layout } from "./base";

const layout: Layout = {
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
  return <Base wm="komorebi" layout={layout} />;
}
