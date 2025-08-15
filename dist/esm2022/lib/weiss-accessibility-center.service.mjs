import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import * as i0 from "@angular/core";
export class WeissAccessibilityCenterService {
    document;
    platformId;
    // Browser check for SSR/clientside compatibility
    isBrowser;
    weissAccessibilityThemes = [
        { name: "Default light", value: "default" },
        { name: "Default dark", value: "dynamic-dark" },
        { name: "High contrast", value: "high-contrast" },
        { name: "Monochrome", value: "monochrome" },
    ];
    weissAccessibilityFontSizes = [
        { name: "Decrease to 85%", value: "smaller" },
        { name: "Default at 100%", value: "default" },
        { name: "Increase to 125%", value: "large" },
        { name: "Increase to 150%", value: "larger" },
        { name: "Increase to 200%", value: "largest" },
    ];
    weissAccessibilitySpacing = [
        { name: "Compact spacing", value: "compact" },
        { name: "Cozy spacing", value: "default" },
        { name: "Comfort spacing", value: "comfort" },
        { name: "Extra-comfort spacing", value: "extra-comfort" },
    ];
    weissAccessibilityLayouts = [
        { name: "Default layout", value: "default" },
        { name: "Single column", value: "mobile" },
    ];
    weissAccessibilityLanguages = [
        { name: "العربية", value: "ar" },
        { name: "中文", value: "zh-CN" },
        { name: "English", value: "en" },
        { name: "Español", value: "es" },
        { name: "Français", value: "fr" },
        { name: "Русский", value: "ru" },
    ];
    defaultWeissAccessibilitySettings = {
        fontSize: "default",
        theme: "default",
        spacing: "default",
        language: "en",
        layout: "default",
    };
    defaultId = 'weiss-accessibility-center';
    targetIdSubject = new BehaviorSubject(this.defaultId);
    targetId$ = this.targetIdSubject.asObservable();
    setTargetId(id) {
        this.targetIdSubject.next(id || this.defaultId);
    }
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
                targetElement.closest("button, [tabindex]") || targetElement;
        }
        if (!this.target) {
            this.target = this.document.getElementById("weiss-a11y-toggle");
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
            localStorage.setItem("weiss-accessibility-settings", JSON.stringify(updatedSettings));
        }
        this.applySettings(updatedSettings);
    }
    // Method to retrieve the current settings from the BehaviorSubject
    getCurrentSettings() {
        return this.accessibilitySettingsSubject.value; // Returns the current settings
    }
    // Method to get saved settings from localStorage or return default settings
    getSavedSettings() {
        this.defaultWeissAccessibilitySettings.language =
            this.getSupportedLanguage();
        if (!this.isBrowser) {
            return this.defaultWeissAccessibilitySettings;
        }
        try {
            const savedSettings = JSON.parse(localStorage.getItem("weiss-accessibility-settings") || "null");
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
        root.setAttribute("data-weiss-accessibility-font-size", settings.fontSize);
        root.setAttribute("data-weiss-accessibility-theme", settings.theme);
        root.setAttribute("data-weiss-accessibility-spacing", settings.spacing);
        root.setAttribute("data-weiss-accessibility-language", settings.language);
        root.setAttribute("data-weiss-accessibility-layout", settings.layout);
        root.setAttribute("lang", settings.language);
        // If the language is Arabic ('ar'), set the direction to RTL (Right-to-Left)
        if (settings.language === "ar") {
            root.setAttribute("dir", "rtl");
        }
        else {
            root.setAttribute("dir", ""); // Otherwise, reset direction to LTR (Left-to-Right)
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
                resetSettings[setting] =
                    this.defaultWeissAccessibilitySettings[setting];
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
        return "en";
    }
    // Normalize the language code (e.g., "en-US" -> "en")
    normalizeLanguageCode(languageCode) {
        return languageCode.split("-")[0]; // Split by "-" and return the base code
    }
    getSupportedLanguage() {
        const browserLanguage = this.getBrowserLanguage();
        // Check if the normalized browser language exists in weissAccessibilityLanguages
        const foundLanguage = this.weissAccessibilityLanguages.find((lang) => lang.value === browserLanguage);
        if (foundLanguage) {
            return foundLanguage.value;
        }
        // Fallback to a default language if no match is found
        return "en";
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: WeissAccessibilityCenterService, deps: [{ token: DOCUMENT }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: WeissAccessibilityCenterService, providedIn: "root" });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: WeissAccessibilityCenterService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: "root",
                }]
        }], ctorParameters: () => [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDaEUsT0FBTyxFQUFFLGVBQWUsRUFBYyxNQUFNLE1BQU0sQ0FBQztBQUtuRCxPQUFPLEVBQUUsUUFBUSxFQUFFLGlCQUFpQixFQUFFLE1BQU0saUJBQWlCLENBQUM7O0FBSzlELE1BQU0sT0FBTywrQkFBK0I7SUErRmQ7SUFDRztJQS9GL0IsaURBQWlEO0lBQ3pDLFNBQVMsQ0FBVTtJQUVwQix3QkFBd0IsR0FBd0I7UUFDckQsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUU7UUFDM0MsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUU7UUFDL0MsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUU7UUFDakQsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUU7S0FDNUMsQ0FBQztJQUVLLDJCQUEyQixHQUF3QjtRQUN4RCxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO1FBQzdDLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUU7UUFDN0MsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRTtRQUM1QyxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFO1FBQzdDLEVBQUUsSUFBSSxFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFBRSxTQUFT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SSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ25CLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxRQUFRLElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5RCxPQUFPLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsc0RBQXNEO0lBQ3RELHFCQUFxQixDQUFDLFlBQW9CO1FBQ3hDLE9BQU8sWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLHdDQUF3QztJQUM3RSxDQUFDO0lBRUQsb0JBQW9CO1FBQ2xCLE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBRWxELGlGQUFpRjtRQUNqRixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUN6RCxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxlQUFlLENBQ3pDLENBQUM7UUFFRixJQUFJLGFBQWEsRUFBRSxDQUFDO1lBQ2xCLE9BQU8sYUFBYSxDQUFDLEtBQUssQ0FBQztRQUM3QixDQUFDO1FBRUQsc0RBQXNEO1FBQ3RELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQzt1R0FwT1UsK0JBQStCLGtCQStGaEMsUUFBUSxhQUNSLFdBQVc7MkdBaEdWLCtCQUErQixjQUY5QixNQUFNOzsyRkFFUCwrQkFBK0I7a0JBSDNDLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzswQkFnR0ksTUFBTTsyQkFBQyxRQUFROzswQkFDZixNQUFNOzJCQUFDLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIFBMQVRGT1JNX0lEIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gXCJyeGpzXCI7XG5pbXBvcnQge1xuICBXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncyxcbiAgTW9kdWxlRGF0YU9wdGlvbnMsXG59IGZyb20gXCIuL3dlaXNzLWFjY2Vzc2liaWxpdHktY2VudGVyLmludGVyZmFjZXNcIjtcbmltcG9ydCB7IERPQ1VNRU5ULCBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gXCJAYW5ndWxhci9jb21tb25cIjtcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiBcInJvb3RcIixcbn0pXG5leHBvcnQgY2xhc3MgV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZSB7XG4gIC8vIEJyb3dzZXIgY2hlY2sgZm9yIFNTUi9jbGllbnRzaWRlIGNvbXBhdGliaWxpdHlcbiAgcHJpdmF0ZSBpc0Jyb3dzZXI6IGJvb2xlYW47XG5cbiAgcHVibGljIHdlaXNzQWNjZXNzaWJpbGl0eVRoZW1lczogTW9kdWxlRGF0YU9wdGlvbnNbXSA9IFtcbiAgICB7IG5hbWU6IFwiRGVmYXVsdCBsaWdodFwiLCB2YWx1ZTogXCJkZWZhdWx0XCIgfSxcbiAgICB7IG5hbWU6IFwiRGVmYXVsdCBkYXJrXCIsIHZhbHVlOiBcImR5bmFtaWMtZGFya1wiIH0sXG4gICAgeyBuYW1lOiBcIkhpZ2ggY29udHJhc3RcIiwgdmFsdWU6IFwiaGlnaC1jb250cmFzdFwiIH0sXG4gICAgeyBuYW1lOiBcIk1vbm9jaHJvbWVcIiwgdmFsdWU6IFwibW9ub2Nocm9tZVwiIH0sXG4gIF07XG5cbiAgcHVibGljIHdlaXNzQWNjZXNzaWJpbGl0eUZvbnRTaXplczogTW9kdWxlRGF0YU9wdGlvbnNbXSA9IFtcbiAgICB7IG5hbWU6IFwiRGVjcmVhc2UgdG8gODUlXCIsIHZhbHVlOiBcInNtYWxsZXJcIiB9LFxuICAgIHsgbmFtZTogXCJEZWZhdWx0IGF0IDEwMCVcIiwgdmFsdWU6IFwiZGVmYXVsdFwiIH0sXG4gICAgeyBuYW1lOiBcIkluY3JlYXNlIHRvIDEyNSVcIiwgdmFsdWU6IFwibGFyZ2VcIiB9LFxuICAgIHsgbmFtZTogXCJJbmNyZWFzZSB0byAxNTAlXCIsIHZhbHVlOiBcImxhcmdlclwiIH0sXG4gICAgeyBuYW1lOiBcIkluY3JlYXNlIHRvIDIwMCVcIiwgdmFsdWU6IFwibGFyZ2VzdFwiIH0sXG4gIF07XG5cbiAgcHVibGljIHdlaXNzQWNjZXNzaWJpbGl0eVNwYWNpbmc6IE1vZHVsZURhdGFPcHRpb25zW10gPSBbXG4gICAgeyBuYW1lOiBcIkNvbXBhY3Qgc3BhY2luZ1wiLCB2YWx1ZTogXCJjb21wYWN0XCIgfSxcbiAgICB7IG5hbWU6IFwiQ296eSBzcGFjaW5nXCIsIHZhbHVlOiBcImRlZmF1bHRcIiB9LFxuICAgIHsgbmFtZTogXCJDb21mb3J0IHNwYWNpbmdcIiwgdmFsdWU6IFwiY29tZm9ydFwiIH0sXG4gICAgeyBuYW1lOiBcIkV4dHJhLWNvbWZvcnQgc3BhY2luZ1wiLCB2YWx1ZTogXCJleHRyYS1jb21mb3J0XCIgfSxcbiAgXTtcblxuICBwdWJsaWMgd2Vpc3NBY2Nlc3NpYmlsaXR5TGF5b3V0czogTW9kdWxlRGF0YU9wdGlvbnNbXSA9IFtcbiAgICB7IG5hbWU6IFwiRGVmYXVsdCBsYXlvdXRcIiwgdmFsdWU6IFwiZGVmYXVsdFwiIH0sXG4gICAgeyBuYW1lOiBcIlNpbmdsZSBjb2x1bW5cIiwgdmFsdWU6IFwibW9iaWxlXCIgfSxcbiAgXTtcblxuICBwdWJsaWMgd2Vpc3NBY2Nlc3NpYmlsaXR5TGFuZ3VhZ2VzOiBNb2R1bGVEYXRhT3B0aW9uc1tdID0gW1xuICAgIHsgbmFtZTogXCLYp9mE2LnYsdio2YrYqVwiLCB2YWx1ZTogXCJhclwiIH0sXG4gICAgeyBuYW1lOiBcIuS4reaWh1wiLCB2YWx1ZTogXCJ6aC1DTlwiIH0sXG4gICAgeyBuYW1lOiBcIkVuZ2xpc2hcIiwgdmFsdWU6IFwiZW5cIiB9LFxuICAgIHsgbmFtZTogXCJFc3Bhw7FvbFwiLCB2YWx1ZTogXCJlc1wiIH0sXG4gICAgeyBuYW1lOiBcIkZyYW7Dp2Fpc1wiLCB2YWx1ZTogXCJmclwiIH0sXG4gICAgeyBuYW1lOiBcItCg0YPRgdGB0LrQuNC5XCIsIHZhbHVlOiBcInJ1XCIgfSxcbiAgXTtcblxuICBwdWJsaWMgZGVmYXVsdFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzOiBXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncyA9IHtcbiAgICBmb250U2l6ZTogXCJkZWZhdWx0XCIsXG4gICAgdGhlbWU6IFwiZGVmYXVsdFwiLFxuICAgIHNwYWNpbmc6IFwiZGVmYXVsdFwiLFxuICAgIGxhbmd1YWdlOiBcImVuXCIsXG4gICAgbGF5b3V0OiBcImRlZmF1bHRcIixcbiAgfTtcblxuICBwcml2YXRlIGRlZmF1bHRJZDogc3RyaW5nID0gJ3dlaXNzLWFjY2Vzc2liaWxpdHktY2VudGVyJztcbiAgcHJpdmF0ZSB0YXJnZXRJZFN1YmplY3QgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PHN0cmluZz4odGhpcy5kZWZhdWx0SWQpO1xuICByZWFkb25seSB0YXJnZXRJZCQgPSB0aGlzLnRhcmdldElkU3ViamVjdC5hc09ic2VydmFibGUoKTtcblxuICBzZXRUYXJnZXRJZChpZDogc3RyaW5nIHwgbnVsbCkge1xuICAgIHRoaXMudGFyZ2V0SWRTdWJqZWN0Lm5leHQoaWQgfHwgdGhpcy5kZWZhdWx0SWQpO1xuICB9XG5cbiAgLy8gQmVoYXZpb3JTdWJqZWN0IHRvIGhvbGQgYW5kIGJyb2FkY2FzdCB0aGUgY3VycmVudCBhY2Nlc3NpYmlsaXR5IHNldHRpbmdzXG4gIHByaXZhdGUgYWNjZXNzaWJpbGl0eVNldHRpbmdzU3ViamVjdDogQmVoYXZpb3JTdWJqZWN0PFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzPjtcblxuICAvLyBPYnNlcnZhYmxlIHRvIGFsbG93IGNvbXBvbmVudHMgdG8gc3Vic2NyaWJlIGFuZCByZWFjdCB0byBzZXR0aW5ncyBjaGFuZ2VzXG4gIHdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzJDogT2JzZXJ2YWJsZTxXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncz47XG5cbiAgcHJpdmF0ZSB0YXJnZXQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlciA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xuICBzaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyJCA9XG4gICAgdGhpcy5zaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyLmFzT2JzZXJ2YWJsZSgpO1xuXG4gIHRvZ2dsZVdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlcihcbiAgICB0YXJnZXRFbGVtZW50PzogSFRNTEVsZW1lbnQgfCBudWxsLFxuICAgIGZvcmNlQ2xvc2U6IGJvb2xlYW4gPSBmYWxzZVxuICApIHtcbiAgICBpZiAoZm9yY2VDbG9zZSkgdGhpcy5zaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyLm5leHQoZmFsc2UpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlci5uZXh0KFxuICAgICAgICAhdGhpcy5zaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyLnZhbHVlXG4gICAgICApO1xuXG4gICAgLy8gU3RvcmUgdGhlIHRhcmdldCBlbGVtZW50IGZvciBmb2N1cyByZXN0b3JhdGlvblxuICAgIGlmICh0YXJnZXRFbGVtZW50KSB7XG4gICAgICB0aGlzLnRhcmdldCA9XG4gICAgICAgIHRhcmdldEVsZW1lbnQuY2xvc2VzdChcImJ1dHRvbiwgW3RhYmluZGV4XVwiKSB8fCB0YXJnZXRFbGVtZW50O1xuICAgIH1cbiAgICBpZiAoIXRoaXMudGFyZ2V0KSB7XG4gICAgICB0aGlzLnRhcmdldCA9IHRoaXMuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3ZWlzcy1hMTF5LXRvZ2dsZVwiKTtcbiAgICB9XG4gICAgLy8gSWYgd2lkZ2V0IGhhcyBiZWVuIGNsb3NlZCwgcmV0dXJuIGZvY3VzIHRvIHRoZSB0aGUgdGFyZ2V0XG4gICAgaWYgKCF0aGlzLnNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIudmFsdWUpIHtcbiAgICAgIGlmICh0aGlzLnRhcmdldCkge1xuICAgICAgICB0aGlzLnRhcmdldC5mb2N1cygpO1xuICAgICAgICB0aGlzLnRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBkb2N1bWVudDogRG9jdW1lbnQsXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBPYmplY3RcbiAgKSB7XG4gICAgdGhpcy5pc0Jyb3dzZXIgPSBpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpO1xuICAgIC8vIE9uIHNlcnZpY2UgaW5pdGlhbGl6YXRpb24sIGxvYWQgc2F2ZWQgc2V0dGluZ3Mgb3IgdXNlIGRlZmF1bHQgb25lc1xuICAgIGNvbnN0IHNhdmVkU2V0dGluZ3MgPSB0aGlzLmdldFNhdmVkU2V0dGluZ3MoKTtcblxuICAgIC8vIEluaXRpYWxpemUgQmVoYXZpb3JTdWJqZWN0IHdpdGggdGhlIHNhdmVkL2RlZmF1bHQgc2V0dGluZ3NcbiAgICB0aGlzLmFjY2Vzc2liaWxpdHlTZXR0aW5nc1N1YmplY3QgPVxuICAgICAgbmV3IEJlaGF2aW9yU3ViamVjdDxXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncz4oc2F2ZWRTZXR0aW5ncyk7XG5cbiAgICAvLyBFeHBvc2UgdGhlIHN1YmplY3QgYXMgYW4gb2JzZXJ2YWJsZVxuICAgIHRoaXMud2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3MkID1cbiAgICAgIHRoaXMuYWNjZXNzaWJpbGl0eVNldHRpbmdzU3ViamVjdC5hc09ic2VydmFibGUoKTtcblxuICAgIC8vIEFwcGx5IHRoZSBsb2FkZWQgb3IgZGVmYXVsdCBzZXR0aW5ncyB0byB0aGUgZG9jdW1lbnQgcm9vdFxuICAgIHRoaXMuYXBwbHlTZXR0aW5ncyhzYXZlZFNldHRpbmdzKTtcbiAgfVxuXG4gIC8vIE1ldGhvZCB0byB1cGRhdGUgYWNjZXNzaWJpbGl0eSBzZXR0aW5ncyAocGFydGlhbGx5IG9yIGZ1bGx5KVxuICB1cGRhdGVTZXR0aW5ncyhuZXdTZXR0aW5nczogUGFydGlhbDxXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncz4pOiB2b2lkIHtcbiAgICBjb25zdCB1cGRhdGVkU2V0dGluZ3MgPSB7XG4gICAgICAuLi50aGlzLmFjY2Vzc2liaWxpdHlTZXR0aW5nc1N1YmplY3QudmFsdWUsXG4gICAgICAuLi5uZXdTZXR0aW5ncyxcbiAgICB9O1xuXG4gICAgdGhpcy5hY2Nlc3NpYmlsaXR5U2V0dGluZ3NTdWJqZWN0Lm5leHQodXBkYXRlZFNldHRpbmdzKTtcblxuICAgIGlmICh0aGlzLmlzQnJvd3Nlcikge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXG4gICAgICAgIFwid2Vpc3MtYWNjZXNzaWJpbGl0eS1zZXR0aW5nc1wiLFxuICAgICAgICBKU09OLnN0cmluZ2lmeSh1cGRhdGVkU2V0dGluZ3MpXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMuYXBwbHlTZXR0aW5ncyh1cGRhdGVkU2V0dGluZ3MpO1xuICB9XG5cbiAgLy8gTWV0aG9kIHRvIHJldHJpZXZlIHRoZSBjdXJyZW50IHNldHRpbmdzIGZyb20gdGhlIEJlaGF2aW9yU3ViamVjdFxuICBnZXRDdXJyZW50U2V0dGluZ3MoKTogV2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3Mge1xuICAgIHJldHVybiB0aGlzLmFjY2Vzc2liaWxpdHlTZXR0aW5nc1N1YmplY3QudmFsdWU7IC8vIFJldHVybnMgdGhlIGN1cnJlbnQgc2V0dGluZ3NcbiAgfVxuXG4gIC8vIE1ldGhvZCB0byBnZXQgc2F2ZWQgc2V0dGluZ3MgZnJvbSBsb2NhbFN0b3JhZ2Ugb3IgcmV0dXJuIGRlZmF1bHQgc2V0dGluZ3NcbiAgcHJpdmF0ZSBnZXRTYXZlZFNldHRpbmdzKCk6IFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzIHtcbiAgICB0aGlzLmRlZmF1bHRXZWlzc0FjY2Vzc2liaWxpdHlTZXR0aW5ncy5sYW5ndWFnZSA9XG4gICAgICB0aGlzLmdldFN1cHBvcnRlZExhbmd1YWdlKCk7XG5cbiAgICBpZiAoIXRoaXMuaXNCcm93c2VyKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZWZhdWx0V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3M7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHNhdmVkU2V0dGluZ3MgPSBKU09OLnBhcnNlKFxuICAgICAgICBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcIndlaXNzLWFjY2Vzc2liaWxpdHktc2V0dGluZ3NcIikgfHwgXCJudWxsXCJcbiAgICAgICk7XG4gICAgICByZXR1cm4gc2F2ZWRTZXR0aW5nc1xuICAgICAgICA/IHsgLi4udGhpcy5kZWZhdWx0V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3MsIC4uLnNhdmVkU2V0dGluZ3MgfVxuICAgICAgICA6IHRoaXMuZGVmYXVsdFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzO1xuICAgIH0gY2F0Y2gge1xuICAgICAgcmV0dXJuIHRoaXMuZGVmYXVsdFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzO1xuICAgIH1cbiAgfVxuXG4gIC8vIE1ldGhvZCB0byBhcHBseSB0aGUgYWNjZXNzaWJpbGl0eSBzZXR0aW5ncyB0byB0aGUgcm9vdCBlbGVtZW50IChIVE1MKVxuICBwcml2YXRlIGFwcGx5U2V0dGluZ3Moc2V0dGluZ3M6IFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzKTogdm9pZCB7XG4gICAgY29uc3Qgcm9vdCA9IHRoaXMuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50OyAvLyBHZXQgdGhlIHJvb3QgSFRNTCBlbGVtZW50XG5cbiAgICAvLyBBcHBseSBmb250IHNpemUsIHRoZW1lLCBzcGFjaW5nLCBhbmQgbGFuZ3VhZ2Ugc2V0dGluZ3MgYXMgYXR0cmlidXRlc1xuICAgIHJvb3Quc2V0QXR0cmlidXRlKFwiZGF0YS13ZWlzcy1hY2Nlc3NpYmlsaXR5LWZvbnQtc2l6ZVwiLCBzZXR0aW5ncy5mb250U2l6ZSk7XG4gICAgcm9vdC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXdlaXNzLWFjY2Vzc2liaWxpdHktdGhlbWVcIiwgc2V0dGluZ3MudGhlbWUpO1xuICAgIHJvb3Quc2V0QXR0cmlidXRlKFwiZGF0YS13ZWlzcy1hY2Nlc3NpYmlsaXR5LXNwYWNpbmdcIiwgc2V0dGluZ3Muc3BhY2luZyk7XG4gICAgcm9vdC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXdlaXNzLWFjY2Vzc2liaWxpdHktbGFuZ3VhZ2VcIiwgc2V0dGluZ3MubGFuZ3VhZ2UpO1xuICAgIHJvb3Quc2V0QXR0cmlidXRlKFwiZGF0YS13ZWlzcy1hY2Nlc3NpYmlsaXR5LWxheW91dFwiLCBzZXR0aW5ncy5sYXlvdXQpO1xuICAgIHJvb3Quc2V0QXR0cmlidXRlKFwibGFuZ1wiLCBzZXR0aW5ncy5sYW5ndWFnZSk7XG5cbiAgICAvLyBJZiB0aGUgbGFuZ3VhZ2UgaXMgQXJhYmljICgnYXInKSwgc2V0IHRoZSBkaXJlY3Rpb24gdG8gUlRMIChSaWdodC10by1MZWZ0KVxuICAgIGlmIChzZXR0aW5ncy5sYW5ndWFnZSA9PT0gXCJhclwiKSB7XG4gICAgICByb290LnNldEF0dHJpYnV0ZShcImRpclwiLCBcInJ0bFwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcm9vdC5zZXRBdHRyaWJ1dGUoXCJkaXJcIiwgXCJcIik7IC8vIE90aGVyd2lzZSwgcmVzZXQgZGlyZWN0aW9uIHRvIExUUiAoTGVmdC10by1SaWdodClcbiAgICB9XG4gIH1cblxuICAvLyBNZXRob2QgdG8gcmVzZXQgc2V0dGluZ3MgdG8gZGVmYXVsdCB2YWx1ZXMsIG9yIG9wdGlvbmFsbHkgb25seSBzcGVjaWZpZWQgc2V0dGluZ3NcbiAgcmVzZXRTZXR0aW5ncyhvbmx5VGhlc2U6IEFycmF5PGtleW9mIFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzPiA9IFtdKTogdm9pZCB7XG4gICAgY29uc29sZS5sb2coXCJSZXNldHRpbmc6IFwiICsgb25seVRoZXNlKTtcbiAgICAvLyBJZiBubyBzcGVjaWZpYyBzZXR0aW5ncyB3ZXJlIHByb3ZpZGVkLCByZXNldCBhbGwgc2V0dGluZ3MgdG8gZGVmYXVsdFxuICAgIGlmIChvbmx5VGhlc2UubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLnVwZGF0ZVNldHRpbmdzKHRoaXMuZGVmYXVsdFdlaXNzQWNjZXNzaWJpbGl0eVNldHRpbmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gT3RoZXJ3aXNlLCBvbmx5IHJlc2V0IHRoZSBzcGVjaWZpZWQgc2V0dGluZ3MgdG8gdGhlaXIgZGVmYXVsdCB2YWx1ZXNcbiAgICAgIGNvbnN0IHJlc2V0U2V0dGluZ3M6IFBhcnRpYWw8V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3M+ID0ge307XG5cbiAgICAgIC8vIExvb3AgdGhyb3VnaCB0aGUgc3BlY2lmaWVkIHNldHRpbmdzIGFuZCBzZXQgdGhlbSB0byB0aGVpciBkZWZhdWx0IHZhbHVlc1xuICAgICAgb25seVRoZXNlLmZvckVhY2goKHNldHRpbmcpID0+IHtcbiAgICAgICAgcmVzZXRTZXR0aW5nc1tzZXR0aW5nXSA9XG4gICAgICAgICAgdGhpcy5kZWZhdWx0V2Vpc3NBY2Nlc3NpYmlsaXR5U2V0dGluZ3Nbc2V0dGluZ107XG4gICAgICB9KTtcblxuICAgICAgLy8gVXBkYXRlIHRoZSBzZXR0aW5ncyB3aXRoIHRoZSByZXNldCB2YWx1ZXNcbiAgICAgIHRoaXMudXBkYXRlU2V0dGluZ3MocmVzZXRTZXR0aW5ncyk7XG4gICAgfVxuICB9XG5cbiAgZ2V0QnJvd3Nlckxhbmd1YWdlKCk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuaXNCcm93c2VyKSB7XG4gICAgICBjb25zdCBsYW5ndWFnZSA9IG5hdmlnYXRvci5sYW5ndWFnZSB8fCBuYXZpZ2F0b3IubGFuZ3VhZ2VzWzBdO1xuICAgICAgcmV0dXJuIHRoaXMubm9ybWFsaXplTGFuZ3VhZ2VDb2RlKGxhbmd1YWdlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gXCJlblwiO1xuICB9XG5cbiAgLy8gTm9ybWFsaXplIHRoZSBsYW5ndWFnZSBjb2RlIChlLmcuLCBcImVuLVVTXCIgLT4gXCJlblwiKVxuICBub3JtYWxpemVMYW5ndWFnZUNvZGUobGFuZ3VhZ2VDb2RlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBsYW5ndWFnZUNvZGUuc3BsaXQoXCItXCIpWzBdOyAvLyBTcGxpdCBieSBcIi1cIiBhbmQgcmV0dXJuIHRoZSBiYXNlIGNvZGVcbiAgfVxuXG4gIGdldFN1cHBvcnRlZExhbmd1YWdlKCk6IHN0cmluZyB7XG4gICAgY29uc3QgYnJvd3Nlckxhbmd1YWdlID0gdGhpcy5nZXRCcm93c2VyTGFuZ3VhZ2UoKTtcblxuICAgIC8vIENoZWNrIGlmIHRoZSBub3JtYWxpemVkIGJyb3dzZXIgbGFuZ3VhZ2UgZXhpc3RzIGluIHdlaXNzQWNjZXNzaWJpbGl0eUxhbmd1YWdlc1xuICAgIGNvbnN0IGZvdW5kTGFuZ3VhZ2UgPSB0aGlzLndlaXNzQWNjZXNzaWJpbGl0eUxhbmd1YWdlcy5maW5kKFxuICAgICAgKGxhbmcpID0+IGxhbmcudmFsdWUgPT09IGJyb3dzZXJMYW5ndWFnZVxuICAgICk7XG5cbiAgICBpZiAoZm91bmRMYW5ndWFnZSkge1xuICAgICAgcmV0dXJuIGZvdW5kTGFuZ3VhZ2UudmFsdWU7XG4gICAgfVxuXG4gICAgLy8gRmFsbGJhY2sgdG8gYSBkZWZhdWx0IGxhbmd1YWdlIGlmIG5vIG1hdGNoIGlzIGZvdW5kXG4gICAgcmV0dXJuIFwiZW5cIjtcbiAgfVxufVxuIl19