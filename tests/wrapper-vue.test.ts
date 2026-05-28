import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { Pagiflow } from '../packages/vue/src/Pagiflow';

function installMockPagiflow() {
  const instance = {
    destroyed: false,
    setOptions: vi.fn(),
    onSlideChange: vi.fn(() => instance),
    destroy: vi.fn(() => {
      instance.destroyed = true;
    }),
  } as any;

  (window as any).Pagiflow = vi.fn(() => instance);
  return instance;
}

describe('Vue wrapper', () => {
  afterEach(() => {
    delete (window as any).Pagiflow;
  });

  it('updates options through watcher and destroys on unmount', async () => {
    const instance = installMockPagiflow();
    const wrapper = mount(Pagiflow as any, {
      props: {
        options: { loop: false, itemsPerSlide: 1 },
      },
      slots: {
        default: '<div>Slide 1</div>',
      },
    });

    await wrapper.setProps({ options: { loop: true, itemsPerSlide: 2 } });
    expect(instance.setOptions).toHaveBeenCalledWith(
      expect.objectContaining({ loop: true, itemsPerSlide: 2 }),
      true
    );

    wrapper.unmount();
    expect(instance.destroy).toHaveBeenCalledTimes(1);
  });
});
