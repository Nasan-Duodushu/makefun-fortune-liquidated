// Fortune Cookie for the Liquidated Trader — one fortune-cookie line for a
// crypto trader who just got liquidated. At most 20 words, sounds like a real
// fortune and lands as a joke on the loss. Writes /output/entry.txt
// (UTF-8, 1-160 chars).
import { mkdirSync, writeFileSync, chmodSync } from "node:fs";
import { join } from "node:path";

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const MAX_CHARS = 160;
const MAX_WORDS = 20;

class Fortune {
  readonly text: string;

  constructor(text: string) {
    this.text = text.trim();
  }

  get words(): number {
    return this.text.split(/\s+/).filter(Boolean).length;
  }

  validate(): void {
    if (this.text.length === 0 || this.text.length > MAX_CHARS) {
      throw new Error(
        `fortune must be 1-${MAX_CHARS} chars, got ${this.text.length}`,
      );
    }
    if (this.words > MAX_WORDS) {
      throw new Error(
        `fortune must be at most ${MAX_WORDS} words, got ${this.words}`,
      );
    }
    if (/[\r\n]/.test(this.text)) {
      throw new Error("fortune must be a single line");
    }
  }

  deliver(dir: string): string {
    this.validate();
    mkdirSync(dir, { recursive: true });
    const target = join(dir, "entry.txt");
    writeFileSync(target, this.text + "\n", "utf8");
    chmodSync(target, 0o644);
    return target;
  }
}

const fortune = new Fortune(
  "Your next trade will be your best one. The cookie has never been wrong before. Neither has your portfolio.",
);

const target = fortune.deliver(OUTPUT_DIR);
console.log(
  `${fortune.text.length} chars, ${fortune.words} words -> ${target}: ${fortune.text}`,
);
