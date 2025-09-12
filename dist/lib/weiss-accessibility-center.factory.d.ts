import { WeissAccessibilityCenterService } from './weiss-accessibility-center.service';
import { AccessibilityOptions } from './weiss-accessibility-center.interfaces';
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
export declare function createAccessibilityOptions(service: WeissAccessibilityCenterService, t?: TranslationFn): AccessibilityOptions;
