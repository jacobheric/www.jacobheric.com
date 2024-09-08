# Jacob's Website

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
