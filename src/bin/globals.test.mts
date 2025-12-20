import { describe, it, expect } from 'vitest';
import { gPackageVersion, gPackageDescription } from './globals.mjs';

describe('globals', () => {
  describe('gPackageVersion', () => {
    it('should be defined', () => {
      // Arrange & Act & Assert
      expect(gPackageVersion).toBeDefined();
    });

    it('should be a string', () => {
      // Arrange & Act & Assert
      expect(typeof gPackageVersion).toBe('string');
    });

    it('should have a valid semantic version format', () => {
      // Arrange
      const semverPattern = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;

      // Act & Assert
      expect(gPackageVersion).toMatch(semverPattern);
    });

    it('should not be empty', () => {
      // Arrange & Act & Assert
      expect(gPackageVersion.length).toBeGreaterThan(0);
    });
  });

  describe('gPackageDescription', () => {
    it('should be defined', () => {
      // Arrange & Act & Assert
      expect(gPackageDescription).toBeDefined();
    });

    it('should be a string', () => {
      // Arrange & Act & Assert
      expect(typeof gPackageDescription).toBe('string');
    });

    it('should not be empty', () => {
      // Arrange & Act & Assert
      expect(gPackageDescription.length).toBeGreaterThan(0);
    });

    it('should contain relevant package information', () => {
      // Arrange
      const lowerDescription = gPackageDescription.toLowerCase();

      // Act
      const hasRelevantKeywords = 
        lowerDescription.includes('report') ||
        lowerDescription.includes('ctrf') ||
        lowerDescription.includes('html') ||
        lowerDescription.includes('test');

      // Assert
      expect(hasRelevantKeywords).toBe(true);
    });
  });
});
