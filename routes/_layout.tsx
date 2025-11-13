import { type PageProps } from "fresh";
import { Partial } from "fresh/runtime";

export default function Layout({ Component }: PageProps) {
  return (
    <div className="flex flex-col min-h-screen justify-between bg-primary-500">
      <div className="flex flex-col justify-start">
        <div class="text-center pt-7 pb-3">
          <div class="inline-block max-w-[90%] p-8 border-2 border-accent [filter:drop-shadow(0_8px_#ff69b4)] [transform:perspective(500px)_rotateX(5deg)_skewX(-3deg)] hover:[transform:perspective(500px)_rotateX(9deg)_skewX(-3deg)_translateY(-4px)] [transition:transform_0.2s] md:[transform:perspective(600px)_rotateX(6deg)_skewX(-5deg)] md:hover:[transform:perspective(600px)_rotateX(10deg)_skewX(-5deg)_translateY(-5px)]">
            <h3 class="text-6xl tracking-widest">
              <a
                class="no-underline "
                href="/"
                title="Home"
              >
                JACOB HERIC
              </a>
            </h3>
            <hr class="w-14 border-flair-gradient mx-auto my-4" />
            <a href="/about/" title="I prefer not to">
              <div class="tagline uppercase text-accent font-thin text-base tracking-wide font-sans">
                I PREFER NOT TO
              </div>
            </a>
          </div>
        </div>
        <div class="italic text-lg font-medium tracking-wide mx-auto my-4">
          <a href="/about/" title="About Jacob Heric">
            About
          </a>
          <span className="font-sans mx-2 not-italic">|</span>
          <a
            href="/books/"
            title="Jacob Heric's Books"
          >
            Books
          </a>
        </div>

        <div class="max-w-[90%] lg:max-w-2xl mx-auto">
          <div
            class="divider-ascii text-2xl text-accent"
            data-symbol="⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡"
          >
          </div>
        </div>
        <div class="flex justify-center ">
          <Partial name="overlay-content">
            <Component />
          </Partial>
        </div>
      </div>
      <footer class="border-t border-flair flex flex-row items-center tracking-wide justify-center text-lg py-6">
        <div className="w-full inline text-right">
          <a
            href="https://github.com/jacobheric/www.jacobheric.com"
            class="inline"
          >
            Made
          </a>{" "}
          with
        </div>

        <div className="text-2xl mx-2">
          &#9829;
        </div>

        <div className="flex flex-row justify-start w-full">
          in Maine
        </div>
      </footer>
    </div>
  );
}
