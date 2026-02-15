import { describe, it, expect } from 'vitest';
import { commanderToCommandArguments, DEFAULT_OUTPUT_PATH } from './command-parameters.mjs';
import type { Command } from 'commander';

describe('command-parameters', () => {
  describe('commanderToCommandArguments', () => {
    it('should convert command with default output path', () => {
      // Arrange
      const mockCommand = {
        args: ['report.ctrf.json'],
        opts: () => ({}),
      } as unknown as Command;

      // Act
      const result = commanderToCommandArguments(mockCommand);

      // Assert
      expect(result).toEqual({
        inputFilePath: 'report.ctrf.json',
        outputPath: DEFAULT_OUTPUT_PATH,
        previousReportPath: undefined,
        baselineReportPath: undefined,
        singleFile: false,
      });
    });

    it('should convert command with custom output path', () => {
      // Arrange
      const mockCommand = {
        args: ['test-report.ctrf.json'],
        opts: () => ({ outputPath: '/custom/output' }),
      } as unknown as Command;

      // Act
      const result = commanderToCommandArguments(mockCommand);

      // Assert
      expect(result).toEqual({
        inputFilePath: 'test-report.ctrf.json',
        outputPath: '/custom/output',
        previousReportPath: undefined,
        baselineReportPath: undefined,
        singleFile: false,
      });
    });

    it('should handle relative input file path', () => {
      // Arrange
      const mockCommand = {
        args: ['./reports/test.ctrf.json'],
        opts: () => ({ outputPath: './output' }),
      } as unknown as Command;

      // Act
      const result = commanderToCommandArguments(mockCommand);

      // Assert
      expect(result).toEqual({
        inputFilePath: './reports/test.ctrf.json',
        outputPath: './output',
        previousReportPath: undefined,
        baselineReportPath: undefined,
        singleFile: false,
      });
    });

    it('should use DEFAULT_OUTPUT_PATH when outputPath is not provided', () => {
      // Arrange
      const mockCommand = {
        args: ['report.ctrf.json'],
        opts: () => ({ outputPath: undefined }),
      } as unknown as Command;

      // Act
      const result = commanderToCommandArguments(mockCommand);

      // Assert
      expect(result.outputPath).toBe(DEFAULT_OUTPUT_PATH);
    });
  });

  describe('DEFAULT_OUTPUT_PATH', () => {
    it('should have correct default value', () => {
      // Arrange & Act & Assert
      expect(DEFAULT_OUTPUT_PATH).toBe('.ctrf/report');
    });
  });
});
