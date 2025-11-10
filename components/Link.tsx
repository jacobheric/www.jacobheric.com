import { ComponentChildren } from "preact";

export const PageLink = (
  { href, children }: { href?: string; children: ComponentChildren },
) => {
  return href
    ? (
      <>
        <a href={href}>{children}</a>
        <link rel="prefetch" href={href} />
      </>
    )
    : <div className="cursor-not-allowed text-slate-400">{children}</div>;
};
