export default function About() {
  return (
    <div className="text-lg mx-4">
      <div class="title text-6xl my-12 text-center">About</div>
      <p class="my-6 font-prose">
        I'm{" "}
        <span itemprop="name">Jacob Heric</span>, a family man living in
        Portland, Maine.
      </p>
      <p class="my-6 font-prose">
        Contact me at{" "}
        <a href="mailto:jacob@jacobheric.com">jacob@jacobheric.com</a>.
      </p>
      <p class="my-6 italic font-prose">
        <a
          title="Bartleby The Scrivener"
          href="http://www.bartleby.com/129/"
          rel="nofollow"
        >
          "I prefer not to," he respectfully and slowly said, and mildly
          disappeared.
        </a>
      </p>
    </div>
  );
}
