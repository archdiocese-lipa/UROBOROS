// .husky/pre-push.js
import { execSync } from "child_process";
import process from "process";

try {
  console.log("Running lint check...");
  execSync("npx lint-staged", { stdio: "inherit" });
  console.log("Linting passed. Proceeding with commit.");
} catch {
  console.error("Linting failed. Commit aborted.");
  process.exit(1);
}
