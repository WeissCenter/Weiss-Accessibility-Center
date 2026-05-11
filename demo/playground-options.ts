import {
  AccessibilityOptions,
  DisplayType,
  ModuleOptions,
  ModuleTypes,
  PositionOptions,
} from '../src/public-api';

export type ModuleSelection = Record<ModuleTypes, boolean>;

export interface PlaygroundControls {
  displayType: Exclude<DisplayType, 'popover'>;
  overlay: boolean;
  position: PositionOptions;
  multiSelectableAccordions: boolean;
  modules: ModuleSelection;
}

export const DEFAULT_MODULE_SELECTION: ModuleSelection = {
  fontSize: true,
  theme: true,
  spacing: true,
  layout: true,
  language: false,
};

export const LANGUAGE_OPTIONS: ModuleOptions = {
  title: 'Language',
  description: 'Change the page language used by the accessibility settings.',
  data: [
    { name: 'Arabic', value: 'ar' },
    { name: 'Chinese', value: 'zh-CN' },
    { name: 'English', value: 'en' },
    { name: 'Spanish', value: 'es' },
    { name: 'French', value: 'fr' },
    { name: 'Russian', value: 'ru' },
  ],
};

export function buildPlaygroundOptions(
  controls: PlaygroundControls
): AccessibilityOptions {
  const include = (Object.keys(controls.modules) as ModuleTypes[]).filter(
    (module) => controls.modules[module]
  );

  return {
    displayType: controls.displayType,
    overlay: controls.overlay,
    position: controls.position,
    include,
    multiSelectableAccordions: controls.multiSelectableAccordions,
    ...(controls.modules.language ? { language: LANGUAGE_OPTIONS } : {}),
  };
}
