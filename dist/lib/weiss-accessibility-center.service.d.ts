import { Observable } from 'rxjs';
import { WeissAccessibilitySettings, ModuleDataOptions } from './weiss-accessibility-center.interfaces';
import * as i0 from "@angular/core";
export declare class WeissAccessibilityCenterService {
    private document;
    weissAccessibilityThemes: ModuleDataOptions[];
    weissAccessibilityFontSizes: ModuleDataOptions[];
    weissAccessibilitySpacing: ModuleDataOptions[];
    weissAccessibilityLayouts: ModuleDataOptions[];
    weissAccessibilityLanguages: ModuleDataOptions[];
    defaultWeissAccessibilitySettings: WeissAccessibilitySettings;
    private accessibilitySettingsSubject;
    weissAccessibilitySettings$: Observable<WeissAccessibilitySettings>;
    private target;
    private showWeissAccessibilityCenter;
    showWeissAccessibilityCenter$: Observable<boolean>;
    toggleWeissAccessibilityCenter(targetElement?: HTMLElement | null, forceClose?: boolean): void;
    constructor(document: Document);
    updateSettings(newSettings: Partial<WeissAccessibilitySettings>): void;
    getCurrentSettings(): WeissAccessibilitySettings;
    private getSavedSettings;
    private applySettings;
    resetSettings(onlyThese?: Array<keyof WeissAccessibilitySettings>): void;
    getBrowserLanguage(): string;
    normalizeLanguageCode(languageCode: string): string;
    getSupportedLanguage(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<WeissAccessibilityCenterService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<WeissAccessibilityCenterService>;
}
