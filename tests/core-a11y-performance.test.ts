import { describe, expect, it } from 'vitest';
import axe from 'axe-core';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Pagiflow = require('../packages/core/src/pagiflow.js');

if (!(HTMLElement.prototype as any).scrollTo) {
  (HTMLElement.prototype as any).scrollTo = () => {};
}

function setupSlider(slideCount = 5) {
  document.body.innerHTML = '<div class="slider"></div>';
  const slider = document.querySelector('.slider') as HTMLDivElement;
  for (let i = 0; i < slideCount; i += 1) {
    const el = document.createElement('div');
    el.textContent = `Slide ${i + 1}`;
    slider.appendChild(el);
  }
  return slider;
}

describe('Core accessibility and performance evidence', () => {
  async function expectNoSevere(options: Record<string, unknown>) {
    setupSlider();
    Pagiflow('.slider', options);
    const result = await axe.run(document.body);
    const severe = result.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical'
    );
    expect(severe).toHaveLength(0);
  }

  it('has no serious/critical axe violations in default markup', async () => {
    await expectNoSevere({
      nav: true,
      paginate: true,
      prevIcon: 'Previous',
      nextIcon: 'Next',
    });
  });

  it('has no serious/critical violations with thumbnails enabled', async () => {
    await expectNoSevere({
      nav: true,
      paginate: true,
      thumbnails: { enabled: true },
      prevIcon: 'Previous',
      nextIcon: 'Next',
    });
  });

  it('has no serious/critical violations in vertical mode', async () => {
    await expectNoSevere({
      direction: 'vertical',
      nav: true,
      paginate: true,
      prevIcon: 'Previous',
      nextIcon: 'Next',
    });
  });

  it('has no serious/critical violations in rtl mode', async () => {
    await expectNoSevere({
      rtl: true,
      nav: true,
      paginate: true,
      prevIcon: 'Previous',
      nextIcon: 'Next',
    });
  });

  it('has no serious/critical violations in sync mode', async () => {
    document.body.innerHTML = '<div class="slider-a"></div><div class="slider-b"></div>';
    for (const cls of ['slider-a', 'slider-b']) {
      const slider = document.querySelector(`.${cls}`) as HTMLDivElement;
      for (let i = 0; i < 5; i += 1) {
        const el = document.createElement('div');
        el.textContent = `${cls} Slide ${i + 1}`;
        slider.appendChild(el);
      }
    }
    Pagiflow('.slider-a', { nav: true, paginate: true, sync: '.slider-b', prevIcon: 'Previous', nextIcon: 'Next' });
    Pagiflow('.slider-b', { nav: true, paginate: true, sync: '.slider-a', prevIcon: 'Previous', nextIcon: 'Next' });

    const result = await axe.run(document.body);
    const severe = result.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical'
    );
    expect(severe).toHaveLength(0);
  });

  it('navigates 500 steps quickly (sanity perf check)', () => {
    setupSlider();
    setupSlider(20);
    const inst = Pagiflow('.slider', { loop: true, speed: 0 });
    const start = performance.now();
    for (let i = 0; i < 500; i += 1) {
      inst.next();
    }
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(500);
    inst.destroy();
  });
});
