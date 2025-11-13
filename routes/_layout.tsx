import { type PageProps } from "fresh";
import { Partial } from "fresh/runtime";
import { Divider } from "../components/Divider.tsx";

export default function Layout({ Component }: PageProps) {
  return (
    <div className="flex flex-col min-h-screen justify-between bg-primary-500 gap-6">
      <div className="flex flex-col justify-start">
        <div class="text-center pt-7 pb-3">
          <div class="inline-block max-w-[90%] p-8 border-2 border-accent hero-frame">
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

        <Divider symbol="⚡" />

        <div class="flex justify-center py-6">
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
