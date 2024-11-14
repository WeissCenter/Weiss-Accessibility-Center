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
        const language = navigator.language || navigator.languages[0];
        return this.normalizeLanguageCode(language);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQUUsZUFBZSxFQUFjLE1BQU0sTUFBTSxDQUFDO0FBRW5ELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7QUFLM0MsTUFBTSxPQUFPLCtCQUErQjtJQW1GSjtJQWpGL0Isd0JBQXdCLEdBQXdCO1FBQ3JELEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO1FBQzNDLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFO1FBQy9DLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsZUFBZSxFQUFFO1FBQ2pELEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFO0tBQzVDLENBQUM7SUFFSywyQkFBMkIsR0FBd0I7UUFDeEQsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRTtRQUM3QyxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO1FBQzdDLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7UUFDNUMsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtRQUM3QyxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO0tBQy9DLENBQUM7SUFFSyx5QkFBeUIsR0FBd0I7UUFDdEQsRUFBRSxJQUFJLEVBQUUs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UUFFRCxzREFBc0Q7UUFDdEQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO3VHQWhOVSwrQkFBK0Isa0JBbUZ0QixRQUFROzJHQW5GakIsK0JBQStCLGNBRjlCLE1BQU07OzJGQUVQLCtCQUErQjtrQkFIM0MsVUFBVTttQkFBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkI7OzBCQW9GYyxNQUFNOzJCQUFDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgV2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3MsIE1vZHVsZURhdGFPcHRpb25zIH0gZnJvbSAnLi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5pbnRlcmZhY2VzJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIFdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2Uge1xuICBcbiAgcHVibGljIHdlaXNzQWNjZXNzaWJpbGl0eVRoZW1lczogTW9kdWxlRGF0YU9wdGlvbnNbXSA9IFtcbiAgICB7IG5hbWU6ICdEZWZhdWx0IGxpZ2h0JywgdmFsdWU6ICdkZWZhdWx0JyB9LFxuICAgIHsgbmFtZTogJ0RlZmF1bHQgZGFyaycsIHZhbHVlOiAnZHluYW1pYy1kYXJrJyB9LFxuICAgIHsgbmFtZTogJ0hpZ2ggY29udHJhc3QnLCB2YWx1ZTogJ2hpZ2gtY29udHJhc3QnIH0sXG4gICAgeyBuYW1lOiAnTW9ub2Nocm9tZScsIHZhbHVlOiAnbW9ub2Nocm9tZScgfSxcbiAgXTtcblxuICBwdWJsaWMgd2Vpc3NBY2Nlc3NpYmlsaXR5Rm9udFNpemVzOiBNb2R1bGVEYXRhT3B0aW9uc1tdID0gW1xuICAgIHsgbmFtZTogJ0RlY3JlYXNlIHRvIDg1JScsIHZhbHVlOiAnc21hbGxlcicgfSxcbiAgICB7IG5hbWU6ICdEZWZhdWx0IGF0IDEwMCUnLCB2YWx1ZTogJ2RlZmF1bHQnIH0sXG4gICAgeyBuYW1lOiAnSW5jcmVhc2UgdG8gMTI1JScsIHZhbHVlOiAnbGFyZ2UnIH0sXG4gICAgeyBuYW1lOiAnSW5jcmVhc2UgdG8gMTUwJScsIHZhbHVlOiAnbGFyZ2VyJyB9LFxuICAgIHsgbmFtZTogJ0luY3JlYXNlIHRvIDIwMCUnLCB2YWx1ZTogJ2xhcmdlc3QnIH0sXG4gIF07XG5cbiAgcHVibGljIHdlaXNzQWNjZXNzaWJpbGl0eVNwYWNpbmc6IE1vZHVsZURhdGFPcHRpb25zW10gPSBbXG4gICAgeyBuYW1lOiAnQ29tcGFjdCBzcGFjaW5nJywgdmFsdWU6ICdjb21wYWN0JyB9LFxuICAgIHsgbmFtZTogJ0Nvenkgc3BhY2luZycsIHZhbHVlOiAnZGVmYXVsdCcgfSxcbiAgICB7IG5hbWU6ICdDb21mb3J0IHNwYWNpbmcnLCB2YWx1ZTogJ2NvbWZvcnQnIH0sXG4gICAgeyBuYW1lOiAnRXh0cmEtY29tZm9ydCBzcGFjaW5nJywgdmFsdWU6ICdleHRyYS1jb21mb3J0JyB9LFxuICBdO1xuXG4gIHB1YmxpYyB3ZWlzc0FjY2Vzc2liaWxpdHlMYXlvdXRzOiBNb2R1bGVEYXRhT3B0aW9uc1tdID0gW1xuICAgIHsgbmFtZTogJ0RlZmF1bHQgbGF5b3V0JywgdmFsdWU6ICdkZWZhdWx0JyB9LFxuICAgIHsgbmFtZTogJ1NpbmdsZSBjb2x1bW4nLCB2YWx1ZTogJ21vYmlsZScgfSxcbiAgXTtcblxuICBwdWJsaWMgd2Vpc3NBY2Nlc3NpYmlsaXR5TGFuZ3VhZ2VzOiBNb2R1bGVEYXRhT3B0aW9uc1tdID0gW1xuICAgIHsgbmFtZTogJ9in2YTYudix2KjZitipJywgdmFsdWU6ICdhcicgfSxcbiAgICB7IG5hbWU6ICfkuK3mlocnLCB2YWx1ZTogJ3poLUNOJyB9LFxuICAgIHsgbmFtZTogJ0VuZ2xpc2gnLCB2YWx1ZTogJ2VuJyB9LFxuICAgIHsgbmFtZTogJ0VzcGHDsW9sJywgdmFsdWU6ICdlcycgfSxcbiAgICB7IG5hbWU6ICdGcmFuw6dhaXMnLCB2YWx1ZTogJ2ZyJyB9LFxuICAgIHsgbmFtZTogJ9Cg0YPRgdGB0LrQuNC5JywgdmFsdWU6ICdydScgfSxcbiAgXTtcblxuICBwdWJsaWMgZGVmYXVsdFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzOiBXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncyA9IHtcbiAgICBmb250U2l6ZTogJ2RlZmF1bHQnLFxuICAgIHRoZW1lOiAnZGVmYXVsdCcsXG4gICAgc3BhY2luZzogJ2RlZmF1bHQnLFxuICAgIGxhbmd1YWdlOiAnZW4nLFxuICAgIGxheW91dDogJ2RlZmF1bHQnLFxuICB9O1xuXG4gIC8vIEJlaGF2aW9yU3ViamVjdCB0byBob2xkIGFuZCBicm9hZGNhc3QgdGhlIGN1cnJlbnQgYWNjZXNzaWJpbGl0eSBzZXR0aW5nc1xuICBwcml2YXRlIGFjY2Vzc2liaWxpdHlTZXR0aW5nc1N1YmplY3Q6IEJlaGF2aW9yU3ViamVjdDxXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncz47XG5cbiAgLy8gT2JzZXJ2YWJsZSB0byBhbGxvdyBjb21wb25lbnRzIHRvIHN1YnNjcmliZSBhbmQgcmVhY3QgdG8gc2V0dGluZ3MgY2hhbmdlc1xuICB3ZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncyQ6IE9ic2VydmFibGU8V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3M+O1xuXG4gIHByaXZhdGUgdGFyZ2V0OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcbiAgc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlciQgPSB0aGlzLnNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIuYXNPYnNlcnZhYmxlKCk7XG5cbiAgdG9nZ2xlV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyKFxuICAgIHRhcmdldEVsZW1lbnQ/OiBIVE1MRWxlbWVudCB8IG51bGwsXG4gICAgZm9yY2VDbG9zZTogYm9vbGVhbiA9IGZhbHNlXG4gICkge1xuICAgIGlmIChmb3JjZUNsb3NlKSB0aGlzLnNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIubmV4dChmYWxzZSk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5zaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyLm5leHQoXG4gICAgICAgICF0aGlzLnNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIudmFsdWVcbiAgICAgICk7XG5cbiAgICAvLyBTdG9yZSB0aGUgdGFyZ2V0IGVsZW1lbnQgZm9yIGZvY3VzIHJlc3RvcmF0aW9uXG4gICAgaWYgKHRhcmdldEVsZW1lbnQpIHtcbiAgICAgIHRoaXMudGFyZ2V0ID1cbiAgICAgICAgdGFyZ2V0RWxlbWVudC5jbG9zZXN0KCdidXR0b24sIFt0YWJpbmRleF0nKSB8fCB0YXJnZXRFbGVtZW50O1xuICAgIH1cbiAgICBpZiAoIXRoaXMudGFyZ2V0KSB7XG4gICAgICB0aGlzLnRhcmdldCA9IHRoaXMuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dlaXNzLWExMXktdG9nZ2xlJyk7XG4gICAgfVxuICAgIC8vIElmIHdpZGdldCBoYXMgYmVlbiBjbG9zZWQsIHJldHVybiBmb2N1cyB0byB0aGUgdGhlIHRhcmdldFxuICAgIGlmICghdGhpcy5zaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyLnZhbHVlKSB7XG4gICAgICBpZiAodGhpcy50YXJnZXQpIHtcbiAgICAgICAgdGhpcy50YXJnZXQuZm9jdXMoKTtcbiAgICAgICAgdGhpcy50YXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IERvY3VtZW50KSB7XG4gICAgLy8gT24gc2VydmljZSBpbml0aWFsaXphdGlvbiwgbG9hZCBzYXZlZCBzZXR0aW5ncyBvciB1c2UgZGVmYXVsdCBvbmVzXG4gICAgY29uc3Qgc2F2ZWRTZXR0aW5ncyA9IHRoaXMuZ2V0U2F2ZWRTZXR0aW5ncygpO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBCZWhhdmlvclN1YmplY3Qgd2l0aCB0aGUgc2F2ZWQvZGVmYXVsdCBzZXR0aW5nc1xuICAgIHRoaXMuYWNjZXNzaWJpbGl0eVNldHRpbmdzU3ViamVjdCA9XG4gICAgICBuZXcgQmVoYXZpb3JTdWJqZWN0PFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzPihzYXZlZFNldHRpbmdzKTtcblxuICAgIC8vIEV4cG9zZSB0aGUgc3ViamVjdCBhcyBhbiBvYnNlcnZhYmxlXG4gICAgdGhpcy53ZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncyQgPVxuICAgICAgdGhpcy5hY2Nlc3NpYmlsaXR5U2V0dGluZ3NTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuXG4gICAgLy8gQXBwbHkgdGhlIGxvYWRlZCBvciBkZWZhdWx0IHNldHRpbmdzIHRvIHRoZSBkb2N1bWVudCByb290XG4gICAgdGhpcy5hcHBseVNldHRpbmdzKHNhdmVkU2V0dGluZ3MpO1xuICB9XG5cbiAgLy8gTWV0aG9kIHRvIHVwZGF0ZSBhY2Nlc3NpYmlsaXR5IHNldHRpbmdzIChwYXJ0aWFsbHkgb3IgZnVsbHkpXG4gIHVwZGF0ZVNldHRpbmdzKG5ld1NldHRpbmdzOiBQYXJ0aWFsPFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzPik6IHZvaWQge1xuICAgIC8vIE1lcmdlIHRoZSBuZXcgc2V0dGluZ3Mgd2l0aCB0aGUgY3VycmVudCBzZXR0aW5nc1xuICAgIGNvbnN0IHVwZGF0ZWRTZXR0aW5ncyA9IHtcbiAgICAgIC4uLnRoaXMuYWNjZXNzaWJpbGl0eVNldHRpbmdzU3ViamVjdC52YWx1ZSwgLy8gQ3VycmVudCBzZXR0aW5nc1xuICAgICAgLi4ubmV3U2V0dGluZ3MsIC8vIE5ldyBzZXR0aW5ncyB0byB1cGRhdGVcbiAgICB9O1xuXG4gICAgLy8gVXBkYXRlIHRoZSBCZWhhdmlvclN1YmplY3Qgd2l0aCB0aGUgbmV3IHNldHRpbmdzXG4gICAgdGhpcy5hY2Nlc3NpYmlsaXR5U2V0dGluZ3NTdWJqZWN0Lm5leHQodXBkYXRlZFNldHRpbmdzKTtcblxuICAgIC8vIFNhdmUgdGhlIHVwZGF0ZWQgc2V0dGluZ3MgdG8gbG9jYWxTdG9yYWdlXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAnd2Vpc3MtYWNjZXNzaWJpbGl0eS1zZXR0aW5ncycsXG4gICAgICBKU09OLnN0cmluZ2lmeSh1cGRhdGVkU2V0dGluZ3MpXG4gICAgKTtcblxuICAgIC8vIEFwcGx5IHRoZSB1cGRhdGVkIHNldHRpbmdzIHRvIHRoZSBkb2N1bWVudCByb290XG4gICAgdGhpcy5hcHBseVNldHRpbmdzKHVwZGF0ZWRTZXR0aW5ncyk7XG4gIH1cblxuICAvLyBNZXRob2QgdG8gcmV0cmlldmUgdGhlIGN1cnJlbnQgc2V0dGluZ3MgZnJvbSB0aGUgQmVoYXZpb3JTdWJqZWN0XG4gIGdldEN1cnJlbnRTZXR0aW5ncygpOiBXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncyB7XG4gICAgcmV0dXJuIHRoaXMuYWNjZXNzaWJpbGl0eVNldHRpbmdzU3ViamVjdC52YWx1ZTsgLy8gUmV0dXJucyB0aGUgY3VycmVudCBzZXR0aW5nc1xuICB9XG5cbiAgLy8gTWV0aG9kIHRvIGdldCBzYXZlZCBzZXR0aW5ncyBmcm9tIGxvY2FsU3RvcmFnZSBvciByZXR1cm4gZGVmYXVsdCBzZXR0aW5nc1xuICBwcml2YXRlIGdldFNhdmVkU2V0dGluZ3MoKTogV2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3Mge1xuICAgIC8vIERldGVybWluZSB0aGUgZGVmYXVsdCBzZXR0aW5ncyBiYXNlZCBvbiB0aGUgYnJvd3NlciBsYW5ndWFnZVxuICAgIHRoaXMuZGVmYXVsdFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzLmxhbmd1YWdlID0gdGhpcy5nZXRTdXBwb3J0ZWRMYW5ndWFnZSgpO1xuXG4gICAgLy8gQXR0ZW1wdCB0byBsb2FkIHNhdmVkIHNldHRpbmdzIGZyb20gbG9jYWxTdG9yYWdlXG4gICAgY29uc3Qgc2F2ZWRTZXR0aW5ncyA9IEpTT04ucGFyc2UoXG4gICAgICBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2Vpc3MtYWNjZXNzaWJpbGl0eS1zZXR0aW5ncycpIHx8ICdudWxsJ1xuICAgICk7XG5cbiAgICAvLyBJZiBzYXZlZCBzZXR0aW5ncyBleGlzdCwgbWVyZ2UgdGhlbSB3aXRoIHRoZSBkZWZhdWx0IHNldHRpbmdzLCBlbHNlIHJldHVybiBkZWZhdWx0IHNldHRpbmdzXG4gICAgcmV0dXJuIHNhdmVkU2V0dGluZ3NcbiAgICAgID8geyAuLi50aGlzLmRlZmF1bHRXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncywgLi4uc2F2ZWRTZXR0aW5ncyB9XG4gICAgICA6IHRoaXMuZGVmYXVsdFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzO1xuICB9XG5cbiAgLy8gTWV0aG9kIHRvIGFwcGx5IHRoZSBhY2Nlc3NpYmlsaXR5IHNldHRpbmdzIHRvIHRoZSByb290IGVsZW1lbnQgKEhUTUwpXG4gIHByaXZhdGUgYXBwbHlTZXR0aW5ncyhzZXR0aW5nczogV2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3MpOiB2b2lkIHtcbiAgICBjb25zdCByb290ID0gdGhpcy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7IC8vIEdldCB0aGUgcm9vdCBIVE1MIGVsZW1lbnRcblxuICAgIC8vIEFwcGx5IGZvbnQgc2l6ZSwgdGhlbWUsIHNwYWNpbmcsIGFuZCBsYW5ndWFnZSBzZXR0aW5ncyBhcyBhdHRyaWJ1dGVzXG4gICAgcm9vdC5zZXRBdHRyaWJ1dGUoJ2RhdGEtd2Vpc3MtYWNjZXNzaWJpbGl0eS1mb250LXNpemUnLCBzZXR0aW5ncy5mb250U2l6ZSk7XG4gICAgcm9vdC5zZXRBdHRyaWJ1dGUoJ2RhdGEtd2Vpc3MtYWNjZXNzaWJpbGl0eS10aGVtZScsIHNldHRpbmdzLnRoZW1lKTtcbiAgICByb290LnNldEF0dHJpYnV0ZSgnZGF0YS13ZWlzcy1hY2Nlc3NpYmlsaXR5LXNwYWNpbmcnLCBzZXR0aW5ncy5zcGFjaW5nKTtcbiAgICByb290LnNldEF0dHJpYnV0ZSgnZGF0YS13ZWlzcy1hY2Nlc3NpYmlsaXR5LWxhbmd1YWdlJywgc2V0dGluZ3MubGFuZ3VhZ2UpO1xuICAgIHJvb3Quc2V0QXR0cmlidXRlKCdkYXRhLXdlaXNzLWFjY2Vzc2liaWxpdHktbGF5b3V0Jywgc2V0dGluZ3MubGF5b3V0KTtcbiAgICByb290LnNldEF0dHJpYnV0ZSgnbGFuZycsIHNldHRpbmdzLmxhbmd1YWdlKTtcblxuICAgIC8vIElmIHRoZSBsYW5ndWFnZSBpcyBBcmFiaWMgKCdhcicpLCBzZXQgdGhlIGRpcmVjdGlvbiB0byBSVEwgKFJpZ2h0LXRvLUxlZnQpXG4gICAgaWYgKHNldHRpbmdzLmxhbmd1YWdlID09PSAnYXInKSB7XG4gICAgICByb290LnNldEF0dHJpYnV0ZSgnZGlyJywgJ3J0bCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByb290LnNldEF0dHJpYnV0ZSgnZGlyJywgJycpOyAvLyBPdGhlcndpc2UsIHJlc2V0IGRpcmVjdGlvbiB0byBMVFIgKExlZnQtdG8tUmlnaHQpXG4gICAgfVxuICB9XG5cbiAgLy8gTWV0aG9kIHRvIHJlc2V0IHNldHRpbmdzIHRvIGRlZmF1bHQgdmFsdWVzLCBvciBvcHRpb25hbGx5IG9ubHkgc3BlY2lmaWVkIHNldHRpbmdzXG4gIHJlc2V0U2V0dGluZ3MoXG4gICAgb25seVRoZXNlOiBBcnJheTxrZXlvZiBXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncz4gPSBbXVxuICApOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZyhcIlJlc2V0dGluZzogXCIgKyBvbmx5VGhlc2UpO1xuICAgIC8vIElmIG5vIHNwZWNpZmljIHNldHRpbmdzIHdlcmUgcHJvdmlkZWQsIHJlc2V0IGFsbCBzZXR0aW5ncyB0byBkZWZhdWx0XG4gICAgaWYgKG9ubHlUaGVzZS5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMudXBkYXRlU2V0dGluZ3ModGhpcy5kZWZhdWx0V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBPdGhlcndpc2UsIG9ubHkgcmVzZXQgdGhlIHNwZWNpZmllZCBzZXR0aW5ncyB0byB0aGVpciBkZWZhdWx0IHZhbHVlc1xuICAgICAgY29uc3QgcmVzZXRTZXR0aW5nczogUGFydGlhbDxXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncz4gPSB7fTtcblxuICAgICAgLy8gTG9vcCB0aHJvdWdoIHRoZSBzcGVjaWZpZWQgc2V0dGluZ3MgYW5kIHNldCB0aGVtIHRvIHRoZWlyIGRlZmF1bHQgdmFsdWVzXG4gICAgICBvbmx5VGhlc2UuZm9yRWFjaCgoc2V0dGluZykgPT4ge1xuICAgICAgICByZXNldFNldHRpbmdzW3NldHRpbmddID0gdGhpcy5kZWZhdWx0V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3Nbc2V0dGluZ107XG4gICAgICB9KTtcblxuICAgICAgLy8gVXBkYXRlIHRoZSBzZXR0aW5ncyB3aXRoIHRoZSByZXNldCB2YWx1ZXNcbiAgICAgIHRoaXMudXBkYXRlU2V0dGluZ3MocmVzZXRTZXR0aW5ncyk7XG4gICAgfVxuXG4gIH1cblxuICBnZXRCcm93c2VyTGFuZ3VhZ2UoKTogc3RyaW5nIHtcbiAgICBjb25zdCBsYW5ndWFnZSA9IG5hdmlnYXRvci5sYW5ndWFnZSB8fCBuYXZpZ2F0b3IubGFuZ3VhZ2VzWzBdO1xuICAgIHJldHVybiB0aGlzLm5vcm1hbGl6ZUxhbmd1YWdlQ29kZShsYW5ndWFnZSk7XG4gIH1cblxuICAvLyBOb3JtYWxpemUgdGhlIGxhbmd1YWdlIGNvZGUgKGUuZy4sIFwiZW4tVVNcIiAtPiBcImVuXCIpXG4gIG5vcm1hbGl6ZUxhbmd1YWdlQ29kZShsYW5ndWFnZUNvZGU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGxhbmd1YWdlQ29kZS5zcGxpdCgnLScpWzBdOyAvLyBTcGxpdCBieSBcIi1cIiBhbmQgcmV0dXJuIHRoZSBiYXNlIGNvZGVcbiAgfVxuXG4gIGdldFN1cHBvcnRlZExhbmd1YWdlKCk6IHN0cmluZyB7XG4gICAgY29uc3QgYnJvd3Nlckxhbmd1YWdlID0gdGhpcy5nZXRCcm93c2VyTGFuZ3VhZ2UoKTtcblxuICAgIC8vIENoZWNrIGlmIHRoZSBub3JtYWxpemVkIGJyb3dzZXIgbGFuZ3VhZ2UgZXhpc3RzIGluIHdlaXNzQWNjZXNzaWJpbGl0eUxhbmd1YWdlc1xuICAgIGNvbnN0IGZvdW5kTGFuZ3VhZ2UgPSB0aGlzLndlaXNzQWNjZXNzaWJpbGl0eUxhbmd1YWdlcy5maW5kKFxuICAgICAgKGxhbmcpID0+IGxhbmcudmFsdWUgPT09IGJyb3dzZXJMYW5ndWFnZVxuICAgICk7XG5cbiAgICBpZiAoZm91bmRMYW5ndWFnZSkge1xuICAgICAgcmV0dXJuIGZvdW5kTGFuZ3VhZ2UudmFsdWU7XG4gICAgfVxuXG4gICAgLy8gRmFsbGJhY2sgdG8gYSBkZWZhdWx0IGxhbmd1YWdlIGlmIG5vIG1hdGNoIGlzIGZvdW5kXG4gICAgcmV0dXJuICdlbic7XG4gIH1cbn1cbiJdfQ==