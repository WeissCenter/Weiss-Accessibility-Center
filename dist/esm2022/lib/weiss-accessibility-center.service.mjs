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
        if (window && (window?.navigator?.language || window?.navigator?.languages?.[0])) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQUUsZUFBZSxFQUFjLE1BQU0sTUFBTSxDQUFDO0FBRW5ELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7QUFLM0MsTUFBTSxPQUFPLCtCQUErQjtJQW1GSjtJQWpGL0Isd0JBQXdCLEdBQXdCO1FBQ3JELEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO1FBQzNDLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFO1FBQy9DLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsZUFBZSxFQUFFO1FBQ2pELEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFO0tBQzVDLENBQUM7SUFFSywyQkFBMkIsR0FBd0I7UUFDeEQsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRTtRQUM3QyxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO1FBQzdDLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7UUFDNUMsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtRQUM3QyxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO0tBQy9DLENBQUM7SUFFSyx5QkFBeUIsR0FBd0I7UUFDdEQsRUFBRSxJQUFJLEVBQUUs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QixDQUFDLElBQUksQ0FDekQsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssZUFBZSxDQUN6QyxDQUFDO1FBRUYsSUFBSSxhQUFhLEVBQUUsQ0FBQztZQUNsQixPQUFPLGFBQWEsQ0FBQyxLQUFLLENBQUM7UUFDN0IsQ0FBQztRQUVELHNEQUFzRDtRQUN0RCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7dUdBck5VLCtCQUErQixrQkFtRnRCLFFBQVE7MkdBbkZqQiwrQkFBK0IsY0FGOUIsTUFBTTs7MkZBRVAsK0JBQStCO2tCQUgzQyxVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7MEJBb0ZjLE1BQU07MkJBQUMsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncywgTW9kdWxlRGF0YU9wdGlvbnMgfSBmcm9tICcuL3dlaXNzLWFjY2Vzc2liaWxpdHktY2VudGVyLmludGVyZmFjZXMnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZSB7XG4gIFxuICBwdWJsaWMgd2Vpc3NBY2Nlc3NpYmlsaXR5VGhlbWVzOiBNb2R1bGVEYXRhT3B0aW9uc1tdID0gW1xuICAgIHsgbmFtZTogJ0RlZmF1bHQgbGlnaHQnLCB2YWx1ZTogJ2RlZmF1bHQnIH0sXG4gICAgeyBuYW1lOiAnRGVmYXVsdCBkYXJrJywgdmFsdWU6ICdkeW5hbWljLWRhcmsnIH0sXG4gICAgeyBuYW1lOiAnSGlnaCBjb250cmFzdCcsIHZhbHVlOiAnaGlnaC1jb250cmFzdCcgfSxcbiAgICB7IG5hbWU6ICdNb25vY2hyb21lJywgdmFsdWU6ICdtb25vY2hyb21lJyB9LFxuICBdO1xuXG4gIHB1YmxpYyB3ZWlzc0FjY2Vzc2liaWxpdHlGb250U2l6ZXM6IE1vZHVsZURhdGFPcHRpb25zW10gPSBbXG4gICAgeyBuYW1lOiAnRGVjcmVhc2UgdG8gODUlJywgdmFsdWU6ICdzbWFsbGVyJyB9LFxuICAgIHsgbmFtZTogJ0RlZmF1bHQgYXQgMTAwJScsIHZhbHVlOiAnZGVmYXVsdCcgfSxcbiAgICB7IG5hbWU6ICdJbmNyZWFzZSB0byAxMjUlJywgdmFsdWU6ICdsYXJnZScgfSxcbiAgICB7IG5hbWU6ICdJbmNyZWFzZSB0byAxNTAlJywgdmFsdWU6ICdsYXJnZXInIH0sXG4gICAgeyBuYW1lOiAnSW5jcmVhc2UgdG8gMjAwJScsIHZhbHVlOiAnbGFyZ2VzdCcgfSxcbiAgXTtcblxuICBwdWJsaWMgd2Vpc3NBY2Nlc3NpYmlsaXR5U3BhY2luZzogTW9kdWxlRGF0YU9wdGlvbnNbXSA9IFtcbiAgICB7IG5hbWU6ICdDb21wYWN0IHNwYWNpbmcnLCB2YWx1ZTogJ2NvbXBhY3QnIH0sXG4gICAgeyBuYW1lOiAnQ296eSBzcGFjaW5nJywgdmFsdWU6ICdkZWZhdWx0JyB9LFxuICAgIHsgbmFtZTogJ0NvbWZvcnQgc3BhY2luZycsIHZhbHVlOiAnY29tZm9ydCcgfSxcbiAgICB7IG5hbWU6ICdFeHRyYS1jb21mb3J0IHNwYWNpbmcnLCB2YWx1ZTogJ2V4dHJhLWNvbWZvcnQnIH0sXG4gIF07XG5cbiAgcHVibGljIHdlaXNzQWNjZXNzaWJpbGl0eUxheW91dHM6IE1vZHVsZURhdGFPcHRpb25zW10gPSBbXG4gICAgeyBuYW1lOiAnRGVmYXVsdCBsYXlvdXQnLCB2YWx1ZTogJ2RlZmF1bHQnIH0sXG4gICAgeyBuYW1lOiAnU2luZ2xlIGNvbHVtbicsIHZhbHVlOiAnbW9iaWxlJyB9LFxuICBdO1xuXG4gIHB1YmxpYyB3ZWlzc0FjY2Vzc2liaWxpdHlMYW5ndWFnZXM6IE1vZHVsZURhdGFPcHRpb25zW10gPSBbXG4gICAgeyBuYW1lOiAn2KfZhNi52LHYqNmK2KknLCB2YWx1ZTogJ2FyJyB9LFxuICAgIHsgbmFtZTogJ+S4reaWhycsIHZhbHVlOiAnemgtQ04nIH0sXG4gICAgeyBuYW1lOiAnRW5nbGlzaCcsIHZhbHVlOiAnZW4nIH0sXG4gICAgeyBuYW1lOiAnRXNwYcOxb2wnLCB2YWx1ZTogJ2VzJyB9LFxuICAgIHsgbmFtZTogJ0ZyYW7Dp2FpcycsIHZhbHVlOiAnZnInIH0sXG4gICAgeyBuYW1lOiAn0KDRg9GB0YHQutC40LknLCB2YWx1ZTogJ3J1JyB9LFxuICBdO1xuXG4gIHB1YmxpYyBkZWZhdWx0V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3M6IFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzID0ge1xuICAgIGZvbnRTaXplOiAnZGVmYXVsdCcsXG4gICAgdGhlbWU6ICdkZWZhdWx0JyxcbiAgICBzcGFjaW5nOiAnZGVmYXVsdCcsXG4gICAgbGFuZ3VhZ2U6ICdlbicsXG4gICAgbGF5b3V0OiAnZGVmYXVsdCcsXG4gIH07XG5cbiAgLy8gQmVoYXZpb3JTdWJqZWN0IHRvIGhvbGQgYW5kIGJyb2FkY2FzdCB0aGUgY3VycmVudCBhY2Nlc3NpYmlsaXR5IHNldHRpbmdzXG4gIHByaXZhdGUgYWNjZXNzaWJpbGl0eVNldHRpbmdzU3ViamVjdDogQmVoYXZpb3JTdWJqZWN0PFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzPjtcblxuICAvLyBPYnNlcnZhYmxlIHRvIGFsbG93IGNvbXBvbmVudHMgdG8gc3Vic2NyaWJlIGFuZCByZWFjdCB0byBzZXR0aW5ncyBjaGFuZ2VzXG4gIHdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzJDogT2JzZXJ2YWJsZTxXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncz47XG5cbiAgcHJpdmF0ZSB0YXJnZXQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlciA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xuICBzaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyJCA9IHRoaXMuc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlci5hc09ic2VydmFibGUoKTtcblxuICB0b2dnbGVXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIoXG4gICAgdGFyZ2V0RWxlbWVudD86IEhUTUxFbGVtZW50IHwgbnVsbCxcbiAgICBmb3JjZUNsb3NlOiBib29sZWFuID0gZmFsc2VcbiAgKSB7XG4gICAgaWYgKGZvcmNlQ2xvc2UpIHRoaXMuc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlci5uZXh0KGZhbHNlKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLnNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIubmV4dChcbiAgICAgICAgIXRoaXMuc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlci52YWx1ZVxuICAgICAgKTtcblxuICAgIC8vIFN0b3JlIHRoZSB0YXJnZXQgZWxlbWVudCBmb3IgZm9jdXMgcmVzdG9yYXRpb25cbiAgICBpZiAodGFyZ2V0RWxlbWVudCkge1xuICAgICAgdGhpcy50YXJnZXQgPVxuICAgICAgICB0YXJnZXRFbGVtZW50LmNsb3Nlc3QoJ2J1dHRvbiwgW3RhYmluZGV4XScpIHx8IHRhcmdldEVsZW1lbnQ7XG4gICAgfVxuICAgIGlmICghdGhpcy50YXJnZXQpIHtcbiAgICAgIHRoaXMudGFyZ2V0ID0gdGhpcy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2Vpc3MtYTExeS10b2dnbGUnKTtcbiAgICB9XG4gICAgLy8gSWYgd2lkZ2V0IGhhcyBiZWVuIGNsb3NlZCwgcmV0dXJuIGZvY3VzIHRvIHRoZSB0aGUgdGFyZ2V0XG4gICAgaWYgKCF0aGlzLnNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIudmFsdWUpIHtcbiAgICAgIGlmICh0aGlzLnRhcmdldCkge1xuICAgICAgICB0aGlzLnRhcmdldC5mb2N1cygpO1xuICAgICAgICB0aGlzLnRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogRG9jdW1lbnQpIHtcbiAgICAvLyBPbiBzZXJ2aWNlIGluaXRpYWxpemF0aW9uLCBsb2FkIHNhdmVkIHNldHRpbmdzIG9yIHVzZSBkZWZhdWx0IG9uZXNcbiAgICBjb25zdCBzYXZlZFNldHRpbmdzID0gdGhpcy5nZXRTYXZlZFNldHRpbmdzKCk7XG5cbiAgICAvLyBJbml0aWFsaXplIEJlaGF2aW9yU3ViamVjdCB3aXRoIHRoZSBzYXZlZC9kZWZhdWx0IHNldHRpbmdzXG4gICAgdGhpcy5hY2Nlc3NpYmlsaXR5U2V0dGluZ3NTdWJqZWN0ID1cbiAgICAgIG5ldyBCZWhhdmlvclN1YmplY3Q8V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3M+KHNhdmVkU2V0dGluZ3MpO1xuXG4gICAgLy8gRXhwb3NlIHRoZSBzdWJqZWN0IGFzIGFuIG9ic2VydmFibGVcbiAgICB0aGlzLndlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzJCA9XG4gICAgICB0aGlzLmFjY2Vzc2liaWxpdHlTZXR0aW5nc1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG5cbiAgICAvLyBBcHBseSB0aGUgbG9hZGVkIG9yIGRlZmF1bHQgc2V0dGluZ3MgdG8gdGhlIGRvY3VtZW50IHJvb3RcbiAgICB0aGlzLmFwcGx5U2V0dGluZ3Moc2F2ZWRTZXR0aW5ncyk7XG4gIH1cblxuICAvLyBNZXRob2QgdG8gdXBkYXRlIGFjY2Vzc2liaWxpdHkgc2V0dGluZ3MgKHBhcnRpYWxseSBvciBmdWxseSlcbiAgdXBkYXRlU2V0dGluZ3MobmV3U2V0dGluZ3M6IFBhcnRpYWw8V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3M+KTogdm9pZCB7XG4gICAgLy8gTWVyZ2UgdGhlIG5ldyBzZXR0aW5ncyB3aXRoIHRoZSBjdXJyZW50IHNldHRpbmdzXG4gICAgY29uc3QgdXBkYXRlZFNldHRpbmdzID0ge1xuICAgICAgLi4udGhpcy5hY2Nlc3NpYmlsaXR5U2V0dGluZ3NTdWJqZWN0LnZhbHVlLCAvLyBDdXJyZW50IHNldHRpbmdzXG4gICAgICAuLi5uZXdTZXR0aW5ncywgLy8gTmV3IHNldHRpbmdzIHRvIHVwZGF0ZVxuICAgIH07XG5cbiAgICAvLyBVcGRhdGUgdGhlIEJlaGF2aW9yU3ViamVjdCB3aXRoIHRoZSBuZXcgc2V0dGluZ3NcbiAgICB0aGlzLmFjY2Vzc2liaWxpdHlTZXR0aW5nc1N1YmplY3QubmV4dCh1cGRhdGVkU2V0dGluZ3MpO1xuXG4gICAgLy8gU2F2ZSB0aGUgdXBkYXRlZCBzZXR0aW5ncyB0byBsb2NhbFN0b3JhZ2VcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgICd3ZWlzcy1hY2Nlc3NpYmlsaXR5LXNldHRpbmdzJyxcbiAgICAgIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRTZXR0aW5ncylcbiAgICApO1xuXG4gICAgLy8gQXBwbHkgdGhlIHVwZGF0ZWQgc2V0dGluZ3MgdG8gdGhlIGRvY3VtZW50IHJvb3RcbiAgICB0aGlzLmFwcGx5U2V0dGluZ3ModXBkYXRlZFNldHRpbmdzKTtcbiAgfVxuXG4gIC8vIE1ldGhvZCB0byByZXRyaWV2ZSB0aGUgY3VycmVudCBzZXR0aW5ncyBmcm9tIHRoZSBCZWhhdmlvclN1YmplY3RcbiAgZ2V0Q3VycmVudFNldHRpbmdzKCk6IFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzIHtcbiAgICByZXR1cm4gdGhpcy5hY2Nlc3NpYmlsaXR5U2V0dGluZ3NTdWJqZWN0LnZhbHVlOyAvLyBSZXR1cm5zIHRoZSBjdXJyZW50IHNldHRpbmdzXG4gIH1cblxuICAvLyBNZXRob2QgdG8gZ2V0IHNhdmVkIHNldHRpbmdzIGZyb20gbG9jYWxTdG9yYWdlIG9yIHJldHVybiBkZWZhdWx0IHNldHRpbmdzXG4gIHByaXZhdGUgZ2V0U2F2ZWRTZXR0aW5ncygpOiBXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncyB7XG4gICAgLy8gRGV0ZXJtaW5lIHRoZSBkZWZhdWx0IHNldHRpbmdzIGJhc2VkIG9uIHRoZSBicm93c2VyIGxhbmd1YWdlXG4gICAgdGhpcy5kZWZhdWx0V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3MubGFuZ3VhZ2UgPSB0aGlzLmdldFN1cHBvcnRlZExhbmd1YWdlKCk7XG5cbiAgICAvLyBBdHRlbXB0IHRvIGxvYWQgc2F2ZWQgc2V0dGluZ3MgZnJvbSBsb2NhbFN0b3JhZ2VcbiAgICBjb25zdCBzYXZlZFNldHRpbmdzID0gSlNPTi5wYXJzZShcbiAgICAgIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3ZWlzcy1hY2Nlc3NpYmlsaXR5LXNldHRpbmdzJykgfHwgJ251bGwnXG4gICAgKTtcblxuICAgIC8vIElmIHNhdmVkIHNldHRpbmdzIGV4aXN0LCBtZXJnZSB0aGVtIHdpdGggdGhlIGRlZmF1bHQgc2V0dGluZ3MsIGVsc2UgcmV0dXJuIGRlZmF1bHQgc2V0dGluZ3NcbiAgICByZXR1cm4gc2F2ZWRTZXR0aW5nc1xuICAgICAgPyB7IC4uLnRoaXMuZGVmYXVsdFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzLCAuLi5zYXZlZFNldHRpbmdzIH1cbiAgICAgIDogdGhpcy5kZWZhdWx0V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3M7XG4gIH1cblxuICAvLyBNZXRob2QgdG8gYXBwbHkgdGhlIGFjY2Vzc2liaWxpdHkgc2V0dGluZ3MgdG8gdGhlIHJvb3QgZWxlbWVudCAoSFRNTClcbiAgcHJpdmF0ZSBhcHBseVNldHRpbmdzKHNldHRpbmdzOiBXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncyk6IHZvaWQge1xuICAgIGNvbnN0IHJvb3QgPSB0aGlzLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudDsgLy8gR2V0IHRoZSByb290IEhUTUwgZWxlbWVudFxuXG4gICAgLy8gQXBwbHkgZm9udCBzaXplLCB0aGVtZSwgc3BhY2luZywgYW5kIGxhbmd1YWdlIHNldHRpbmdzIGFzIGF0dHJpYnV0ZXNcbiAgICByb290LnNldEF0dHJpYnV0ZSgnZGF0YS13ZWlzcy1hY2Nlc3NpYmlsaXR5LWZvbnQtc2l6ZScsIHNldHRpbmdzLmZvbnRTaXplKTtcbiAgICByb290LnNldEF0dHJpYnV0ZSgnZGF0YS13ZWlzcy1hY2Nlc3NpYmlsaXR5LXRoZW1lJywgc2V0dGluZ3MudGhlbWUpO1xuICAgIHJvb3Quc2V0QXR0cmlidXRlKCdkYXRhLXdlaXNzLWFjY2Vzc2liaWxpdHktc3BhY2luZycsIHNldHRpbmdzLnNwYWNpbmcpO1xuICAgIHJvb3Quc2V0QXR0cmlidXRlKCdkYXRhLXdlaXNzLWFjY2Vzc2liaWxpdHktbGFuZ3VhZ2UnLCBzZXR0aW5ncy5sYW5ndWFnZSk7XG4gICAgcm9vdC5zZXRBdHRyaWJ1dGUoJ2RhdGEtd2Vpc3MtYWNjZXNzaWJpbGl0eS1sYXlvdXQnLCBzZXR0aW5ncy5sYXlvdXQpO1xuICAgIHJvb3Quc2V0QXR0cmlidXRlKCdsYW5nJywgc2V0dGluZ3MubGFuZ3VhZ2UpO1xuXG4gICAgLy8gSWYgdGhlIGxhbmd1YWdlIGlzIEFyYWJpYyAoJ2FyJyksIHNldCB0aGUgZGlyZWN0aW9uIHRvIFJUTCAoUmlnaHQtdG8tTGVmdClcbiAgICBpZiAoc2V0dGluZ3MubGFuZ3VhZ2UgPT09ICdhcicpIHtcbiAgICAgIHJvb3Quc2V0QXR0cmlidXRlKCdkaXInLCAncnRsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvb3Quc2V0QXR0cmlidXRlKCdkaXInLCAnJyk7IC8vIE90aGVyd2lzZSwgcmVzZXQgZGlyZWN0aW9uIHRvIExUUiAoTGVmdC10by1SaWdodClcbiAgICB9XG4gIH1cblxuICAvLyBNZXRob2QgdG8gcmVzZXQgc2V0dGluZ3MgdG8gZGVmYXVsdCB2YWx1ZXMsIG9yIG9wdGlvbmFsbHkgb25seSBzcGVjaWZpZWQgc2V0dGluZ3NcbiAgcmVzZXRTZXR0aW5ncyhcbiAgICBvbmx5VGhlc2U6IEFycmF5PGtleW9mIFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzPiA9IFtdXG4gICk6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKFwiUmVzZXR0aW5nOiBcIiArIG9ubHlUaGVzZSk7XG4gICAgLy8gSWYgbm8gc3BlY2lmaWMgc2V0dGluZ3Mgd2VyZSBwcm92aWRlZCwgcmVzZXQgYWxsIHNldHRpbmdzIHRvIGRlZmF1bHRcbiAgICBpZiAob25seVRoZXNlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy51cGRhdGVTZXR0aW5ncyh0aGlzLmRlZmF1bHRXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE90aGVyd2lzZSwgb25seSByZXNldCB0aGUgc3BlY2lmaWVkIHNldHRpbmdzIHRvIHRoZWlyIGRlZmF1bHQgdmFsdWVzXG4gICAgICBjb25zdCByZXNldFNldHRpbmdzOiBQYXJ0aWFsPFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzPiA9IHt9O1xuXG4gICAgICAvLyBMb29wIHRocm91Z2ggdGhlIHNwZWNpZmllZCBzZXR0aW5ncyBhbmQgc2V0IHRoZW0gdG8gdGhlaXIgZGVmYXVsdCB2YWx1ZXNcbiAgICAgIG9ubHlUaGVzZS5mb3JFYWNoKChzZXR0aW5nKSA9PiB7XG4gICAgICAgIHJlc2V0U2V0dGluZ3Nbc2V0dGluZ10gPSB0aGlzLmRlZmF1bHRXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5nc1tzZXR0aW5nXTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBVcGRhdGUgdGhlIHNldHRpbmdzIHdpdGggdGhlIHJlc2V0IHZhbHVlc1xuICAgICAgdGhpcy51cGRhdGVTZXR0aW5ncyhyZXNldFNldHRpbmdzKTtcbiAgICB9XG5cbiAgfVxuXG4gIGdldEJyb3dzZXJMYW5ndWFnZSgpOiBzdHJpbmcge1xuXG4gICAgaWYod2luZG93ICYmICh3aW5kb3c/Lm5hdmlnYXRvcj8ubGFuZ3VhZ2UgfHwgd2luZG93Py5uYXZpZ2F0b3I/Lmxhbmd1YWdlcz8uWzBdKSl7XG4gICAgICBjb25zdCBsYW5ndWFnZSA9IG5hdmlnYXRvci5sYW5ndWFnZSB8fCBuYXZpZ2F0b3IubGFuZ3VhZ2VzWzBdO1xuICAgICAgcmV0dXJuIHRoaXMubm9ybWFsaXplTGFuZ3VhZ2VDb2RlKGxhbmd1YWdlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJ2VuJztcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgbGFuZ3VhZ2UgY29kZSAoZS5nLiwgXCJlbi1VU1wiIC0+IFwiZW5cIilcbiAgbm9ybWFsaXplTGFuZ3VhZ2VDb2RlKGxhbmd1YWdlQ29kZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbGFuZ3VhZ2VDb2RlLnNwbGl0KCctJylbMF07IC8vIFNwbGl0IGJ5IFwiLVwiIGFuZCByZXR1cm4gdGhlIGJhc2UgY29kZVxuICB9XG5cbiAgZ2V0U3VwcG9ydGVkTGFuZ3VhZ2UoKTogc3RyaW5nIHtcbiAgICBjb25zdCBicm93c2VyTGFuZ3VhZ2UgPSB0aGlzLmdldEJyb3dzZXJMYW5ndWFnZSgpO1xuXG4gICAgLy8gQ2hlY2sgaWYgdGhlIG5vcm1hbGl6ZWQgYnJvd3NlciBsYW5ndWFnZSBleGlzdHMgaW4gd2Vpc3NBY2Nlc3NpYmlsaXR5TGFuZ3VhZ2VzXG4gICAgY29uc3QgZm91bmRMYW5ndWFnZSA9IHRoaXMud2Vpc3NBY2Nlc3NpYmlsaXR5TGFuZ3VhZ2VzLmZpbmQoXG4gICAgICAobGFuZykgPT4gbGFuZy52YWx1ZSA9PT0gYnJvd3Nlckxhbmd1YWdlXG4gICAgKTtcblxuICAgIGlmIChmb3VuZExhbmd1YWdlKSB7XG4gICAgICByZXR1cm4gZm91bmRMYW5ndWFnZS52YWx1ZTtcbiAgICB9XG5cbiAgICAvLyBGYWxsYmFjayB0byBhIGRlZmF1bHQgbGFuZ3VhZ2UgaWYgbm8gbWF0Y2ggaXMgZm91bmRcbiAgICByZXR1cm4gJ2VuJztcbiAgfVxufVxuIl19