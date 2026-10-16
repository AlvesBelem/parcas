import { cn } from "@/lib/utils";

type FormattedDescriptionProps = {
  title: string;
  description: string;
  className?: string;
};

export function FormattedDescription({ title, description, className }: FormattedDescriptionProps) {
  const blocks = formatDescription(description);

  return (
    <section className={cn("border-y border-(--color-border) py-5", className)} aria-labelledby="formatted-description-title">
      <h2 id="formatted-description-title" className="font-(family-name:--font-playfair) text-2xl text-(--color-text)">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-left text-[15px] leading-7 text-(--color-text-muted)">
        {blocks.map((block, index) => {
          if (block.kind === "bullet") {
            return (
              <div key={`${block.text}-${index}`} className="flex gap-3 border border-(--color-border) bg-white/70 px-4 py-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-(--color-wine)" aria-hidden />
                <p className="wrap-break-word">{block.text}</p>
              </div>
            );
          }

          return (
            <p key={`${block.text}-${index}`} className={cn("wrap-break-word", block.kind === "highlight" && "font-semibold text-(--color-text)")}>
              {block.text}
            </p>
          );
        })}
      </div>
    </section>
  );
}

function formatDescription(description: string) {
  return description
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+(?=[✓◆•])/gu, "\n")
    .replace(/[ \t]+(?=[🚀💻📱🌐])/gu, "\n")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (/^[✓◆•]/u.test(line)) {
        return { kind: "bullet" as const, text: line.replace(/^[✓◆•]\s*/u, "") };
      }

      return { kind: /^[🚀💻📱🌐]/u.test(line) ? "highlight" as const : "paragraph" as const, text: line };
    });
}
