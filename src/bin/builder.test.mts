import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { resolveOutputPath, resolveReporterPath, buildReport } from './builder.mjs';
import path from 'path';
import * as vitepress from 'vitepress';

// Mock vitepress build function
vi.mock('vitepress', () => ({
  build: vi.fn(),
}));

describe('builder', () => {
  const originalCwd = process.cwd();
  const originalEnv = process.env.CTRF_REPORT_PATH;

  afterEach(() => {
    // Restore original values
    process.chdir(originalCwd);
    if (originalEnv === undefined) {
      delete process.env.CTRF_REPORT_PATH;
    } else {
      process.env.CTRF_REPORT_PATH = originalEnv;
    }
    vi.clearAllMocks();
  });

  describe('resolveOutputPath', () => {
    it('should resolve absolute path as is', () => {
      // Arrange
      const absolutePath = '/absolute/path/to/output';

      // Act
      const result = resolveOutputPath(absolutePath);

      // Assert
      expect(result).toBe(absolutePath);
    });

    it('should resolve relative path based on cwd', () => {
      // Arrange
      const relativePath = './output';
      const expected = path.resolve(process.cwd(), relativePath);

      // Act
      const result = resolveOutputPath(relativePath);

      // Assert
      expect(result).toBe(expected);
    });

    it('should handle paths with .. segments', () => {
      // Arrange
      const relativePath = '../output';
      const expected = path.resolve(process.cwd(), relativePath);

      // Act
      const result = resolveOutputPath(relativePath);

      // Assert
      expect(result).toBe(expected);
    });
  });

  describe('resolveReporterPath', () => {
    it('should resolve to reporter directory relative to module', () => {
      // Arrange & Act
      const result = resolveReporterPath();
      
      // Assert
      expect(result).toContain('reporter');
      expect(path.isAbsolute(result)).toBe(true);
    });

    it('should resolve to the same path on multiple calls', () => {
      // Arrange & Act
      const result1 = resolveReporterPath();
      const result2 = resolveReporterPath();

      // Assert
      expect(result1).toBe(result2);
    });
  });

  describe('buildReport', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      // Mock console.log to avoid noise in test output
      vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should set CTRF_REPORT_PATH environment variable', () => {
      // Arrange
      const commandArgs = {
        inputFilePath: '/path/to/report.ctrf.json',
        outputPath: './output',
      };

      // Act
      buildReport(commandArgs);

      // Assert
      expect(process.env.CTRF_REPORT_PATH).toBe(commandArgs.inputFilePath);
    });

    it('should call vitepress build with correct paths', () => {
      // Arrange
      const commandArgs = {
        inputFilePath: '/path/to/report.ctrf.json',
        outputPath: './output',
      };

      // Act
      buildReport(commandArgs);

      // Assert
      expect(vitepress.build).toHaveBeenCalledTimes(1);
      
      const callArgs = vi.mocked(vitepress.build).mock.calls[0];
      expect(callArgs).toBeDefined();
      expect(callArgs![0]).toContain('reporter'); // reporter path
      expect(callArgs![1]).toEqual({
        outDir: path.resolve(process.cwd(), commandArgs.outputPath),
      });
    });

    it('should resolve output path correctly', () => {
      // Arrange
      const commandArgs = {
        inputFilePath: 'report.ctrf.json',
        outputPath: '.ctrf/report',
      };
      const expectedOutDir = path.resolve(process.cwd(), '.ctrf/report');

      // Act
      buildReport(commandArgs);

      // Assert
      const callArgs = vi.mocked(vitepress.build).mock.calls[0];
      expect(callArgs).toBeDefined();
      expect(callArgs![1]).toEqual({ outDir: expectedOutDir });
    });

    it('should log processing messages', () => {
      // Arrange
      const commandArgs = {
        inputFilePath: 'test-report.ctrf.json',
        outputPath: './output',
      };

      // Act
      buildReport(commandArgs);

      // Assert
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('test-report.ctrf.json')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('./output')
      );
    });

    it('should handle absolute input file path', () => {
      // Arrange
      const commandArgs = {
        inputFilePath: '/absolute/path/report.ctrf.json',
        outputPath: '/absolute/output',
      };

      // Act
      buildReport(commandArgs);

      // Assert
      expect(process.env.CTRF_REPORT_PATH).toBe('/absolute/path/report.ctrf.json');
      
      const callArgs = vi.mocked(vitepress.build).mock.calls[0];
      expect(callArgs).toBeDefined();
      expect(callArgs![1]).toEqual({ outDir: '/absolute/output' });
    });
  });
});
