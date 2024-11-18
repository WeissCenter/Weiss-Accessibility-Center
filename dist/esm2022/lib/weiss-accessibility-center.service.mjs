import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import * as i0 from "@angular/core";
export class WeissAccessibilityCenterService {
    document;
    weissAccessibilityThemes = [
        { name: 'Default light', value: 'default' },
        { name: 'Default dark', value: 'dynamic-dark' },
        { name: 'High contrast', value: 'high-contrast' },
        { name: 'Monochrome', value: 'monochrome' },
    ];
    weissAccessibilityFontSizes = [
        { name: 'Decrease to 85%', value: 'smaller' },
        { name: 'Default at 100%', value: 'default' },
        { name: 'Increase to 125%', value: 'large' },
        { name: 'Increase to 150%', value: 'larger' },
        { name: 'Increase to 200%', value: 'largest' },
    ];
    weissAccessibilitySpacing = [
        { name: 'Compact spacing', value: 'compact' },
        { name: 'Cozy spacing', value: 'default' },
        { name: 'Comfort spacing', value: 'comfort' },
        { name: 'Extra-comfort spacing', value: 'extra-comfort' },
    ];
    weissAccessibilityLayouts = [
        { name: 'Default layout', value: 'default' },
        { name: 'Single column', value: 'mobile' },
    ];
    weissAccessibilityLanguages = [
        { name: 'العربية', value: 'ar' },
        { name: '中文', value: 'zh-CN' },
        { name: 'English', value: 'en' },
        { name: 'Español', value: 'es' },
        { name: 'Français', value: 'fr' },
        { name: 'Русский', value: 'ru' },
    ];
    defaultWeissAccessibilitySettings = {
        fontSize: 'default',
        theme: 'default',
        spacing: 'default',
        language: 'en',
        layout: 'default',
    };
    // BehaviorSubject to hold and broadcast the current accessibility settings
    accessibilitySettingsSubject;
    // Observable to allow components to subscribe and react to settings changes
    weissAccessibilitySettings$;
    target = null;
    showWeissAccessibilityCenter = new BehaviorSubject(false);
    showWeissAccessibilityCenter$ = this.showWeissAccessibilityCenter.asObservable();
    toggleWeissAccessibilityCenter(targetElement, forceClose = false) {
        if (forceClose)
            this.showWeissAccessibilityCenter.next(false);
        else
            this.showWeissAccessibilityCenter.next(!this.showWeissAccessibilityCenter.value);
        // Store the target element for focus restoration
        if (targetElement) {
            this.target =
                targetElement.closest('button, [tabindex]') || targetElement;
        }
        if (!this.target) {
            this.target = this.document.getElementById('weiss-a11y-toggle');
        }
        // If widget has been closed, return focus to the the target
        if (!this.showWeissAccessibilityCenter.value) {
            if (this.target) {
                this.target.focus();
                this.target = null;
            }
        }
    }
    constructor(document) {
        this.document = document;
        // On service initialization, load saved settings or use default ones
        const savedSettings = this.getSavedSettings();
        // Initialize BehaviorSubject with the saved/default settings
        this.accessibilitySettingsSubject =
            new BehaviorSubject(savedSettings);
        // Expose the subject as an observable
        this.weissAccessibilitySettings$ =
            this.accessibilitySettingsSubject.asObservable();
        // Apply the loaded or default settings to the document root
        this.applySettings(savedSettings);
    }
    // Method to update accessibility settings (partially or fully)
    updateSettings(newSettings) {
        // Merge the new settings with the current settings
        const updatedSettings = {
            ...this.accessibilitySettingsSubject.value, // Current settings
            ...newSettings, // New settings to update
        };
        // Update the BehaviorSubject with the new settings
        this.accessibilitySettingsSubject.next(updatedSettings);
        // Save the updated settings to localStorage
        localStorage.setItem('weiss-accessibility-settings', JSON.stringify(updatedSettings));
        // Apply the updated settings to the document root
        this.applySettings(updatedSettings);
    }
    // Method to retrieve the current settings from the BehaviorSubject
    getCurrentSettings() {
        return this.accessibilitySettingsSubject.value; // Returns the current settings
    }
    // Method to get saved settings from localStorage or return default settings
    getSavedSettings() {
        // Determine the default settings based on the browser language
        this.defaultWeissAccessibilitySettings.language = this.getSupportedLanguage();
        // Attempt to load saved settings from localStorage
        const savedSettings = JSON.parse(localStorage.getItem('weiss-accessibility-settings') || 'null');
        // If saved settings exist, merge them with the default settings, else return default settings
        return savedSettings
            ? { ...this.defaultWeissAccessibilitySettings, ...savedSettings }
            : this.defaultWeissAccessibilitySettings;
    }
    // Method to apply the accessibility settings to the root element (HTML)
    applySettings(settings) {
        const root = this.document.documentElement; // Get the root HTML element
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
        }
        else {
            root.setAttribute('dir', ''); // Otherwise, reset direction to LTR (Left-to-Right)
        }
    }
    // Method to reset settings to default values, or optionally only specified settings
    resetSettings(onlyThese = []) {
        console.log("Resetting: " + onlyThese);
        // If no specific settings were provided, reset all settings to default
        if (onlyThese.length === 0) {
            this.updateSettings(this.defaultWeissAccessibilitySettings);
        }
        else {
            // Otherwise, only reset the specified settings to their default values
            const resetSettings = {};
            // Loop through the specified settings and set them to their default values
            onlyThese.forEach((setting) => {
                resetSettings[setting] = this.defaultWeissAccessibilitySettings[setting];
            });
            // Update the settings with the reset values
            this.updateSettings(resetSettings);
        }
    }
    getBrowserLanguage() {
        if (window.navigator && (window.navigator.language || window.navigator.languages[0])) {
            const language = navigator.language || navigator.languages[0];
            return this.normalizeLanguageCode(language);
        }
        return 'en';
    }
    // Normalize the language code (e.g., "en-US" -> "en")
    normalizeLanguageCode(languageCode) {
        return languageCode.split('-')[0]; // Split by "-" and return the base code
    }
    getSupportedLanguage() {
        const browserLanguage = this.getBrowserLanguage();
        // Check if the normalized browser language exists in weissAccessibilityLanguages
        const foundLanguage = this.weissAccessibilityLanguages.find((lang) => lang.value === browserLanguage);
        if (foundLanguage) {
            return foundLanguage.value;
        }
        // Fallback to a default language if no match is found
        return 'en';
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: WeissAccessibilityCenterService, deps: [{ token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: WeissAccessibilityCenterService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: WeissAccessibilityCenterService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQUUsZUFBZSxFQUFjLE1BQU0sTUFBTSxDQUFDO0FBRW5ELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7QUFLM0MsTUFBTSxPQUFPLCtCQUErQjtJQW1GSjtJQWpGL0Isd0JBQXdCLEdBQXdCO1FBQ3JELEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO1FBQzNDLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFO1FBQy9DLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsZUFBZSxFQUFFO1FBQ2pELEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFO0tBQzVDLENBQUM7SUFFSywyQkFBMkIsR0FBd0I7UUFDeEQsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRTtRQUM3QyxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO1FBQzdDLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7UUFDNUMsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtRQUM3QyxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO0tBQy9DLENBQUM7SUFFSyx5QkFBeUIsR0FBd0I7UUFDdEQsRUFBRSxJQUFJLEVBQUUs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MkJBQTJCLENBQUMsSUFBSSxDQUN6RCxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxlQUFlLENBQ3pDLENBQUM7UUFFRixJQUFJLGFBQWEsRUFBRSxDQUFDO1lBQ2xCLE9BQU8sYUFBYSxDQUFDLEtBQUssQ0FBQztRQUM3QixDQUFDO1FBRUQsc0RBQXNEO1FBQ3RELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQzt1R0FyTlUsK0JBQStCLGtCQW1GdEIsUUFBUTsyR0FuRmpCLCtCQUErQixjQUY5QixNQUFNOzsyRkFFUCwrQkFBK0I7a0JBSDNDLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzswQkFvRmMsTUFBTTsyQkFBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzLCBNb2R1bGVEYXRhT3B0aW9ucyB9IGZyb20gJy4vd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlIHtcbiAgXG4gIHB1YmxpYyB3ZWlzc0FjY2Vzc2liaWxpdHlUaGVtZXM6IE1vZHVsZURhdGFPcHRpb25zW10gPSBbXG4gICAgeyBuYW1lOiAnRGVmYXVsdCBsaWdodCcsIHZhbHVlOiAnZGVmYXVsdCcgfSxcbiAgICB7IG5hbWU6ICdEZWZhdWx0IGRhcmsnLCB2YWx1ZTogJ2R5bmFtaWMtZGFyaycgfSxcbiAgICB7IG5hbWU6ICdIaWdoIGNvbnRyYXN0JywgdmFsdWU6ICdoaWdoLWNvbnRyYXN0JyB9LFxuICAgIHsgbmFtZTogJ01vbm9jaHJvbWUnLCB2YWx1ZTogJ21vbm9jaHJvbWUnIH0sXG4gIF07XG5cbiAgcHVibGljIHdlaXNzQWNjZXNzaWJpbGl0eUZvbnRTaXplczogTW9kdWxlRGF0YU9wdGlvbnNbXSA9IFtcbiAgICB7IG5hbWU6ICdEZWNyZWFzZSB0byA4NSUnLCB2YWx1ZTogJ3NtYWxsZXInIH0sXG4gICAgeyBuYW1lOiAnRGVmYXVsdCBhdCAxMDAlJywgdmFsdWU6ICdkZWZhdWx0JyB9LFxuICAgIHsgbmFtZTogJ0luY3JlYXNlIHRvIDEyNSUnLCB2YWx1ZTogJ2xhcmdlJyB9LFxuICAgIHsgbmFtZTogJ0luY3JlYXNlIHRvIDE1MCUnLCB2YWx1ZTogJ2xhcmdlcicgfSxcbiAgICB7IG5hbWU6ICdJbmNyZWFzZSB0byAyMDAlJywgdmFsdWU6ICdsYXJnZXN0JyB9LFxuICBdO1xuXG4gIHB1YmxpYyB3ZWlzc0FjY2Vzc2liaWxpdHlTcGFjaW5nOiBNb2R1bGVEYXRhT3B0aW9uc1tdID0gW1xuICAgIHsgbmFtZTogJ0NvbXBhY3Qgc3BhY2luZycsIHZhbHVlOiAnY29tcGFjdCcgfSxcbiAgICB7IG5hbWU6ICdDb3p5IHNwYWNpbmcnLCB2YWx1ZTogJ2RlZmF1bHQnIH0sXG4gICAgeyBuYW1lOiAnQ29tZm9ydCBzcGFjaW5nJywgdmFsdWU6ICdjb21mb3J0JyB9LFxuICAgIHsgbmFtZTogJ0V4dHJhLWNvbWZvcnQgc3BhY2luZycsIHZhbHVlOiAnZXh0cmEtY29tZm9ydCcgfSxcbiAgXTtcblxuICBwdWJsaWMgd2Vpc3NBY2Nlc3NpYmlsaXR5TGF5b3V0czogTW9kdWxlRGF0YU9wdGlvbnNbXSA9IFtcbiAgICB7IG5hbWU6ICdEZWZhdWx0IGxheW91dCcsIHZhbHVlOiAnZGVmYXVsdCcgfSxcbiAgICB7IG5hbWU6ICdTaW5nbGUgY29sdW1uJywgdmFsdWU6ICdtb2JpbGUnIH0sXG4gIF07XG5cbiAgcHVibGljIHdlaXNzQWNjZXNzaWJpbGl0eUxhbmd1YWdlczogTW9kdWxlRGF0YU9wdGlvbnNbXSA9IFtcbiAgICB7IG5hbWU6ICfYp9mE2LnYsdio2YrYqScsIHZhbHVlOiAnYXInIH0sXG4gICAgeyBuYW1lOiAn5Lit5paHJywgdmFsdWU6ICd6aC1DTicgfSxcbiAgICB7IG5hbWU6ICdFbmdsaXNoJywgdmFsdWU6ICdlbicgfSxcbiAgICB7IG5hbWU6ICdFc3Bhw7FvbCcsIHZhbHVlOiAnZXMnIH0sXG4gICAgeyBuYW1lOiAnRnJhbsOnYWlzJywgdmFsdWU6ICdmcicgfSxcbiAgICB7IG5hbWU6ICfQoNGD0YHRgdC60LjQuScsIHZhbHVlOiAncnUnIH0sXG4gIF07XG5cbiAgcHVibGljIGRlZmF1bHRXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5nczogV2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3MgPSB7XG4gICAgZm9udFNpemU6ICdkZWZhdWx0JyxcbiAgICB0aGVtZTogJ2RlZmF1bHQnLFxuICAgIHNwYWNpbmc6ICdkZWZhdWx0JyxcbiAgICBsYW5ndWFnZTogJ2VuJyxcbiAgICBsYXlvdXQ6ICdkZWZhdWx0JyxcbiAgfTtcblxuICAvLyBCZWhhdmlvclN1YmplY3QgdG8gaG9sZCBhbmQgYnJvYWRjYXN0IHRoZSBjdXJyZW50IGFjY2Vzc2liaWxpdHkgc2V0dGluZ3NcbiAgcHJpdmF0ZSBhY2Nlc3NpYmlsaXR5U2V0dGluZ3NTdWJqZWN0OiBCZWhhdmlvclN1YmplY3Q8V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3M+O1xuXG4gIC8vIE9ic2VydmFibGUgdG8gYWxsb3cgY29tcG9uZW50cyB0byBzdWJzY3JpYmUgYW5kIHJlYWN0IHRvIHNldHRpbmdzIGNoYW5nZXNcbiAgd2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3MkOiBPYnNlcnZhYmxlPFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzPjtcblxuICBwcml2YXRlIHRhcmdldDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBzaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPihmYWxzZSk7XG4gIHNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIkID0gdGhpcy5zaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyLmFzT2JzZXJ2YWJsZSgpO1xuXG4gIHRvZ2dsZVdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlcihcbiAgICB0YXJnZXRFbGVtZW50PzogSFRNTEVsZW1lbnQgfCBudWxsLFxuICAgIGZvcmNlQ2xvc2U6IGJvb2xlYW4gPSBmYWxzZVxuICApIHtcbiAgICBpZiAoZm9yY2VDbG9zZSkgdGhpcy5zaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyLm5leHQoZmFsc2UpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlci5uZXh0KFxuICAgICAgICAhdGhpcy5zaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyLnZhbHVlXG4gICAgICApO1xuXG4gICAgLy8gU3RvcmUgdGhlIHRhcmdldCBlbGVtZW50IGZvciBmb2N1cyByZXN0b3JhdGlvblxuICAgIGlmICh0YXJnZXRFbGVtZW50KSB7XG4gICAgICB0aGlzLnRhcmdldCA9XG4gICAgICAgIHRhcmdldEVsZW1lbnQuY2xvc2VzdCgnYnV0dG9uLCBbdGFiaW5kZXhdJykgfHwgdGFyZ2V0RWxlbWVudDtcbiAgICB9XG4gICAgaWYgKCF0aGlzLnRhcmdldCkge1xuICAgICAgdGhpcy50YXJnZXQgPSB0aGlzLmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3ZWlzcy1hMTF5LXRvZ2dsZScpO1xuICAgIH1cbiAgICAvLyBJZiB3aWRnZXQgaGFzIGJlZW4gY2xvc2VkLCByZXR1cm4gZm9jdXMgdG8gdGhlIHRoZSB0YXJnZXRcbiAgICBpZiAoIXRoaXMuc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlci52YWx1ZSkge1xuICAgICAgaWYgKHRoaXMudGFyZ2V0KSB7XG4gICAgICAgIHRoaXMudGFyZ2V0LmZvY3VzKCk7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50OiBEb2N1bWVudCkge1xuICAgIC8vIE9uIHNlcnZpY2UgaW5pdGlhbGl6YXRpb24sIGxvYWQgc2F2ZWQgc2V0dGluZ3Mgb3IgdXNlIGRlZmF1bHQgb25lc1xuICAgIGNvbnN0IHNhdmVkU2V0dGluZ3MgPSB0aGlzLmdldFNhdmVkU2V0dGluZ3MoKTtcblxuICAgIC8vIEluaXRpYWxpemUgQmVoYXZpb3JTdWJqZWN0IHdpdGggdGhlIHNhdmVkL2RlZmF1bHQgc2V0dGluZ3NcbiAgICB0aGlzLmFjY2Vzc2liaWxpdHlTZXR0aW5nc1N1YmplY3QgPVxuICAgICAgbmV3IEJlaGF2aW9yU3ViamVjdDxXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncz4oc2F2ZWRTZXR0aW5ncyk7XG5cbiAgICAvLyBFeHBvc2UgdGhlIHN1YmplY3QgYXMgYW4gb2JzZXJ2YWJsZVxuICAgIHRoaXMud2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3MkID1cbiAgICAgIHRoaXMuYWNjZXNzaWJpbGl0eVNldHRpbmdzU3ViamVjdC5hc09ic2VydmFibGUoKTtcblxuICAgIC8vIEFwcGx5IHRoZSBsb2FkZWQgb3IgZGVmYXVsdCBzZXR0aW5ncyB0byB0aGUgZG9jdW1lbnQgcm9vdFxuICAgIHRoaXMuYXBwbHlTZXR0aW5ncyhzYXZlZFNldHRpbmdzKTtcbiAgfVxuXG4gIC8vIE1ldGhvZCB0byB1cGRhdGUgYWNjZXNzaWJpbGl0eSBzZXR0aW5ncyAocGFydGlhbGx5IG9yIGZ1bGx5KVxuICB1cGRhdGVTZXR0aW5ncyhuZXdTZXR0aW5nczogUGFydGlhbDxXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncz4pOiB2b2lkIHtcbiAgICAvLyBNZXJnZSB0aGUgbmV3IHNldHRpbmdzIHdpdGggdGhlIGN1cnJlbnQgc2V0dGluZ3NcbiAgICBjb25zdCB1cGRhdGVkU2V0dGluZ3MgPSB7XG4gICAgICAuLi50aGlzLmFjY2Vzc2liaWxpdHlTZXR0aW5nc1N1YmplY3QudmFsdWUsIC8vIEN1cnJlbnQgc2V0dGluZ3NcbiAgICAgIC4uLm5ld1NldHRpbmdzLCAvLyBOZXcgc2V0dGluZ3MgdG8gdXBkYXRlXG4gICAgfTtcblxuICAgIC8vIFVwZGF0ZSB0aGUgQmVoYXZpb3JTdWJqZWN0IHdpdGggdGhlIG5ldyBzZXR0aW5nc1xuICAgIHRoaXMuYWNjZXNzaWJpbGl0eVNldHRpbmdzU3ViamVjdC5uZXh0KHVwZGF0ZWRTZXR0aW5ncyk7XG5cbiAgICAvLyBTYXZlIHRoZSB1cGRhdGVkIHNldHRpbmdzIHRvIGxvY2FsU3RvcmFnZVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgJ3dlaXNzLWFjY2Vzc2liaWxpdHktc2V0dGluZ3MnLFxuICAgICAgSlNPTi5zdHJpbmdpZnkodXBkYXRlZFNldHRpbmdzKVxuICAgICk7XG5cbiAgICAvLyBBcHBseSB0aGUgdXBkYXRlZCBzZXR0aW5ncyB0byB0aGUgZG9jdW1lbnQgcm9vdFxuICAgIHRoaXMuYXBwbHlTZXR0aW5ncyh1cGRhdGVkU2V0dGluZ3MpO1xuICB9XG5cbiAgLy8gTWV0aG9kIHRvIHJldHJpZXZlIHRoZSBjdXJyZW50IHNldHRpbmdzIGZyb20gdGhlIEJlaGF2aW9yU3ViamVjdFxuICBnZXRDdXJyZW50U2V0dGluZ3MoKTogV2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3Mge1xuICAgIHJldHVybiB0aGlzLmFjY2Vzc2liaWxpdHlTZXR0aW5nc1N1YmplY3QudmFsdWU7IC8vIFJldHVybnMgdGhlIGN1cnJlbnQgc2V0dGluZ3NcbiAgfVxuXG4gIC8vIE1ldGhvZCB0byBnZXQgc2F2ZWQgc2V0dGluZ3MgZnJvbSBsb2NhbFN0b3JhZ2Ugb3IgcmV0dXJuIGRlZmF1bHQgc2V0dGluZ3NcbiAgcHJpdmF0ZSBnZXRTYXZlZFNldHRpbmdzKCk6IFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzIHtcbiAgICAvLyBEZXRlcm1pbmUgdGhlIGRlZmF1bHQgc2V0dGluZ3MgYmFzZWQgb24gdGhlIGJyb3dzZXIgbGFuZ3VhZ2VcbiAgICB0aGlzLmRlZmF1bHRXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncy5sYW5ndWFnZSA9IHRoaXMuZ2V0U3VwcG9ydGVkTGFuZ3VhZ2UoKTtcblxuICAgIC8vIEF0dGVtcHQgdG8gbG9hZCBzYXZlZCBzZXR0aW5ncyBmcm9tIGxvY2FsU3RvcmFnZVxuICAgIGNvbnN0IHNhdmVkU2V0dGluZ3MgPSBKU09OLnBhcnNlKFxuICAgICAgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dlaXNzLWFjY2Vzc2liaWxpdHktc2V0dGluZ3MnKSB8fCAnbnVsbCdcbiAgICApO1xuXG4gICAgLy8gSWYgc2F2ZWQgc2V0dGluZ3MgZXhpc3QsIG1lcmdlIHRoZW0gd2l0aCB0aGUgZGVmYXVsdCBzZXR0aW5ncywgZWxzZSByZXR1cm4gZGVmYXVsdCBzZXR0aW5nc1xuICAgIHJldHVybiBzYXZlZFNldHRpbmdzXG4gICAgICA/IHsgLi4udGhpcy5kZWZhdWx0V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3MsIC4uLnNhdmVkU2V0dGluZ3MgfVxuICAgICAgOiB0aGlzLmRlZmF1bHRXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncztcbiAgfVxuXG4gIC8vIE1ldGhvZCB0byBhcHBseSB0aGUgYWNjZXNzaWJpbGl0eSBzZXR0aW5ncyB0byB0aGUgcm9vdCBlbGVtZW50IChIVE1MKVxuICBwcml2YXRlIGFwcGx5U2V0dGluZ3Moc2V0dGluZ3M6IFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzKTogdm9pZCB7XG4gICAgY29uc3Qgcm9vdCA9IHRoaXMuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50OyAvLyBHZXQgdGhlIHJvb3QgSFRNTCBlbGVtZW50XG5cbiAgICAvLyBBcHBseSBmb250IHNpemUsIHRoZW1lLCBzcGFjaW5nLCBhbmQgbGFuZ3VhZ2Ugc2V0dGluZ3MgYXMgYXR0cmlidXRlc1xuICAgIHJvb3Quc2V0QXR0cmlidXRlKCdkYXRhLXdlaXNzLWFjY2Vzc2liaWxpdHktZm9udC1zaXplJywgc2V0dGluZ3MuZm9udFNpemUpO1xuICAgIHJvb3Quc2V0QXR0cmlidXRlKCdkYXRhLXdlaXNzLWFjY2Vzc2liaWxpdHktdGhlbWUnLCBzZXR0aW5ncy50aGVtZSk7XG4gICAgcm9vdC5zZXRBdHRyaWJ1dGUoJ2RhdGEtd2Vpc3MtYWNjZXNzaWJpbGl0eS1zcGFjaW5nJywgc2V0dGluZ3Muc3BhY2luZyk7XG4gICAgcm9vdC5zZXRBdHRyaWJ1dGUoJ2RhdGEtd2Vpc3MtYWNjZXNzaWJpbGl0eS1sYW5ndWFnZScsIHNldHRpbmdzLmxhbmd1YWdlKTtcbiAgICByb290LnNldEF0dHJpYnV0ZSgnZGF0YS13ZWlzcy1hY2Nlc3NpYmlsaXR5LWxheW91dCcsIHNldHRpbmdzLmxheW91dCk7XG4gICAgcm9vdC5zZXRBdHRyaWJ1dGUoJ2xhbmcnLCBzZXR0aW5ncy5sYW5ndWFnZSk7XG5cbiAgICAvLyBJZiB0aGUgbGFuZ3VhZ2UgaXMgQXJhYmljICgnYXInKSwgc2V0IHRoZSBkaXJlY3Rpb24gdG8gUlRMIChSaWdodC10by1MZWZ0KVxuICAgIGlmIChzZXR0aW5ncy5sYW5ndWFnZSA9PT0gJ2FyJykge1xuICAgICAgcm9vdC5zZXRBdHRyaWJ1dGUoJ2RpcicsICdydGwnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm9vdC5zZXRBdHRyaWJ1dGUoJ2RpcicsICcnKTsgLy8gT3RoZXJ3aXNlLCByZXNldCBkaXJlY3Rpb24gdG8gTFRSIChMZWZ0LXRvLVJpZ2h0KVxuICAgIH1cbiAgfVxuXG4gIC8vIE1ldGhvZCB0byByZXNldCBzZXR0aW5ncyB0byBkZWZhdWx0IHZhbHVlcywgb3Igb3B0aW9uYWxseSBvbmx5IHNwZWNpZmllZCBzZXR0aW5nc1xuICByZXNldFNldHRpbmdzKFxuICAgIG9ubHlUaGVzZTogQXJyYXk8a2V5b2YgV2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3M+ID0gW11cbiAgKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coXCJSZXNldHRpbmc6IFwiICsgb25seVRoZXNlKTtcbiAgICAvLyBJZiBubyBzcGVjaWZpYyBzZXR0aW5ncyB3ZXJlIHByb3ZpZGVkLCByZXNldCBhbGwgc2V0dGluZ3MgdG8gZGVmYXVsdFxuICAgIGlmIChvbmx5VGhlc2UubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLnVwZGF0ZVNldHRpbmdzKHRoaXMuZGVmYXVsdFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gT3RoZXJ3aXNlLCBvbmx5IHJlc2V0IHRoZSBzcGVjaWZpZWQgc2V0dGluZ3MgdG8gdGhlaXIgZGVmYXVsdCB2YWx1ZXNcbiAgICAgIGNvbnN0IHJlc2V0U2V0dGluZ3M6IFBhcnRpYWw8V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3M+ID0ge307XG5cbiAgICAgIC8vIExvb3AgdGhyb3VnaCB0aGUgc3BlY2lmaWVkIHNldHRpbmdzIGFuZCBzZXQgdGhlbSB0byB0aGVpciBkZWZhdWx0IHZhbHVlc1xuICAgICAgb25seVRoZXNlLmZvckVhY2goKHNldHRpbmcpID0+IHtcbiAgICAgICAgcmVzZXRTZXR0aW5nc1tzZXR0aW5nXSA9IHRoaXMuZGVmYXVsdFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzW3NldHRpbmddO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFVwZGF0ZSB0aGUgc2V0dGluZ3Mgd2l0aCB0aGUgcmVzZXQgdmFsdWVzXG4gICAgICB0aGlzLnVwZGF0ZVNldHRpbmdzKHJlc2V0U2V0dGluZ3MpO1xuICAgIH1cblxuICB9XG5cbiAgZ2V0QnJvd3Nlckxhbmd1YWdlKCk6IHN0cmluZyB7XG5cbiAgICBpZih3aW5kb3cubmF2aWdhdG9yICYmICh3aW5kb3cubmF2aWdhdG9yLmxhbmd1YWdlIHx8IHdpbmRvdy5uYXZpZ2F0b3IubGFuZ3VhZ2VzWzBdKSl7XG4gICAgICBjb25zdCBsYW5ndWFnZSA9IG5hdmlnYXRvci5sYW5ndWFnZSB8fCBuYXZpZ2F0b3IubGFuZ3VhZ2VzWzBdO1xuICAgICAgcmV0dXJuIHRoaXMubm9ybWFsaXplTGFuZ3VhZ2VDb2RlKGxhbmd1YWdlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJ2VuJztcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgbGFuZ3VhZ2UgY29kZSAoZS5nLiwgXCJlbi1VU1wiIC0+IFwiZW5cIilcbiAgbm9ybWFsaXplTGFuZ3VhZ2VDb2RlKGxhbmd1YWdlQ29kZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbGFuZ3VhZ2VDb2RlLnNwbGl0KCctJylbMF07IC8vIFNwbGl0IGJ5IFwiLVwiIGFuZCByZXR1cm4gdGhlIGJhc2UgY29kZVxuICB9XG5cbiAgZ2V0U3VwcG9ydGVkTGFuZ3VhZ2UoKTogc3RyaW5nIHtcbiAgICBjb25zdCBicm93c2VyTGFuZ3VhZ2UgPSB0aGlzLmdldEJyb3dzZXJMYW5ndWFnZSgpO1xuXG4gICAgLy8gQ2hlY2sgaWYgdGhlIG5vcm1hbGl6ZWQgYnJvd3NlciBsYW5ndWFnZSBleGlzdHMgaW4gd2Vpc3NBY2Nlc3NpYmlsaXR5TGFuZ3VhZ2VzXG4gICAgY29uc3QgZm91bmRMYW5ndWFnZSA9IHRoaXMud2Vpc3NBY2Nlc3NpYmlsaXR5TGFuZ3VhZ2VzLmZpbmQoXG4gICAgICAobGFuZykgPT4gbGFuZy52YWx1ZSA9PT0gYnJvd3Nlckxhbmd1YWdlXG4gICAgKTtcblxuICAgIGlmIChmb3VuZExhbmd1YWdlKSB7XG4gICAgICByZXR1cm4gZm91bmRMYW5ndWFnZS52YWx1ZTtcbiAgICB9XG5cbiAgICAvLyBGYWxsYmFjayB0byBhIGRlZmF1bHQgbGFuZ3VhZ2UgaWYgbm8gbWF0Y2ggaXMgZm91bmRcbiAgICByZXR1cm4gJ2VuJztcbiAgfVxufVxuIl19