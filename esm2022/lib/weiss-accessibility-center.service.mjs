import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export class WeissAccessibilityCenterService {
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: WeissAccessibilityCenterService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: WeissAccessibilityCenterService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: WeissAccessibilityCenterService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxlQUFlLEVBQWMsTUFBTSxNQUFNLENBQUM7O0FBTW5ELE1BQU0sT0FBTywrQkFBK0I7SUFFbkMsd0JBQXdCLEdBQXdCO1FBQ3JELEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO1FBQzNDLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFO1FBQy9DLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsZUFBZSxFQUFFO1FBQ2pELEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFO0tBQzVDLENBQUM7SUFFSywyQkFBMkIsR0FBd0I7UUFDeEQsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRTtRQUM3QyxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO1FBQzdDLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7UUFDNUMsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRTtRQUM3QyxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO0tBQy9DLENBQUM7SUFFSyx5QkFBeUIsR0FBd0I7UUFDdEQsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRTtRQUM3QyxFQUFFLElBQUksRUFBRSxjQUFjLEVB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LFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgV2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3MsIE1vZHVsZURhdGFPcHRpb25zIH0gZnJvbSAnLi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5pbnRlcmZhY2VzJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIFdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2Uge1xuICBcbiAgcHVibGljIHdlaXNzQWNjZXNzaWJpbGl0eVRoZW1lczogTW9kdWxlRGF0YU9wdGlvbnNbXSA9IFtcbiAgICB7IG5hbWU6ICdEZWZhdWx0IGxpZ2h0JywgdmFsdWU6ICdkZWZhdWx0JyB9LFxuICAgIHsgbmFtZTogJ0RlZmF1bHQgZGFyaycsIHZhbHVlOiAnZHluYW1pYy1kYXJrJyB9LFxuICAgIHsgbmFtZTogJ0hpZ2ggY29udHJhc3QnLCB2YWx1ZTogJ2hpZ2gtY29udHJhc3QnIH0sXG4gICAgeyBuYW1lOiAnTW9ub2Nocm9tZScsIHZhbHVlOiAnbW9ub2Nocm9tZScgfSxcbiAgXTtcblxuICBwdWJsaWMgd2Vpc3NBY2Nlc3NpYmlsaXR5Rm9udFNpemVzOiBNb2R1bGVEYXRhT3B0aW9uc1tdID0gW1xuICAgIHsgbmFtZTogJ0RlY3JlYXNlIHRvIDg1JScsIHZhbHVlOiAnc21hbGxlcicgfSxcbiAgICB7IG5hbWU6ICdEZWZhdWx0IGF0IDEwMCUnLCB2YWx1ZTogJ2RlZmF1bHQnIH0sXG4gICAgeyBuYW1lOiAnSW5jcmVhc2UgdG8gMTI1JScsIHZhbHVlOiAnbGFyZ2UnIH0sXG4gICAgeyBuYW1lOiAnSW5jcmVhc2UgdG8gMTUwJScsIHZhbHVlOiAnbGFyZ2VyJyB9LFxuICAgIHsgbmFtZTogJ0luY3JlYXNlIHRvIDIwMCUnLCB2YWx1ZTogJ2xhcmdlc3QnIH0sXG4gIF07XG5cbiAgcHVibGljIHdlaXNzQWNjZXNzaWJpbGl0eVNwYWNpbmc6IE1vZHVsZURhdGFPcHRpb25zW10gPSBbXG4gICAgeyBuYW1lOiAnQ29tcGFjdCBzcGFjaW5nJywgdmFsdWU6ICdjb21wYWN0JyB9LFxuICAgIHsgbmFtZTogJ0Nvenkgc3BhY2luZycsIHZhbHVlOiAnZGVmYXVsdCcgfSxcbiAgICB7IG5hbWU6ICdDb21mb3J0IHNwYWNpbmcnLCB2YWx1ZTogJ2NvbWZvcnQnIH0sXG4gICAgeyBuYW1lOiAnRXh0cmEtY29tZm9ydCBzcGFjaW5nJywgdmFsdWU6ICdleHRyYS1jb21mb3J0JyB9LFxuICBdO1xuXG4gIHB1YmxpYyB3ZWlzc0FjY2Vzc2liaWxpdHlMYXlvdXRzOiBNb2R1bGVEYXRhT3B0aW9uc1tdID0gW1xuICAgIHsgbmFtZTogJ0RlZmF1bHQgbGF5b3V0JywgdmFsdWU6ICdkZWZhdWx0JyB9LFxuICAgIHsgbmFtZTogJ1NpbmdsZSBjb2x1bW4nLCB2YWx1ZTogJ21vYmlsZScgfSxcbiAgXTtcblxuICBwdWJsaWMgd2Vpc3NBY2Nlc3NpYmlsaXR5TGFuZ3VhZ2VzOiBNb2R1bGVEYXRhT3B0aW9uc1tdID0gW1xuICAgIHsgbmFtZTogJ9in2YTYudix2KjZitipJywgdmFsdWU6ICdhcicgfSxcbiAgICB7IG5hbWU6ICfkuK3mlocnLCB2YWx1ZTogJ3poLUNOJyB9LFxuICAgIHsgbmFtZTogJ0VuZ2xpc2gnLCB2YWx1ZTogJ2VuJyB9LFxuICAgIHsgbmFtZTogJ0VzcGHDsW9sJywgdmFsdWU6ICdlcycgfSxcbiAgICB7IG5hbWU6ICdGcmFuw6dhaXMnLCB2YWx1ZTogJ2ZyJyB9LFxuICAgIHsgbmFtZTogJ9Cg0YPRgdGB0LrQuNC5JywgdmFsdWU6ICdydScgfSxcbiAgXTtcblxuICBwdWJsaWMgZGVmYXVsdFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzOiBXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncyA9IHtcbiAgICBmb250U2l6ZTogJ2RlZmF1bHQnLFxuICAgIHRoZW1lOiAnZGVmYXVsdCcsXG4gICAgc3BhY2luZzogJ2RlZmF1bHQnLFxuICAgIGxhbmd1YWdlOiAnZW4nLFxuICAgIGxheW91dDogJ2RlZmF1bHQnLFxuICB9O1xuXG4gIC8vIEJlaGF2aW9yU3ViamVjdCB0byBob2xkIGFuZCBicm9hZGNhc3QgdGhlIGN1cnJlbnQgYWNjZXNzaWJpbGl0eSBzZXR0aW5nc1xuICBwcml2YXRlIGFjY2Vzc2liaWxpdHlTZXR0aW5nc1N1YmplY3Q6IEJlaGF2aW9yU3ViamVjdDxXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncz47XG5cbiAgLy8gT2JzZXJ2YWJsZSB0byBhbGxvdyBjb21wb25lbnRzIHRvIHN1YnNjcmliZSBhbmQgcmVhY3QgdG8gc2V0dGluZ3MgY2hhbmdlc1xuICB3ZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncyQ6IE9ic2VydmFibGU8V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3M+O1xuXG4gIHByaXZhdGUgdGFyZ2V0OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcbiAgc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlciQgPSB0aGlzLnNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIuYXNPYnNlcnZhYmxlKCk7XG5cbiAgdG9nZ2xlV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyKFxuICAgIHRhcmdldEVsZW1lbnQ/OiBIVE1MRWxlbWVudCB8IG51bGwsXG4gICAgZm9yY2VDbG9zZTogYm9vbGVhbiA9IGZhbHNlXG4gICkge1xuICAgIGlmIChmb3JjZUNsb3NlKSB0aGlzLnNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIubmV4dChmYWxzZSk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5zaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyLm5leHQoXG4gICAgICAgICF0aGlzLnNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIudmFsdWVcbiAgICAgICk7XG5cbiAgICAvLyBTdG9yZSB0aGUgdGFyZ2V0IGVsZW1lbnQgZm9yIGZvY3VzIHJlc3RvcmF0aW9uXG4gICAgaWYgKHRhcmdldEVsZW1lbnQpIHtcbiAgICAgIHRoaXMudGFyZ2V0ID1cbiAgICAgICAgdGFyZ2V0RWxlbWVudC5jbG9zZXN0KCdidXR0b24sIFt0YWJpbmRleF0nKSB8fCB0YXJnZXRFbGVtZW50O1xuICAgIH1cbiAgICBpZiAoIXRoaXMudGFyZ2V0KSB7XG4gICAgICB0aGlzLnRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3ZWlzcy1hMTF5LXRvZ2dsZScpO1xuICAgIH1cbiAgICAvLyBJZiB3aWRnZXQgaGFzIGJlZW4gY2xvc2VkLCByZXR1cm4gZm9jdXMgdG8gdGhlIHRoZSB0YXJnZXRcbiAgICBpZiAoIXRoaXMuc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlci52YWx1ZSkge1xuICAgICAgaWYgKHRoaXMudGFyZ2V0KSB7XG4gICAgICAgIHRoaXMudGFyZ2V0LmZvY3VzKCk7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvLyBPbiBzZXJ2aWNlIGluaXRpYWxpemF0aW9uLCBsb2FkIHNhdmVkIHNldHRpbmdzIG9yIHVzZSBkZWZhdWx0IG9uZXNcbiAgICBjb25zdCBzYXZlZFNldHRpbmdzID0gdGhpcy5nZXRTYXZlZFNldHRpbmdzKCk7XG5cbiAgICAvLyBJbml0aWFsaXplIEJlaGF2aW9yU3ViamVjdCB3aXRoIHRoZSBzYXZlZC9kZWZhdWx0IHNldHRpbmdzXG4gICAgdGhpcy5hY2Nlc3NpYmlsaXR5U2V0dGluZ3NTdWJqZWN0ID1cbiAgICAgIG5ldyBCZWhhdmlvclN1YmplY3Q8V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3M+KHNhdmVkU2V0dGluZ3MpO1xuXG4gICAgLy8gRXhwb3NlIHRoZSBzdWJqZWN0IGFzIGFuIG9ic2VydmFibGVcbiAgICB0aGlzLndlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzJCA9XG4gICAgICB0aGlzLmFjY2Vzc2liaWxpdHlTZXR0aW5nc1N1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG5cbiAgICAvLyBBcHBseSB0aGUgbG9hZGVkIG9yIGRlZmF1bHQgc2V0dGluZ3MgdG8gdGhlIGRvY3VtZW50IHJvb3RcbiAgICB0aGlzLmFwcGx5U2V0dGluZ3Moc2F2ZWRTZXR0aW5ncyk7XG4gIH1cblxuICAvLyBNZXRob2QgdG8gdXBkYXRlIGFjY2Vzc2liaWxpdHkgc2V0dGluZ3MgKHBhcnRpYWxseSBvciBmdWxseSlcbiAgdXBkYXRlU2V0dGluZ3MobmV3U2V0dGluZ3M6IFBhcnRpYWw8V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3M+KTogdm9pZCB7XG4gICAgLy8gTWVyZ2UgdGhlIG5ldyBzZXR0aW5ncyB3aXRoIHRoZSBjdXJyZW50IHNldHRpbmdzXG4gICAgY29uc3QgdXBkYXRlZFNldHRpbmdzID0ge1xuICAgICAgLi4udGhpcy5hY2Nlc3NpYmlsaXR5U2V0dGluZ3NTdWJqZWN0LnZhbHVlLCAvLyBDdXJyZW50IHNldHRpbmdzXG4gICAgICAuLi5uZXdTZXR0aW5ncywgLy8gTmV3IHNldHRpbmdzIHRvIHVwZGF0ZVxuICAgIH07XG5cbiAgICAvLyBVcGRhdGUgdGhlIEJlaGF2aW9yU3ViamVjdCB3aXRoIHRoZSBuZXcgc2V0dGluZ3NcbiAgICB0aGlzLmFjY2Vzc2liaWxpdHlTZXR0aW5nc1N1YmplY3QubmV4dCh1cGRhdGVkU2V0dGluZ3MpO1xuXG4gICAgLy8gU2F2ZSB0aGUgdXBkYXRlZCBzZXR0aW5ncyB0byBsb2NhbFN0b3JhZ2VcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgICd3ZWlzcy1hY2Nlc3NpYmlsaXR5LXNldHRpbmdzJyxcbiAgICAgIEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRTZXR0aW5ncylcbiAgICApO1xuXG4gICAgLy8gQXBwbHkgdGhlIHVwZGF0ZWQgc2V0dGluZ3MgdG8gdGhlIGRvY3VtZW50IHJvb3RcbiAgICB0aGlzLmFwcGx5U2V0dGluZ3ModXBkYXRlZFNldHRpbmdzKTtcbiAgfVxuXG4gIC8vIE1ldGhvZCB0byByZXRyaWV2ZSB0aGUgY3VycmVudCBzZXR0aW5ncyBmcm9tIHRoZSBCZWhhdmlvclN1YmplY3RcbiAgZ2V0Q3VycmVudFNldHRpbmdzKCk6IFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzIHtcbiAgICByZXR1cm4gdGhpcy5hY2Nlc3NpYmlsaXR5U2V0dGluZ3NTdWJqZWN0LnZhbHVlOyAvLyBSZXR1cm5zIHRoZSBjdXJyZW50IHNldHRpbmdzXG4gIH1cblxuICAvLyBNZXRob2QgdG8gZ2V0IHNhdmVkIHNldHRpbmdzIGZyb20gbG9jYWxTdG9yYWdlIG9yIHJldHVybiBkZWZhdWx0IHNldHRpbmdzXG4gIHByaXZhdGUgZ2V0U2F2ZWRTZXR0aW5ncygpOiBXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncyB7XG4gICAgLy8gRGV0ZXJtaW5lIHRoZSBkZWZhdWx0IHNldHRpbmdzIGJhc2VkIG9uIHRoZSBicm93c2VyIGxhbmd1YWdlXG4gICAgdGhpcy5kZWZhdWx0V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3MubGFuZ3VhZ2UgPSB0aGlzLmdldFN1cHBvcnRlZExhbmd1YWdlKCk7XG5cbiAgICAvLyBBdHRlbXB0IHRvIGxvYWQgc2F2ZWQgc2V0dGluZ3MgZnJvbSBsb2NhbFN0b3JhZ2VcbiAgICBjb25zdCBzYXZlZFNldHRpbmdzID0gSlNPTi5wYXJzZShcbiAgICAgIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd3ZWlzcy1hY2Nlc3NpYmlsaXR5LXNldHRpbmdzJykgfHwgJ251bGwnXG4gICAgKTtcblxuICAgIC8vIElmIHNhdmVkIHNldHRpbmdzIGV4aXN0LCBtZXJnZSB0aGVtIHdpdGggdGhlIGRlZmF1bHQgc2V0dGluZ3MsIGVsc2UgcmV0dXJuIGRlZmF1bHQgc2V0dGluZ3NcbiAgICByZXR1cm4gc2F2ZWRTZXR0aW5nc1xuICAgICAgPyB7IC4uLnRoaXMuZGVmYXVsdFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzLCAuLi5zYXZlZFNldHRpbmdzIH1cbiAgICAgIDogdGhpcy5kZWZhdWx0V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3M7XG4gIH1cblxuICAvLyBNZXRob2QgdG8gYXBwbHkgdGhlIGFjY2Vzc2liaWxpdHkgc2V0dGluZ3MgdG8gdGhlIHJvb3QgZWxlbWVudCAoSFRNTClcbiAgcHJpdmF0ZSBhcHBseVNldHRpbmdzKHNldHRpbmdzOiBXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncyk6IHZvaWQge1xuICAgIGNvbnN0IHJvb3QgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7IC8vIEdldCB0aGUgcm9vdCBIVE1MIGVsZW1lbnRcblxuICAgIC8vIEFwcGx5IGZvbnQgc2l6ZSwgdGhlbWUsIHNwYWNpbmcsIGFuZCBsYW5ndWFnZSBzZXR0aW5ncyBhcyBhdHRyaWJ1dGVzXG4gICAgcm9vdC5zZXRBdHRyaWJ1dGUoJ2RhdGEtd2Vpc3MtYWNjZXNzaWJpbGl0eS1mb250LXNpemUnLCBzZXR0aW5ncy5mb250U2l6ZSk7XG4gICAgcm9vdC5zZXRBdHRyaWJ1dGUoJ2RhdGEtd2Vpc3MtYWNjZXNzaWJpbGl0eS10aGVtZScsIHNldHRpbmdzLnRoZW1lKTtcbiAgICByb290LnNldEF0dHJpYnV0ZSgnZGF0YS13ZWlzcy1hY2Nlc3NpYmlsaXR5LXNwYWNpbmcnLCBzZXR0aW5ncy5zcGFjaW5nKTtcbiAgICByb290LnNldEF0dHJpYnV0ZSgnZGF0YS13ZWlzcy1hY2Nlc3NpYmlsaXR5LWxhbmd1YWdlJywgc2V0dGluZ3MubGFuZ3VhZ2UpO1xuICAgIHJvb3Quc2V0QXR0cmlidXRlKCdkYXRhLXdlaXNzLWFjY2Vzc2liaWxpdHktbGF5b3V0Jywgc2V0dGluZ3MubGF5b3V0KTtcbiAgICByb290LnNldEF0dHJpYnV0ZSgnbGFuZycsIHNldHRpbmdzLmxhbmd1YWdlKTtcblxuICAgIC8vIElmIHRoZSBsYW5ndWFnZSBpcyBBcmFiaWMgKCdhcicpLCBzZXQgdGhlIGRpcmVjdGlvbiB0byBSVEwgKFJpZ2h0LXRvLUxlZnQpXG4gICAgaWYgKHNldHRpbmdzLmxhbmd1YWdlID09PSAnYXInKSB7XG4gICAgICByb290LnNldEF0dHJpYnV0ZSgnZGlyJywgJ3J0bCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByb290LnNldEF0dHJpYnV0ZSgnZGlyJywgJycpOyAvLyBPdGhlcndpc2UsIHJlc2V0IGRpcmVjdGlvbiB0byBMVFIgKExlZnQtdG8tUmlnaHQpXG4gICAgfVxuICB9XG5cbiAgLy8gTWV0aG9kIHRvIHJlc2V0IHNldHRpbmdzIHRvIGRlZmF1bHQgdmFsdWVzLCBvciBvcHRpb25hbGx5IG9ubHkgc3BlY2lmaWVkIHNldHRpbmdzXG4gIHJlc2V0U2V0dGluZ3MoXG4gICAgb25seVRoZXNlOiBBcnJheTxrZXlvZiBXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncz4gPSBbXVxuICApOiB2b2lkIHtcbiAgICBjb25zb2xlLmxvZyhcIlJlc2V0dGluZzogXCIgKyBvbmx5VGhlc2UpO1xuICAgIC8vIElmIG5vIHNwZWNpZmljIHNldHRpbmdzIHdlcmUgcHJvdmlkZWQsIHJlc2V0IGFsbCBzZXR0aW5ncyB0byBkZWZhdWx0XG4gICAgaWYgKG9ubHlUaGVzZS5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMudXBkYXRlU2V0dGluZ3ModGhpcy5kZWZhdWx0V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBPdGhlcndpc2UsIG9ubHkgcmVzZXQgdGhlIHNwZWNpZmllZCBzZXR0aW5ncyB0byB0aGVpciBkZWZhdWx0IHZhbHVlc1xuICAgICAgY29uc3QgcmVzZXRTZXR0aW5nczogUGFydGlhbDxXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncz4gPSB7fTtcblxuICAgICAgLy8gTG9vcCB0aHJvdWdoIHRoZSBzcGVjaWZpZWQgc2V0dGluZ3MgYW5kIHNldCB0aGVtIHRvIHRoZWlyIGRlZmF1bHQgdmFsdWVzXG4gICAgICBvbmx5VGhlc2UuZm9yRWFjaCgoc2V0dGluZykgPT4ge1xuICAgICAgICByZXNldFNldHRpbmdzW3NldHRpbmddID0gdGhpcy5kZWZhdWx0V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3Nbc2V0dGluZ107XG4gICAgICB9KTtcblxuICAgICAgLy8gVXBkYXRlIHRoZSBzZXR0aW5ncyB3aXRoIHRoZSByZXNldCB2YWx1ZXNcbiAgICAgIHRoaXMudXBkYXRlU2V0dGluZ3MocmVzZXRTZXR0aW5ncyk7XG4gICAgfVxuXG4gIH1cblxuICBnZXRCcm93c2VyTGFuZ3VhZ2UoKTogc3RyaW5nIHtcbiAgICBjb25zdCBsYW5ndWFnZSA9IG5hdmlnYXRvci5sYW5ndWFnZSB8fCBuYXZpZ2F0b3IubGFuZ3VhZ2VzWzBdO1xuICAgIHJldHVybiB0aGlzLm5vcm1hbGl6ZUxhbmd1YWdlQ29kZShsYW5ndWFnZSk7XG4gIH1cblxuICAvLyBOb3JtYWxpemUgdGhlIGxhbmd1YWdlIGNvZGUgKGUuZy4sIFwiZW4tVVNcIiAtPiBcImVuXCIpXG4gIG5vcm1hbGl6ZUxhbmd1YWdlQ29kZShsYW5ndWFnZUNvZGU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGxhbmd1YWdlQ29kZS5zcGxpdCgnLScpWzBdOyAvLyBTcGxpdCBieSBcIi1cIiBhbmQgcmV0dXJuIHRoZSBiYXNlIGNvZGVcbiAgfVxuXG4gIGdldFN1cHBvcnRlZExhbmd1YWdlKCk6IHN0cmluZyB7XG4gICAgY29uc3QgYnJvd3Nlckxhbmd1YWdlID0gdGhpcy5nZXRCcm93c2VyTGFuZ3VhZ2UoKTtcblxuICAgIC8vIENoZWNrIGlmIHRoZSBub3JtYWxpemVkIGJyb3dzZXIgbGFuZ3VhZ2UgZXhpc3RzIGluIHdlaXNzQWNjZXNzaWJpbGl0eUxhbmd1YWdlc1xuICAgIGNvbnN0IGZvdW5kTGFuZ3VhZ2UgPSB0aGlzLndlaXNzQWNjZXNzaWJpbGl0eUxhbmd1YWdlcy5maW5kKFxuICAgICAgKGxhbmcpID0+IGxhbmcudmFsdWUgPT09IGJyb3dzZXJMYW5ndWFnZVxuICAgICk7XG5cbiAgICBpZiAoZm91bmRMYW5ndWFnZSkge1xuICAgICAgcmV0dXJuIGZvdW5kTGFuZ3VhZ2UudmFsdWU7XG4gICAgfVxuXG4gICAgLy8gRmFsbGJhY2sgdG8gYSBkZWZhdWx0IGxhbmd1YWdlIGlmIG5vIG1hdGNoIGlzIGZvdW5kXG4gICAgcmV0dXJuICdlbic7XG4gIH1cbn1cbiJdfQ==