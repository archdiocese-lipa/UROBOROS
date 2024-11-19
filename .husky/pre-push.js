// .husky/pre-push.js
import { execSync } from "child_process";
import process from "process";

try {
  console.log("Running lint check on changed files...");
  const changedFiles = execSync(
    "git diff --cached --name-only --diff-filter=ACMRTUXB HEAD"
  )
    .toString()
    .trim()
    .split("\n")
    .filter(
      (file) =>
        file.endsWith(".js") ||
        file.endsWith(".jsx") ||
        file.endsWith(".ts") ||
        file.endsWith(".tsx")
    );

  if (changedFiles.length > 0) {
    execSync(`npx eslint ${changedFiles.join(" ")}`, { stdio: "inherit" });
  } else {
    console.log("No JavaScript/TypeScript files changed.");
  }
  console.log("Linting passed. Proceeding with push.");
} catch {
  console.error("Linting failed. Push aborted.");
  process.exit(1);
}
