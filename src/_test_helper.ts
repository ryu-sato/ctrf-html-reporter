import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';

export const packNPM = (outDir: string = '.') => {
  const packResult = execSync('npm pack --pack-destination ' + outDir, {
    encoding: 'utf-8',
  });
  if (!packResult || packResult?.split('\n')?.at(-2) == null) {
    throw new Error('Failed to create npm package tarball');
  }
  const packName = packResult.split('\n').at(-2)!;
  return join(outDir, packName);
};

export const installNPM = (tempDir: string, tarballPath: string) => {
  execSync(`npm install ${tarballPath}`, {
    cwd: tempDir,
  });
}

export const writePackageJson = (dir: string, content?: object) => {
  content ||= { name: 'test-project', version: '1.0.0' };
  writeFileSync(
    join(dir, 'package.json'),
    JSON.stringify(content)
  );
}

export const writeCTRFFile = (dir: string, content?: object) => {
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
