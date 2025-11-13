export const Divider = (
  { symbol, className }: { symbol: string; className?: string },
) => {
  return (
    <div class="max-w-[90%] lg:max-w-2xl mx-auto">
      <div
        class={`divider-ascii text-2xl tracking-widest text-accent h-8 ${className}`}
        data-symbol={symbol.repeat(100)}
      >
      </div>
    </div>
  );
};
