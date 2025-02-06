export type ModuleOptions = {
  title: string;
  description: string;
  data: ModuleDataOptions[];
};

export type ModuleDataOptions = {
  name: string;
  value: string;
};

export type PositionOptions = 'left' | 'right' | 'start' | 'end';

export type AccessibilityOptions = {
  displayType?: DisplayType;
  overlay?: boolean;
  position?: PositionOptions;
  include?: ModuleTypes[];
  title?: string;
  description?: string;
  multiSelectableAccordions?: boolean;
  fontSize?: ModuleOptions;
  theme?: ModuleOptions;
  layout?: ModuleOptions;
  spacing?: ModuleOptions;
  language?: ModuleOptions;
};

export type DisplayType = 'panel' | 'strip' | 'popover';
export type ModuleTypes =
  | 'fontSize'
  | 'theme'
  | 'layout'
  | 'spacing'
  | 'language';

export interface WeissAccessibilitySettings {
  fontSize: string;
  theme: string;
  spacing: string;
  language: string;
  layout: string;
}

export interface PanelData {
  title: string;
  description: string;
  position: PositionOptions;
  multiSelectableAccordions?: boolean;
  modules: {
    [key in ModuleTypes]?: ModuleOptions;
  }
}