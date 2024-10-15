import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export class WeissAccessibilityCenterService {
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
        this.weissAccessibilityThemes = [
            { name: 'Default light', value: 'default' },
            { name: 'Default dark', value: 'dynamic-dark' },
            { name: 'High contrast', value: 'high-contrast' },
            { name: 'Monochrome', value: 'monochrome' },
        ];
        this.weissAccessibilityFontSizes = [
            { name: 'Decrease to 85%', value: 'smaller' },
            { name: 'Default at 100%', value: 'default' },
            { name: 'Increase to 125%', value: 'large' },
            { name: 'Increase to 150%', value: 'larger' },
            { name: 'Increase to 200%', value: 'largest' },
        ];
        this.weissAccessibilitySpacing = [
            { name: 'Compact spacing', value: 'compact' },
            { name: 'Cozy spacing', value: 'default' },
            { name: 'Comfort spacing', value: 'comfort' },
            { name: 'Extra-comfort spacing', value: 'extra-comfort' },
        ];
        this.weissAccessibilityLayouts = [
            { name: 'Default layout', value: 'default' },
            { name: 'Single column', value: 'mobile' },
        ];
        this.weissAccessibilityLanguages = [
            { name: 'العربية', value: 'ar' },
            { name: '中文', value: 'zh-CN' },
            { name: 'English', value: 'en' },
            { name: 'Español', value: 'es' },
            { name: 'Français', value: 'fr' },
            { name: 'Русский', value: 'ru' },
        ];
        this.defaultWeissAccessibilitySettings = {
            fontSize: 'default',
            theme: 'default',
            spacing: 'default',
            language: 'en',
            layout: 'default',
        };
        this.target = null;
        this.showWeissAccessibilityCenter = new BehaviorSubject(false);
        this.showWeissAccessibilityCenter$ = this.showWeissAccessibilityCenter.asObservable();
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: WeissAccessibilityCenterService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: WeissAccessibilityCenterService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: WeissAccessibilityCenterService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3dlaXNzLWFjY2Vzc2liaWxpdHktY2VudGVyL3NyYy9saWIvd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxlQUFlLEVBQWMsTUFBTSxNQUFNLENBQUM7O0FBTW5ELE1BQU0sT0FBTywrQkFBK0I7SUF3RDFDLDhCQUE4QixDQUM1QixhQUFrQyxFQUNsQyxhQUFzQixLQUFLO1FBRTNCLElBQUksVUFBVTtZQUFFLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7O1lBRTVELElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxJQUFJLENBQ3BDLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLEtBQUssQ0FDekMsQ0FBQztRQUVKLGlEQUFpRDtRQUNqRCxJQUFJLGFBQWEsRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxNQUFNO2dCQUNULGFBQWEsQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsSUFBSSxhQUFhLENBQUM7UUFDakUsQ0FBQztRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDN0QsQ0FBQztRQUNELDREQUE0RDtRQUM1RCxJQUFJLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzdDLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNoQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNwQixJQUFJLENB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Iiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncywgTW9kdWxlRGF0YU9wdGlvbnMgfSBmcm9tICcuL3dlaXNzLWFjY2Vzc2liaWxpdHktY2VudGVyLmludGVyZmFjZXMnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZSB7XG4gIFxuICBwdWJsaWMgd2Vpc3NBY2Nlc3NpYmlsaXR5VGhlbWVzOiBNb2R1bGVEYXRhT3B0aW9uc1tdID0gW1xuICAgIHsgbmFtZTogJ0RlZmF1bHQgbGlnaHQnLCB2YWx1ZTogJ2RlZmF1bHQnIH0sXG4gICAgeyBuYW1lOiAnRGVmYXVsdCBkYXJrJywgdmFsdWU6ICdkeW5hbWljLWRhcmsnIH0sXG4gICAgeyBuYW1lOiAnSGlnaCBjb250cmFzdCcsIHZhbHVlOiAnaGlnaC1jb250cmFzdCcgfSxcbiAgICB7IG5hbWU6ICdNb25vY2hyb21lJywgdmFsdWU6ICdtb25vY2hyb21lJyB9LFxuICBdO1xuXG4gIHB1YmxpYyB3ZWlzc0FjY2Vzc2liaWxpdHlGb250U2l6ZXM6IE1vZHVsZURhdGFPcHRpb25zW10gPSBbXG4gICAgeyBuYW1lOiAnRGVjcmVhc2UgdG8gODUlJywgdmFsdWU6ICdzbWFsbGVyJyB9LFxuICAgIHsgbmFtZTogJ0RlZmF1bHQgYXQgMTAwJScsIHZhbHVlOiAnZGVmYXVsdCcgfSxcbiAgICB7IG5hbWU6ICdJbmNyZWFzZSB0byAxMjUlJywgdmFsdWU6ICdsYXJnZScgfSxcbiAgICB7IG5hbWU6ICdJbmNyZWFzZSB0byAxNTAlJywgdmFsdWU6ICdsYXJnZXInIH0sXG4gICAgeyBuYW1lOiAnSW5jcmVhc2UgdG8gMjAwJScsIHZhbHVlOiAnbGFyZ2VzdCcgfSxcbiAgXTtcblxuICBwdWJsaWMgd2Vpc3NBY2Nlc3NpYmlsaXR5U3BhY2luZzogTW9kdWxlRGF0YU9wdGlvbnNbXSA9IFtcbiAgICB7IG5hbWU6ICdDb21wYWN0IHNwYWNpbmcnLCB2YWx1ZTogJ2NvbXBhY3QnIH0sXG4gICAgeyBuYW1lOiAnQ296eSBzcGFjaW5nJywgdmFsdWU6ICdkZWZhdWx0JyB9LFxuICAgIHsgbmFtZTogJ0NvbWZvcnQgc3BhY2luZycsIHZhbHVlOiAnY29tZm9ydCcgfSxcbiAgICB7IG5hbWU6ICdFeHRyYS1jb21mb3J0IHNwYWNpbmcnLCB2YWx1ZTogJ2V4dHJhLWNvbWZvcnQnIH0sXG4gIF07XG5cbiAgcHVibGljIHdlaXNzQWNjZXNzaWJpbGl0eUxheW91dHM6IE1vZHVsZURhdGFPcHRpb25zW10gPSBbXG4gICAgeyBuYW1lOiAnRGVmYXVsdCBsYXlvdXQnLCB2YWx1ZTogJ2RlZmF1bHQnIH0sXG4gICAgeyBuYW1lOiAnU2luZ2xlIGNvbHVtbicsIHZhbHVlOiAnbW9iaWxlJyB9LFxuICBdO1xuXG4gIHB1YmxpYyB3ZWlzc0FjY2Vzc2liaWxpdHlMYW5ndWFnZXM6IE1vZHVsZURhdGFPcHRpb25zW10gPSBbXG4gICAgeyBuYW1lOiAn2KfZhNi52LHYqNmK2KknLCB2YWx1ZTogJ2FyJyB9LFxuICAgIHsgbmFtZTogJ+S4reaWhycsIHZhbHVlOiAnemgtQ04nIH0sXG4gICAgeyBuYW1lOiAnRW5nbGlzaCcsIHZhbHVlOiAnZW4nIH0sXG4gICAgeyBuYW1lOiAnRXNwYcOxb2wnLCB2YWx1ZTogJ2VzJyB9LFxuICAgIHsgbmFtZTogJ0ZyYW7Dp2FpcycsIHZhbHVlOiAnZnInIH0sXG4gICAgeyBuYW1lOiAn0KDRg9GB0YHQutC40LknLCB2YWx1ZTogJ3J1JyB9LFxuICBdO1xuXG4gIHB1YmxpYyBkZWZhdWx0V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3M6IFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzID0ge1xuICAgIGZvbnRTaXplOiAnZGVmYXVsdCcsXG4gICAgdGhlbWU6ICdkZWZhdWx0JyxcbiAgICBzcGFjaW5nOiAnZGVmYXVsdCcsXG4gICAgbGFuZ3VhZ2U6ICdlbicsXG4gICAgbGF5b3V0OiAnZGVmYXVsdCcsXG4gIH07XG5cbiAgLy8gQmVoYXZpb3JTdWJqZWN0IHRvIGhvbGQgYW5kIGJyb2FkY2FzdCB0aGUgY3VycmVudCBhY2Nlc3NpYmlsaXR5IHNldHRpbmdzXG4gIHByaXZhdGUgYWNjZXNzaWJpbGl0eVNldHRpbmdzU3ViamVjdDogQmVoYXZpb3JTdWJqZWN0PFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzPjtcblxuICAvLyBPYnNlcnZhYmxlIHRvIGFsbG93IGNvbXBvbmVudHMgdG8gc3Vic2NyaWJlIGFuZCByZWFjdCB0byBzZXR0aW5ncyBjaGFuZ2VzXG4gIHdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzJDogT2JzZXJ2YWJsZTxXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncz47XG5cbiAgcHJpdmF0ZSB0YXJnZXQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlciA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xuICBzaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyJCA9IHRoaXMuc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlci5hc09ic2VydmFibGUoKTtcblxuICB0b2dnbGVXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIoXG4gICAgdGFyZ2V0RWxlbWVudD86IEhUTUxFbGVtZW50IHwgbnVsbCxcbiAgICBmb3JjZUNsb3NlOiBib29sZWFuID0gZmFsc2VcbiAgKSB7XG4gICAgaWYgKGZvcmNlQ2xvc2UpIHRoaXMuc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlci5uZXh0KGZhbHNlKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLnNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIubmV4dChcbiAgICAgICAgIXRoaXMuc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlci52YWx1ZVxuICAgICAgKTtcblxuICAgIC8vIFN0b3JlIHRoZSB0YXJnZXQgZWxlbWVudCBmb3IgZm9jdXMgcmVzdG9yYXRpb25cbiAgICBpZiAodGFyZ2V0RWxlbWVudCkge1xuICAgICAgdGhpcy50YXJnZXQgPVxuICAgICAgICB0YXJnZXRFbGVtZW50LmNsb3Nlc3QoJ2J1dHRvbiwgW3RhYmluZGV4XScpIHx8IHRhcmdldEVsZW1lbnQ7XG4gICAgfVxuICAgIGlmICghdGhpcy50YXJnZXQpIHtcbiAgICAgIHRoaXMudGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dlaXNzLWExMXktdG9nZ2xlJyk7XG4gICAgfVxuICAgIC8vIElmIHdpZGdldCBoYXMgYmVlbiBjbG9zZWQsIHJldHVybiBmb2N1cyB0byB0aGUgdGhlIHRhcmdldFxuICAgIGlmICghdGhpcy5zaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyLnZhbHVlKSB7XG4gICAgICBpZiAodGhpcy50YXJnZXQpIHtcbiAgICAgICAgdGhpcy50YXJnZXQuZm9jdXMoKTtcbiAgICAgICAgdGhpcy50YXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8vIE9uIHNlcnZpY2UgaW5pdGlhbGl6YXRpb24sIGxvYWQgc2F2ZWQgc2V0dGluZ3Mgb3IgdXNlIGRlZmF1bHQgb25lc1xuICAgIGNvbnN0IHNhdmVkU2V0dGluZ3MgPSB0aGlzLmdldFNhdmVkU2V0dGluZ3MoKTtcblxuICAgIC8vIEluaXRpYWxpemUgQmVoYXZpb3JTdWJqZWN0IHdpdGggdGhlIHNhdmVkL2RlZmF1bHQgc2V0dGluZ3NcbiAgICB0aGlzLmFjY2Vzc2liaWxpdHlTZXR0aW5nc1N1YmplY3QgPVxuICAgICAgbmV3IEJlaGF2aW9yU3ViamVjdDxXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncz4oc2F2ZWRTZXR0aW5ncyk7XG5cbiAgICAvLyBFeHBvc2UgdGhlIHN1YmplY3QgYXMgYW4gb2JzZXJ2YWJsZVxuICAgIHRoaXMud2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3MkID1cbiAgICAgIHRoaXMuYWNjZXNzaWJpbGl0eVNldHRpbmdzU3ViamVjdC5hc09ic2VydmFibGUoKTtcblxuICAgIC8vIEFwcGx5IHRoZSBsb2FkZWQgb3IgZGVmYXVsdCBzZXR0aW5ncyB0byB0aGUgZG9jdW1lbnQgcm9vdFxuICAgIHRoaXMuYXBwbHlTZXR0aW5ncyhzYXZlZFNldHRpbmdzKTtcbiAgfVxuXG4gIC8vIE1ldGhvZCB0byB1cGRhdGUgYWNjZXNzaWJpbGl0eSBzZXR0aW5ncyAocGFydGlhbGx5IG9yIGZ1bGx5KVxuICB1cGRhdGVTZXR0aW5ncyhuZXdTZXR0aW5nczogUGFydGlhbDxXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncz4pOiB2b2lkIHtcbiAgICAvLyBNZXJnZSB0aGUgbmV3IHNldHRpbmdzIHdpdGggdGhlIGN1cnJlbnQgc2V0dGluZ3NcbiAgICBjb25zdCB1cGRhdGVkU2V0dGluZ3MgPSB7XG4gICAgICAuLi50aGlzLmFjY2Vzc2liaWxpdHlTZXR0aW5nc1N1YmplY3QudmFsdWUsIC8vIEN1cnJlbnQgc2V0dGluZ3NcbiAgICAgIC4uLm5ld1NldHRpbmdzLCAvLyBOZXcgc2V0dGluZ3MgdG8gdXBkYXRlXG4gICAgfTtcblxuICAgIC8vIFVwZGF0ZSB0aGUgQmVoYXZpb3JTdWJqZWN0IHdpdGggdGhlIG5ldyBzZXR0aW5nc1xuICAgIHRoaXMuYWNjZXNzaWJpbGl0eVNldHRpbmdzU3ViamVjdC5uZXh0KHVwZGF0ZWRTZXR0aW5ncyk7XG5cbiAgICAvLyBTYXZlIHRoZSB1cGRhdGVkIHNldHRpbmdzIHRvIGxvY2FsU3RvcmFnZVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFxuICAgICAgJ3dlaXNzLWFjY2Vzc2liaWxpdHktc2V0dGluZ3MnLFxuICAgICAgSlNPTi5zdHJpbmdpZnkodXBkYXRlZFNldHRpbmdzKVxuICAgICk7XG5cbiAgICAvLyBBcHBseSB0aGUgdXBkYXRlZCBzZXR0aW5ncyB0byB0aGUgZG9jdW1lbnQgcm9vdFxuICAgIHRoaXMuYXBwbHlTZXR0aW5ncyh1cGRhdGVkU2V0dGluZ3MpO1xuICB9XG5cbiAgLy8gTWV0aG9kIHRvIHJldHJpZXZlIHRoZSBjdXJyZW50IHNldHRpbmdzIGZyb20gdGhlIEJlaGF2aW9yU3ViamVjdFxuICBnZXRDdXJyZW50U2V0dGluZ3MoKTogV2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3Mge1xuICAgIHJldHVybiB0aGlzLmFjY2Vzc2liaWxpdHlTZXR0aW5nc1N1YmplY3QudmFsdWU7IC8vIFJldHVybnMgdGhlIGN1cnJlbnQgc2V0dGluZ3NcbiAgfVxuXG4gIC8vIE1ldGhvZCB0byBnZXQgc2F2ZWQgc2V0dGluZ3MgZnJvbSBsb2NhbFN0b3JhZ2Ugb3IgcmV0dXJuIGRlZmF1bHQgc2V0dGluZ3NcbiAgcHJpdmF0ZSBnZXRTYXZlZFNldHRpbmdzKCk6IFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzIHtcbiAgICAvLyBEZXRlcm1pbmUgdGhlIGRlZmF1bHQgc2V0dGluZ3MgYmFzZWQgb24gdGhlIGJyb3dzZXIgbGFuZ3VhZ2VcbiAgICB0aGlzLmRlZmF1bHRXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncy5sYW5ndWFnZSA9IHRoaXMuZ2V0U3VwcG9ydGVkTGFuZ3VhZ2UoKTtcblxuICAgIC8vIEF0dGVtcHQgdG8gbG9hZCBzYXZlZCBzZXR0aW5ncyBmcm9tIGxvY2FsU3RvcmFnZVxuICAgIGNvbnN0IHNhdmVkU2V0dGluZ3MgPSBKU09OLnBhcnNlKFxuICAgICAgbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3dlaXNzLWFjY2Vzc2liaWxpdHktc2V0dGluZ3MnKSB8fCAnbnVsbCdcbiAgICApO1xuXG4gICAgLy8gSWYgc2F2ZWQgc2V0dGluZ3MgZXhpc3QsIG1lcmdlIHRoZW0gd2l0aCB0aGUgZGVmYXVsdCBzZXR0aW5ncywgZWxzZSByZXR1cm4gZGVmYXVsdCBzZXR0aW5nc1xuICAgIHJldHVybiBzYXZlZFNldHRpbmdzXG4gICAgICA/IHsgLi4udGhpcy5kZWZhdWx0V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3MsIC4uLnNhdmVkU2V0dGluZ3MgfVxuICAgICAgOiB0aGlzLmRlZmF1bHRXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncztcbiAgfVxuXG4gIC8vIE1ldGhvZCB0byBhcHBseSB0aGUgYWNjZXNzaWJpbGl0eSBzZXR0aW5ncyB0byB0aGUgcm9vdCBlbGVtZW50IChIVE1MKVxuICBwcml2YXRlIGFwcGx5U2V0dGluZ3Moc2V0dGluZ3M6IFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzKTogdm9pZCB7XG4gICAgY29uc3Qgcm9vdCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDsgLy8gR2V0IHRoZSByb290IEhUTUwgZWxlbWVudFxuXG4gICAgLy8gQXBwbHkgZm9udCBzaXplLCB0aGVtZSwgc3BhY2luZywgYW5kIGxhbmd1YWdlIHNldHRpbmdzIGFzIGF0dHJpYnV0ZXNcbiAgICByb290LnNldEF0dHJpYnV0ZSgnZGF0YS13ZWlzcy1hY2Nlc3NpYmlsaXR5LWZvbnQtc2l6ZScsIHNldHRpbmdzLmZvbnRTaXplKTtcbiAgICByb290LnNldEF0dHJpYnV0ZSgnZGF0YS13ZWlzcy1hY2Nlc3NpYmlsaXR5LXRoZW1lJywgc2V0dGluZ3MudGhlbWUpO1xuICAgIHJvb3Quc2V0QXR0cmlidXRlKCdkYXRhLXdlaXNzLWFjY2Vzc2liaWxpdHktc3BhY2luZycsIHNldHRpbmdzLnNwYWNpbmcpO1xuICAgIHJvb3Quc2V0QXR0cmlidXRlKCdkYXRhLXdlaXNzLWFjY2Vzc2liaWxpdHktbGFuZ3VhZ2UnLCBzZXR0aW5ncy5sYW5ndWFnZSk7XG4gICAgcm9vdC5zZXRBdHRyaWJ1dGUoJ2RhdGEtd2Vpc3MtYWNjZXNzaWJpbGl0eS1sYXlvdXQnLCBzZXR0aW5ncy5sYXlvdXQpO1xuICAgIHJvb3Quc2V0QXR0cmlidXRlKCdsYW5nJywgc2V0dGluZ3MubGFuZ3VhZ2UpO1xuXG4gICAgLy8gSWYgdGhlIGxhbmd1YWdlIGlzIEFyYWJpYyAoJ2FyJyksIHNldCB0aGUgZGlyZWN0aW9uIHRvIFJUTCAoUmlnaHQtdG8tTGVmdClcbiAgICBpZiAoc2V0dGluZ3MubGFuZ3VhZ2UgPT09ICdhcicpIHtcbiAgICAgIHJvb3Quc2V0QXR0cmlidXRlKCdkaXInLCAncnRsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJvb3Quc2V0QXR0cmlidXRlKCdkaXInLCAnJyk7IC8vIE90aGVyd2lzZSwgcmVzZXQgZGlyZWN0aW9uIHRvIExUUiAoTGVmdC10by1SaWdodClcbiAgICB9XG4gIH1cblxuICAvLyBNZXRob2QgdG8gcmVzZXQgc2V0dGluZ3MgdG8gZGVmYXVsdCB2YWx1ZXMsIG9yIG9wdGlvbmFsbHkgb25seSBzcGVjaWZpZWQgc2V0dGluZ3NcbiAgcmVzZXRTZXR0aW5ncyhcbiAgICBvbmx5VGhlc2U6IEFycmF5PGtleW9mIFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzPiA9IFtdXG4gICk6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKFwiUmVzZXR0aW5nOiBcIiArIG9ubHlUaGVzZSk7XG4gICAgLy8gSWYgbm8gc3BlY2lmaWMgc2V0dGluZ3Mgd2VyZSBwcm92aWRlZCwgcmVzZXQgYWxsIHNldHRpbmdzIHRvIGRlZmF1bHRcbiAgICBpZiAob25seVRoZXNlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy51cGRhdGVTZXR0aW5ncyh0aGlzLmRlZmF1bHRXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE90aGVyd2lzZSwgb25seSByZXNldCB0aGUgc3BlY2lmaWVkIHNldHRpbmdzIHRvIHRoZWlyIGRlZmF1bHQgdmFsdWVzXG4gICAgICBjb25zdCByZXNldFNldHRpbmdzOiBQYXJ0aWFsPFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzPiA9IHt9O1xuXG4gICAgICAvLyBMb29wIHRocm91Z2ggdGhlIHNwZWNpZmllZCBzZXR0aW5ncyBhbmQgc2V0IHRoZW0gdG8gdGhlaXIgZGVmYXVsdCB2YWx1ZXNcbiAgICAgIG9ubHlUaGVzZS5mb3JFYWNoKChzZXR0aW5nKSA9PiB7XG4gICAgICAgIHJlc2V0U2V0dGluZ3Nbc2V0dGluZ10gPSB0aGlzLmRlZmF1bHRXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5nc1tzZXR0aW5nXTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBVcGRhdGUgdGhlIHNldHRpbmdzIHdpdGggdGhlIHJlc2V0IHZhbHVlc1xuICAgICAgdGhpcy51cGRhdGVTZXR0aW5ncyhyZXNldFNldHRpbmdzKTtcbiAgICB9XG5cbiAgfVxuXG4gIGdldEJyb3dzZXJMYW5ndWFnZSgpOiBzdHJpbmcge1xuICAgIGNvbnN0IGxhbmd1YWdlID0gbmF2aWdhdG9yLmxhbmd1YWdlIHx8IG5hdmlnYXRvci5sYW5ndWFnZXNbMF07XG4gICAgcmV0dXJuIHRoaXMubm9ybWFsaXplTGFuZ3VhZ2VDb2RlKGxhbmd1YWdlKTtcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSB0aGUgbGFuZ3VhZ2UgY29kZSAoZS5nLiwgXCJlbi1VU1wiIC0+IFwiZW5cIilcbiAgbm9ybWFsaXplTGFuZ3VhZ2VDb2RlKGxhbmd1YWdlQ29kZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gbGFuZ3VhZ2VDb2RlLnNwbGl0KCctJylbMF07IC8vIFNwbGl0IGJ5IFwiLVwiIGFuZCByZXR1cm4gdGhlIGJhc2UgY29kZVxuICB9XG5cbiAgZ2V0U3VwcG9ydGVkTGFuZ3VhZ2UoKTogc3RyaW5nIHtcbiAgICBjb25zdCBicm93c2VyTGFuZ3VhZ2UgPSB0aGlzLmdldEJyb3dzZXJMYW5ndWFnZSgpO1xuXG4gICAgLy8gQ2hlY2sgaWYgdGhlIG5vcm1hbGl6ZWQgYnJvd3NlciBsYW5ndWFnZSBleGlzdHMgaW4gd2Vpc3NBY2Nlc3NpYmlsaXR5TGFuZ3VhZ2VzXG4gICAgY29uc3QgZm91bmRMYW5ndWFnZSA9IHRoaXMud2Vpc3NBY2Nlc3NpYmlsaXR5TGFuZ3VhZ2VzLmZpbmQoXG4gICAgICAobGFuZykgPT4gbGFuZy52YWx1ZSA9PT0gYnJvd3Nlckxhbmd1YWdlXG4gICAgKTtcblxuICAgIGlmIChmb3VuZExhbmd1YWdlKSB7XG4gICAgICByZXR1cm4gZm91bmRMYW5ndWFnZS52YWx1ZTtcbiAgICB9XG5cbiAgICAvLyBGYWxsYmFjayB0byBhIGRlZmF1bHQgbGFuZ3VhZ2UgaWYgbm8gbWF0Y2ggaXMgZm91bmRcbiAgICByZXR1cm4gJ2VuJztcbiAgfVxufVxuIl19