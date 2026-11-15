/**
 * What an accordion shows without JavaScript. Radix leaves a closed panel empty until it opens, so a style
 * alone cannot reveal it. Instead this renders every item as plain text inside <noscript>, and hides the
 * accordion marked `data-noscript-hide={scope}`. With JavaScript on, browsers ignore all of it.
 */
export function NoscriptList({
  scope,
  items,
  className,
  tone = "light",
}: {
  scope: string;
  items: readonly { title: string; text: string }[];
  className?: string;
  /** "dark" for a list on the Void: white text and rules instead of Ink. */
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  return (
    <noscript>
      <style>{`[data-noscript-hide="${scope}"]{display:none}`}</style>
      <dl className={className}>
        {items.map((item) => (
          <div key={item.title} className={dark ? "border-b-2 border-white/10 py-6" : "border-b border-ink/15 py-6"}>
            <dt className="text-xl font-medium tracking-[-0.01em]">{item.title}</dt>
            <dd className={dark ? "mt-3 text-lg leading-relaxed text-white/70" : "mt-3 text-lg leading-relaxed text-ink/70"}>{item.text}</dd>
          </div>
        ))}
      </dl>
    </noscript>
  );
}
