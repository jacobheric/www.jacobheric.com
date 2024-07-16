import * as Marked from "https://esm.sh/marked@7.0.2";

class Renderer extends Marked.Renderer {
}

export const renderMarkdown = (
  input: string,
): string => {
  const renderer = new Renderer();
  const markedOpts: Marked.MarkedOptions = {
    gfm: true,
    renderer,
  };

  return Marked.parseInline(input, markedOpts) as string;
};
