/**
 * What an accordion shows without JavaScript. Radix leaves a closed panel empty until it opens, so a style
 * alone cannot reveal it. Instead this renders every item as plain text inside <noscript>, and hides the
 * accordion marked `data-noscript-hide={scope}`. With JavaScript on, browsers ignore all of it.
 */
export function NoscriptList({
  scope,
  items,
  className,
}: {
  scope: string;
  items: readonly { title: string; text: string }[];
  className?: string;
}) {
  return (
    <noscript>
      <style>{`[data-noscript-hide="${scope}"]{display:none}`}</style>
      <dl className={className}>
        {items.map((item) => (
          <div key={item.title} className="border-b border-white/15 py-6">
            <dt className="text-xl font-medium tracking-[-0.01em]">{item.title}</dt>
            <dd className="mt-3 text-lg leading-relaxed text-white/70">{item.text}</dd>
          </div>
        ))}
      </dl>
    </noscript>
  );
}
