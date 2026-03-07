import { parseArgs } from "@std/cli";
import { syncContent } from "@/lib/content/sync.ts";

type RunOptions = {
  env?: Record<string, string>;
};

const run = async (
  cmd: string,
  args: string[],
  { env }: RunOptions = {},
) => {
  const result = await new Deno.Command(cmd, {
    args,
    env,
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  }).output();

  if (!result.success) {
    throw new Error(`${cmd} ${args.join(" ")} failed`);
  }
};

const args = parseArgs(Deno.args, {
  string: ["message"],
  alias: { m: "message" },
  boolean: ["no-push", "no-sync"],
  default: {
    "no-push": false,
    "no-sync": false,
  },
});

const resolveMessage = () => {
  const fromArg = String(args.message ?? "").trim();
  if (fromArg) {
    return fromArg;
  }

  const fromPrompt = prompt("Commit message for main repo + shard submodules?")
    ?.trim();
  if (fromPrompt) {
    return fromPrompt;
  }

  throw new Error("commit message required");
};

const message = resolveMessage();

if (!args["no-sync"]) {
  console.log("syncing content before publish...");
  const summary = await syncContent({ persistPostsIndex: false });
  console.log(
    `content sync complete: posts(created=${summary.createdPosts}, appended=${summary.appendedPosts}, skipped=${summary.skippedPostImages}), pictures(processed=${summary.processedPictures}, resized=${summary.resizedPictures}, copied=${summary.copiedPictures}, skipped=${summary.skippedPictures})`,
  );
}

console.log("building production posts index...");
await run(
  "deno",
  ["task", "loadPosts"],
  {
    env: {
      ...Deno.env.toObject(),
      PRODUCTION: "true",
    },
  },
);
console.log("production posts index complete");

console.log("committing main repo + shard submodules...");
await run("bash", ["./supercommit.sh", message]);

if (!args["no-push"]) {
  console.log("pushing shard submodules...");
  await run("git", [
    "submodule",
    "foreach",
    "--quiet",
    "git push origin HEAD:main",
  ]);

  console.log("pushing main repo...");
  await run("git", ["push", "--recurse-submodules=check"]);
}

console.log("publish complete");
