import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cwd } from "node:process";
import markdownit from "markdown-it";

export default function readme() {
  try {
    const file = resolve(cwd(), "README.md");
    if (existsSync(file)) {
      const contents = readFileSync(file, "utf8");
      const html = markdownit().render(contents);

      return html;
    }
  } catch (error) {
    console.error(error);
  }
}
