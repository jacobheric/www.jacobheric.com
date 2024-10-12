# Jacob's Website

[![Made with Fresh](https://fresh.deno.dev/fresh-badge.svg)](https://fresh.deno.dev)

### Overview

This is my personal site, built with Deno fresh and deployed to Deno deploy.
It's mostly just pictures of daily life with some comments. Actually it's a lot
of pictures. See below for more on the technical challenges that presents.

### History

It's actually pretty long in internet terms if you look at the post chronology.
The stack timeline goes something like `wordpress` &rarr; `drupal` &rarr;
`wordpress` &rarr; `jekyll` &rarr; `eleventy` &rarr; `deno fresh`. Why fresh?
I'm a web dev by trade and static site generators are not something I use very
often so it was always a pain to maintain. I like deno. It's a very familiar
hammer. I have used it professionally. It addresses _a lot_ of the pain points
of doing modern web development, JIT builds, built-in formatters/linters,
standards based.

local dev:

```
deno task start
```

To generate posts, add images to `static/images/raw` in the form of
yyyy-mm-dd-name and then run:

```
deno task makePosts
```

This will make a new post from images for any day that does not already have a
post. Images are automatically added to the new posts grouped by day.

Resize images. Images are resized automatically when doing local dev or you can
do it manually with:

```
deno task resizePictures
```

This will resize images for small and large use on the web. It also shards the
images randomly across four git sub-repositories...so each stays well below Deno
Deploy's 1GB static file size limit.

Commit and deploy:

```
./supercommit.sh "august 2024"
```

This issues a commit against the main repository and all sub-repositories. Then:

```
git push --recurse-submodules=on-demand
```
