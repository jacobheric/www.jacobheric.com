import { Picture } from "@/components/Picture.tsx";
import { Nav } from "../components/Nav.tsx";

export default function Books() {
  return (
    <div class="w-11/12 mx-auto flex flex-col items-center gap-8">
      <div class="text-6xl text-center">Books</div>
      <div>
        <span class="title text-2xl font-bold italic inline mr-2 text-center">
          Autobiography of Joker So Far
        </span>
        <span class="inline">by Jacob Heric</span>
      </div>

      <Nav
        leftChildren={
          <a
            href="https://www.amazon.com/Autobiography-Joker-Far-Jacob-Heric/dp/0692539506/"
            rel="nofollow"
          >
            paperback
          </a>
        }
        rightChildren={
          <a
            href="https://www.amazon.com/Autobiography-Joker-Far-Jacob-Heric-ebook/dp/B018B79GEY/"
            rel="nofollow"
          >
            kindle
          </a>
        }
      />

      <div class="flex flex-row flex-wrap md:flex-nowrap justify-center align-top space-x-4 space-y-4">
        <div className="w-full flex justify-center lg:justify-end">
          <Picture
            className="max-w-xl"
            src="auto-bio-cover.jpg"
            alt="Autobiograph of Joker so Far Cover Image"
          />
        </div>
        <div class="flex-col w-full flex items-center font-prose">
          <div class="font-bold pb-3 max-w-prose">
            Out of the ordinary folds of middle America, comes a teenage obscura
            with a penchant for pain. Joseph Kare, aka{" "}
            <em>Joker</em>, wakes up one day to find himself squarely in the
            crosshairs of cultural change.
          </div>
          <div className="max-w-prose">
            For Joker, ditching high school in America’s heartland comes with
            dire consequences. His first dilemma is to run damage control - a
            rumor spreads after last night’s party. His next dilemma is Cass.
            Somehow she’s at the center of the rumor. Soon she will be at the
            center of his life too. She will be more important than the friends
            he double-deals, more important than the escalating threats to his
            life, more important than his future. Wily, wicked, and weird, Joker
            navigates his adolescence according to his own rules. With imprecise
            prose, screwball scheming and, ultimately, stubborn brilliance,
            Joker hurtles himself to the extremes of his boyish world, where he
            attempts to escape his own demise while celebrating the marvelous,
            awkward, bitter-sweet tang of a teenage life. True.
          </div>
        </div>
      </div>
      <div class=" text-2xl italic">
        Out now on
        <a
          href="https://www.truejokercompany.com"
          rel="nofollow"
          className="ml-2"
        >
          True Joker Company Publications
        </a>
      </div>
    </div>
  );
}
