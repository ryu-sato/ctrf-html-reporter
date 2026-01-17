import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { packNPM, installNPM, writePackageJson, writeCTRFFile } from './_test_helper.js';

describe('e2e: npx ctrf-html-reporter', () => {
  let tempDir: string;
  let tarballPath: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'ctrf-test-'));

    tarballPath = packNPM(tempDir);
    writePackageJson(tempDir);
    installNPM(tempDir, tarballPath);

    writeCTRFFile(tempDir);
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('should execute via npx and generate HTML report', () => {
    // Act
    const result = execSync(
      'npx ctrf-html-reporter sample.ctrf.json -o ./output',
      {
        cwd: tempDir,
        encoding: 'utf-8'
      }
    );

    // Assert
    expect(result).toContain('sample.ctrf.json');
    const outputDir = join(tempDir, 'output');
    expect(() => {
      execSync(`test -d ${outputDir}`);
    }).not.toThrow();
  });
});
