import {
  For,
  Show,
  createSignal,
  onCleanup,
  onMount,
  createEffect,
} from "solid-js";
import type { Layout } from "../base";

type ComponentType =
  | "direction"
  | "memory"
  | "cpu"
  | "battery"
  | "media"
  | "network"
  | "datetime"
  | "rss"
  | "wm"
  | "systray";

interface ConfigMenuProps {
  layout: Layout;
  onChange: (next: Layout) => void;
  persistKey?: string;
  initialOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function deepCloneLayout(layout: Layout): Layout {
  return JSON.parse(JSON.stringify(layout));
}

export default function ConfigMenu(props: ConfigMenuProps) {
  const [open, setOpen] = createSignal(Boolean(props.initialOpen));
  const [jsonError, setJsonError] = createSignal<string | null>(null);

  const [openColumnIdx, setOpenColumnIdx] = createSignal<number | null>(null);

  createEffect(() => {
    props.onOpenChange?.(open());
  });

  const availableComponents: ComponentType[] = [
    "direction",
    "memory",
    "cpu",
    "battery",
    "media",
    "network",
    "datetime",
    "rss",
    "wm",
    "systray",
  ];

  const persistIfNeeded = (next: Layout) => {
    if (!props.persistKey) return;
    try {
      localStorage.setItem(props.persistKey, JSON.stringify(next));
    } catch {}
  };

  const updateLayout = (updater: (l: Layout) => void) => {
    const next = deepCloneLayout(props.layout);
    updater(next);
    props.onChange(next);
    persistIfNeeded(next);
  };

  const addColumn = () => {
    updateLayout((l) => {
      l.columns.push({ align: "left", width: 1, components: [] });
    });
    setOpenColumnIdx(props.layout.columns.length);
  };

  const removeColumn = (idx: number) => {
    updateLayout((l) => {
      l.columns.splice(idx, 1);
    });
    if (openColumnIdx() === idx) {
      setOpenColumnIdx(null);
    } else if (openColumnIdx() !== null && openColumnIdx()! > idx) {
      setOpenColumnIdx(openColumnIdx()! - 1);
    }
  };

  const addComponent = (colIdx: number, type: ComponentType) => {
    updateLayout((l) => {
      l.columns[colIdx].components.push({ type });
    });
  };

  const removeComponent = (colIdx: number, compIdx: number) => {
    updateLayout((l) => {
      l.columns[colIdx].components.splice(compIdx, 1);
    });
  };

  const moveComponent = (colIdx: number, compIdx: number, dir: -1 | 1) => {
    updateLayout((l) => {
      const list = l.columns[colIdx].components;
      const newIdx = compIdx + dir;
      if (newIdx < 0 || newIdx >= list.length) return;
      const [item] = list.splice(compIdx, 1);
      list.splice(newIdx, 0, item);
    });
  };

  const setComponentType = (
    colIdx: number,
    compIdx: number,
    type: ComponentType
  ) => {
    updateLayout((l) => {
      l.columns[colIdx].components[compIdx].type = type;
    });
  };

  const setComponentOptions = (
    colIdx: number,
    compIdx: number,
    json: string
  ) => {
    try {
      const parsed = json.trim() === "" ? undefined : JSON.parse(json);
      setJsonError(null);
      updateLayout((l) => {
        l.columns[colIdx].components[compIdx].options = parsed as any;
      });
    } catch (e) {
      setJsonError("Invalid JSON for options");
    }
  };

  const keydownHandler = (e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  };

  onMount(() => {
    window.addEventListener("keydown", keydownHandler);
  });
  onCleanup(() => window.removeEventListener("keydown", keydownHandler));

  const componentOptionsString = (colIdx: number, compIdx: number) =>
    JSON.stringify(
      props.layout.columns[colIdx].components[compIdx].options ?? "",
      null,
      2
    );

  return (
    <Show when={open()}>
      <div class="mt-2 h-full w-full overflow-auto rounded border border-neutral-700 bg-neutral-900/95 p-3 text-neutral-200 shadow-xl backdrop-blur">
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-2">
            <label class="text-sm">
              <div class="mb-1 text-neutral-400">Top margin (px)</div>
              <input
                type="number"
                class="w-full rounded bg-neutral-800 px-2 py-1"
                value={props.layout.topMargin}
                onInput={(e) =>
                  updateLayout(
                    (l) => (l.topMargin = Number(e.currentTarget.value))
                  )
                }
              />
            </label>
            <label class="text-sm">
              <div class="mb-1 text-neutral-400">Side margin (px)</div>
              <input
                type="number"
                class="w-full rounded bg-neutral-800 px-2 py-1"
                value={props.layout.xMargin}
                onInput={(e) =>
                  updateLayout(
                    (l) => (l.xMargin = Number(e.currentTarget.value))
                  )
                }
              />
            </label>
          </div>

          <div class="flex items-center justify-between">
            <div class="font-medium">Columns</div>
            <button
              class="text-xs rounded bg-neutral-800 px-2 py-1 hover:bg-neutral-700"
              onClick={addColumn}
            >
              Add column
            </button>
          </div>

          <For each={props.layout.columns}>
            {(col, colIdx) => {
              const idx = colIdx();
              const isOpen = () => openColumnIdx() === idx;
              return (
                <div class="rounded border border-neutral-800 mb-2">
                  <div
                    class="flex items-center justify-between cursor-pointer px-2 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-t"
                    onClick={() => setOpenColumnIdx(isOpen() ? null : idx)}
                  >
                    <div class="flex items-center gap-2">
                      <span class="text-sm text-neutral-400">
                        Column {idx + 1}
                      </span>
                      <span class="text-xs">{isOpen() ? "▼" : "▶"}</span>
                    </div>
                    <button
                      class="text-xs text-red-300 hover:text-red-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeColumn(idx);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  <Show when={isOpen()}>
                    <div class="p-2 pt-3">
                      <div class="grid grid-cols-3 gap-2 mb-2">
                        <label class="text-sm col-span-1">
                          <div class="mb-1 text-neutral-400">Align</div>
                          <select
                            class="w-full rounded bg-neutral-800 px-2 py-1"
                            value={col.align}
                            onChange={(e) =>
                              updateLayout(
                                (l) =>
                                  (l.columns[idx].align = e.currentTarget
                                    .value as any)
                              )
                            }
                          >
                            <option value="left">left</option>
                            <option value="center">center</option>
                            <option value="right">right</option>
                          </select>
                        </label>
                        <label class="text-sm col-span-2">
                          <div class="mb-1 text-neutral-400">Width</div>
                          <div class="flex items-center gap-2">
                            <select
                              class="w-28 rounded bg-neutral-800 px-2 py-1"
                              value={
                                typeof col.width === "string"
                                  ? col.width
                                  : "number"
                              }
                              onChange={(e) =>
                                updateLayout((l) => {
                                  const val = e.currentTarget.value;
                                  l.columns[idx].width =
                                    val === "auto"
                                      ? "auto"
                                      : typeof col.width === "number"
                                      ? col.width
                                      : 1;
                                })
                              }
                            >
                              <option value="auto">auto</option>
                              <option value="number">fraction</option>
                            </select>
                            <Show when={typeof col.width === "number"}>
                              <input
                                type="number"
                                min="1"
                                class="w-full rounded bg-neutral-800 px-2 py-1"
                                value={
                                  typeof col.width === "number" ? col.width : 1
                                }
                                onInput={(e) =>
                                  updateLayout(
                                    (l) =>
                                      (l.columns[idx].width = Number(
                                        e.currentTarget.value
                                      ))
                                  )
                                }
                              />
                            </Show>
                          </div>
                        </label>
                      </div>

                      <div class="mb-1 text-sm text-neutral-400">
                        Components
                      </div>
                      <div class="space-y-2">
                        <For each={col.components}>
                          {(comp, compIdx) => (
                            <div class="rounded bg-neutral-800 p-2">
                              <div class="mb-2 flex items-center justify-between">
                                <div class="text-xs text-neutral-300">
                                  #{compIdx() + 1}
                                </div>
                                <div class="flex items-center gap-2">
                                  <button
                                    class="text-xs rounded bg-neutral-700 px-2 py-0.5 hover:bg-neutral-600"
                                    onClick={() =>
                                      moveComponent(idx, compIdx(), -1)
                                    }
                                  >
                                    ↑
                                  </button>
                                  <button
                                    class="text-xs rounded bg-neutral-700 px-2 py-0.5 hover:bg-neutral-600"
                                    onClick={() =>
                                      moveComponent(idx, compIdx(), 1)
                                    }
                                  >
                                    ↓
                                  </button>
                                  <button
                                    class="text-xs text-red-300 hover:text-red-200"
                                    onClick={() =>
                                      removeComponent(idx, compIdx())
                                    }
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                              <div class="grid grid-cols-3 gap-2">
                                <label class="text-sm col-span-1">
                                  <div class="mb-1 text-neutral-400">Type</div>
                                  <select
                                    class="w-full rounded bg-neutral-900 px-2 py-1"
                                    value={comp.type}
                                    onChange={(e) =>
                                      setComponentType(
                                        idx,
                                        compIdx(),
                                        e.currentTarget.value as ComponentType
                                      )
                                    }
                                  >
                                    <For each={availableComponents}>
                                      {(t) => <option value={t}>{t}</option>}
                                    </For>
                                  </select>
                                </label>
                                <label class="text-sm col-span-2">
                                  <div class="mb-1 text-neutral-400">
                                    Options (JSON)
                                  </div>
                                  <textarea
                                    class="h-20 w-full rounded bg-neutral-900 px-2 py-1 font-mono text-xs"
                                    value={componentOptionsString(
                                      idx,
                                      compIdx()
                                    )}
                                    onInput={(e) =>
                                      setComponentOptions(
                                        idx,
                                        compIdx(),
                                        e.currentTarget.value
                                      )
                                    }
                                  />
                                </label>
                              </div>
                            </div>
                          )}
                        </For>

                        <div class="flex items-center gap-2">
                          <select
                            id={`add-type-${idx}`}
                            class="flex-1 rounded bg-neutral-800 px-2 py-1"
                          >
                            <For each={availableComponents}>
                              {(t) => <option value={t}>{t}</option>}
                            </For>
                          </select>
                          <button
                            class="rounded bg-neutral-700 px-2 py-1 text-sm hover:bg-neutral-600"
                            onClick={() => {
                              const select = document.getElementById(
                                `add-type-${idx}`
                              ) as HTMLSelectElement;
                              addComponent(idx, select.value as ComponentType);
                            }}
                          >
                            Add component
                          </button>
                        </div>
                        <Show when={jsonError()}>
                          <div class="text-xs text-red-300">{jsonError()}</div>
                        </Show>
                      </div>
                    </div>
                  </Show>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </Show>
  );
}
