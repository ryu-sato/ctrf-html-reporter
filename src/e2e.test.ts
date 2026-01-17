import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const packNPM = (outDir: string = '.') => {
  const packResult = execSync('npm pack --pack-destination ' + outDir, {
    encoding: 'utf-8',
  });
  if (!packResult || packResult?.split('\n')?.at(-2) == null) {
    throw new Error('Failed to create npm package tarball');
  }
  const packName = packResult.split('\n').at(-2)!;
  return join(outDir, packName);
};

const installNPM = (tempDir: string, tarballPath: string) => {
  execSync(`npm install ${tarballPath}`, {
    cwd: tempDir,
  });
}

const writePackageJson = (dir: string, content?: object) => {
  content ||= { name: 'test-project', version: '1.0.0' };
  writeFileSync(
    join(dir, 'package.json'),
    JSON.stringify(content)
  );
}

const writeCTRFFile = (dir: string, content?: object) => {
  content ||= {
    results: {
      tool: { name: 'test-tool' },
      summary: { tests: 1, passed: 1, failed: 0 },
      tests: [{ name: 'test1', status: 'passed' }]
    }
  };
  writeFileSync(
    join(dir, 'sample.ctrf.json'),
    JSON.stringify(content)
  );
}

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
    rmSync(tarballPath, { force: true });
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
