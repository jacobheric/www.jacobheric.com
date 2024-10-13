import { Partial } from "$fresh/runtime.ts";
import { FreshContext } from "$fresh/server.ts";

export default function Layout(ctx: FreshContext) {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <div className="flex flex-col justify-start">
        <div class="bg-gray-50 border-b text-center pt-7 pb-3">
          <div>
            <h3 class=" uppercase font-bold text-7xl tracking-widest pb-4">
              <a
                class="no-underline"
                id="site-title"
                href="/"
                title="Home"
              >
                JACOB HERIC
              </a>
            </h3>
            <hr class="w-14 border-black mx-auto" />
            <div class="p-4 tagline uppercase text-yellow-700 font-thin text-base tracking-wide font-sans">
              I PREFER NOT TO
            </div>
          </div>
          <div class="italic text-lg font-medium tracking-wide ">
            <a href="/about/" alt="About Jacob Heric" title="About Jacob Heric">
              About
            </a>
            <span className="font-sans mx-2 not-italic">|</span>
            <a
              href="/books/"
              alt="Jacob Heric's Books"
              title="Jacob Heric's Books"
            >
              Books
            </a>
          </div>
        </div>
        <div class="flex justify-center">
          <Partial name="overlay-content">
            <ctx.Component />
          </Partial>
        </div>
      </div>
      <footer class="bg-gray-50 border-t fat text-center text-lg py-10">
        Made with <span class="text-2xl">&#9829;</span> in Portland, Maine
      </footer>
    </div>
  );
}
