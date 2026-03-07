import { page } from "@/lib/server/layout.ts";
import { respondHtml } from "@/lib/server/http.ts";
import { renderPictureHtml } from "@/lib/pictures/render.ts";

export const renderAbout = (req: Request) =>
  respondHtml({
    req,
    cacheKey: "about",
    cacheControl: "public, max-age=600",
    render: () =>
      page({
        title: "About",
        body: `<div class="text-lg mx-4 dark:text-white">
          <div class="title text-6xl my-12 text-center">About</div>
          <p class="my-6">
            I'm <span itemprop="name">Jacob Heric</span>, a family man living in Portland, Maine.
          </p>
          <p class="my-6">
            Contact me at <a href="mailto:jacob@jacobheric.com">jacob@jacobheric.com</a>.
          </p>
          <p class="my-6 italic">
            <a title="Bartleby The Scrivener" href="http://www.bartleby.com/129/" rel="nofollow">
              "I prefer not to," he respectfully and slowly said, and mildly disappeared.
            </a>
          </p>
        </div>`,
      }),
  });

export const renderBooks = (req: Request) =>
  respondHtml({
    req,
    cacheKey: "books",
    cacheControl: "public, max-age=600",
    render: () =>
      page({
        title: "Books",
        body:
          `<div class="w-11/12 mx-auto flex flex-col items-center dark:text-white">
            <div class="title text-6xl my-12 text-center">Books</div>
            <div>
              <span class="title text-2xl font-bold italic inline mr-2 text-center">
                Autobiography of Joker So Far
              </span>
              <span class="inline">by Jacob Heric</span>
            </div>
            <div class="flex flex-row justify-center font-bold text-2xl my-8 space-x-2">
              <div class="w-full">
                <a href="https://www.amazon.com/Autobiography-Joker-Far-Jacob-Heric-ebook/dp/B018B79GEY/" rel="nofollow">kindle</a>
              </div>
              <div class="w-full">&#124;</div>
              <div class="w-full">
                <a href="https://www.amazon.com/Autobiography-Joker-Far-Jacob-Heric/dp/0692539506/" rel="nofollow">paperback</a>
              </div>
            </div>
            <div class="flex flex-row flex-wrap md:flex-nowrap justify-center align-top space-x-2">
              <div class="w-full flex justify-center lg:justify-end">
                ${
            renderPictureHtml({
              src: "auto-bio-cover.jpg",
              alt: "Autobiograph of Joker so Far Cover Image",
              className: "max-w-xl mr-4 mt-0",
            })
          }
              </div>
              <div class="flex-col w-full flex items-center">
                <div class="font-bold pb-3 max-w-prose">
                  Out of the ordinary folds of middle America, comes a teenage obscura
                  with a penchant for pain. Joseph Kare, aka <em>Joker</em>, wakes up one day
                  to find himself squarely in the crosshairs of cultural change.
                </div>
                <div class="max-w-prose">
                  For Joker, ditching high school in America&apos;s heartland comes with dire
                  consequences. His first dilemma is to run damage control - a rumor spreads
                  after last night&apos;s party. His next dilemma is Cass. Somehow she&apos;s at the
                  center of the rumor. Soon she will be at the center of his life too. She
                  will be more important than the friends he double-deals, more important than
                  the escalating threats to his life, more important than his future. Wily,
                  wicked, and weird, Joker navigates his adolescence according to his own rules.
                  With imprecise prose, screwball scheming and, ultimately, stubborn brilliance,
                  Joker hurtles himself to the extremes of his boyish world, where he attempts
                  to escape his own demise while celebrating the marvelous, awkward, bitter-sweet
                  tang of a teenage life. True.
                </div>
              </div>
            </div>
            <div class="my-10 text-2xl italic">
              Out now on
              <a href="https://www.truejokercompany.com" rel="nofollow" class="ml-2">
                True Joker Company Publications
              </a>
            </div>
          </div>`,
      }),
  });

export const renderNotFound = (req: Request) =>
  respondHtml({
    req,
    cacheKey: "not-found",
    status: 404,
    cacheControl: "public, max-age=120",
    render: () =>
      page({
        title: "Not Found",
        body: "<article><h2>nope</h2></article>",
      }),
  });
