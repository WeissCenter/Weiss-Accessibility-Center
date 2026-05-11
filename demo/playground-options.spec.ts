import { buildPlaygroundOptions, DEFAULT_MODULE_SELECTION } from './playground-options';

describe('buildPlaygroundOptions', () => {
  it('maps playground controls into accessibility center options', () => {
    const options = buildPlaygroundOptions({
      displayType: 'strip',
      overlay: false,
      position: 'left',
      multiSelectableAccordions: true,
      modules: {
        fontSize: true,
        theme: false,
        spacing: true,
        layout: false,
        language: true,
      },
    });

    expect(options.displayType).toBe('strip');
    expect(options.overlay).toBe(false);
    expect(options.position).toBe('left');
    expect(options.multiSelectableAccordions).toBe(true);
    expect(options.include).toEqual(['fontSize', 'spacing', 'language']);
    expect(options.language?.data.map((item) => item.value)).toEqual([
      'ar',
      'zh-CN',
      'en',
      'es',
      'fr',
      'ru',
    ]);
  });

  it('starts with all primary modules enabled except language', () => {
    expect(DEFAULT_MODULE_SELECTION).toEqual({
      fontSize: true,
      theme: true,
      spacing: true,
      layout: true,
      language: false,
    });
  });
});
