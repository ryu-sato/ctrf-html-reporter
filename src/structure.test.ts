import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync } from 'child_process';
import { mkdtempSync, rmSync, readFileSync, existsSync, accessSync, constants } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { installNPM, packNPM, writePackageJson } from './_test_helper.js';

describe('Package Structure Verification', () => {
  let tempDir: string;

  beforeAll(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'ctrf-package-verify-'));

    const tarballPath = packNPM(tempDir);
    writePackageJson(tempDir);
    installNPM(tempDir, tarballPath);
  });

  afterAll(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  const getBinInfo = () => {
    const packageJsonPath = join(tempDir, 'node_modules/ctrf-html-reporter/package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const name = Object.keys(packageJson.bin)[0];
    if (!name) {
      throw new Error('bin field not found or empty in package.json');
    }
    const binPath = join(tempDir, 'node_modules/.bin', name);
    return { packageJson, name, binPath };
  };

  it('should have bin field in package.json', () => {
    const { packageJson, name } = getBinInfo();

    expect(packageJson.bin).toBeDefined();
    expect(typeof packageJson.bin).toBe('object');

    const binEntries = Object.entries(packageJson.bin);
    expect(binEntries.length).toBeGreaterThan(0);
    expect(name).toBeTruthy();
  });

  it('should have bin file in node_modules/.bin', () => {
    const { binPath } = getBinInfo();

    expect(existsSync(binPath)).toBe(true);
  });

  it('should have executable bin file', () => {
    const { binPath } = getBinInfo();

    expect(() => {
      accessSync(binPath, constants.X_OK);
    }).not.toThrow();
  });

  it('should execute bin with --version flag', () => {
    const { binPath } = getBinInfo();

    const result = execSync(`${binPath} --version`, {
      encoding: 'utf-8',
    });

    expect(result.trim()).toMatch(/^\d+\.\d+\.\d+/);
  });
});
