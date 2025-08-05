import { cn } from "../../utils";

const Background = ({
  children,
  align = "center",
}: {
  children;
  align?: "left" | "center" | "right";
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
          "h-10 flex gap-1 items-center bg-[var(--bg)] border border-[var(--border)] rounded-full w-fit font-extrabold px-1"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Background;
