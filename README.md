# Jacob's Website

[![Made with Fresh](https://fresh.deno.dev/fresh-badge.svg)](https://fresh.deno.dev)

### overview

This is my personal site, built with Deno fresh and deployed to Deno deploy.
It's mostly just pictures of daily life with some comments. Actually it's a lot
of pictures. See below for more on the technical challenges that presents.

**local dev:**

```
deno task start
```

**adding content**

To generate posts, add images to `static/images/raw` in the form of
yyyy-mm-dd-name and then run:

```
deno task makePosts
```

This will make a new post from images for any day that does not already have a
post. Images are automatically added to the new posts grouped by day.

```
deno task resizePictures
```

This will resize images for small and large use on the web. It also shards the
images randomly across four git sub-repositories...so each stays well below Deno
Deploy's 1GB static file size limit. Image repos are not open source.

Commit and deploy:

```
./supercommit.sh "august 2024"
```

This issues a commit against the main repository and all sub-repositories. Then:

```
git push --recurse-submodules=on-demand
```
