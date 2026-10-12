import { randomBytes } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { hash } from "bcryptjs";

// Public demo password only. Never pass real passwords on a command line.
const password = "Demo-Only!2026";
const escapeEnv = (value) => value.replaceAll("$", "\\$");
const contents = `# LOCAL DEMO ONLY. Never commit this file.\nNEXTAUTH_URL=http://localhost:3000\nNEXTAUTH_SECRET=${randomBytes(32).toString("base64url")}\nDEMO_EMAIL=demo@example.com\nDEMO_PASSWORD_HASH='${escapeEnv(await hash(password, 12))}'\n`;
try {
  await writeFile(new URL("../.env.local", import.meta.url), contents, { flag: "wx", mode: 0o600 });
  console.log("Created .env.local with a fresh random secret and bcrypt cost-12 hash.\nDemo login: demo@example.com / Demo-Only!2026\nRun npm run dev.");
} catch (error) {
  if (error.code === "EEXIST") {
    console.error(".env.local already exists; nothing was overwritten. Configure it manually or remove it intentionally before rerunning.");
    process.exitCode = 1;
  } else throw error;
}
