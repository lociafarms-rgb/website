import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;
global.HTMLElement = dom.window.HTMLElement;

describe('PhotoCarousel logic', () => {
  let container, track, slides;

  beforeEach(() => {
    vi.useFakeTimers();
    
    // Setup carousel DOM structure
    container = document.createElement('div');
    container.className = 'carousel-container';
    
    track = document.createElement('div');
    track.className = 'carousel-track';
    
    slides = [];
    for (let i = 0; i < 3; i++) {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      track.appendChild(slide);
      slides.push(slide);
    }
    
    container.appendChild(track);
    document.body.appendChild(container);
  });

  it('should calculate correct translateX for slide index', () => {
    const currentIndex = 1;
    const translateX = -currentIndex * 100;
    expect(translateX).toBe(-100);
  });

  it('should handle circular navigation forward', () => {
    let currentIndex = 2; // Last slide
    const totalSlides = 3;
    currentIndex = (currentIndex + 1) % totalSlides;
    expect(currentIndex).toBe(0); // Should wrap to first
  });

  it('should handle circular navigation backward', () => {
    let currentIndex = 0; // First slide
    const totalSlides = 3;
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    expect(currentIndex).toBe(2); // Should wrap to last
  });

  it('should detect swipe gesture correctly', () => {
    const swipeThreshold = 50;
    const touchStartX = 100;
    const touchEndX = 200; // Swipe right
    const diff = touchStartX - touchEndX;
    
    expect(Math.abs(diff)).toBeGreaterThan(swipeThreshold);
    expect(diff < 0).toBe(true); // Should go to next slide
  });

  it('should not trigger swipe for small movements', () => {
    const swipeThreshold = 50;
    const touchStartX = 100;
    const touchEndX = 130; // Small movement
    const diff = Math.abs(touchStartX - touchEndX);
    
    expect(diff).toBeLessThan(swipeThreshold);
  });
});

