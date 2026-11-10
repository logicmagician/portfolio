// Server-only: checks whether a public file exists at build time.
import fs from "fs";
import path from "path";

export function publicFileExists(publicPath: string): boolean {
  const relative = publicPath.replace(/^\/+/, "");
  return fs.existsSync(path.join(process.cwd(), "public", relative));
}
