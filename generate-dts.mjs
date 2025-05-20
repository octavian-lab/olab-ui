// generate-dts.mjs (oppure genera-dts.js se usi node --loader=ts)
import { readdir, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPONENTS_DIR = path.join(__dirname, 'src/components');
const OUTPUT_FILE = path.join(__dirname, 'types/index.d.ts');

async function scanVueComponents(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const components = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const nested = await scanVueComponents(fullPath);
      components.push(...nested);
    } else if (entry.isFile() && entry.name.endsWith('.vue')) {
      const name = path.basename(entry.name, '.vue');
      components.push(name);
    }
  }

  return components;
}

function generateTypeDeclarations(components) {
  const lines = [
    `declare module '@octavianlab/olab-ui' {`,
    `  import { DefineComponent } from 'vue';`,
  ];

  components.forEach(name => {
    lines.push(`  const ${name}: DefineComponent<{}, {}, any>;`);
  });

  lines.push(`  export {`);
  lines.push(`    ${components.join(',\n    ')}`);
  lines.push(`  };`);
  lines.push(`}`);

  return lines.join('\n');
}

const components = await scanVueComponents(COMPONENTS_DIR);
const content = generateTypeDeclarations(components);

await mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
await writeFile(OUTPUT_FILE, content);

console.log(`✅ Type declarations written to ${OUTPUT_FILE}`);
