import { describe, it, expect } from 'vitest';
import { version, description } from './package-info.mjs';

describe('package-info', () => {
  describe('version', () => {
    it('should export version from globals', () => {
      // Arrange & Act & Assert
      expect(version).toBeDefined();
      expect(typeof version).toBe('string');
    });

    it('should have a valid semantic version format', () => {
      // Arrange
      const semverPattern = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;

      // Act & Assert
      expect(version).toMatch(semverPattern);
    });
  });

  describe('description', () => {
    it('should export description from globals', () => {
      // Arrange & Act & Assert
      expect(description).toBeDefined();
      expect(typeof description).toBe('string');
    });

    it('should not be empty', () => {
      // Arrange & Act & Assert
      expect(description.length).toBeGreaterThan(0);
    });

    it('should contain relevant keywords', () => {
      // Arrange
      const lowerDescription = description.toLowerCase();

      // Act
      const hasRelevantKeywords = 
        lowerDescription.includes('report') ||
        lowerDescription.includes('ctrf') ||
        lowerDescription.includes('html');

      // Assert
      expect(hasRelevantKeywords).toBe(true);
    });
  });
});
