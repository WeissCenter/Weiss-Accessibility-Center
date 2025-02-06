import { WeissAccessibilityCenterService } from './weiss-accessibility-center.service';
import { AccessibilityOptions } from './weiss-accessibility-center.interfaces';

export function createAccessibilityOptions(service: WeissAccessibilityCenterService): AccessibilityOptions {
  return {
    displayType: 'panel',
    overlay: true,
    position: 'end',
    include: ['fontSize', 'theme', 'spacing', 'layout'],
    title: 'Accessibility settings',
    description: 'Adjust the settings below to customize the appearance of this website.',
    multiSelectableAccordions: false,
    fontSize: {
      title: 'Text size',
      description: 'The text-size setting allows you to adjust how big or small the words appear on the screen.',
      data: service.weissAccessibilityFontSizes,
    },
    theme: {
      title: 'Color theme',
      description: 'The color theme setting allows you to adjust the color scheme of the website.',
      data: service.weissAccessibilityThemes,
    },
    spacing: {
      title: 'Spacing',
      description: 'The spacing setting lets you adjust the distance between elements on the page.',
      data: service.weissAccessibilitySpacing,
    },
    layout: {
      title: 'Layout',
      description: 'The layout setting allows you to change how content is arranged on the screen.',
      data: service.weissAccessibilityLayouts,
    },
  };
}
