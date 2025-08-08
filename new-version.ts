require("dotenv").config({ path: "./.env" });
const zpack = require("./zpack.json");
const { execSync } = require("child_process");
const fs = require("fs");
const readline = require("readline");

const TOKEN = process.env.ZEBAR_TOKEN;

if (!TOKEN) {
  console.error("ZEBAR_TOKEN is not set in the environment variables");
  process.exit(1);
}

function writeJsonFileSync(filePath: string, data: any) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    })
  );
}

async function main() {
  const currentVersion = zpack.version;

  const NEW_VERSION = await prompt(
    `Enter the new version tag (current: ${currentVersion}): `
  );

  const COMMIT_MSG = await prompt("Enter git commit message: ");

  const versionValue = NEW_VERSION.startsWith("v")
    ? NEW_VERSION.substring(1)
    : NEW_VERSION;

  zpack.version = versionValue;
  writeJsonFileSync("./zpack.json", zpack);

  execSync("git add -A", { stdio: "inherit" });

  if (!COMMIT_MSG || !COMMIT_MSG.trim()) {
    execSync(`git commit -m "New version ${versionValue}"`, {
      stdio: "inherit",
    });
  } else {
    execSync(`git commit -m "${COMMIT_MSG.replace(/"/g, '\\"')}"`, {
      stdio: "inherit",
    });
  }

  execSync("git push", { stdio: "inherit" });

  execSync(`git tag ${NEW_VERSION}`, { stdio: "inherit" });

  execSync("git push --tags", { stdio: "inherit" });

  execSync(`zebar publish --token ${TOKEN} --pack-config ./zpack.json`, {
    stdio: "inherit",
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
