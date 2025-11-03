import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';

// Load script.js in a DOM environment to access utils
const scriptContent = readFileSync('./script.js', 'utf-8');
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
const window = dom.window;
const document = window.document;

// Execute script in context
eval(scriptContent.replace('const app = new App();', '')); // Remove auto-init

global.window = window;
global.document = document;
describe('Utils', () => {
  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.restoreAllMocks();
      vi.useRealTimers();
    });

    it('should delay function execution', () => {
      const mockFn = vi.fn();
      const debouncedFn = utils.debounce(mockFn, 100);

      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should reset timer on multiple calls', () => {
      const mockFn = vi.fn();
      const debouncedFn = utils.debounce(mockFn, 100);

      debouncedFn();
      vi.advanceTimersByTime(50);
      debouncedFn();
      vi.advanceTimersByTime(50);
      expect(mockFn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments to debounced function', () => {
      const mockFn = vi.fn();
      const debouncedFn = utils.debounce(mockFn, 100);

      debouncedFn('arg1', 'arg2');
      vi.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('isInViewport', () => {
    it('should return true for element in viewport', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      // Mock getBoundingClientRect
      element.getBoundingClientRect = vi.fn(() => ({
        top: 100,
        left: 100,
        bottom: 200,
        right: 200,
        width: 100,
        height: 100
      }));

      Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });
      Object.defineProperty(window, 'innerWidth', { value: 800, writable: true });

      expect(utils.isInViewport(element)).toBe(true);
    });

    it('should return false for element outside viewport', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      element.getBoundingClientRect = vi.fn(() => ({
        top: 900,
        left: 900,
        bottom: 1000,
        right: 1000,
        width: 100,
        height: 100
      }));

      Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });
      Object.defineProperty(window, 'innerWidth', { value: 800, writable: true });

      expect(utils.isInViewport(element)).toBe(false);
    });

    it('should return false for element partially outside viewport', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      element.getBoundingClientRect = vi.fn(() => ({
        top: -50,
        left: 100,
        bottom: 50,
        right: 200,
        width: 100,
        height: 100
      }));

      Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });
      Object.defineProperty(window, 'innerWidth', { value: 800, writable: true });

      expect(utils.isInViewport(element)).toBe(false);
    });
  });
});

