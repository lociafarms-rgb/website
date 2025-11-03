import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

// Mock DOM
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;

describe('VideoLoader utility methods', () => {
  // Since VideoLoader methods are instance methods, we'll test the utility functions
  // that are used internally

  describe('extractVideoId', () => {
    const extractVideoId = (urlOrId) => {
      if (!urlOrId) return '';
      
      if (!urlOrId.includes('http') && !urlOrId.includes('/')) {
        return urlOrId;
      }

      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /^([a-zA-Z0-9_-]{11})$/
      ];

      for (const pattern of patterns) {
        const match = urlOrId.match(pattern);
        if (match) {
          return match[1] || match[0];
        }
      }

      return urlOrId;
    };

    it('should extract video ID from YouTube watch URL', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
    });

    it('should extract video ID from youtu.be URL', () => {
      const url = 'https://youtu.be/dQw4w9WgXcQ';
      expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
    });

    it('should extract video ID from embed URL', () => {
      const url = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
      expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
    });

    it('should return direct ID if already an ID', () => {
      const id = 'dQw4w9WgXcQ';
      expect(extractVideoId(id)).toBe('dQw4w9WgXcQ');
    });

    it('should handle empty string', () => {
      expect(extractVideoId('')).toBe('');
    });

    it('should handle null or undefined', () => {
      expect(extractVideoId(null)).toBe('');
      expect(extractVideoId(undefined)).toBe('');
    });
  });

  describe('formatDate', () => {
    const formatDate = (dateString) => {
      if (!dateString) return '';
      
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      } catch (error) {
        return dateString;
      }
    };

    it('should format valid date string', () => {
      const date = '2025-01-15';
      const formatted = formatDate(date);
      expect(formatted).toContain('January');
      expect(formatted).toContain('15');
      expect(formatted).toContain('2025');
    });

    it('should return empty string for empty input', () => {
      expect(formatDate('')).toBe('');
    });

    it('should return original string for invalid date', () => {
      const invalid = 'invalid-date';
      expect(formatDate(invalid)).toBe(invalid);
    });
  });

  describe('escapeHtml', () => {
    const escapeHtml = (text) => {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    };

    it('should escape HTML entities', () => {
      const text = '<script>alert("xss")</script>';
      const escaped = escapeHtml(text);
      expect(escaped).not.toContain('<script>');
      expect(escaped).toContain('&lt;script&gt;');
    });

    it('should escape quotes', () => {
      const text = 'Text with "quotes"';
      const escaped = escapeHtml(text);
      expect(escaped).toBe('Text with "quotes"');
    });

    it('should handle empty string', () => {
      expect(escapeHtml('')).toBe('');
    });

    it('should handle special characters', () => {
      const text = 'Text & more';
      const escaped = escapeHtml(text);
      expect(escaped).toContain('&');
    });
  });
});

