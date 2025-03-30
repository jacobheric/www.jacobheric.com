import { ComponentChildren } from "preact";

export const Nav = (
  { leftChildren, rightChildren, className }: {
    leftChildren: ComponentChildren;
    rightChildren: ComponentChildren;
    className?: string;
  },
) => (
  <div
    class={`w-full flex flex-row items-center italic text-lg font-medium tracking-wide justify-center space-x-4 ${className}`}
  >
    <div className="flex flex-row justify-end w-full space-x-4">
      {leftChildren}
    </div>

    <div className="flex flex-row justify-center items-center font-sans not-italic w-2 dark:text-white">
      |
    </div>
    <div className="flex flex-row justify-start w-full space-x-4">
      {rightChildren}
    </div>
  </div>
);
