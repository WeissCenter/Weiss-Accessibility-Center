import * as i0 from '@angular/core';
import { PLATFORM_ID, Injectable, Inject, EventEmitter, Component, ViewEncapsulation, Input, Output, ViewChild, ViewChildren, ElementRef, HostListener, Directive, NgModule } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil, Subscription } from 'rxjs';
import * as i2 from '@angular/common';
import { isPlatformBrowser, DOCUMENT, CommonModule, AsyncPipe } from '@angular/common';
import * as i3 from '@angular/forms';
import { FormsModule } from '@angular/forms';

class WeissAccessibilityCenterService {
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

function createAccessibilityOptions(service) {
    return {
        displayType: 'panel',
        overlay: true,
        position: 'end',
        include: ['fontSize', 'theme', 'spacing', 'layout'],
        title: 'Accessibility settings',
        description: 'Adjust the settings below to customize the appearance of this website.',
        multiSelectableAccordions: false,
        fontSize: {
            title: 'Text size',
            description: 'The text-size setting allows you to adjust how big or small the words appear on the screen.',
            data: service.weissAccessibilityFontSizes,
        },
        theme: {
            title: 'Color theme',
            description: 'The color theme setting allows you to adjust the color scheme of the website.',
            data: service.weissAccessibilityThemes,
        },
        spacing: {
            title: 'Spacing',
            description: 'The spacing setting lets you adjust the distance between elements on the page.',
            data: service.weissAccessibilitySpacing,
        },
        layout: {
            title: 'Layout',
            description: 'The layout setting allows you to change how content is arranged on the screen.',
            data: service.weissAccessibilityLayouts,
        },
    };
}

class StripComponent {
    weissAccessibilityCenterService;
    data;
    statusMessageChange = new EventEmitter();
    moduleKeys = [];
    selectedModule = undefined;
    dynamicTabIndex = 3;
    closeSelectionPanel = false;
    showSelectionPanel = false;
    toggleModule(item) {
        // Open selection panel if not already open
        // Close selection panel if open and selected module is already open
        // Otherwise, leave panel open and update selected module
        if (!this.showSelectionPanel) {
            this.showSelectionPanel = true;
        }
        else if (this.selectedModule === item) {
            this.showSelectionPanel = false;
        }
        this.selectedModule = item;
    }
    get dynamicTabIndexValue() {
        let tabIndex = -1;
        if (this.selectedModule === 'fontSize') {
            tabIndex = 3;
        }
        else if (this.selectedModule === 'spacing') {
            tabIndex = 5;
        }
        else if (this.selectedModule === 'theme') {
            tabIndex = 7;
        }
        else if (this.selectedModule === 'layout') {
            tabIndex = 9;
        }
        return tabIndex;
    }
    constructor(weissAccessibilityCenterService) {
        this.weissAccessibilityCenterService = weissAccessibilityCenterService;
    }
    close() {
        this.weissAccessibilityCenterService.toggleWeissAccessibilityCenter(null, true);
    }
    onSettingsChange(module, value) {
        // Create an object with the dynamic key and updated value
        const updatedSettings = { [module]: value };
        // Call the service to update the settings with the dynamic key
        this.weissAccessibilityCenterService.updateSettings(updatedSettings);
    }
    ngOnInit() {
        if (this.data) {
            console.log(this.data);
            this.moduleKeys = Object.keys(this.data.modules);
        }
    }
    ngOnChanges(changes) {
        if (changes['closeSelectionPanel'] &&
            changes['closeSelectionPanel'].currentValue === true) {
            this.showSelectionPanel = false;
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: StripComponent, deps: [{ token: WeissAccessibilityCenterService }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.8", type: StripComponent, selector: "weiss-accessibility-strip", inputs: { data: "data", closeSelectionPanel: "closeSelectionPanel" }, outputs: { statusMessageChange: "statusMessageChange" }, usesOnChanges: true, ngImport: i0, template: "<section class=\"weiss-accessibility-center-strip-wrapper\" aria-labelledby=\"accessibilityCenterTitle\"\n    [ngClass]=\"{'weiss-accessibility-center-strip--right': data?.position === 'end' || data?.position === 'right', 'weiss-accessibility-center-strip--left': data?.position === 'start' || data?.position === 'left'}\">\n    <div class=\"weiss-accessibility-center-strip\">\n        <h2 id=\"accessibilityCenterTitle\" class=\"visually-hidden\">{{data?.title}}</h2>\n        <button tabindex=\"1\" #closeButton aria-controls=\"accessibilityCenter\" type=\"button\"\n            style=\"flex-direction: column;top:var(--usa-spacing-1)\" class=\"usa-button padding-1 usa-button--unstyled \"\n            (click)=\"close()\">\n            <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"icon icon-tabler icon-tabler-x\" width=\"24\" height=\"24\"\n                viewBox=\"0 0 24 24\" stroke-width=\"3\" style=\"width:var(--usa-spacing-3);height:var(--usa-spacing-3)\"\n                stroke=\"currentColor\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n                <path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\" />\n                <path d=\"M18 6l-12 12\" />\n                <path d=\"M6 6l12 12\" />\n            </svg>\n            Close\n        </button>\n        <div class=\"content\">\n            <button type=\"button\" tabindex=\"2\"\n                [ngClass]=\"{'bg-a11y-active': (weissAccessibilityCenterService.weissAccessibilitySettings$ | async)?.fontSize !== 'default'}\"\n                style=\"flex-direction: column;\"\n                class=\"usa-button padding-y-105 padding-x-105 usa-button--unstyled width-full\"\n                *ngIf=\"data?.modules?.fontSize\" \n                (click)=\"toggleModule('fontSize')\"\n                aria-describedby=\"fontSizeDescriptor\">\n                <span class=\"display-inline-block\">\n                    <svg aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"\n                        class=\"icon icon-tabler icon-tabler-text-size\" width=\"24\" height=\"24\"\n                        style=\"--usa-button-icon-size:var(--usa-spacing-4)\" viewBox=\"0 0 24 24\" stroke-width=\"2.25\"\n                        stroke=\"currentColor\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n                        <path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\" />\n                        <path d=\"M3 7v-2h13v2\" />\n                        <path d=\"M10 5v14\" />\n                        <path d=\"M12 19h-4\" />\n                        <path d=\"M15 13v-1h6v1\" />\n                        <path d=\"M18 12v7\" />\n                        <path d=\"M17 19h2\" />\n                    </svg>\n                </span>\n                {{data?.modules?.fontSize?.title}}\n            </button>\n            <span class=\"visually-hidden\" id=\"fontSizeDescriptor\">{{data?.modules?.fontSize?.description}}</span>\n\n\n            <button type=\"button\" tabindex=\"4\"\n            (click)=\"toggleModule('spacing')\"\n                [ngClass]=\"{'bg-a11y-active': (weissAccessibilityCenterService.weissAccessibilitySettings$ | async)?.spacing !== 'default'}\"\n                style=\"flex-direction: column;\"\n                class=\"usa-button padding-y-105 padding-x-105 usa-button--unstyled width-full\"\n                *ngIf=\"data?.modules?.spacing\" aria-describedby=\"spacingDescriptor\">\n                <span class=\"display-inline-block\">\n                    <svg aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"\n                        class=\"icon icon-tabler icon-tabler-text-size\" width=\"24\" height=\"24\"\n                        style=\"--usa-button-icon-size:var(--usa-spacing-4)\" viewBox=\"0 0 24 24\" stroke-width=\"2.25\"\n                        stroke=\"currentColor\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n                        <path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\" />\n                        <path d=\"M8 7l4 -4l4 4\" />\n                        <path d=\"M8 17l4 4l4 -4\" />\n                        <path d=\"M12 3l0 18\" />\n                    </svg>\n                </span>\n                {{data?.modules?.spacing?.title}}\n            </button>\n            <span class=\"visually-hidden\" id=\"spacingDescriptor\">{{data?.modules?.spacing?.description}}</span>\n\n            <button type=\"button\" tabindex=\"6\"\n            (click)=\"toggleModule('theme')\"\n                [ngClass]=\"{'bg-a11y-active': (weissAccessibilityCenterService.weissAccessibilitySettings$ | async)?.theme !== 'default'}\"\n                style=\"flex-direction: column;\"\n                class=\"usa-button padding-y-105 padding-x-105 usa-button--unstyled width-full\"\n                *ngIf=\"data?.modules?.theme\" aria-describedby=\"themeDescriptor\">\n                <span class=\"display-inline-block\">\n                    <svg aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"\n                        class=\"icon icon-tabler icon-tabler-text-size\" width=\"24\" height=\"24\"\n                        style=\"--usa-button-icon-size:var(--usa-spacing-4)\" viewBox=\"0 0 24 24\" stroke-width=\"2\"\n                        stroke=\"currentColor\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n                        <path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\" />\n                        <path d=\"M19 3h-4a2 2 0 0 0 -2 2v12a4 4 0 0 0 8 0v-12a2 2 0 0 0 -2 -2\" />\n                        <path d=\"M13 7.35l-2 -2a2 2 0 0 0 -2.828 0l-2.828 2.828a2 2 0 0 0 0 2.828l9 9\" />\n                        <path d=\"M7.3 13h-2.3a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h12\" />\n                        <path d=\"M17 17l0 .01\" />\n                    </svg>\n                </span>\n                {{data?.modules?.theme?.title}}\n            </button>\n            <span class=\"visually-hidden\" id=\"themeDescriptor\">{{data?.modules?.theme?.description}}</span>\n\n            <button type=\"button\" tabindex=\"8\"\n            (click)=\"toggleModule('layout')\"\n                [ngClass]=\"{'bg-a11y-active': (weissAccessibilityCenterService.weissAccessibilitySettings$ | async)?.layout !== 'default'}\"\n                style=\"flex-direction: column;\"\n                class=\"usa-button padding-y-105 padding-x-105 usa-button--unstyled width-full\"\n                *ngIf=\"data?.modules?.layout\" aria-describedby=\"layoutDescriptor\">\n                <span class=\"display-inline-block\">\n                    <svg aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"\n                        class=\"icon icon-tabler icon-tabler-text-size\" width=\"24\" height=\"24\"\n                        style=\"--usa-button-icon-size:var(--usa-spacing-4)\" viewBox=\"0 0 24 24\" stroke-width=\"2\"\n                        stroke=\"currentColor\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n                        <path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\" />\n                        <path d=\"M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z\" />\n                        <path d=\"M12 4l0 16\" />\n                    </svg>\n                </span>\n                {{data?.modules?.layout?.title}}\n            </button>\n            <span class=\"visually-hidden\" id=\"layoutDescriptor\">{{data?.modules?.layout?.description}}</span>\n        </div>\n        <button type=\"button\" style=\"flex-direction: column;\"\n            class=\"usa-button padding-y-105 padding-x-205 usa-button--unstyled width-full\" tabindex=\"10\"\n            (click)=\"weissAccessibilityCenterService.resetSettings(moduleKeys);statusMessageChange.emit('Setting reset has been applied')\">Reset</button>\n\n    </div>\n    <div class=\"weiss-accessibility-center-strip-selection-panel\" *ngIf=\"showSelectionPanel\">\n        <form>\n            <ng-container *ngFor=\"let module of moduleKeys\" >\n                <fieldset class=\"usa-fieldset usa-prose display-flex flex-column gap-05 usa-prose\" *ngIf=\"selectedModule === module\">\n                    <legend class=\"usa-legend margin-top-0 margin-bottom-2\">\n                        {{data?.modules?.[module]?.description}}\n                    </legend>\n                    <div class=\"usa-radio margin-top-0\" *ngFor=\"let item of data?.modules?.[module]?.data\">\n                        <input [tabIndex]=\"dynamicTabIndexValue\" class=\"usa-radio__input usa-radio__input--tile\"\n                            id=\"accessibility-{{module}}-{{item.value}}\" type=\"radio\" name=\"accessibility-{{module}}\"\n                            [ngModel]=\"(weissAccessibilityCenterService.weissAccessibilitySettings$ | async)?.[module]\"\n                            (ngModelChange)=\"onSettingsChange(module, $event)\" [value]=\"item.value\" />\n                        <label class=\"usa-radio__label\"\n                            for=\"accessibility-{{module}}-{{item.value}}\">{{item.name}}</label>\n                    </div>\n                </fieldset>\n            </ng-container>\n        </form>\n    </div>\n</section>", styles: [":root{--weiss-accessibility-center-strip-background: var(--usa-primary-dark);--weiss-accessibility-strip-border-width: var(--usa-spacing-2px);--weiss-accessibility-strip-border-color: var(--usa-primary-darkest);--weiss-accessibility-center-strip-selection-background: var(--usa-white)}.weiss-accessibility-center-strip-wrapper{top:0;position:fixed;height:100dvh;min-height:100dvh;z-index:999;display:flex;max-width:100vw}.weiss-accessibility-center-strip-wrapper.weiss-accessibility-center-strip--left{left:0}.weiss-accessibility-center-strip-wrapper.weiss-accessibility-center-strip--left .weiss-accessibility-center-strip-selection-panel,.weiss-accessibility-center-strip-wrapper.weiss-accessibility-center-strip--left .weiss-accessibility-center-strip{border-right:var(--weiss-accessibility-strip-border-width) solid var(--weiss-accessibility-strip-border-color)}.weiss-accessibility-center-strip-wrapper.weiss-accessibility-center-strip--right{right:0;flex-direction:row-reverse}.weiss-accessibility-center-strip-wrapper.weiss-accessibility-center-strip--right .weiss-accessibility-center-strip-selection-panel,.weiss-accessibility-center-strip-wrapper.weiss-accessibility-center-strip--right .weiss-accessibility-center-strip{border-left:var(--weiss-accessibility-strip-border-width) solid var(--weiss-accessibility-strip-border-color)}.weiss-accessibility-center-strip{display:flex;flex-direction:column;min-width:calc(var(--usa-spacing-10) + var(--usa-spacing-3));justify-content:space-between;align-items:center;height:100%;overflow:hidden;background:var(--weiss-accessibility-center-strip-background);gap:var(--usa-spacing-05);padding:0 var(--usa-spacing-05);transition:max-width .25s ease-in,min-width .25s ease-in;will-change:visibility,max-width,min-width;position:relative;--usa-button-font-size: var(--usa-font-size-2xs);--usa-button-gap: var(--usa-spacing-0);--usa-link-color: var(--usa-white);--usa-link-visited-color: var(--usa-white);--usa-link-active-color: var(--usa-white);--usa-link-hover-color: var(--usa-primary-lighter);--usa-button-outline-offset: calc(var(--usa-focus-width) * -1)}.weiss-accessibility-center-strip .content{display:flex;flex-direction:column;justify-content:center;align-items:stretch;width:100%;height:100%;gap:var(--usa-spacing-05);padding:0;list-style:none}.weiss-accessibility-center-strip button.usa-button{text-align:center}.weiss-accessibility-center-strip button.usa-button svg{fill:none}.weiss-accessibility-center-strip button.bg-a11y-active,.weiss-accessibility-center-strip .bg-a11y-active{background-color:var(--weiss-accessibility-center-button-open-background-color);--usa-link-color: var(--weiss-accessibility-center-button-open-color);--usa-link-hover-color: var(--weiss-accessibility-center-button-open-color);--usa-link-active-color: var(--weiss-accessibility-center-button-open-color)}.weiss-accessibility-center-strip-selection-panel{display:flex;flex-direction:column;justify-content:center;align-items:center;gap:var(--usa-spacing-05);padding:var(--usa-spacing-05) var(--usa-spacing-105);background:var(--weiss-accessibility-center-strip-selection-background);width:100%;max-width:var(--usa-spacing-mobile);height:100%}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i3.RadioControlValueAccessor, selector: "input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]", inputs: ["name", "formControlName", "value"] }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i3.NgForm, selector: "form:not([ngNoForm]):not([formGroup]),ng-form,[ngForm]", inputs: ["ngFormOptions"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "pipe", type: i2.AsyncPipe, name: "async" }], encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: StripComponent, decorators: [{
            type: Component,
            args: [{ selector: 'weiss-accessibility-strip', encapsulation: ViewEncapsulation.None, template: "<section class=\"weiss-accessibility-center-strip-wrapper\" aria-labelledby=\"accessibilityCenterTitle\"\n    [ngClass]=\"{'weiss-accessibility-center-strip--right': data?.position === 'end' || data?.position === 'right', 'weiss-accessibility-center-strip--left': data?.position === 'start' || data?.position === 'left'}\">\n    <div class=\"weiss-accessibility-center-strip\">\n        <h2 id=\"accessibilityCenterTitle\" class=\"visually-hidden\">{{data?.title}}</h2>\n        <button tabindex=\"1\" #closeButton aria-controls=\"accessibilityCenter\" type=\"button\"\n            style=\"flex-direction: column;top:var(--usa-spacing-1)\" class=\"usa-button padding-1 usa-button--unstyled \"\n            (click)=\"close()\">\n            <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"icon icon-tabler icon-tabler-x\" width=\"24\" height=\"24\"\n                viewBox=\"0 0 24 24\" stroke-width=\"3\" style=\"width:var(--usa-spacing-3);height:var(--usa-spacing-3)\"\n                stroke=\"currentColor\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n                <path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\" />\n                <path d=\"M18 6l-12 12\" />\n                <path d=\"M6 6l12 12\" />\n            </svg>\n            Close\n        </button>\n        <div class=\"content\">\n            <button type=\"button\" tabindex=\"2\"\n                [ngClass]=\"{'bg-a11y-active': (weissAccessibilityCenterService.weissAccessibilitySettings$ | async)?.fontSize !== 'default'}\"\n                style=\"flex-direction: column;\"\n                class=\"usa-button padding-y-105 padding-x-105 usa-button--unstyled width-full\"\n                *ngIf=\"data?.modules?.fontSize\" \n                (click)=\"toggleModule('fontSize')\"\n                aria-describedby=\"fontSizeDescriptor\">\n                <span class=\"display-inline-block\">\n                    <svg aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"\n                        class=\"icon icon-tabler icon-tabler-text-size\" width=\"24\" height=\"24\"\n                        style=\"--usa-button-icon-size:var(--usa-spacing-4)\" viewBox=\"0 0 24 24\" stroke-width=\"2.25\"\n                        stroke=\"currentColor\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n                        <path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\" />\n                        <path d=\"M3 7v-2h13v2\" />\n                        <path d=\"M10 5v14\" />\n                        <path d=\"M12 19h-4\" />\n                        <path d=\"M15 13v-1h6v1\" />\n                        <path d=\"M18 12v7\" />\n                        <path d=\"M17 19h2\" />\n                    </svg>\n                </span>\n                {{data?.modules?.fontSize?.title}}\n            </button>\n            <span class=\"visually-hidden\" id=\"fontSizeDescriptor\">{{data?.modules?.fontSize?.description}}</span>\n\n\n            <button type=\"button\" tabindex=\"4\"\n            (click)=\"toggleModule('spacing')\"\n                [ngClass]=\"{'bg-a11y-active': (weissAccessibilityCenterService.weissAccessibilitySettings$ | async)?.spacing !== 'default'}\"\n                style=\"flex-direction: column;\"\n                class=\"usa-button padding-y-105 padding-x-105 usa-button--unstyled width-full\"\n                *ngIf=\"data?.modules?.spacing\" aria-describedby=\"spacingDescriptor\">\n                <span class=\"display-inline-block\">\n                    <svg aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"\n                        class=\"icon icon-tabler icon-tabler-text-size\" width=\"24\" height=\"24\"\n                        style=\"--usa-button-icon-size:var(--usa-spacing-4)\" viewBox=\"0 0 24 24\" stroke-width=\"2.25\"\n                        stroke=\"currentColor\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n                        <path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\" />\n                        <path d=\"M8 7l4 -4l4 4\" />\n                        <path d=\"M8 17l4 4l4 -4\" />\n                        <path d=\"M12 3l0 18\" />\n                    </svg>\n                </span>\n                {{data?.modules?.spacing?.title}}\n            </button>\n            <span class=\"visually-hidden\" id=\"spacingDescriptor\">{{data?.modules?.spacing?.description}}</span>\n\n            <button type=\"button\" tabindex=\"6\"\n            (click)=\"toggleModule('theme')\"\n                [ngClass]=\"{'bg-a11y-active': (weissAccessibilityCenterService.weissAccessibilitySettings$ | async)?.theme !== 'default'}\"\n                style=\"flex-direction: column;\"\n                class=\"usa-button padding-y-105 padding-x-105 usa-button--unstyled width-full\"\n                *ngIf=\"data?.modules?.theme\" aria-describedby=\"themeDescriptor\">\n                <span class=\"display-inline-block\">\n                    <svg aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"\n                        class=\"icon icon-tabler icon-tabler-text-size\" width=\"24\" height=\"24\"\n                        style=\"--usa-button-icon-size:var(--usa-spacing-4)\" viewBox=\"0 0 24 24\" stroke-width=\"2\"\n                        stroke=\"currentColor\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n                        <path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\" />\n                        <path d=\"M19 3h-4a2 2 0 0 0 -2 2v12a4 4 0 0 0 8 0v-12a2 2 0 0 0 -2 -2\" />\n                        <path d=\"M13 7.35l-2 -2a2 2 0 0 0 -2.828 0l-2.828 2.828a2 2 0 0 0 0 2.828l9 9\" />\n                        <path d=\"M7.3 13h-2.3a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h12\" />\n                        <path d=\"M17 17l0 .01\" />\n                    </svg>\n                </span>\n                {{data?.modules?.theme?.title}}\n            </button>\n            <span class=\"visually-hidden\" id=\"themeDescriptor\">{{data?.modules?.theme?.description}}</span>\n\n            <button type=\"button\" tabindex=\"8\"\n            (click)=\"toggleModule('layout')\"\n                [ngClass]=\"{'bg-a11y-active': (weissAccessibilityCenterService.weissAccessibilitySettings$ | async)?.layout !== 'default'}\"\n                style=\"flex-direction: column;\"\n                class=\"usa-button padding-y-105 padding-x-105 usa-button--unstyled width-full\"\n                *ngIf=\"data?.modules?.layout\" aria-describedby=\"layoutDescriptor\">\n                <span class=\"display-inline-block\">\n                    <svg aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"\n                        class=\"icon icon-tabler icon-tabler-text-size\" width=\"24\" height=\"24\"\n                        style=\"--usa-button-icon-size:var(--usa-spacing-4)\" viewBox=\"0 0 24 24\" stroke-width=\"2\"\n                        stroke=\"currentColor\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n                        <path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\" />\n                        <path d=\"M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z\" />\n                        <path d=\"M12 4l0 16\" />\n                    </svg>\n                </span>\n                {{data?.modules?.layout?.title}}\n            </button>\n            <span class=\"visually-hidden\" id=\"layoutDescriptor\">{{data?.modules?.layout?.description}}</span>\n        </div>\n        <button type=\"button\" style=\"flex-direction: column;\"\n            class=\"usa-button padding-y-105 padding-x-205 usa-button--unstyled width-full\" tabindex=\"10\"\n            (click)=\"weissAccessibilityCenterService.resetSettings(moduleKeys);statusMessageChange.emit('Setting reset has been applied')\">Reset</button>\n\n    </div>\n    <div class=\"weiss-accessibility-center-strip-selection-panel\" *ngIf=\"showSelectionPanel\">\n        <form>\n            <ng-container *ngFor=\"let module of moduleKeys\" >\n                <fieldset class=\"usa-fieldset usa-prose display-flex flex-column gap-05 usa-prose\" *ngIf=\"selectedModule === module\">\n                    <legend class=\"usa-legend margin-top-0 margin-bottom-2\">\n                        {{data?.modules?.[module]?.description}}\n                    </legend>\n                    <div class=\"usa-radio margin-top-0\" *ngFor=\"let item of data?.modules?.[module]?.data\">\n                        <input [tabIndex]=\"dynamicTabIndexValue\" class=\"usa-radio__input usa-radio__input--tile\"\n                            id=\"accessibility-{{module}}-{{item.value}}\" type=\"radio\" name=\"accessibility-{{module}}\"\n                            [ngModel]=\"(weissAccessibilityCenterService.weissAccessibilitySettings$ | async)?.[module]\"\n                            (ngModelChange)=\"onSettingsChange(module, $event)\" [value]=\"item.value\" />\n                        <label class=\"usa-radio__label\"\n                            for=\"accessibility-{{module}}-{{item.value}}\">{{item.name}}</label>\n                    </div>\n                </fieldset>\n            </ng-container>\n        </form>\n    </div>\n</section>", styles: [":root{--weiss-accessibility-center-strip-background: var(--usa-primary-dark);--weiss-accessibility-strip-border-width: var(--usa-spacing-2px);--weiss-accessibility-strip-border-color: var(--usa-primary-darkest);--weiss-accessibility-center-strip-selection-background: var(--usa-white)}.weiss-accessibility-center-strip-wrapper{top:0;position:fixed;height:100dvh;min-height:100dvh;z-index:999;display:flex;max-width:100vw}.weiss-accessibility-center-strip-wrapper.weiss-accessibility-center-strip--left{left:0}.weiss-accessibility-center-strip-wrapper.weiss-accessibility-center-strip--left .weiss-accessibility-center-strip-selection-panel,.weiss-accessibility-center-strip-wrapper.weiss-accessibility-center-strip--left .weiss-accessibility-center-strip{border-right:var(--weiss-accessibility-strip-border-width) solid var(--weiss-accessibility-strip-border-color)}.weiss-accessibility-center-strip-wrapper.weiss-accessibility-center-strip--right{right:0;flex-direction:row-reverse}.weiss-accessibility-center-strip-wrapper.weiss-accessibility-center-strip--right .weiss-accessibility-center-strip-selection-panel,.weiss-accessibility-center-strip-wrapper.weiss-accessibility-center-strip--right .weiss-accessibility-center-strip{border-left:var(--weiss-accessibility-strip-border-width) solid var(--weiss-accessibility-strip-border-color)}.weiss-accessibility-center-strip{display:flex;flex-direction:column;min-width:calc(var(--usa-spacing-10) + var(--usa-spacing-3));justify-content:space-between;align-items:center;height:100%;overflow:hidden;background:var(--weiss-accessibility-center-strip-background);gap:var(--usa-spacing-05);padding:0 var(--usa-spacing-05);transition:max-width .25s ease-in,min-width .25s ease-in;will-change:visibility,max-width,min-width;position:relative;--usa-button-font-size: var(--usa-font-size-2xs);--usa-button-gap: var(--usa-spacing-0);--usa-link-color: var(--usa-white);--usa-link-visited-color: var(--usa-white);--usa-link-active-color: var(--usa-white);--usa-link-hover-color: var(--usa-primary-lighter);--usa-button-outline-offset: calc(var(--usa-focus-width) * -1)}.weiss-accessibility-center-strip .content{display:flex;flex-direction:column;justify-content:center;align-items:stretch;width:100%;height:100%;gap:var(--usa-spacing-05);padding:0;list-style:none}.weiss-accessibility-center-strip button.usa-button{text-align:center}.weiss-accessibility-center-strip button.usa-button svg{fill:none}.weiss-accessibility-center-strip button.bg-a11y-active,.weiss-accessibility-center-strip .bg-a11y-active{background-color:var(--weiss-accessibility-center-button-open-background-color);--usa-link-color: var(--weiss-accessibility-center-button-open-color);--usa-link-hover-color: var(--weiss-accessibility-center-button-open-color);--usa-link-active-color: var(--weiss-accessibility-center-button-open-color)}.weiss-accessibility-center-strip-selection-panel{display:flex;flex-direction:column;justify-content:center;align-items:center;gap:var(--usa-spacing-05);padding:var(--usa-spacing-05) var(--usa-spacing-105);background:var(--weiss-accessibility-center-strip-selection-background);width:100%;max-width:var(--usa-spacing-mobile);height:100%}\n"] }]
        }], ctorParameters: () => [{ type: WeissAccessibilityCenterService }], propDecorators: { data: [{
                type: Input
            }], statusMessageChange: [{
                type: Output
            }], closeSelectionPanel: [{
                type: Input
            }] } });

class PanelComponent {
    weissAccessibilityCenterService;
    data;
    statusMessageChange = new EventEmitter();
    panelContent;
    accordionButtons;
    multiSelectable = false;
    ngOnChanges(changes) {
        if (changes['data'] && this.data) {
            this.multiSelectable = this.data.multiSelectableAccordions ?? false;
        }
    }
    scrollElementIntoView(element) {
        element.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }
    handleKeyboardEvent(event, sectionId) {
        // Check if the key pressed is Enter or Space
        if (event.key === "Enter" || event.key === " ") {
            // Wait for DOM update
            setTimeout(() => {
                const contentElement = document.getElementById(sectionId);
                if (contentElement && this.expand[sectionId]) {
                    this.scrollElementIntoView(contentElement);
                }
            }, 0);
        }
    }
    moduleKeys = [];
    expand = {};
    constructor(weissAccessibilityCenterService) {
        this.weissAccessibilityCenterService = weissAccessibilityCenterService;
    }
    close() {
        this.weissAccessibilityCenterService.toggleWeissAccessibilityCenter(null, true);
    }
    ngOnInit() {
        if (this.data) {
            this.multiSelectable = this.data.multiSelectableAccordions ?? false;
            this.moduleKeys = Object.keys(this.data.modules);
            this.expand = this.moduleKeys.reduce((acc, module) => {
                acc[module] = false;
                return acc;
            }, {});
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: PanelComponent, deps: [{ token: WeissAccessibilityCenterService }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.8", type: PanelComponent, selector: "weiss-accessibility-panel", inputs: { data: "data" }, outputs: { statusMessageChange: "statusMessageChange" }, viewQueries: [{ propertyName: "panelContent", first: true, predicate: ["accessibilityPanel"], descendants: true }, { propertyName: "accordionButtons", predicate: ["accordionButton"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "<section aria-labelledby=\"accessibilityCenterTitle\" class=\"weiss-accessibility-center-panel\" [ngClass]=\"{'weiss-accessibility-center-panel--right': data?.position === 'end' || data?.position === 'right', 'weiss-accessibility-center-panel--left': data?.position === 'start' || data?.position === 'left'}\">\n    <div class=\"weiss-accessibility-center-panel__header display-flex flex-column\">\n        <div class=\"display-flex flex-align-start gap-1 flex-justify\">\n            <h2 id=\"accessibilityCenterTitle\" class=\"margin-0\">\n                {{data?.title}}\n            </h2>\n            <button type=\"button\" class=\"usa-button usa-button--unstyled width-auto text-no-underline margin-left-auto\"\n                #closeButton (click)=\"close()\">\n                Close\n                <svg xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-hidden=\"true\" width=\"24\" height=\"24\"\n                    viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"\n                    stroke-linejoin=\"round\" class=\"icon icon-tabler icons-tabler-outline icon-tabler-x\">\n                    <path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\" />\n                    <path d=\"M18 6l-12 12\" />\n                    <path d=\"M6 6l12 12\" />\n                </svg>\n            </button>\n        </div>\n        <p>{{data?.description}}</p>\n    </div>\n    <div #accessibilityPanel class=\"display-flex flex-1 overflow-auto flex-column weiss-accessibility-center-panel__content\">\n        <div class=\"display-flex flex-column gap-1 usa-accordion usa-accordion--bordered\" [ngClass]=\"{'usa-accordion--multiselectable': multiSelectable}\" role=\"list\" [attr.data-allow-multiple]=\"multiSelectable ? '' : null\">\n            <span *ngIf=\"data?.modules?.fontSize\" role=\"listitem\">\n                <h3 class=\"usa-accordion__heading\">\n                    <button type=\"button\" #accordionButton class=\"usa-accordion__button display-flex flex-align-center gap-1\" \n                    aria-controls=\"accessibilityText\" [attr.aria-expanded]=\"expand['fontSize']\">\n                    <svg aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"\n                    class=\"icon\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" stroke-width=\"2.25\"\n                    stroke=\"currentColor\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n                    <path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\" />\n                    <path d=\"M3 7v-2h13v2\" />\n                    <path d=\"M10 5v14\" />\n                    <path d=\"M12 19h-4\" />\n                    <path d=\"M15 13v-1h6v1\" />\n                    <path d=\"M18 12v7\" />\n                    <path d=\"M17 19h2\" />\n                </svg>\n                        {{data?.modules?.fontSize?.title}}\n                    </button>\n                </h3>\n                <div id=\"accessibilityText\" class=\"usa-accordion__content usa-prose\" [hidden]=\"!expand['fontSize']\">\n                    <form>\n                        <fieldset class=\"usa-fieldset usa-prose display-flex flex-column gap-05 usa-prose\">\n                            <legend class=\"usa-legend margin-top-0 margin-bottom-2\">\n                                {{data?.modules?.fontSize?.description}}\n                            </legend>\n                            <div class=\"usa-radio margin-top-0\" *ngFor=\"let item of data?.modules?.fontSize?.data\">\n                                <input class=\"usa-radio__input usa-radio__input--tile\"\n                                    id=\"accessibility-font-size-{{item.value}}\" type=\"radio\"\n                                    #radioInput\n                                    name=\"accessibility-font-size\"\n                                    [ngModel]=\"(weissAccessibilityCenterService.weissAccessibilitySettings$ | async)?.fontSize\"\n                                    (ngModelChange)=\"weissAccessibilityCenterService.updateSettings({ fontSize: $event })\"\n                                    [value]=\"item.value\" />\n                                <label class=\"usa-radio__label\"\n                                    for=\"accessibility-font-size-{{item.value}}\">{{item.name}}</label>\n                            </div>\n                        </fieldset>\n                    </form>\n                </div>\n            </span>\n            <span *ngIf=\"data?.modules?.spacing\" role=\"listitem\">\n                <h3 class=\"usa-accordion__heading\">\n                    <button type=\"button\" #accordionButton class=\"usa-accordion__button display-flex flex-align-center gap-1\" \n                    aria-controls=\"accessibilitySpacing\" [attr.aria-expanded]=\"expand['spacing']\">\n                    <svg  xmlns=\"http://www.w3.org/2000/svg\"  width=\"24\"  height=\"24\"  viewBox=\"0 0 24 24\"  fill=\"none\"  stroke=\"currentColor\"  stroke-width=\"2\"  stroke-linecap=\"round\"  stroke-linejoin=\"round\"  class=\"icon\"><path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M8 7l4 -4l4 4\" /><path d=\"M8 17l4 4l4 -4\" /><path d=\"M12 3l0 18\" /></svg>\n                        {{data?.modules?.spacing?.title}}\n                    </button>\n                </h3>\n                <div id=\"accessibilitySpacing\" class=\"usa-accordion__content usa-prose\" [hidden]=\"!expand['spacing']\">\n                    <form>\n                        <fieldset class=\"usa-fieldset usa-prose display-flex flex-column gap-05 usa-prose\">\n                            <legend class=\"usa-legend margin-top-0 margin-bottom-2\">\n                                {{data?.modules?.spacing?.description}}\n                            </legend>\n                            <div class=\"usa-radio margin-top-0\" *ngFor=\"let item of data?.modules?.spacing?.data\">\n                                <input class=\"usa-radio__input usa-radio__input--tile\"\n                                    id=\"accessibility-spacing-{{item.value}}\" type=\"radio\"\n                                    #radioInput\n                                    name=\"accessibility-spacing\"\n                                    [ngModel]=\"(weissAccessibilityCenterService.weissAccessibilitySettings$ | async)?.spacing\"\n                                    (ngModelChange)=\"weissAccessibilityCenterService.updateSettings({ spacing: $event })\"\n                                    [value]=\"item.value\" />\n                                <label class=\"usa-radio__label\"\n                                    for=\"accessibility-spacing-{{item.value}}\">{{item.name}}</label>\n                            </div>\n                        </fieldset>\n                    </form>\n                </div>\n            </span>\n            <span *ngIf=\"data?.modules?.theme\" role=\"listitem\">\n                <h3 class=\"usa-accordion__heading\">\n                    <button type=\"button\" #accordionButton class=\"usa-accordion__button display-flex flex-align-center gap-1\" aria-controls=\"accessibilityTheme\" [attr.aria-expanded]=\"expand['theme']\">\n                    <svg aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"\n                    class=\"icon\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" stroke-width=\"2.25\"\n                    stroke=\"currentColor\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M19 3h-4a2 2 0 0 0 -2 2v12a4 4 0 0 0 8 0v-12a2 2 0 0 0 -2 -2\" /><path d=\"M13 7.35l-2 -2a2 2 0 0 0 -2.828 0l-2.828 2.828a2 2 0 0 0 0 2.828l9 9\" /><path d=\"M7.3 13h-2.3a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h12\" /><path d=\"M17 17l0 .01\" /></svg>\n                        {{data?.modules?.theme?.title}}\n                    </button>\n                </h3>\n                <div id=\"accessibilityTheme\" [hidden]=\"!expand['theme']\" class=\"usa-accordion__content usa-prose\">\n                    <form>\n                        <fieldset class=\"usa-fieldset usa-prose display-flex flex-column gap-05 usa-prose\">\n                            <legend class=\"usa-legend margin-top-0 margin-bottom-2\">\n                                {{data?.modules?.theme?.description}}\n                            </legend>\n                            <div class=\"usa-radio margin-top-0\" *ngFor=\"let item of data?.modules?.theme?.data\">\n                                <input class=\"usa-radio__input usa-radio__input--tile\"\n                                    id=\"accessibility-theme-{{item.value}}\" type=\"radio\" name=\"accessibility-theme\"\n                                    #radioInput\n                                    [ngModel]=\"(weissAccessibilityCenterService.weissAccessibilitySettings$ | async)?.theme\"\n                                    (ngModelChange)=\"weissAccessibilityCenterService.updateSettings({ theme: $event })\"\n                                    [value]=\"item.value\" />\n                                <label class=\"usa-radio__label\"\n                                    for=\"accessibility-theme-{{item.value}}\">{{item.name}}</label>\n                            </div>\n                        </fieldset>\n                    </form>\n                </div>\n            </span>\n            <span *ngIf=\"data?.modules?.layout\" role=\"listitem\">\n                <h3 class=\"usa-accordion__heading\">\n                    <button type=\"button\" #accordionButton class=\"usa-accordion__button display-flex flex-align-center gap-1\" \n                        aria-controls=\"accessibilityLayout\" [attr.aria-expanded]=\"expand['layout']\">\n                        <svg  xmlns=\"http://www.w3.org/2000/svg\"  width=\"24\"  height=\"24\"  viewBox=\"0 0 24 24\"  fill=\"none\"  stroke=\"currentColor\"  stroke-width=\"2\"  stroke-linecap=\"round\"  stroke-linejoin=\"round\"  class=\"icon\"><path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z\" /><path d=\"M12 4l0 16\" /></svg>\n                        {{data?.modules?.layout?.title}}\n                    </button>\n                </h3>\n                <div id=\"accessibilityLayout\" [hidden]=\"!expand['layout']\" class=\"usa-accordion__content usa-prose\">\n                    <form>\n                        <fieldset class=\"usa-fieldset usa-prose display-flex flex-column gap-05 usa-prose\">\n                            <legend class=\"usa-legend margin-top-0 margin-bottom-2\">\n                                {{data?.modules?.layout?.description}}\n                            </legend>\n                            <div class=\"usa-radio margin-top-0\" *ngFor=\"let item of data?.modules?.layout?.data\">\n                                <input class=\"usa-radio__input usa-radio__input--tile\"\n                                    id=\"accessibility-layout-{{item.value}}\" type=\"radio\" name=\"accessibility-layout\"\n                                    #radioInput\n                                    [ngModel]=\"(weissAccessibilityCenterService.weissAccessibilitySettings$ | async)?.layout\"\n                                    (ngModelChange)=\"weissAccessibilityCenterService.updateSettings({ layout: $event })\"\n                                    [value]=\"item.value\" />\n                                <label class=\"usa-radio__label\"\n                                    for=\"accessibility-layout-{{item.value}}\">{{item.name}}</label>\n                            </div>\n                        </fieldset>\n                    </form>\n                </div>\n            </span>\n        </div>\n    </div>\n    <div class=\"display-flex margin-top-2 gap-2 padding-x-2 padding-bottom-2\">\n        <button type=\"button\" class=\"usa-button usa-button--unstyled\"\n            (click)=\"weissAccessibilityCenterService.resetSettings(moduleKeys);statusMessageChange.emit('Options Reset')\">Reset\n            all settings</button>\n        <button type=\"button\" class=\"usa-button usa-button--unstyled\" (click)=\"close()\">Close</button>\n    </div>", styles: [":root{--weiss-accessibility-panel-background: var(--usa-base-lightest);--weiss-accessibility-panel-border-color: var(--usa-border-color-lighter);--weiss-accessibility-panel-border-width: var(--usa-spacing-1px);--weiss-accessibility-panel-border-radius: var(--usa-border-radius-lg);--weiss-accessibility-panel-shadow: var(--usa-box-shadow-2);--weiss-accessibility-panel-max-width: var(--usa-spacing-mobile);--weiss-accessibility-panel-content-gap: var(--usa-spacing-1);--weiss-accessibility-panel-content-padding-y: var(--usa-spacing-2);--weiss-accessibility-panel-content-padding-x: var(--usa-spacing-105);--weiss-accessibility-panel-header-font-size: var(--usa-h3-font-size);--weiss-accessibility-panel-header-font-weight: var(--usa-h3-font-weight);--weiss-accessibility-panel-header-line-height: var(--usa-h3-font-line-height);--weiss-accessibility-panel-content-font-size: var(--usa-body-font-size);--weiss-accessibility-panel-content-font-weight: var(--usa-body-font-weight);--weiss-accessibility-panel-content-line-height: var(--usa-body-font-line-height);--weiss-accessibility-panel-category-header-font-size: var(--usa-h4-font-size);--weiss-accessibility-panel-category-header-font-weight: var(--usa-h4-font-weight);--weiss-accessibility-panel-category-header-line-height: var(--usa-h4-font-line-height);--weiss-accessibility-panel-accent-border-color: var(--usa-gold);--weiss-accessibility-panel-accent-border-width: var(--usa-spacing-05);--weiss-accessibility-panel-content-background: var(--usa-white)}.weiss-accessibility-center-panel{position:fixed;overflow:auto;top:0;height:100vh;width:100%;max-width:var(--weiss-accessibility-panel-max-width);display:flex;flex-direction:column;gap:0px;z-index:999;background:var(--weiss-accessibility-panel-background);box-shadow:var(--weiss-accessibility-panel-shadow);--usa-accordion-padding-x: var(--weiss-accessibility-panel-content-padding-x);--usa-accordion-padding-y: var(--weiss-accessibility-panel-content-padding-y);--usa-accordion-button-padding-x: var(--usa-accordion-padding-x)}.weiss-accessibility-center-panel.weiss-accessibility-center-panel--left{left:0;border-right:var(--weiss-accessibility-panel-border-width) solid var(--weiss-accessibility-panel-border-color);border-radius:0 var(--weiss-accessibility-panel-border-radius) var(--weiss-accessibility-panel-border-radius) 0}.weiss-accessibility-center-panel.weiss-accessibility-center-panel--right{right:0;border-left:var(--weiss-accessibility-panel-border-width) solid var(--weiss-accessibility-panel-border-color);border-radius:var(--weiss-accessibility-panel-border-radius) 0 0 var(--weiss-accessibility-panel-border-radius)}.weiss-accessibility-center-panel .usa-accordion+.usa-accordion,.weiss-accessibility-center-panel .usa-accordion+.usa-accordion--bordered{margin-top:var(--usa-spacing-0)}.weiss-accessibility-center-panel .weiss-accessibility-center-panel__header{--usa-button-gap: var(--usa-spacing-2px);padding:var(--weiss-accessibility-panel-content-padding-y) var(--weiss-accessibility-panel-content-padding-x);gap:var(--usa-spacing-105)}.weiss-accessibility-center-panel .weiss-accessibility-center-panel__header h2{font-size:var(--weiss-accessibility-panel-header-font-size);font-weight:var(--weiss-accessibility-panel-header-font-weight);line-height:var(--weiss-accessibility-panel-header-line-height);padding:0}.weiss-accessibility-center-panel .weiss-accessibility-center-panel__header p{margin:0;padding:0;font-size:var(--weiss-accessibility-panel-content-font-size);font-weight:var(--weiss-accessibility-panel-content-font-weight);line-height:var(--weiss-accessibility-panel-content-line-height)}.weiss-accessibility-center-panel .weiss-accessibility-center-panel__content{padding:calc(var(--weiss-accessibility-panel-content-padding-y) + var(--weiss-accessibility-panel-accent-border-width)) var(--weiss-accessibility-panel-content-padding-x) var(--weiss-accessibility-panel-content-padding-y);gap:var(--weiss-accessibility-panel-content-gap);background:var(--weiss-accessibility-panel-content-background);border-top:var(--weiss-accessibility-panel-accent-border-width) solid var(--weiss-accessibility-panel-accent-border-color)}.weiss-accessibility-center-panel .weiss-accessibility-center-panel__content ul{gap:var(--weiss-accessibility-panel-content-gap)}.weiss-accessibility-center-panel .weiss-accessibility-center-panel__content h3{font-size:var(--weiss-accessibility-panel-category-header-font-size);font-weight:var(--weiss-accessibility-panel-category-header-font-weight);line-height:var(--weiss-accessibility-panel-category-header-line-height);padding:0}.weiss-accessibility-center-panel .weiss-accessibility-center-panel__content p{margin:0;padding:0;font-size:var(--weiss-accessibility-panel-content-font-size);font-weight:var(--weiss-accessibility-panel-content-font-weight);line-height:var(--weiss-accessibility-panel-content-line-height)}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.ɵNgNoValidate, selector: "form:not([ngNoForm]):not([ngNativeValidate])" }, { kind: "directive", type: i3.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i3.RadioControlValueAccessor, selector: "input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]", inputs: ["name", "formControlName", "value"] }, { kind: "directive", type: i3.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i3.NgControlStatusGroup, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]" }, { kind: "directive", type: i3.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "directive", type: i3.NgForm, selector: "form:not([ngNoForm]):not([formGroup]),ng-form,[ngForm]", inputs: ["ngFormOptions"], outputs: ["ngSubmit"], exportAs: ["ngForm"] }, { kind: "pipe", type: i2.AsyncPipe, name: "async" }], encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: PanelComponent, decorators: [{
            type: Component,
            args: [{ selector: "weiss-accessibility-panel", encapsulation: ViewEncapsulation.None, template: "<section aria-labelledby=\"accessibilityCenterTitle\" class=\"weiss-accessibility-center-panel\" [ngClass]=\"{'weiss-accessibility-center-panel--right': data?.position === 'end' || data?.position === 'right', 'weiss-accessibility-center-panel--left': data?.position === 'start' || data?.position === 'left'}\">\n    <div class=\"weiss-accessibility-center-panel__header display-flex flex-column\">\n        <div class=\"display-flex flex-align-start gap-1 flex-justify\">\n            <h2 id=\"accessibilityCenterTitle\" class=\"margin-0\">\n                {{data?.title}}\n            </h2>\n            <button type=\"button\" class=\"usa-button usa-button--unstyled width-auto text-no-underline margin-left-auto\"\n                #closeButton (click)=\"close()\">\n                Close\n                <svg xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-hidden=\"true\" width=\"24\" height=\"24\"\n                    viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"\n                    stroke-linejoin=\"round\" class=\"icon icon-tabler icons-tabler-outline icon-tabler-x\">\n                    <path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\" />\n                    <path d=\"M18 6l-12 12\" />\n                    <path d=\"M6 6l12 12\" />\n                </svg>\n            </button>\n        </div>\n        <p>{{data?.description}}</p>\n    </div>\n    <div #accessibilityPanel class=\"display-flex flex-1 overflow-auto flex-column weiss-accessibility-center-panel__content\">\n        <div class=\"display-flex flex-column gap-1 usa-accordion usa-accordion--bordered\" [ngClass]=\"{'usa-accordion--multiselectable': multiSelectable}\" role=\"list\" [attr.data-allow-multiple]=\"multiSelectable ? '' : null\">\n            <span *ngIf=\"data?.modules?.fontSize\" role=\"listitem\">\n                <h3 class=\"usa-accordion__heading\">\n                    <button type=\"button\" #accordionButton class=\"usa-accordion__button display-flex flex-align-center gap-1\" \n                    aria-controls=\"accessibilityText\" [attr.aria-expanded]=\"expand['fontSize']\">\n                    <svg aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"\n                    class=\"icon\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" stroke-width=\"2.25\"\n                    stroke=\"currentColor\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n                    <path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\" />\n                    <path d=\"M3 7v-2h13v2\" />\n                    <path d=\"M10 5v14\" />\n                    <path d=\"M12 19h-4\" />\n                    <path d=\"M15 13v-1h6v1\" />\n                    <path d=\"M18 12v7\" />\n                    <path d=\"M17 19h2\" />\n                </svg>\n                        {{data?.modules?.fontSize?.title}}\n                    </button>\n                </h3>\n                <div id=\"accessibilityText\" class=\"usa-accordion__content usa-prose\" [hidden]=\"!expand['fontSize']\">\n                    <form>\n                        <fieldset class=\"usa-fieldset usa-prose display-flex flex-column gap-05 usa-prose\">\n                            <legend class=\"usa-legend margin-top-0 margin-bottom-2\">\n                                {{data?.modules?.fontSize?.description}}\n                            </legend>\n                            <div class=\"usa-radio margin-top-0\" *ngFor=\"let item of data?.modules?.fontSize?.data\">\n                                <input class=\"usa-radio__input usa-radio__input--tile\"\n                                    id=\"accessibility-font-size-{{item.value}}\" type=\"radio\"\n                                    #radioInput\n                                    name=\"accessibility-font-size\"\n                                    [ngModel]=\"(weissAccessibilityCenterService.weissAccessibilitySettings$ | async)?.fontSize\"\n                                    (ngModelChange)=\"weissAccessibilityCenterService.updateSettings({ fontSize: $event })\"\n                                    [value]=\"item.value\" />\n                                <label class=\"usa-radio__label\"\n                                    for=\"accessibility-font-size-{{item.value}}\">{{item.name}}</label>\n                            </div>\n                        </fieldset>\n                    </form>\n                </div>\n            </span>\n            <span *ngIf=\"data?.modules?.spacing\" role=\"listitem\">\n                <h3 class=\"usa-accordion__heading\">\n                    <button type=\"button\" #accordionButton class=\"usa-accordion__button display-flex flex-align-center gap-1\" \n                    aria-controls=\"accessibilitySpacing\" [attr.aria-expanded]=\"expand['spacing']\">\n                    <svg  xmlns=\"http://www.w3.org/2000/svg\"  width=\"24\"  height=\"24\"  viewBox=\"0 0 24 24\"  fill=\"none\"  stroke=\"currentColor\"  stroke-width=\"2\"  stroke-linecap=\"round\"  stroke-linejoin=\"round\"  class=\"icon\"><path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M8 7l4 -4l4 4\" /><path d=\"M8 17l4 4l4 -4\" /><path d=\"M12 3l0 18\" /></svg>\n                        {{data?.modules?.spacing?.title}}\n                    </button>\n                </h3>\n                <div id=\"accessibilitySpacing\" class=\"usa-accordion__content usa-prose\" [hidden]=\"!expand['spacing']\">\n                    <form>\n                        <fieldset class=\"usa-fieldset usa-prose display-flex flex-column gap-05 usa-prose\">\n                            <legend class=\"usa-legend margin-top-0 margin-bottom-2\">\n                                {{data?.modules?.spacing?.description}}\n                            </legend>\n                            <div class=\"usa-radio margin-top-0\" *ngFor=\"let item of data?.modules?.spacing?.data\">\n                                <input class=\"usa-radio__input usa-radio__input--tile\"\n                                    id=\"accessibility-spacing-{{item.value}}\" type=\"radio\"\n                                    #radioInput\n                                    name=\"accessibility-spacing\"\n                                    [ngModel]=\"(weissAccessibilityCenterService.weissAccessibilitySettings$ | async)?.spacing\"\n                                    (ngModelChange)=\"weissAccessibilityCenterService.updateSettings({ spacing: $event })\"\n                                    [value]=\"item.value\" />\n                                <label class=\"usa-radio__label\"\n                                    for=\"accessibility-spacing-{{item.value}}\">{{item.name}}</label>\n                            </div>\n                        </fieldset>\n                    </form>\n                </div>\n            </span>\n            <span *ngIf=\"data?.modules?.theme\" role=\"listitem\">\n                <h3 class=\"usa-accordion__heading\">\n                    <button type=\"button\" #accordionButton class=\"usa-accordion__button display-flex flex-align-center gap-1\" aria-controls=\"accessibilityTheme\" [attr.aria-expanded]=\"expand['theme']\">\n                    <svg aria-hidden=\"true\" xmlns=\"http://www.w3.org/2000/svg\"\n                    class=\"icon\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" stroke-width=\"2.25\"\n                    stroke=\"currentColor\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M19 3h-4a2 2 0 0 0 -2 2v12a4 4 0 0 0 8 0v-12a2 2 0 0 0 -2 -2\" /><path d=\"M13 7.35l-2 -2a2 2 0 0 0 -2.828 0l-2.828 2.828a2 2 0 0 0 0 2.828l9 9\" /><path d=\"M7.3 13h-2.3a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h12\" /><path d=\"M17 17l0 .01\" /></svg>\n                        {{data?.modules?.theme?.title}}\n                    </button>\n                </h3>\n                <div id=\"accessibilityTheme\" [hidden]=\"!expand['theme']\" class=\"usa-accordion__content usa-prose\">\n                    <form>\n                        <fieldset class=\"usa-fieldset usa-prose display-flex flex-column gap-05 usa-prose\">\n                            <legend class=\"usa-legend margin-top-0 margin-bottom-2\">\n                                {{data?.modules?.theme?.description}}\n                            </legend>\n                            <div class=\"usa-radio margin-top-0\" *ngFor=\"let item of data?.modules?.theme?.data\">\n                                <input class=\"usa-radio__input usa-radio__input--tile\"\n                                    id=\"accessibility-theme-{{item.value}}\" type=\"radio\" name=\"accessibility-theme\"\n                                    #radioInput\n                                    [ngModel]=\"(weissAccessibilityCenterService.weissAccessibilitySettings$ | async)?.theme\"\n                                    (ngModelChange)=\"weissAccessibilityCenterService.updateSettings({ theme: $event })\"\n                                    [value]=\"item.value\" />\n                                <label class=\"usa-radio__label\"\n                                    for=\"accessibility-theme-{{item.value}}\">{{item.name}}</label>\n                            </div>\n                        </fieldset>\n                    </form>\n                </div>\n            </span>\n            <span *ngIf=\"data?.modules?.layout\" role=\"listitem\">\n                <h3 class=\"usa-accordion__heading\">\n                    <button type=\"button\" #accordionButton class=\"usa-accordion__button display-flex flex-align-center gap-1\" \n                        aria-controls=\"accessibilityLayout\" [attr.aria-expanded]=\"expand['layout']\">\n                        <svg  xmlns=\"http://www.w3.org/2000/svg\"  width=\"24\"  height=\"24\"  viewBox=\"0 0 24 24\"  fill=\"none\"  stroke=\"currentColor\"  stroke-width=\"2\"  stroke-linecap=\"round\"  stroke-linejoin=\"round\"  class=\"icon\"><path stroke=\"none\" d=\"M0 0h24v24H0z\" fill=\"none\"/><path d=\"M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z\" /><path d=\"M12 4l0 16\" /></svg>\n                        {{data?.modules?.layout?.title}}\n                    </button>\n                </h3>\n                <div id=\"accessibilityLayout\" [hidden]=\"!expand['layout']\" class=\"usa-accordion__content usa-prose\">\n                    <form>\n                        <fieldset class=\"usa-fieldset usa-prose display-flex flex-column gap-05 usa-prose\">\n                            <legend class=\"usa-legend margin-top-0 margin-bottom-2\">\n                                {{data?.modules?.layout?.description}}\n                            </legend>\n                            <div class=\"usa-radio margin-top-0\" *ngFor=\"let item of data?.modules?.layout?.data\">\n                                <input class=\"usa-radio__input usa-radio__input--tile\"\n                                    id=\"accessibility-layout-{{item.value}}\" type=\"radio\" name=\"accessibility-layout\"\n                                    #radioInput\n                                    [ngModel]=\"(weissAccessibilityCenterService.weissAccessibilitySettings$ | async)?.layout\"\n                                    (ngModelChange)=\"weissAccessibilityCenterService.updateSettings({ layout: $event })\"\n                                    [value]=\"item.value\" />\n                                <label class=\"usa-radio__label\"\n                                    for=\"accessibility-layout-{{item.value}}\">{{item.name}}</label>\n                            </div>\n                        </fieldset>\n                    </form>\n                </div>\n            </span>\n        </div>\n    </div>\n    <div class=\"display-flex margin-top-2 gap-2 padding-x-2 padding-bottom-2\">\n        <button type=\"button\" class=\"usa-button usa-button--unstyled\"\n            (click)=\"weissAccessibilityCenterService.resetSettings(moduleKeys);statusMessageChange.emit('Options Reset')\">Reset\n            all settings</button>\n        <button type=\"button\" class=\"usa-button usa-button--unstyled\" (click)=\"close()\">Close</button>\n    </div>", styles: [":root{--weiss-accessibility-panel-background: var(--usa-base-lightest);--weiss-accessibility-panel-border-color: var(--usa-border-color-lighter);--weiss-accessibility-panel-border-width: var(--usa-spacing-1px);--weiss-accessibility-panel-border-radius: var(--usa-border-radius-lg);--weiss-accessibility-panel-shadow: var(--usa-box-shadow-2);--weiss-accessibility-panel-max-width: var(--usa-spacing-mobile);--weiss-accessibility-panel-content-gap: var(--usa-spacing-1);--weiss-accessibility-panel-content-padding-y: var(--usa-spacing-2);--weiss-accessibility-panel-content-padding-x: var(--usa-spacing-105);--weiss-accessibility-panel-header-font-size: var(--usa-h3-font-size);--weiss-accessibility-panel-header-font-weight: var(--usa-h3-font-weight);--weiss-accessibility-panel-header-line-height: var(--usa-h3-font-line-height);--weiss-accessibility-panel-content-font-size: var(--usa-body-font-size);--weiss-accessibility-panel-content-font-weight: var(--usa-body-font-weight);--weiss-accessibility-panel-content-line-height: var(--usa-body-font-line-height);--weiss-accessibility-panel-category-header-font-size: var(--usa-h4-font-size);--weiss-accessibility-panel-category-header-font-weight: var(--usa-h4-font-weight);--weiss-accessibility-panel-category-header-line-height: var(--usa-h4-font-line-height);--weiss-accessibility-panel-accent-border-color: var(--usa-gold);--weiss-accessibility-panel-accent-border-width: var(--usa-spacing-05);--weiss-accessibility-panel-content-background: var(--usa-white)}.weiss-accessibility-center-panel{position:fixed;overflow:auto;top:0;height:100vh;width:100%;max-width:var(--weiss-accessibility-panel-max-width);display:flex;flex-direction:column;gap:0px;z-index:999;background:var(--weiss-accessibility-panel-background);box-shadow:var(--weiss-accessibility-panel-shadow);--usa-accordion-padding-x: var(--weiss-accessibility-panel-content-padding-x);--usa-accordion-padding-y: var(--weiss-accessibility-panel-content-padding-y);--usa-accordion-button-padding-x: var(--usa-accordion-padding-x)}.weiss-accessibility-center-panel.weiss-accessibility-center-panel--left{left:0;border-right:var(--weiss-accessibility-panel-border-width) solid var(--weiss-accessibility-panel-border-color);border-radius:0 var(--weiss-accessibility-panel-border-radius) var(--weiss-accessibility-panel-border-radius) 0}.weiss-accessibility-center-panel.weiss-accessibility-center-panel--right{right:0;border-left:var(--weiss-accessibility-panel-border-width) solid var(--weiss-accessibility-panel-border-color);border-radius:var(--weiss-accessibility-panel-border-radius) 0 0 var(--weiss-accessibility-panel-border-radius)}.weiss-accessibility-center-panel .usa-accordion+.usa-accordion,.weiss-accessibility-center-panel .usa-accordion+.usa-accordion--bordered{margin-top:var(--usa-spacing-0)}.weiss-accessibility-center-panel .weiss-accessibility-center-panel__header{--usa-button-gap: var(--usa-spacing-2px);padding:var(--weiss-accessibility-panel-content-padding-y) var(--weiss-accessibility-panel-content-padding-x);gap:var(--usa-spacing-105)}.weiss-accessibility-center-panel .weiss-accessibility-center-panel__header h2{font-size:var(--weiss-accessibility-panel-header-font-size);font-weight:var(--weiss-accessibility-panel-header-font-weight);line-height:var(--weiss-accessibility-panel-header-line-height);padding:0}.weiss-accessibility-center-panel .weiss-accessibility-center-panel__header p{margin:0;padding:0;font-size:var(--weiss-accessibility-panel-content-font-size);font-weight:var(--weiss-accessibility-panel-content-font-weight);line-height:var(--weiss-accessibility-panel-content-line-height)}.weiss-accessibility-center-panel .weiss-accessibility-center-panel__content{padding:calc(var(--weiss-accessibility-panel-content-padding-y) + var(--weiss-accessibility-panel-accent-border-width)) var(--weiss-accessibility-panel-content-padding-x) var(--weiss-accessibility-panel-content-padding-y);gap:var(--weiss-accessibility-panel-content-gap);background:var(--weiss-accessibility-panel-content-background);border-top:var(--weiss-accessibility-panel-accent-border-width) solid var(--weiss-accessibility-panel-accent-border-color)}.weiss-accessibility-center-panel .weiss-accessibility-center-panel__content ul{gap:var(--weiss-accessibility-panel-content-gap)}.weiss-accessibility-center-panel .weiss-accessibility-center-panel__content h3{font-size:var(--weiss-accessibility-panel-category-header-font-size);font-weight:var(--weiss-accessibility-panel-category-header-font-weight);line-height:var(--weiss-accessibility-panel-category-header-line-height);padding:0}.weiss-accessibility-center-panel .weiss-accessibility-center-panel__content p{margin:0;padding:0;font-size:var(--weiss-accessibility-panel-content-font-size);font-weight:var(--weiss-accessibility-panel-content-font-weight);line-height:var(--weiss-accessibility-panel-content-line-height)}\n"] }]
        }], ctorParameters: () => [{ type: WeissAccessibilityCenterService }], propDecorators: { data: [{
                type: Input
            }], statusMessageChange: [{
                type: Output
            }], panelContent: [{
                type: ViewChild,
                args: ["accessibilityPanel"]
            }], accordionButtons: [{
                type: ViewChildren,
                args: ["accordionButton"]
            }] } });

class WeissAccessibilityCenterComponent {
    weissAccessibilityCenterService;
    renderer;
    centerEl;
    options;
    title;
    description;
    displayType;
    overlay;
    position;
    modules;
    fontSize;
    theme;
    spacing;
    layout;
    multiSelectableAccordions;
    // Merged options object that will be used within the component
    currentOptions;
    showWeissAccessibilityCenter = false;
    data;
    firstFocusableElement = null;
    lastFocusableElement = null;
    focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable], li[tabindex="0"], li[tabindex="-1"], tr[tabindex="0"], tr[tabindex="-1"]';
    statusMessage = "";
    forceCloseSelectionPanel = false;
    focusTimeoutId = null;
    destroy$ = new Subject();
    constructor(weissAccessibilityCenterService, renderer) {
        this.weissAccessibilityCenterService = weissAccessibilityCenterService;
        this.renderer = renderer;
        this.currentOptions = createAccessibilityOptions(this.weissAccessibilityCenterService);
        this.setupOptions();
        this.weissAccessibilityCenterService.showWeissAccessibilityCenter$
            .pipe(takeUntil(this.destroy$))
            .subscribe((show) => {
            this.showWeissAccessibilityCenter = show;
            this.forceCloseSelectionPanel = !show;
            if (!show && this.focusTimeoutId !== null) {
                clearTimeout(this.focusTimeoutId);
                this.focusTimeoutId = null;
            }
            if (show) {
                const focusableElements = this.centerEl?.nativeElement.querySelectorAll(this.focusableElementsString);
                this.firstFocusableElement = focusableElements[0];
                this.lastFocusableElement =
                    focusableElements[focusableElements.length - 1];
                this.focusTimeoutId = window.setTimeout(() => {
                    this.firstFocusableElement?.focus();
                    this.focusTimeoutId = null;
                }, 0);
            }
        });
    }
    ngAfterViewInit() {
        // Apply id to the actual <article> after it's in the DOM
        this.weissAccessibilityCenterService.targetId$
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
            const value = id ?? 'weiss-accessibility-center';
            this.renderer.setAttribute(this.centerEl.nativeElement, 'id', value);
        });
    }
    // This method is triggered when the child component emits a new status message
    onStatusMessageChange(newMessage) {
        this.statusMessage = newMessage;
    }
    scrollElementIntoView(element) {
        element.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }
    // Close panel when user hits escape key
    // Trap focus within the accessibility center
    handleKeyboardEvent(event) {
        if (this.showWeissAccessibilityCenter) {
            const deepActiveElement = document.activeElement;
            if (event.key === "Tab") {
                if (event.shiftKey) {
                    /* shift + tab */
                    if (deepActiveElement === this.firstFocusableElement) {
                        event.preventDefault();
                        this.lastFocusableElement?.focus();
                    }
                }
                else {
                    /* tab */
                    if (deepActiveElement === this.lastFocusableElement) {
                        event.preventDefault();
                        this.firstFocusableElement?.focus();
                    }
                }
                this.scrollElementIntoView(deepActiveElement);
            }
            else if (event.key === "Escape") {
                this.weissAccessibilityCenterService.toggleWeissAccessibilityCenter(null, true);
                this.statusMessage = "Accessibility center closed";
            }
            else if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                // Wait for DOM update
                setTimeout(() => {
                    const activeElement = document.activeElement;
                    if (activeElement &&
                        this.centerEl.nativeElement.contains(activeElement)) {
                        this.scrollElementIntoView(activeElement);
                    }
                }, 0);
            }
        }
    }
    ngOnChanges(changes) {
        if (changes["options"] &&
            changes["options"].currentValue !== changes["options"].previousValue) {
            this.setupOptions();
        }
        else if (changes["title"] &&
            changes["title"].currentValue !== changes["title"].previousValue) {
            this.setupOptions();
        }
        else if (changes["description"] &&
            changes["description"].currentValue !==
                changes["description"].previousValue) {
            this.setupOptions();
        }
        else if (changes["displayType"] &&
            changes["displayType"].currentValue !==
                changes["displayType"].previousValue) {
            this.setupOptions();
        }
        else if (changes["modules"] &&
            changes["modules"].currentValue !== changes["modules"].previousValue) {
            this.setupOptions();
        }
        else if (changes["fontSize"] &&
            changes["fontSize"].currentValue !== changes["fontSize"].previousValue) {
            this.setupOptions();
        }
        else if (changes["theme"] &&
            changes["theme"].currentValue !== changes["theme"].previousValue) {
            this.setupOptions();
        }
        else if (changes["spacing"] &&
            changes["spacing"].currentValue !== changes["spacing"].previousValue) {
            this.setupOptions();
        }
        else if (changes["layout"] &&
            changes["layout"].currentValue !== changes["layout"].previousValue) {
            this.setupOptions();
        }
        else if (changes["overlay"] &&
            changes["overlay"].currentValue !== changes["overlay"].previousValue) {
            this.setupOptions();
        }
        else if (changes["position"] &&
            changes["position"].currentValue !== changes["position"].previousValue) {
            this.setupOptions();
        }
        else if (changes["multiSelectableAccordions"] &&
            changes["multiSelectableAccordions"].currentValue !==
                changes["multiSelectableAccordions"].previousValue) {
            this.setupOptions();
        }
    }
    setupOptions() {
        // Merge the provided options with the default ones
        const mergedOptions = {
            ...createAccessibilityOptions(this.weissAccessibilityCenterService),
            ...this.options,
        };
        // If an option was passed individually, override in mergedOptions
        if (this.title) {
            mergedOptions.title = this.title;
        }
        if (this.description) {
            mergedOptions.description = this.description;
        }
        if (this.displayType) {
            mergedOptions.displayType = this.displayType;
        }
        if (this.overlay !== undefined) {
            mergedOptions.overlay = this.overlay;
        }
        if (this.multiSelectableAccordions) {
            mergedOptions.multiSelectableAccordions = this.multiSelectableAccordions;
        }
        if (this.position) {
            mergedOptions.position = this.position;
        }
        if (this.modules) {
            mergedOptions.include = this.modules;
        }
        if (this.fontSize) {
            mergedOptions.fontSize = this.fontSize;
            // If fontSize was passed in specifically, check to be sure it's included in the modules list. If not, add it.
            if (mergedOptions.include &&
                !mergedOptions.include.includes("fontSize")) {
                mergedOptions.include.push("fontSize");
            }
        }
        if (this.theme) {
            mergedOptions.theme = this.theme;
            if (mergedOptions.include && !mergedOptions.include.includes("theme")) {
                mergedOptions.include.push("theme");
            }
        }
        if (this.spacing) {
            mergedOptions.spacing = this.spacing;
            if (mergedOptions.include && !mergedOptions.include.includes("spacing")) {
                mergedOptions.include.push("spacing");
            }
        }
        if (this.layout) {
            mergedOptions.layout = this.layout;
            if (mergedOptions.include && !mergedOptions.include.includes("layout")) {
                mergedOptions.include.push("layout");
            }
        }
        // Now store the final merged options
        this.currentOptions = mergedOptions;
        this.data = this.buildData();
    }
    buildData() {
        // Build the data object to pass to the panel
        // Determine which modules to include based on the current options
        const includedModules = this.currentOptions.include || [];
        let moduleData = {};
        includedModules.forEach((module) => {
            // Add the module to the data object
            moduleData[module] = this.currentOptions[module];
        });
        const data = {
            title: this.currentOptions.title || "Accessibility settings",
            description: this.currentOptions.description ||
                "Adjust the settings below to customize the appearance of this website.",
            modules: moduleData,
            multiSelectableAccordions: this.currentOptions.multiSelectableAccordions || false,
            position: this.currentOptions.position || "end",
        };
        return data;
    }
    ngOnDestroy() {
        if (this.focusTimeoutId !== null) {
            clearTimeout(this.focusTimeoutId);
            this.focusTimeoutId = null;
        }
        this.destroy$.next();
        this.destroy$.complete();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: WeissAccessibilityCenterComponent, deps: [{ token: WeissAccessibilityCenterService }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.8", type: WeissAccessibilityCenterComponent, selector: "weiss-accessibility-center", inputs: { options: "options", title: "title", description: "description", displayType: "displayType", overlay: "overlay", position: "position", modules: "modules", fontSize: "fontSize", theme: "theme", spacing: "spacing", layout: "layout", multiSelectableAccordions: "multiSelectableAccordions" }, host: { listeners: { "keydown": "handleKeyboardEvent($event)" } }, viewQueries: [{ propertyName: "centerEl", first: true, predicate: ["center"], descendants: true, read: ElementRef }], usesOnChanges: true, ngImport: i0, template: `
    <article
      role="dialog"
      aria-modal="true"
      [hidden]="!showWeissAccessibilityCenter"
      #center
    >
      <div
        class="background-overlay"
        *ngIf="currentOptions.overlay"
        (click)="
          weissAccessibilityCenterService.toggleWeissAccessibilityCenter(
            null,
            true
          )
        "
      ></div>
      <ng-container *ngIf="currentOptions.displayType === 'panel'">
        <weiss-accessibility-panel
          (statusMessageChange)="onStatusMessageChange($event)"
          [data]="data"
        ></weiss-accessibility-panel>
      </ng-container>
      <ng-container *ngIf="currentOptions.displayType === 'strip'">
        <weiss-accessibility-strip
          [closeSelectionPanel]="forceCloseSelectionPanel"
          (statusMessageChange)="onStatusMessageChange($event)"
          [data]="data"
        ></weiss-accessibility-strip>
      </ng-container>
      <ng-container *ngIf="currentOptions.displayType === 'popover'">
        <!-- <weiss-accessibility-popover></weiss-accessibility-popover> -->
      </ng-container>
      <div
        aria-live="polite"
        id="statusMessage"
        *ngIf="statusMessage"
        class="visually-hidden"
      >
        {{ statusMessage }}
      </div>
    </article>
  `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: StripComponent, selector: "weiss-accessibility-strip", inputs: ["data", "closeSelectionPanel"], outputs: ["statusMessageChange"] }, { kind: "component", type: PanelComponent, selector: "weiss-accessibility-panel", inputs: ["data"], outputs: ["statusMessageChange"] }], encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: WeissAccessibilityCenterComponent, decorators: [{
            type: Component,
            args: [{
                    selector: "weiss-accessibility-center",
                    template: `
    <article
      role="dialog"
      aria-modal="true"
      [hidden]="!showWeissAccessibilityCenter"
      #center
    >
      <div
        class="background-overlay"
        *ngIf="currentOptions.overlay"
        (click)="
          weissAccessibilityCenterService.toggleWeissAccessibilityCenter(
            null,
            true
          )
        "
      ></div>
      <ng-container *ngIf="currentOptions.displayType === 'panel'">
        <weiss-accessibility-panel
          (statusMessageChange)="onStatusMessageChange($event)"
          [data]="data"
        ></weiss-accessibility-panel>
      </ng-container>
      <ng-container *ngIf="currentOptions.displayType === 'strip'">
        <weiss-accessibility-strip
          [closeSelectionPanel]="forceCloseSelectionPanel"
          (statusMessageChange)="onStatusMessageChange($event)"
          [data]="data"
        ></weiss-accessibility-strip>
      </ng-container>
      <ng-container *ngIf="currentOptions.displayType === 'popover'">
        <!-- <weiss-accessibility-popover></weiss-accessibility-popover> -->
      </ng-container>
      <div
        aria-live="polite"
        id="statusMessage"
        *ngIf="statusMessage"
        class="visually-hidden"
      >
        {{ statusMessage }}
      </div>
    </article>
  `,
                    encapsulation: ViewEncapsulation.None,
                }]
        }], ctorParameters: () => [{ type: WeissAccessibilityCenterService }, { type: i0.Renderer2 }], propDecorators: { centerEl: [{
                type: ViewChild,
                args: ["center", { read: ElementRef }]
            }], options: [{
                type: Input
            }], title: [{
                type: Input
            }], description: [{
                type: Input
            }], displayType: [{
                type: Input
            }], overlay: [{
                type: Input
            }], position: [{
                type: Input
            }], modules: [{
                type: Input
            }], fontSize: [{
                type: Input
            }], theme: [{
                type: Input
            }], spacing: [{
                type: Input
            }], layout: [{
                type: Input
            }], multiSelectableAccordions: [{
                type: Input
            }], handleKeyboardEvent: [{
                type: HostListener,
                args: ["keydown", ["$event"]]
            }] } });

// a11y-trigger.directive.ts
class WeissAccessibilityToggleDirective {
    el;
    renderer;
    accessibilityService;
    targetId;
    ariaExpanded = false;
    subscription = new Subscription();
    constructor(el, renderer, accessibilityService) {
        this.el = el;
        this.renderer = renderer;
        this.accessibilityService = accessibilityService;
    }
    ngOnInit() {
        // Set necessary ARIA attributes
        this.renderer.setAttribute(this.el.nativeElement, 'aria-expanded', 'false');
        this.renderer.setAttribute(this.el.nativeElement, 'aria-haspopup', 'true');
        // If no id on the button, set one
        if (!this.el.nativeElement.id) {
            this.renderer.setAttribute(this.el.nativeElement, 'id', 'weiss-a11y-toggle');
        }
        // Initial push and aria-controls sync
        this.pushTargetIdToService();
        this.updateAriaControls();
        // Ensure the element is focusable if it's not inherently focusable
        this.makeElementFocusable();
        // Subscribe to the widget visibility observable to update 'aria-expanded'
        this.subscription =
            this.accessibilityService.showWeissAccessibilityCenter$.subscribe((visible) => {
                this.ariaExpanded = visible;
                this.renderer.setAttribute(this.el.nativeElement, 'aria-expanded', String(this.ariaExpanded));
                if (visible) {
                    this.renderer.addClass(this.el.nativeElement, 'weiss-a11y-active');
                }
                else {
                    this.renderer.removeClass(this.el.nativeElement, 'weiss-a11y-active');
                }
            });
    }
    ngOnChanges(changes) {
        if (changes['targetId']) {
            this.pushTargetIdToService();
            this.updateAriaControls();
        }
    }
    pushTargetIdToService() {
        this.accessibilityService.setTargetId(this.targetId ?? null);
    }
    updateAriaControls() {
        if (this.targetId) {
            this.renderer.setAttribute(this.el.nativeElement, 'aria-controls', this.targetId);
        }
        else {
            this.renderer.removeAttribute(this.el.nativeElement, 'aria-controls');
        }
    }
    // Ensure the element is focusable
    makeElementFocusable() {
        const nodeName = this.el.nativeElement.nodeName.toLowerCase();
        const focusableElements = ['a', 'button', 'input', 'textarea', 'select'];
        if (!focusableElements.includes(nodeName)) {
            // Add tabindex if not already present
            if (!this.el.nativeElement.hasAttribute('tabindex')) {
                this.renderer.setAttribute(this.el.nativeElement, 'tabindex', '0');
            }
            if (!this.el.nativeElement.hasAttribute('role')) {
                this.renderer.setAttribute(this.el.nativeElement, 'role', 'button');
            }
        }
    }
    onClick(target) {
        this.accessibilityService.toggleWeissAccessibilityCenter(target);
    }
    onKeyDown(event) {
        if (event.key === 'Enter' ||
            event.key === ' ' ||
            event.key === 'Spacebar') {
            event.preventDefault();
            this.accessibilityService.toggleWeissAccessibilityCenter(this.el.nativeElement);
        }
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
        // Optionally clear the id if this was the only trigger
        // this.accessibilityService.setTargetId(null);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: WeissAccessibilityToggleDirective, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: WeissAccessibilityCenterService }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.8", type: WeissAccessibilityToggleDirective, selector: "[weissA11yToggle]", inputs: { targetId: ["weissA11yToggle", "targetId"] }, host: { listeners: { "click": "onClick($event.target)", "keydown": "onKeyDown($event)" } }, usesOnChanges: true, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: WeissAccessibilityToggleDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[weissA11yToggle]',
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: WeissAccessibilityCenterService }], propDecorators: { targetId: [{
                type: Input,
                args: ['weissA11yToggle']
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event.target']]
            }], onKeyDown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });

class WeissAccessibilityCenterModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: WeissAccessibilityCenterModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.2.8", ngImport: i0, type: WeissAccessibilityCenterModule, declarations: [WeissAccessibilityCenterComponent,
            WeissAccessibilityToggleDirective,
            StripComponent,
            PanelComponent], imports: [CommonModule,
            FormsModule,
            AsyncPipe], exports: [WeissAccessibilityCenterComponent,
            WeissAccessibilityToggleDirective] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: WeissAccessibilityCenterModule, providers: [WeissAccessibilityCenterService], imports: [CommonModule,
            FormsModule] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: WeissAccessibilityCenterModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        WeissAccessibilityCenterComponent,
                        WeissAccessibilityToggleDirective,
                        StripComponent,
                        PanelComponent,
                    ],
                    imports: [
                        CommonModule,
                        FormsModule,
                        AsyncPipe
                    ],
                    providers: [WeissAccessibilityCenterService],
                    exports: [
                        WeissAccessibilityCenterComponent,
                        WeissAccessibilityToggleDirective
                    ]
                }]
        }] });

/*
 * Public API Surface of weiss-accessibility-center
 */

/**
 * Generated bundle index. Do not edit.
 */

export { WeissAccessibilityCenterComponent, WeissAccessibilityCenterModule, WeissAccessibilityCenterService, WeissAccessibilityToggleDirective };
//# sourceMappingURL=weiss-accessibility-center.mjs.map
