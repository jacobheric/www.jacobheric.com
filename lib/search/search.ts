import { POSTS } from "../posts/posts.ts";

const MIN_SCORE = 20;

const normalize = (value: string) => value.toLowerCase().trim();

const tokenize = (value: string) =>
  normalize(value)
    .split(/\s+/)
    .filter(Boolean);

const subsequenceScore = (term: string, text: string) => {
  if (!term || !text) {
    return 0;
  }

  let termIndex = 0;
  let firstMatch = -1;
  let lastMatch = -1;

  for (let i = 0; i < text.length && termIndex < term.length; i++) {
    if (text[i] !== term[termIndex]) {
      continue;
    }

    if (firstMatch < 0) {
      firstMatch = i;
    }
    lastMatch = i;
    termIndex++;
  }

  if (termIndex !== term.length || firstMatch < 0 || lastMatch < 0) {
    return 0;
  }

  const spread = lastMatch - firstMatch + 1;
  const compactness = term.length / spread;
  const earlyBonus = 1 / (1 + firstMatch / 16);
  return (compactness * 24) + (earlyBonus * 12);
};

const fieldScore = (term: string, text: string) => {
  const exactIndex = text.indexOf(term);
  if (exactIndex >= 0) {
    return 140 - Math.min(exactIndex, 120);
  }

  return subsequenceScore(term, text);
};

const postScore = (
  { title, content }: { title: string; content: string },
  query: string,
  tokens: string[],
) => {
  const titleText = normalize(title);
  const contentText = normalize(content);

  const queryScore = (fieldScore(query, titleText) * 2.4) +
    fieldScore(query, contentText);

  const tokenScore = tokens.reduce((total, token) => {
    return total +
      (fieldScore(token, titleText) * 0.9) +
      (fieldScore(token, contentText) * 0.4);
  }, 0);

  return queryScore + tokenScore;
};

export const search = (term: string) => {
  const query = normalize(term);
  if (!query) {
    return [];
  }

  const tokens = tokenize(query);
  return POSTS
    .map((post) => ({ post, score: postScore(post, query, tokens) }))
    .filter(({ score }) => score >= MIN_SCORE)
    .sort((a, b) =>
      b.score - a.score || b.post.date.getTime() - a.post.date.getTime()
    )
    .map(({ post }) => post);
};
