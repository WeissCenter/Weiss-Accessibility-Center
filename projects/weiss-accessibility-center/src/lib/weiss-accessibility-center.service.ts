import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WeissAccessibilitySettings, ModuleDataOptions } from './weiss-accessibility-center.interfaces';

@Injectable({
  providedIn: 'root',
})
export class WeissAccessibilityCenterService {
  
  public weissAccessibilityThemes: ModuleDataOptions[] = [
    { name: 'Default light', value: 'default' },
    { name: 'Default dark', value: 'dynamic-dark' },
    { name: 'High contrast', value: 'high-contrast' },
    { name: 'Monochrome', value: 'monochrome' },
  ];

  public weissAccessibilityFontSizes: ModuleDataOptions[] = [
    { name: 'Decrease to 85%', value: 'smaller' },
    { name: 'Default at 100%', value: 'default' },
    { name: 'Increase to 125%', value: 'large' },
    { name: 'Increase to 150%', value: 'larger' },
    { name: 'Increase to 200%', value: 'largest' },
  ];

  public weissAccessibilitySpacing: ModuleDataOptions[] = [
    { name: 'Compact spacing', value: 'compact' },
    { name: 'Cozy spacing', value: 'default' },
    { name: 'Comfort spacing', value: 'comfort' },
    { name: 'Extra-comfort spacing', value: 'extra-comfort' },
  ];

  public weissAccessibilityLayouts: ModuleDataOptions[] = [
    { name: 'Default layout', value: 'default' },
    { name: 'Single column', value: 'mobile' },
  ];

  public weissAccessibilityLanguages: ModuleDataOptions[] = [
    { name: 'العربية', value: 'ar' },
    { name: '中文', value: 'zh-CN' },
    { name: 'English', value: 'en' },
    { name: 'Español', value: 'es' },
    { name: 'Français', value: 'fr' },
    { name: 'Русский', value: 'ru' },
  ];

  public defaultWeissAccessibilitySettings: WeissAccessibilitySettings = {
    fontSize: 'default',
    theme: 'default',
    spacing: 'default',
    language: 'en',
    layout: 'default',
  };

  // BehaviorSubject to hold and broadcast the current accessibility settings
  private accessibilitySettingsSubject: BehaviorSubject<WeissAccessibilitySettings>;

  // Observable to allow components to subscribe and react to settings changes
  weissAccessibilitySettings$: Observable<WeissAccessibilitySettings>;

  private target: HTMLElement | null = null;
  private showWeissAccessibilityCenter = new BehaviorSubject<boolean>(false);
  showWeissAccessibilityCenter$ = this.showWeissAccessibilityCenter.asObservable();

  toggleWeissAccessibilityCenter(
    targetElement?: HTMLElement | null,
    forceClose: boolean = false
  ) {
    if (forceClose) this.showWeissAccessibilityCenter.next(false);
    else
      this.showWeissAccessibilityCenter.next(
        !this.showWeissAccessibilityCenter.value
      );

    // Store the target element for focus restoration
    if (targetElement) {
      this.target =
        targetElement.closest('button, [tabindex]') || targetElement;
    }
    if (!this.target) {
      this.target = document.getElementById('weiss-a11y-toggle');
    }
    // If widget has been closed, return focus to the the target
    if (!this.showWeissAccessibilityCenter.value) {
      if (this.target) {
        this.target.focus();
        this.target = null;
      }
    }
  }

  constructor() {
    // On service initialization, load saved settings or use default ones
    const savedSettings = this.getSavedSettings();

    // Initialize BehaviorSubject with the saved/default settings
    this.accessibilitySettingsSubject =
      new BehaviorSubject<WeissAccessibilitySettings>(savedSettings);

    // Expose the subject as an observable
    this.weissAccessibilitySettings$ =
      this.accessibilitySettingsSubject.asObservable();

    // Apply the loaded or default settings to the document root
    this.applySettings(savedSettings);
  }

