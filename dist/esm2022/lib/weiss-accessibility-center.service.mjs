import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import * as i0 from "@angular/core";
export class WeissAccessibilityCenterService {
    document;
    platformId;
    // Browser check for SSR/clientside compatibility
    isBrowser;
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
    constructor(document, platformId) {
        this.document = document;
        this.platformId = platformId;
        this.isBrowser = isPlatformBrowser(this.platformId);
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
        const updatedSettings = {
            ...this.accessibilitySettingsSubject.value,
            ...newSettings,
        };
        this.accessibilitySettingsSubject.next(updatedSettings);
        if (this.isBrowser) {
            localStorage.setItem('weiss-accessibility-settings', JSON.stringify(updatedSettings));
        }
        this.applySettings(updatedSettings);
    }
    // Method to retrieve the current settings from the BehaviorSubject
    getCurrentSettings() {
        return this.accessibilitySettingsSubject.value; // Returns the current settings
    }
    // Method to get saved settings from localStorage or return default settings
    getSavedSettings() {
        this.defaultWeissAccessibilitySettings.language = this.getSupportedLanguage();
        if (!this.isBrowser) {
            return this.defaultWeissAccessibilitySettings;
        }
        try {
            const savedSettings = JSON.parse(localStorage.getItem('weiss-accessibility-settings') || 'null');
            return savedSettings
                ? { ...this.defaultWeissAccessibilitySettings, ...savedSettings }
                : this.defaultWeissAccessibilitySettings;
        }
        catch {
            return this.defaultWeissAccessibilitySettings;
        }
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
        if (this.isBrowser) {
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: WeissAccessibilityCenterService, deps: [{ token: DOCUMENT }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable });
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
                }] }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDaEUsT0FBTyxFQUFFLGVBQWUsRUFBYyxNQUFNLE1BQU0sQ0FBQztBQUVuRCxPQUFPLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7O0FBSzlELE1BQU0sT0FBTywrQkFBK0I7SUFzRmQ7SUFDRztJQXRGL0IsaURBQWlEO0lBQ3pDLFNBQVMsQ0FBVTtJQUVwQix3QkFBd0IsR0FBd0I7UUFDckQsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUU7UUFDM0MsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUU7UUFDL0MsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUU7UUFDakQsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUU7S0FDNUMsQ0FBQztJQUVLLDJCQUEyQixHQUF3QjtRQUN4RCxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO1FBQzdDLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUU7UUFDN0MsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRTtRQUM1QyxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO1FBQzdDLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFBRSxTQUFT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QyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyx3Q0FBd0M7SUFDN0UsQ0FBQztJQUVELG9CQUFvQjtRQUNsQixNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUVsRCxpRkFBaUY7UUFDakYsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FDekQsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssZUFBZSxDQUN6QyxDQUFDO1FBRUYsSUFBSSxhQUFhLEVBQUUsQ0FBQztZQUNsQixPQUFPLGFBQWEsQ0FBQyxLQUFLLENBQUM7UUFDN0IsQ0FBQztRQUVELHNEQUFzRDtRQUN0RCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7dUdBNU5VLCtCQUErQixrQkFzRmhDLFFBQVEsYUFDUixXQUFXOzJHQXZGViwrQkFBK0IsY0FGOUIsTUFBTTs7MkZBRVAsK0JBQStCO2tCQUgzQyxVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7MEJBdUZJLE1BQU07MkJBQUMsUUFBUTs7MEJBQ2YsTUFBTTsyQkFBQyxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBQTEFURk9STV9JRCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncywgTW9kdWxlRGF0YU9wdGlvbnMgfSBmcm9tICcuL3dlaXNzLWFjY2Vzc2liaWxpdHktY2VudGVyLmludGVyZmFjZXMnO1xuaW1wb3J0IHsgRE9DVU1FTlQsIGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIFdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2Uge1xuICAvLyBCcm93c2VyIGNoZWNrIGZvciBTU1IvY2xpZW50c2lkZSBjb21wYXRpYmlsaXR5XG4gIHByaXZhdGUgaXNCcm93c2VyOiBib29sZWFuO1xuICBcbiAgcHVibGljIHdlaXNzQWNjZXNzaWJpbGl0eVRoZW1lczogTW9kdWxlRGF0YU9wdGlvbnNbXSA9IFtcbiAgICB7IG5hbWU6ICdEZWZhdWx0IGxpZ2h0JywgdmFsdWU6ICdkZWZhdWx0JyB9LFxuICAgIHsgbmFtZTogJ0RlZmF1bHQgZGFyaycsIHZhbHVlOiAnZHluYW1pYy1kYXJrJyB9LFxuICAgIHsgbmFtZTogJ0hpZ2ggY29udHJhc3QnLCB2YWx1ZTogJ2hpZ2gtY29udHJhc3QnIH0sXG4gICAgeyBuYW1lOiAnTW9ub2Nocm9tZScsIHZhbHVlOiAnbW9ub2Nocm9tZScgfSxcbiAgXTtcblxuICBwdWJsaWMgd2Vpc3NBY2Nlc3NpYmlsaXR5Rm9udFNpemVzOiBNb2R1bGVEYXRhT3B0aW9uc1tdID0gW1xuICAgIHsgbmFtZTogJ0RlY3JlYXNlIHRvIDg1JScsIHZhbHVlOiAnc21hbGxlcicgfSxcbiAgICB7IG5hbWU6ICdEZWZhdWx0IGF0IDEwMCUnLCB2YWx1ZTogJ2RlZmF1bHQnIH0sXG4gICAgeyBuYW1lOiAnSW5jcmVhc2UgdG8gMTI1JScsIHZhbHVlOiAnbGFyZ2UnIH0sXG4gICAgeyBuYW1lOiAnSW5jcmVhc2UgdG8gMTUwJScsIHZhbHVlOiAnbGFyZ2VyJyB9LFxuICAgIHsgbmFtZTogJ0luY3JlYXNlIHRvIDIwMCUnLCB2YWx1ZTogJ2xhcmdlc3QnIH0sXG4gIF07XG5cbiAgcHVibGljIHdlaXNzQWNjZXNzaWJpbGl0eVNwYWNpbmc6IE1vZHVsZURhdGFPcHRpb25zW10gPSBbXG4gICAgeyBuYW1lOiAnQ29tcGFjdCBzcGFjaW5nJywgdmFsdWU6ICdjb21wYWN0JyB9LFxuICAgIHsgbmFtZTogJ0Nvenkgc3BhY2luZycsIHZhbHVlOiAnZGVmYXVsdCcgfSxcbiAgICB7IG5hbWU6ICdDb21mb3J0IHNwYWNpbmcnLCB2YWx1ZTogJ2NvbWZvcnQnIH0sXG4gICAgeyBuYW1lOiAnRXh0cmEtY29tZm9ydCBzcGFjaW5nJywgdmFsdWU6ICdleHRyYS1jb21mb3J0JyB9LFxuICBdO1xuXG4gIHB1YmxpYyB3ZWlzc0FjY2Vzc2liaWxpdHlMYXlvdXRzOiBNb2R1bGVEYXRhT3B0aW9uc1tdID0gW1xuICAgIHsgbmFtZTogJ0RlZmF1bHQgbGF5b3V0JywgdmFsdWU6ICdkZWZhdWx0JyB9LFxuICAgIHsgbmFtZTogJ1NpbmdsZSBjb2x1bW4nLCB2YWx1ZTogJ21vYmlsZScgfSxcbiAgXTtcblxuICBwdWJsaWMgd2Vpc3NBY2Nlc3NpYmlsaXR5TGFuZ3VhZ2VzOiBNb2R1bGVEYXRhT3B0aW9uc1tdID0gW1xuICAgIHsgbmFtZTogJ9in2YTYudix2KjZitipJywgdmFsdWU6ICdhcicgfSxcbiAgICB7IG5hbWU6ICfkuK3mlocnLCB2YWx1ZTogJ3poLUNOJyB9LFxuICAgIHsgbmFtZTogJ0VuZ2xpc2gnLCB2YWx1ZTogJ2VuJyB9LFxuICAgIHsgbmFtZTogJ0VzcGHDsW9sJywgdmFsdWU6ICdlcycgfSxcbiAgICB7IG5hbWU6ICdGcmFuw6dhaXMnLCB2YWx1ZTogJ2ZyJyB9LFxuICAgIHsgbmFtZTogJ9Cg0YPRgdGB0LrQuNC5JywgdmFsdWU6ICdydScgfSxcbiAgXTtcblxuICBwdWJsaWMgZGVmYXVsdFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzOiBXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncyA9IHtcbiAgICBmb250U2l6ZTogJ2RlZmF1bHQnLFxuICAgIHRoZW1lOiAnZGVmYXVsdCcsXG4gICAgc3BhY2luZzogJ2RlZmF1bHQnLFxuICAgIGxhbmd1YWdlOiAnZW4nLFxuICAgIGxheW91dDogJ2RlZmF1bHQnLFxuICB9O1xuXG4gIC8vIEJlaGF2aW9yU3ViamVjdCB0byBob2xkIGFuZCBicm9hZGNhc3QgdGhlIGN1cnJlbnQgYWNjZXNzaWJpbGl0eSBzZXR0aW5nc1xuICBwcml2YXRlIGFjY2Vzc2liaWxpdHlTZXR0aW5nc1N1YmplY3Q6IEJlaGF2aW9yU3ViamVjdDxXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncz47XG5cbiAgLy8gT2JzZXJ2YWJsZSB0byBhbGxvdyBjb21wb25lbnRzIHRvIHN1YnNjcmliZSBhbmQgcmVhY3QgdG8gc2V0dGluZ3MgY2hhbmdlc1xuICB3ZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncyQ6IE9ic2VydmFibGU8V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3M+O1xuXG4gIHByaXZhdGUgdGFyZ2V0OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcbiAgc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlciQgPSB0aGlzLnNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIuYXNPYnNlcnZhYmxlKCk7XG5cbiAgdG9nZ2xlV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyKFxuICAgIHRhcmdldEVsZW1lbnQ/OiBIVE1MRWxlbWVudCB8IG51bGwsXG4gICAgZm9yY2VDbG9zZTogYm9vbGVhbiA9IGZhbHNlXG4gICkge1xuICAgIGlmIChmb3JjZUNsb3NlKSB0aGlzLnNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIubmV4dChmYWxzZSk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5zaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyLm5leHQoXG4gICAgICAgICF0aGlzLnNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIudmFsdWVcbiAgICAgICk7XG5cbiAgICAvLyBTdG9yZSB0aGUgdGFyZ2V0IGVsZW1lbnQgZm9yIGZvY3VzIHJlc3RvcmF0aW9uXG4gICAgaWYgKHRhcmdldEVsZW1lbnQpIHtcbiAgICAgIHRoaXMudGFyZ2V0ID1cbiAgICAgICAgdGFyZ2V0RWxlbWVudC5jbG9zZXN0KCdidXR0b24sIFt0YWJpbmRleF0nKSB8fCB0YXJnZXRFbGVtZW50O1xuICAgIH1cbiAgICBpZiAoIXRoaXMudGFyZ2V0KSB7XG4gICAgICB0aGlzLnRhcmdldCA9IHRoaXMuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dlaXNzLWExMXktdG9nZ2xlJyk7XG4gICAgfVxuICAgIC8vIElmIHdpZGdldCBoYXMgYmVlbiBjbG9zZWQsIHJldHVybiBmb2N1cyB0byB0aGUgdGhlIHRhcmdldFxuICAgIGlmICghdGhpcy5zaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyLnZhbHVlKSB7XG4gICAgICBpZiAodGhpcy50YXJnZXQpIHtcbiAgICAgICAgdGhpcy50YXJnZXQuZm9jdXMoKTtcbiAgICAgICAgdGhpcy50YXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IERvY3VtZW50LFxuICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgcGxhdGZvcm1JZDogT2JqZWN0XG4gICAgKSB7XG4gICAgdGhpcy5pc0Jyb3dzZXIgPSBpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpO1xuICAgIC8vIE9uIHNlcnZpY2UgaW5pdGlhbGl6YXRpb24sIGxvYWQgc2F2ZWQgc2V0dGluZ3Mgb3IgdXNlIGRlZmF1bHQgb25lc1xuICAgIGNvbnN0IHNhdmVkU2V0dGluZ3MgPSB0aGlzLmdldFNhdmVkU2V0dGluZ3MoKTtcblxuICAgIC8vIEluaXRpYWxpemUgQmVoYXZpb3JTdWJqZWN0IHdpdGggdGhlIHNhdmVkL2RlZmF1bHQgc2V0dGluZ3NcbiAgICB0aGlzLmFjY2Vzc2liaWxpdHlTZXR0aW5nc1N1YmplY3QgPVxuICAgICAgbmV3IEJlaGF2aW9yU3ViamVjdDxXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncz4oc2F2ZWRTZXR0aW5ncyk7XG5cbiAgICAvLyBFeHBvc2UgdGhlIHN1YmplY3QgYXMgYW4gb2JzZXJ2YWJsZVxuICAgIHRoaXMud2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3MkID1cbiAgICAgIHRoaXMuYWNjZXNzaWJpbGl0eVNldHRpbmdzU3ViamVjdC5hc09ic2VydmFibGUoKTtcblxuICAgIC8vIEFwcGx5IHRoZSBsb2FkZWQgb3IgZGVmYXVsdCBzZXR0aW5ncyB0byB0aGUgZG9jdW1lbnQgcm9vdFxuICAgIHRoaXMuYXBwbHlTZXR0aW5ncyhzYXZlZFNldHRpbmdzKTtcbiAgfVxuXG4gIC8vIE1ldGhvZCB0byB1cGRhdGUgYWNjZXNzaWJpbGl0eSBzZXR0aW5ncyAocGFydGlhbGx5IG9yIGZ1bGx5KVxuICB1cGRhdGVTZXR0aW5ncyhuZXdTZXR0aW5nczogUGFydGlhbDxXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncz4pOiB2b2lkIHtcbiAgICBjb25zdCB1cGRhdGVkU2V0dGluZ3MgPSB7XG4gICAgICAuLi50aGlzLmFjY2Vzc2liaWxpdHlTZXR0aW5nc1N1YmplY3QudmFsdWUsXG4gICAgICAuLi5uZXdTZXR0aW5ncyxcbiAgICB9O1xuXG4gICAgdGhpcy5hY2Nlc3NpYmlsaXR5U2V0dGluZ3NTdWJqZWN0Lm5leHQodXBkYXRlZFNldHRpbmdzKTtcblxuICAgIGlmICh0aGlzLmlzQnJvd3Nlcikge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgICd3ZWlzcy1hY2Nlc3NpYmlsaXR5LXNldHRpbmdzJyxcbiAgICAgICAgSlNPTi5zdHJpbmdpZnkodXBkYXRlZFNldHRpbmdzKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwcGx5U2V0dGluZ3ModXBkYXRlZFNldHRpbmdzKTtcbiAgfVxuXG4gIC8vIE1ldGhvZCB0byByZXRyaWV2ZSB0aGUgY3VycmVudCBzZXR0aW5ncyBmcm9tIHRoZSBCZWhhdmlvclN1YmplY3RcbiAgZ2V0Q3VycmVudFNldHRpbmdzKCk6IFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzIHtcbiAgICByZXR1cm4gdGhpcy5hY2Nlc3NpYmlsaXR5U2V0dGluZ3NTdWJqZWN0LnZhbHVlOyAvLyBSZXR1cm5zIHRoZSBjdXJyZW50IHNldHRpbmdzXG4gIH1cblxuICAvLyBNZXRob2QgdG8gZ2V0IHNhdmVkIHNldHRpbmdzIGZyb20gbG9jYWxTdG9yYWdlIG9yIHJldHVybiBkZWZhdWx0IHNldHRpbmdzXG4gIHByaXZhdGUgZ2V0U2F2ZWRTZXR0aW5ncygpOiBXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncyB7XG4gICAgdGhpcy5kZWZhdWx0V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3MubGFuZ3VhZ2UgPSB0aGlzLmdldFN1cHBvcnRlZExhbmd1YWdlKCk7XG5cbiAgICBpZiAoIXRoaXMuaXNCcm93c2VyKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZWZhdWx0V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3M7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHNhdmVkU2V0dGluZ3MgPSBKU09OLnBhcnNlKFxuICAgICAgICBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnd2Vpc3MtYWNjZXNzaWJpbGl0eS1zZXR0aW5ncycpIHx8ICdudWxsJ1xuICAgICAgKTtcbiAgICAgIHJldHVybiBzYXZlZFNldHRpbmdzXG4gICAgICAgID8geyAuLi50aGlzLmRlZmF1bHRXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncywgLi4uc2F2ZWRTZXR0aW5ncyB9XG4gICAgICAgIDogdGhpcy5kZWZhdWx0V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3M7XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4gdGhpcy5kZWZhdWx0V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3M7XG4gICAgfVxuICB9XG5cbiAgLy8gTWV0aG9kIHRvIGFwcGx5IHRoZSBhY2Nlc3NpYmlsaXR5IHNldHRpbmdzIHRvIHRoZSByb290IGVsZW1lbnQgKEhUTUwpXG4gIHByaXZhdGUgYXBwbHlTZXR0aW5ncyhzZXR0aW5nczogV2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3MpOiB2b2lkIHtcbiAgICBjb25zdCByb290ID0gdGhpcy5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7IC8vIEdldCB0aGUgcm9vdCBIVE1MIGVsZW1lbnRcblxuICAgIC8vIEFwcGx5IGZvbnQgc2l6ZSwgdGhlbWUsIHNwYWNpbmcsIGFuZCBsYW5ndWFnZSBzZXR0aW5ncyBhcyBhdHRyaWJ1dGVzXG4gICAgcm9vdC5zZXRBdHRyaWJ1dGUoJ2RhdGEtd2Vpc3MtYWNjZXNzaWJpbGl0eS1mb250LXNpemUnLCBzZXR0aW5ncy5mb250U2l6ZSk7XG4gICAgcm9vdC5zZXRBdHRyaWJ1dGUoJ2RhdGEtd2Vpc3MtYWNjZXNzaWJpbGl0eS10aGVtZScsIHNldHRpbmdzLnRoZW1lKTtcbiAgICByb290LnNldEF0dHJpYnV0ZSgnZGF0YS13ZWlzcy1hY2Nlc3NpYmlsaXR5LXNwYWNpbmcnLCBzZXR0aW5ncy5zcGFjaW5nKTtcbiAgICByb290LnNldEF0dHJpYnV0ZSgnZGF0YS13ZWlzcy1hY2Nlc3NpYmlsaXR5LWxhbmd1YWdlJywgc2V0dGluZ3MubGFuZ3VhZ2UpO1xuICAgIHJvb3Quc2V0QXR0cmlidXRlKCdkYXRhLXdlaXNzLWFjY2Vzc2liaWxpdHktbGF5b3V0Jywgc2V0dGluZ3MubGF5b3V0KTtcbiAgICByb290LnNldEF0dHJpYnV0ZSgnbGFuZycsIHNldHRpbmdzLmxhbmd1YWdlKTtcblxuICAgIC8vIElmIHRoZSBsYW5ndWFnZSBpcyBBcmFiaWMgKCdhcicpLCBzZXQgdGhlIGRpcmVjdGlvbiB0byBSVEwgKFJpZ2h0LXRvLUxlZnQpXG4gICAgaWYgKHNldHRpbmdzLmxhbmd1YWdlID09PSAnYXInKSB7XG4gICAgICByb290LnNldEF0dHJpYnV0ZSgnZGlyJywgJ3J0bCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByb290LnNldEF0dHJpYnV0ZSgnZGlyJywgJycpOyAvLyBPdGhlcndpc2UsIHJlc2V0IGRpcmVjdGlvbiB0byBMVFIgKExlZnQtdG8tUmlnaHQpXG4gICAgfVxuICB9XG5cbiAgLy8gTWV0aG9kIHRvIHJlc2V0IHNldHRpbmdzIHRvIGRlZmF1bHQgdmFsdWVzLCBvciBvcHRpb25hbGx5IG9ubHkgc3BlY2lmaWVkIHNldHRpbmdzXG4gIHJlc2V0U2V0dGluZ3MoXG4gICAgb25seVRoZXNlOiBBcnJheTxrZXlvZiBXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncz4gPSBbXVxuICApOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZyhcIlJlc2V0dGluZzogXCIgKyBvbmx5VGhlc2UpO1xuICAgIC8vIElmIG5vIHNwZWNpZmljIHNldHRpbmdzIHdlcmUgcHJvdmlkZWQsIHJlc2V0IGFsbCBzZXR0aW5ncyB0byBkZWZhdWx0XG4gICAgaWYgKG9ubHlUaGVzZS5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMudXBkYXRlU2V0dGluZ3ModGhpcy5kZWZhdWx0V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBPdGhlcndpc2UsIG9ubHkgcmVzZXQgdGhlIHNwZWNpZmllZCBzZXR0aW5ncyB0byB0aGVpciBkZWZhdWx0IHZhbHVlc1xuICAgICAgY29uc3QgcmVzZXRTZXR0aW5nczogUGFydGlhbDxXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncz4gPSB7fTtcblxuICAgICAgLy8gTG9vcCB0aHJvdWdoIHRoZSBzcGVjaWZpZWQgc2V0dGluZ3MgYW5kIHNldCB0aGVtIHRvIHRoZWlyIGRlZmF1bHQgdmFsdWVzXG4gICAgICBvbmx5VGhlc2UuZm9yRWFjaCgoc2V0dGluZykgPT4ge1xuICAgICAgICByZXNldFNldHRpbmdzW3NldHRpbmddID0gdGhpcy5kZWZhdWx0V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3Nbc2V0dGluZ107XG4gICAgICB9KTtcblxuICAgICAgLy8gVXBkYXRlIHRoZSBzZXR0aW5ncyB3aXRoIHRoZSByZXNldCB2YWx1ZXNcbiAgICAgIHRoaXMudXBkYXRlU2V0dGluZ3MocmVzZXRTZXR0aW5ncyk7XG4gICAgfVxuXG4gIH1cblxuICBnZXRCcm93c2VyTGFuZ3VhZ2UoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5pc0Jyb3dzZXIpIHtcbiAgICAgIGNvbnN0IGxhbmd1YWdlID0gbmF2aWdhdG9yLmxhbmd1YWdlIHx8IG5hdmlnYXRvci5sYW5ndWFnZXNbMF07XG4gICAgICByZXR1cm4gdGhpcy5ub3JtYWxpemVMYW5ndWFnZUNvZGUobGFuZ3VhZ2UpO1xuICAgIH1cblxuICAgIHJldHVybiAnZW4nO1xuICB9XG5cbiAgLy8gTm9ybWFsaXplIHRoZSBsYW5ndWFnZSBjb2RlIChlLmcuLCBcImVuLVVTXCIgLT4gXCJlblwiKVxuICBub3JtYWxpemVMYW5ndWFnZUNvZGUobGFuZ3VhZ2VDb2RlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBsYW5ndWFnZUNvZGUuc3BsaXQoJy0nKVswXTsgLy8gU3BsaXQgYnkgXCItXCIgYW5kIHJldHVybiB0aGUgYmFzZSBjb2RlXG4gIH1cblxuICBnZXRTdXBwb3J0ZWRMYW5ndWFnZSgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGJyb3dzZXJMYW5ndWFnZSA9IHRoaXMuZ2V0QnJvd3Nlckxhbmd1YWdlKCk7XG5cbiAgICAvLyBDaGVjayBpZiB0aGUgbm9ybWFsaXplZCBicm93c2VyIGxhbmd1YWdlIGV4aXN0cyBpbiB3ZWlzc0FjY2Vzc2liaWxpdHlMYW5ndWFnZXNcbiAgICBjb25zdCBmb3VuZExhbmd1YWdlID0gdGhpcy53ZWlzc0FjY2Vzc2liaWxpdHlMYW5ndWFnZXMuZmluZChcbiAgICAgIChsYW5nKSA9PiBsYW5nLnZhbHVlID09PSBicm93c2VyTGFuZ3VhZ2VcbiAgICApO1xuXG4gICAgaWYgKGZvdW5kTGFuZ3VhZ2UpIHtcbiAgICAgIHJldHVybiBmb3VuZExhbmd1YWdlLnZhbHVlO1xuICAgIH1cblxuICAgIC8vIEZhbGxiYWNrIHRvIGEgZGVmYXVsdCBsYW5ndWFnZSBpZiBubyBtYXRjaCBpcyBmb3VuZFxuICAgIHJldHVybiAnZW4nO1xuICB9XG59XG4iXX0=