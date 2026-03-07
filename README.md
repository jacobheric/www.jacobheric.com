# Jacob's Website

![](./screenshot.png)

### overview

This is my personal site, built with vanilla TypeScript on top of `Deno.serve`
and deployed to Deno Deploy. It's mostly just pictures of daily life with some
comments. Actually it's a lot of pictures. See below for more on the technical
challenges that presents.

**local dev:**

```
deno task dev
```

**adding content**

To generate posts, add images to `static/image/raw` in the form of
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
images randomly across four git sub-repositories...so each stays well below deno
deploy's 1GB static file size limit. Image repos are not open source. But, they
contain just the images and a github action one liner to serve the files on deno
deploy like so:

```
      ...

      - name: Upload to Deno Deploy
        uses: denoland/deployctl@v1
        with:
          project: "jacobheric-pine"
          entrypoint: "https://jsr.io/@std/http/0.224.5/file_server.ts"
          root: "."
```

Commit and deploy:

```
deno task build
./supercommit.sh "august 2024"
```

This issues a commit against the main repository and all sub-repositories. Then:

```
git push --recurse-submodules=on-demand
```

**data**

Posts are authored as markdown files with YAML frontmatter in `posts/`.
`deno task loadPosts` compiles them into `lib/db/posts.json` for fast runtime
reads. I built a version that uses deno's kv store but I blew the read/write
limits way too quickly. That version is here:
https://github.com/jacobheric/www.jacobheric.com/tree/kv
