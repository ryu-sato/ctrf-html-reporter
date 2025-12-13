import fs from 'fs';
import path from 'path';
import { copyFile } from 'copy-file';

export function copyDir(src: string, dest: string, excludeDirs: string[] = []): void {
  // If the dest directory does not exist, create it.
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }

  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    // Skip excluded entries
    if (excludeDirs.includes(entry.name)) {
      continue
    }

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, excludeDirs)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
};

export { copyFile };