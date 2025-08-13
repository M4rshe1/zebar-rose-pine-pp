import { cn } from "../../lib/utils";

const Background = ({
  children,
  align = "center",
  corners = ["top-left", "top-right", "bottom-left", "bottom-right"],
}: {
  children;
  align?: "left" | "center" | "right";
  corners?: ("top-left" | "top-right" | "bottom-left" | "bottom-right")[];
}) => {
  return (
    <div
      class={cn("flex justify-center", {
        "justify-start": align === "left",
        "justify-center": align === "center",
        "justify-end": align === "right",
      })}
    >
      <div
        class={cn(
          "h-10 flex gap-1 items-center bg-[var(--bg)] border border-[var(--border)] w-fit font-extrabold px-1",
          corners.includes("top-left") && "rounded-tl-full",
          corners.includes("top-right") && "rounded-tr-full",
          corners.includes("bottom-left") && "rounded-bl-full",
          corners.includes("bottom-right") && "rounded-br-full"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Background;