  // Method to update accessibility settings (partially or fully)
  updateSettings(newSettings: Partial<WeissAccessibilitySettings>): void {
    // Merge the new settings with the current settings
    const updatedSettings = {
      ...this.accessibilitySettingsSubject.value, // Current settings
      ...newSettings, // New settings to update
    };

    // Update the BehaviorSubject with the new settings
    this.accessibilitySettingsSubject.next(updatedSettings);

    // Save the updated settings to localStorage
    localStorage.setItem(
      'weiss-accessibility-settings',
      JSON.stringify(updatedSettings)
    );

    // Apply the updated settings to the document root
    this.applySettings(updatedSettings);
  }

  // Method to retrieve the current settings from the BehaviorSubject
  getCurrentSettings(): WeissAccessibilitySettings {
    return this.accessibilitySettingsSubject.value; // Returns the current settings
  }

  // Method to get saved settings from localStorage or return default settings
  private getSavedSettings(): WeissAccessibilitySettings {
    // Determine the default settings based on the browser language
    this.defaultWeissAccessibilitySettings.language = this.getSupportedLanguage();

    // Attempt to load saved settings from localStorage
    const savedSettings = JSON.parse(
      localStorage.getItem('weiss-accessibility-settings') || 'null'
    );

    // If saved settings exist, merge them with the default settings, else return default settings
    return savedSettings
      ? { ...this.defaultWeissAccessibilitySettings, ...savedSettings }
      : this.defaultWeissAccessibilitySettings;
  }

  // Method to apply the accessibility settings to the root element (HTML)
  private applySettings(settings: WeissAccessibilitySettings): void {
    const root = document.documentElement; // Get the root HTML element

    // Apply font size, theme, spacing, and language settings as attributes
    root.setAttribute('data-weiss-accessibility-font-size', settings.fontSize);
    root.setAttribute('data-weiss-accessibility-theme', settings.theme);
    root.setAttribute('data-weiss-accessibility-spacing', settings.spacing);
    root.setAttribute('data-weiss-accessibility-language', settings.language);
    root.setAttribute('data-weiss-accessibility-layout', settings.layout);
    root.setAttribute('lang', settings.language);

    // If the language is Arabic ('ar'), set the direction to RTL (Right-to-Left)
    if (settings.language === 'ar') {
      root.setAttribute('dir', 'rtl');
    } else {
      root.setAttribute('dir', ''); // Otherwise, reset direction to LTR (Left-to-Right)
    }
  }

  // Method to reset settings to default values, or optionally only specified settings
  resetSettings(
    onlyThese: Array<keyof WeissAccessibilitySettings> = []
  ): void {
    console.log("Resetting: " + onlyThese);
    // If no specific settings were provided, reset all settings to default
    if (onlyThese.length === 0) {
      this.updateSettings(this.defaultWeissAccessibilitySettings);
    } else {
      // Otherwise, only reset the specified settings to their default values
      const resetSettings: Partial<WeissAccessibilitySettings> = {};

      // Loop through the specified settings and set them to their default values
      onlyThese.forEach((setting) => {
        resetSettings[setting] = this.defaultWeissAccessibilitySettings[setting];
      });

      // Update the settings with the reset values
      this.updateSettings(resetSettings);
    }

  }

  getBrowserLanguage(): string {
    const language = navigator.language || navigator.languages[0];
    return this.normalizeLanguageCode(language);
  }

  // Normalize the language code (e.g., "en-US" -> "en")
  normalizeLanguageCode(languageCode: string): string {
    return languageCode.split('-')[0]; // Split by "-" and return the base code
  }

  getSupportedLanguage(): string {
    const browserLanguage = this.getBrowserLanguage();

    // Check if the normalized browser language exists in weissAccessibilityLanguages
    const foundLanguage = this.weissAccessibilityLanguages.find(
      (lang) => lang.value === browserLanguage
    );

    if (foundLanguage) {
      return foundLanguage.value;
    }

    // Fallback to a default language if no match is found
    return 'en';
  }
}
