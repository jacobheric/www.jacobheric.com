import { type PageProps } from "fresh";
import { Partial } from "fresh/runtime";

export default function Layout({ Component }: PageProps) {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <div className="flex flex-col justify-start">
        <div class="bg-gray-50 border-b text-center pt-7 pb-3">
          <div>
            <h3 class=" uppercase font-bold text-7xl tracking-widest pb-4">
              <a
                class="no-underline"
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
              title="Jacob Heric's Books"
            >
              Books
            </a>
          </div>
        </div>
        <div class="flex justify-center">
          <Partial name="overlay-content">
            <Component />
          </Partial>
        </div>
      </div>
      <footer class="bg-gray-50 border-t flex flex-row items-center tracking-wide justify-center text-lg py-10 ">
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
