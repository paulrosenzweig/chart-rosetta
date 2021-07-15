import fs from "fs/promises";
import { buildSync } from "esbuild";

const packageJSON = JSON.parse(await fs.readFile("package.json"));
const deps = Object.keys(packageJSON.dependencies);

function buildContent(contents, outfile) {
  buildSync({
    stdin: { contents, resolveDir: "." },
    format: "esm",
    bundle: true,
    outfile,
  });
}

for (const dep of deps) {
  const outfile = `esm-deps/${dep}.js`;
  try {
    buildContent(
      `export * from "${dep}"; export {default} from "${dep}"`,
      outfile
    );
  } catch (e) {
    const [{ text }] = e.errors;
    if (text.match(/No matching export in ".*" for import "default"/)) {
      buildContent(`export * from "${dep}"`, outfile);
    } else {
      throw e;
    }
  }
}
