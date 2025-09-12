import { WeissAccessibilityCenterService } from './weiss-accessibility-center.service';
import { AccessibilityOptions, ModuleDataOptions } from './weiss-accessibility-center.interfaces';

/**
 * Translation accessor signature used to retrieve localized strings.
 * key: translation key
 * fallback: default English (or base) value when translation missing
 */
export type TranslationFn = (key: string, fallback: string) => string;

/**
 * Factory method to create default accessibility options with optional translations.
 * A translation function can be provided to customize module titles, descriptions, and option labels.
 */
export function createAccessibilityOptions(
  service: WeissAccessibilityCenterService,
  t?: TranslationFn
): AccessibilityOptions {
  const tr = (key: string, fallback: string) => (t ? t(key, fallback) : fallback);

  const mapOptionNames = (prefix: string, options: ModuleDataOptions[]): ModuleDataOptions[] =>
    options.map(opt => ({
      ...opt,
      name: tr(`${prefix}Option${pascal(opt.value)}`, opt.name)
    }));

  return {
    displayType: 'panel',
    overlay: true,
    position: 'end',
    include: ['fontSize', 'theme', 'spacing', 'layout'],
    title: tr('title', 'Accessibility settings'),
    description: tr('description', 'Adjust the settings below to customize the appearance of this website.'),
    multiSelectableAccordions: false,
    fontSize: {
      title: tr('fontSizeTitle', 'Text size'),
      description: tr('fontSizeDescription', 'The text-size setting allows you to adjust how big or small the words appear on the screen.'),
      data: mapOptionNames('fontSize', service.weissAccessibilityFontSizes),
    },
    theme: {
      title: tr('themeTitle', 'Color theme'),
      description: tr('themeDescription', 'The color theme setting allows you to adjust the color scheme of the website.'),
      data: mapOptionNames('theme', service.weissAccessibilityThemes),
    },
    spacing: {
      title: tr('spacingTitle', 'Spacing'),
      description: tr('spacingDescription', 'The spacing setting lets you adjust the distance between elements on the page.'),
      data: mapOptionNames('spacing', service.weissAccessibilitySpacing),
    },
    layout: {
      title: tr('layoutTitle', 'Layout'),
      description: tr('layoutDescription', 'The layout setting allows you to change how content is arranged on the screen.'),
      data: mapOptionNames('layout', service.weissAccessibilityLayouts),
    },
  };
}

// Helper to convert values like 'dynamic-dark' to 'DynamicDark' for key construction
function pascal(value: string): string {
  return value
    .split(/[^a-zA-Z0-9]/g)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}
