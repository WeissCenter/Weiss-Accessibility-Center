import { Component, HostListener, Input, ViewChild, ViewEncapsulation, ElementRef } from "@angular/core";
import { createAccessibilityOptions } from "./weiss-accessibility-center.factory";
import { Subject, takeUntil } from "rxjs";
import * as i0 from "@angular/core";
import * as i1 from "./weiss-accessibility-center.service";
import * as i2 from "@angular/common";
import * as i3 from "./templates/strip/strip.component";
import * as i4 from "./templates/panel/panel.component";
export class WeissAccessibilityCenterComponent {
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
    /**
     * Optional language map for custom translations. Example:
     * {
     *   en: { title: 'Accessibility', description: '...' },
     *   es: { title: 'Accesibilidad', description: '...' }
     * }
     */
    languageMap;
    /**
     * Currently selected language code
     */
    selectedLanguage;
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
    accessibleName = "Weiss Accessibility Center";
    // Action label getters using translation function
    get closeLabel() {
        return this.translationFn('closeLabel', 'Close');
    }
    get resetAllLabel() {
        return this.translationFn('resetAllLabel', 'Reset all settings');
    }
    get resetLabel() {
        return this.translationFn('resetLabel', 'Reset');
    }
    get resetStatusMessage() {
        return this.translationFn('resetStatusMessage', 'Options Reset');
    }
    /**
     * Returns the translated string for a given key, using languageMap if available
     */
    getTranslation(key, fallback) {
        if (this.languageMap &&
            this.selectedLanguage &&
            this.languageMap[this.selectedLanguage] &&
            this.languageMap[this.selectedLanguage][key]) {
            return this.languageMap[this.selectedLanguage][key];
        }
        return fallback;
    }
    constructor(weissAccessibilityCenterService, renderer) {
        this.weissAccessibilityCenterService = weissAccessibilityCenterService;
        this.renderer = renderer;
        this.currentOptions = createAccessibilityOptions(this.weissAccessibilityCenterService, this.translationFn);
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
        // Apply id to the actual <div> after it's in the DOM
        this.renderer.setAttribute(this.centerEl.nativeElement, 'id', 'weiss-accessibility-center');
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
        else if ((changes["languageMap"] && changes["languageMap"].currentValue !== changes["languageMap"].previousValue) ||
            (changes["selectedLanguage"] && changes["selectedLanguage"].currentValue !== changes["selectedLanguage"].previousValue)) {
            this.setupOptions();
        }
    }
    setupOptions() {
        // Merge the provided options with the default ones
        const mergedOptions = {
            ...createAccessibilityOptions(this.weissAccessibilityCenterService, this.translationFn),
            ...this.options,
        };
        // If an option was passed individually, override in mergedOptions
        // For title/description, use translation if available
        mergedOptions.title = this.translationFn('title', this.title ?? mergedOptions.title ?? 'Accessibility settings');
        mergedOptions.description = this.translationFn('description', this.description ?? mergedOptions.description ?? 'Adjust the settings below to customize the appearance of this website.');
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
            title: this.currentOptions.title,
            description: this.currentOptions.description,
            modules: moduleData,
            multiSelectableAccordions: this.currentOptions.multiSelectableAccordions || false,
            position: this.currentOptions.position || "end",
        };
        return data;
    }
    translationFn = (key, fallback) => {
        if (this.languageMap &&
            this.selectedLanguage &&
            this.languageMap[this.selectedLanguage] &&
            this.languageMap[this.selectedLanguage][key]) {
            return this.languageMap[this.selectedLanguage][key];
        }
        return fallback;
    };
    ngOnDestroy() {
        if (this.focusTimeoutId !== null) {
            clearTimeout(this.focusTimeoutId);
            this.focusTimeoutId = null;
        }
        this.destroy$.next();
        this.destroy$.complete();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: WeissAccessibilityCenterComponent, deps: [{ token: i1.WeissAccessibilityCenterService }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.8", type: WeissAccessibilityCenterComponent, selector: "weiss-accessibility-center", inputs: { options: "options", title: "title", description: "description", displayType: "displayType", overlay: "overlay", position: "position", modules: "modules", fontSize: "fontSize", theme: "theme", spacing: "spacing", layout: "layout", multiSelectableAccordions: "multiSelectableAccordions", languageMap: "languageMap", selectedLanguage: "selectedLanguage" }, host: { listeners: { "keydown": "handleKeyboardEvent($event)" } }, viewQueries: [{ propertyName: "centerEl", first: true, predicate: ["center"], descendants: true, read: ElementRef }], usesOnChanges: true, ngImport: i0, template: `
    <div
      role="dialog"
      aria-labelledby="accessibilityCenterTitle"
      aria-modal="true"
      [attr.name]="accessibleName"
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
          [closeLabel]="closeLabel"
          [resetAllLabel]="resetAllLabel"
          [resetStatusMessage]="resetStatusMessage"
        ></weiss-accessibility-panel>
      </ng-container>
      <ng-container *ngIf="currentOptions.displayType === 'strip'">
        <weiss-accessibility-strip
          [closeSelectionPanel]="forceCloseSelectionPanel"
          (statusMessageChange)="onStatusMessageChange($event)"
          [data]="data"
          [closeLabel]="closeLabel"
          [resetLabel]="resetLabel"
          [resetStatusMessage]="resetStatusMessage"
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
        </div>
  `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i3.StripComponent, selector: "weiss-accessibility-strip", inputs: ["data", "closeLabel", "resetLabel", "resetStatusMessage", "closeSelectionPanel"], outputs: ["statusMessageChange"] }, { kind: "component", type: i4.PanelComponent, selector: "weiss-accessibility-panel", inputs: ["data", "closeLabel", "resetAllLabel", "resetStatusMessage"], outputs: ["statusMessageChange"] }], encapsulation: i0.ViewEncapsulation.None });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: WeissAccessibilityCenterComponent, decorators: [{
            type: Component,
            args: [{
                    selector: "weiss-accessibility-center",
                    template: `
    <div
      role="dialog"
      aria-labelledby="accessibilityCenterTitle"
      aria-modal="true"
      [attr.name]="accessibleName"
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
          [closeLabel]="closeLabel"
          [resetAllLabel]="resetAllLabel"
          [resetStatusMessage]="resetStatusMessage"
        ></weiss-accessibility-panel>
      </ng-container>
      <ng-container *ngIf="currentOptions.displayType === 'strip'">
        <weiss-accessibility-strip
          [closeSelectionPanel]="forceCloseSelectionPanel"
          (statusMessageChange)="onStatusMessageChange($event)"
          [data]="data"
          [closeLabel]="closeLabel"
          [resetLabel]="resetLabel"
          [resetStatusMessage]="resetStatusMessage"
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
        </div>
  `,
                    encapsulation: ViewEncapsulation.None,
                }]
        }], ctorParameters: () => [{ type: i1.WeissAccessibilityCenterService }, { type: i0.Renderer2 }], propDecorators: { centerEl: [{
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
            }], languageMap: [{
                type: Input
            }], selectedLanguage: [{
                type: Input
            }], handleKeyboardEvent: [{
                type: HostListener,
                args: ["keydown", ["$event"]]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUVMLFNBQVMsRUFDVCxpQkFBaUIsRUFJakIsVUFBVSxFQUNYLE1BQU0sZUFBZSxDQUFDO0FBVXZCLE9BQU8sRUFBRSwwQkFBMEIsRUFBaUIsTUFBTSxzQ0FBc0MsQ0FBQztBQUNqRyxPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLE1BQU0sQ0FBQzs7Ozs7O0FBeUQxQyxNQUFNLE9BQU8saUNBQWlDO0lBNkVuQztJQUNDO0lBN0VpQyxRQUFRLENBQTJCO0lBRXJFLE9BQU8sQ0FBbUM7SUFDMUMsS0FBSyxDQUFxQjtJQUMxQixXQUFXLENBQXFCO0lBQ2hDLFdBQVcsQ0FBMEI7SUFDckMsT0FBTyxDQUFzQjtJQUM3QixRQUFRLENBQThCO0lBQ3RDLE9BQU8sQ0FBNEI7SUFDbkMsUUFBUSxDQUE0QjtJQUNwQyxLQUFLLENBQTRCO0lBQ2pDLE9BQU8sQ0FBNEI7SUFDbkMsTUFBTSxDQUE0QjtJQUNsQyx5QkFBeUIsQ0FBc0I7SUFDeEQ7Ozs7OztPQU1HO0lBQ00sV0FBVyxDQUFpRDtJQUNyRTs7T0FFRztJQUNNLGdCQUFnQixDQUFVO0lBRW5DLCtEQUErRDtJQUMvRCxjQUFjLENBQXVCO0lBRTlCLDRCQUE0QixHQUFHLEtBQUssQ0FBQztJQUNyQyxJQUFJLENBQXdCO0lBRTNCLHFCQUFxQixHQUF1QixJQUFJLENBQUM7SUFDakQsb0JBQW9CLEdBQXVCLElBQUksQ0FBQztJQUNoRCx1QkFBdUIsR0FDN0IsMFBBQTBQLENBQUM7SUFFdFAsYUFBYSxHQUFXLEVBQUUsQ0FBQztJQUMzQix3QkFBd0IsR0FBWSxLQUFL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Q3RDOzRIQUU0QyxRQUFRO3NCQUFsRCxTQUFTO3VCQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7Z0JBRWhDLE9BQU87c0JBQWYsS0FBSztnQkFDRyxLQUFLO3NCQUFiLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFDRyxXQUFXO3NCQUFuQixLQUFLO2dCQUNHLE9BQU87c0JBQWYsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLE9BQU87c0JBQWYsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLEtBQUs7c0JBQWIsS0FBSztnQkFDRyxPQUFPO3NCQUFmLEtBQUs7Z0JBQ0csTUFBTTtzQkFBZCxLQUFLO2dCQUNHLHlCQUF5QjtzQkFBakMsS0FBSztnQkFRRyxXQUFXO3NCQUFuQixLQUFLO2dCQUlHLGdCQUFnQjtzQkFBeEIsS0FBSztnQkFrSE4sbUJBQW1CO3NCQURsQixZQUFZO3VCQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSG9zdExpc3RlbmVyLFxuICBJbnB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgT25EZXN0cm95LFxuICBBZnRlclZpZXdJbml0LFxuICBSZW5kZXJlcjIsXG4gIEVsZW1lbnRSZWZcbn0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7XG4gIEFjY2Vzc2liaWxpdHlPcHRpb25zLFxuICBEaXNwbGF5VHlwZSxcbiAgTW9kdWxlT3B0aW9ucyxcbiAgTW9kdWxlVHlwZXMsXG4gIFBhbmVsRGF0YSxcbiAgUG9zaXRpb25PcHRpb25zLFxufSBmcm9tIFwiLi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5pbnRlcmZhY2VzXCI7XG5pbXBvcnQgeyBXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlIH0gZnJvbSBcIi4vd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuc2VydmljZVwiO1xuaW1wb3J0IHsgY3JlYXRlQWNjZXNzaWJpbGl0eU9wdGlvbnMsIFRyYW5zbGF0aW9uRm4gfSBmcm9tIFwiLi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5mYWN0b3J5XCI7XG5pbXBvcnQgeyBTdWJqZWN0LCB0YWtlVW50aWwgfSBmcm9tIFwicnhqc1wiO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6IFwid2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXJcIixcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2XG4gICAgICByb2xlPVwiZGlhbG9nXCJcbiAgICAgIGFyaWEtbGFiZWxsZWRieT1cImFjY2Vzc2liaWxpdHlDZW50ZXJUaXRsZVwiXG4gICAgICBhcmlhLW1vZGFsPVwidHJ1ZVwiXG4gICAgICBbYXR0ci5uYW1lXT1cImFjY2Vzc2libGVOYW1lXCJcbiAgICAgIFtoaWRkZW5dPVwiIXNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJcIlxuICAgICAgI2NlbnRlclxuICAgID5cbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3M9XCJiYWNrZ3JvdW5kLW92ZXJsYXlcIlxuICAgICAgICAqbmdJZj1cImN1cnJlbnRPcHRpb25zLm92ZXJsYXlcIlxuICAgICAgICAoY2xpY2spPVwiXG4gICAgICAgICAgd2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZS50b2dnbGVXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIoXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgIClcbiAgICAgICAgXCJcbiAgICAgID48L2Rpdj5cbiAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJjdXJyZW50T3B0aW9ucy5kaXNwbGF5VHlwZSA9PT0gJ3BhbmVsJ1wiPlxuICAgICAgICA8d2Vpc3MtYWNjZXNzaWJpbGl0eS1wYW5lbFxuICAgICAgICAgIChzdGF0dXNNZXNzYWdlQ2hhbmdlKT1cIm9uU3RhdHVzTWVzc2FnZUNoYW5nZSgkZXZlbnQpXCJcbiAgICAgICAgICBbZGF0YV09XCJkYXRhXCJcbiAgICAgICAgICBbY2xvc2VMYWJlbF09XCJjbG9zZUxhYmVsXCJcbiAgICAgICAgICBbcmVzZXRBbGxMYWJlbF09XCJyZXNldEFsbExhYmVsXCJcbiAgICAgICAgICBbcmVzZXRTdGF0dXNNZXNzYWdlXT1cInJlc2V0U3RhdHVzTWVzc2FnZVwiXG4gICAgICAgID48L3dlaXNzLWFjY2Vzc2liaWxpdHktcGFuZWw+XG4gICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJjdXJyZW50T3B0aW9ucy5kaXNwbGF5VHlwZSA9PT0gJ3N0cmlwJ1wiPlxuICAgICAgICA8d2Vpc3MtYWNjZXNzaWJpbGl0eS1zdHJpcFxuICAgICAgICAgIFtjbG9zZVNlbGVjdGlvblBhbmVsXT1cImZvcmNlQ2xvc2VTZWxlY3Rpb25QYW5lbFwiXG4gICAgICAgICAgKHN0YXR1c01lc3NhZ2VDaGFuZ2UpPVwib25TdGF0dXNNZXNzYWdlQ2hhbmdlKCRldmVudClcIlxuICAgICAgICAgIFtkYXRhXT1cImRhdGFcIlxuICAgICAgICAgIFtjbG9zZUxhYmVsXT1cImNsb3NlTGFiZWxcIlxuICAgICAgICAgIFtyZXNldExhYmVsXT1cInJlc2V0TGFiZWxcIlxuICAgICAgICAgIFtyZXNldFN0YXR1c01lc3NhZ2VdPVwicmVzZXRTdGF0dXNNZXNzYWdlXCJcbiAgICAgICAgPjwvd2Vpc3MtYWNjZXNzaWJpbGl0eS1zdHJpcD5cbiAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImN1cnJlbnRPcHRpb25zLmRpc3BsYXlUeXBlID09PSAncG9wb3ZlcidcIj5cbiAgICAgICAgPCEtLSA8d2Vpc3MtYWNjZXNzaWJpbGl0eS1wb3BvdmVyPjwvd2Vpc3MtYWNjZXNzaWJpbGl0eS1wb3BvdmVyPiAtLT5cbiAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgPGRpdlxuICAgICAgICBhcmlhLWxpdmU9XCJwb2xpdGVcIlxuICAgICAgICBpZD1cInN0YXR1c01lc3NhZ2VcIlxuICAgICAgICAqbmdJZj1cInN0YXR1c01lc3NhZ2VcIlxuICAgICAgICBjbGFzcz1cInZpc3VhbGx5LWhpZGRlblwiXG4gICAgICA+XG4gICAgICAgIHt7IHN0YXR1c01lc3NhZ2UgfX1cbiAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgYCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25EZXN0cm95LCBBZnRlclZpZXdJbml0IHtcbiAgQFZpZXdDaGlsZChcImNlbnRlclwiLCB7IHJlYWQ6IEVsZW1lbnRSZWYgfSkgY2VudGVyRWwhOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICBASW5wdXQoKSBvcHRpb25zOiBBY2Nlc3NpYmlsaXR5T3B0aW9ucyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgdGl0bGU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgZGVzY3JpcHRpb246IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgZGlzcGxheVR5cGU6IERpc3BsYXlUeXBlIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBvdmVybGF5OiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBwb3NpdGlvbjogUG9zaXRpb25PcHRpb25zIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBtb2R1bGVzOiBNb2R1bGVUeXBlc1tdIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBmb250U2l6ZTogTW9kdWxlT3B0aW9ucyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgdGhlbWU6IE1vZHVsZU9wdGlvbnMgfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIHNwYWNpbmc6IE1vZHVsZU9wdGlvbnMgfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIGxheW91dDogTW9kdWxlT3B0aW9ucyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgbXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9uczogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgLyoqXG4gICAqIE9wdGlvbmFsIGxhbmd1YWdlIG1hcCBmb3IgY3VzdG9tIHRyYW5zbGF0aW9ucy4gRXhhbXBsZTpcbiAgICoge1xuICAgKiAgIGVuOiB7IHRpdGxlOiAnQWNjZXNzaWJpbGl0eScsIGRlc2NyaXB0aW9uOiAnLi4uJyB9LFxuICAgKiAgIGVzOiB7IHRpdGxlOiAnQWNjZXNpYmlsaWRhZCcsIGRlc2NyaXB0aW9uOiAnLi4uJyB9XG4gICAqIH1cbiAgICovXG4gIEBJbnB1dCgpIGxhbmd1YWdlTWFwPzogeyBbbGFuZzogc3RyaW5nXTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB9O1xuICAvKipcbiAgICogQ3VycmVudGx5IHNlbGVjdGVkIGxhbmd1YWdlIGNvZGVcbiAgICovXG4gIEBJbnB1dCgpIHNlbGVjdGVkTGFuZ3VhZ2U/OiBzdHJpbmc7XG5cbiAgLy8gTWVyZ2VkIG9wdGlvbnMgb2JqZWN0IHRoYXQgd2lsbCBiZSB1c2VkIHdpdGhpbiB0aGUgY29tcG9uZW50XG4gIGN1cnJlbnRPcHRpb25zOiBBY2Nlc3NpYmlsaXR5T3B0aW9ucztcblxuICBwdWJsaWMgc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlciA9IGZhbHNlO1xuICBwdWJsaWMgZGF0YTogUGFuZWxEYXRhIHwgdW5kZWZpbmVkO1xuXG4gIHByaXZhdGUgZmlyc3RGb2N1c2FibGVFbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGxhc3RGb2N1c2FibGVFbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGZvY3VzYWJsZUVsZW1lbnRzU3RyaW5nID1cbiAgICAnYVtocmVmXSwgYXJlYVtocmVmXSwgaW5wdXQ6bm90KFtkaXNhYmxlZF0pLCBzZWxlY3Q6bm90KFtkaXNhYmxlZF0pLCB0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSksIGJ1dHRvbjpub3QoW2Rpc2FibGVkXSksIGlmcmFtZSwgb2JqZWN0LCBlbWJlZCwgW3RhYmluZGV4PVwiMFwiXSwgW2NvbnRlbnRlZGl0YWJsZV0sIGxpW3RhYmluZGV4PVwiMFwiXSwgbGlbdGFiaW5kZXg9XCItMVwiXSwgdHJbdGFiaW5kZXg9XCIwXCJdLCB0clt0YWJpbmRleD1cIi0xXCJdJztcblxuICBwdWJsaWMgc3RhdHVzTWVzc2FnZTogc3RyaW5nID0gXCJcIjtcbiAgcHVibGljIGZvcmNlQ2xvc2VTZWxlY3Rpb25QYW5lbDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHByaXZhdGUgZm9jdXNUaW1lb3V0SWQ6IG51bWJlciB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGRlc3Ryb3kkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBwdWJsaWMgYWNjZXNzaWJsZU5hbWUgPSBcIldlaXNzIEFjY2Vzc2liaWxpdHkgQ2VudGVyXCI7XG5cbiAgLy8gQWN0aW9uIGxhYmVsIGdldHRlcnMgdXNpbmcgdHJhbnNsYXRpb24gZnVuY3Rpb25cbiAgZ2V0IGNsb3NlTGFiZWwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2xhdGlvbkZuKCdjbG9zZUxhYmVsJywgJ0Nsb3NlJyk7XG4gIH1cbiAgZ2V0IHJlc2V0QWxsTGFiZWwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2xhdGlvbkZuKCdyZXNldEFsbExhYmVsJywgJ1Jlc2V0IGFsbCBzZXR0aW5ncycpO1xuICB9XG4gIGdldCByZXNldExhYmVsKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudHJhbnNsYXRpb25GbigncmVzZXRMYWJlbCcsICdSZXNldCcpO1xuICB9XG4gIGdldCByZXNldFN0YXR1c01lc3NhZ2UoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy50cmFuc2xhdGlvbkZuKCdyZXNldFN0YXR1c01lc3NhZ2UnLCAnT3B0aW9ucyBSZXNldCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHRyYW5zbGF0ZWQgc3RyaW5nIGZvciBhIGdpdmVuIGtleSwgdXNpbmcgbGFuZ3VhZ2VNYXAgaWYgYXZhaWxhYmxlXG4gICAqL1xuICBnZXRUcmFuc2xhdGlvbihrZXk6IHN0cmluZywgZmFsbGJhY2s6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5sYW5ndWFnZU1hcCAmJlxuICAgICAgdGhpcy5zZWxlY3RlZExhbmd1YWdlICYmXG4gICAgICB0aGlzLmxhbmd1YWdlTWFwW3RoaXMuc2VsZWN0ZWRMYW5ndWFnZV0gJiZcbiAgICAgIHRoaXMubGFuZ3VhZ2VNYXBbdGhpcy5zZWxlY3RlZExhbmd1YWdlXVtrZXldXG4gICAgKSB7XG4gICAgICByZXR1cm4gdGhpcy5sYW5ndWFnZU1hcFt0aGlzLnNlbGVjdGVkTGFuZ3VhZ2VdW2tleV07XG4gICAgfVxuICAgIHJldHVybiBmYWxsYmFjaztcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyB3ZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlOiBXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMlxuICApIHtcbiAgICB0aGlzLmN1cnJlbnRPcHRpb25zID0gY3JlYXRlQWNjZXNzaWJpbGl0eU9wdGlvbnMoXG4gICAgICB0aGlzLndlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2UsXG4gICAgICB0aGlzLnRyYW5zbGF0aW9uRm5cbiAgICApO1xuICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG5cbiAgICB0aGlzLndlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2Uuc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlciRcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSlcbiAgICAgIC5zdWJzY3JpYmUoKHNob3cpID0+IHtcbiAgICAgICAgdGhpcy5zaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyID0gc2hvdztcbiAgICAgICAgdGhpcy5mb3JjZUNsb3NlU2VsZWN0aW9uUGFuZWwgPSAhc2hvdztcblxuICAgICAgICBpZiAoIXNob3cgJiYgdGhpcy5mb2N1c1RpbWVvdXRJZCAhPT0gbnVsbCkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmZvY3VzVGltZW91dElkKTtcbiAgICAgICAgICB0aGlzLmZvY3VzVGltZW91dElkID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaG93KSB7XG4gICAgICAgICAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHMgPVxuICAgICAgICAgICAgdGhpcy5jZW50ZXJFbD8ubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgICAgICB0aGlzLmZvY3VzYWJsZUVsZW1lbnRzU3RyaW5nXG4gICAgICAgICAgICApIGFzIE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+O1xuICAgICAgICAgIHRoaXMuZmlyc3RGb2N1c2FibGVFbGVtZW50ID0gZm9jdXNhYmxlRWxlbWVudHNbMF07XG4gICAgICAgICAgdGhpcy5sYXN0Rm9jdXNhYmxlRWxlbWVudCA9XG4gICAgICAgICAgICBmb2N1c2FibGVFbGVtZW50c1tmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxXTtcblxuICAgICAgICAgIHRoaXMuZm9jdXNUaW1lb3V0SWQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZpcnN0Rm9jdXNhYmxlRWxlbWVudD8uZm9jdXMoKTtcbiAgICAgICAgICAgIHRoaXMuZm9jdXNUaW1lb3V0SWQgPSBudWxsO1xuICAgICAgICAgIH0sIDApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICAvLyBBcHBseSBpZCB0byB0aGUgYWN0dWFsIDxkaXY+IGFmdGVyIGl0J3MgaW4gdGhlIERPTVxuICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMuY2VudGVyRWwubmF0aXZlRWxlbWVudCwgJ2lkJywgJ3dlaXNzLWFjY2Vzc2liaWxpdHktY2VudGVyJyk7XG4gICAgdGhpcy53ZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlLnRhcmdldElkJFxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgLnN1YnNjcmliZSgoaWQpID0+IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBpZCA/PyAnd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXInO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLmNlbnRlckVsLm5hdGl2ZUVsZW1lbnQsICdpZCcsIHZhbHVlKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgLy8gVGhpcyBtZXRob2QgaXMgdHJpZ2dlcmVkIHdoZW4gdGhlIGNoaWxkIGNvbXBvbmVudCBlbWl0cyBhIG5ldyBzdGF0dXMgbWVzc2FnZVxuICBvblN0YXR1c01lc3NhZ2VDaGFuZ2UobmV3TWVzc2FnZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zdGF0dXNNZXNzYWdlID0gbmV3TWVzc2FnZTtcbiAgfVxuXG4gIHByaXZhdGUgc2Nyb2xsRWxlbWVudEludG9WaWV3KGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICBlbGVtZW50LnNjcm9sbEludG9WaWV3KHtcbiAgICAgIGJlaGF2aW9yOiBcInNtb290aFwiLFxuICAgICAgYmxvY2s6IFwiY2VudGVyXCIsXG4gICAgfSk7XG4gIH1cblxuICAvLyBDbG9zZSBwYW5lbCB3aGVuIHVzZXIgaGl0cyBlc2NhcGUga2V5XG4gIC8vIFRyYXAgZm9jdXMgd2l0aGluIHRoZSBhY2Nlc3NpYmlsaXR5IGNlbnRlclxuICBASG9zdExpc3RlbmVyKFwia2V5ZG93blwiLCBbXCIkZXZlbnRcIl0pXG4gIGhhbmRsZUtleWJvYXJkRXZlbnQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAodGhpcy5zaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyKSB7XG4gICAgICBjb25zdCBkZWVwQWN0aXZlRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICBpZiAoZXZlbnQua2V5ID09PSBcIlRhYlwiKSB7XG4gICAgICAgIGlmIChldmVudC5zaGlmdEtleSkge1xuICAgICAgICAgIC8qIHNoaWZ0ICsgdGFiICovXG4gICAgICAgICAgaWYgKGRlZXBBY3RpdmVFbGVtZW50ID09PSB0aGlzLmZpcnN0Rm9jdXNhYmxlRWxlbWVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMubGFzdEZvY3VzYWJsZUVsZW1lbnQ/LmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8qIHRhYiAqL1xuICAgICAgICAgIGlmIChkZWVwQWN0aXZlRWxlbWVudCA9PT0gdGhpcy5sYXN0Rm9jdXNhYmxlRWxlbWVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuZmlyc3RGb2N1c2FibGVFbGVtZW50Py5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNjcm9sbEVsZW1lbnRJbnRvVmlldyhkZWVwQWN0aXZlRWxlbWVudCBhcyBFbGVtZW50KTtcbiAgICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5ID09PSBcIkVzY2FwZVwiKSB7XG4gICAgICAgIHRoaXMud2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZS50b2dnbGVXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIoXG4gICAgICAgICAgbnVsbCxcbiAgICAgICAgICB0cnVlXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc3RhdHVzTWVzc2FnZSA9IFwiQWNjZXNzaWJpbGl0eSBjZW50ZXIgY2xvc2VkXCI7XG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleSA9PT0gXCJBcnJvd1VwXCIgfHwgZXZlbnQua2V5ID09PSBcIkFycm93RG93blwiKSB7XG4gICAgICAgIC8vIFdhaXQgZm9yIERPTSB1cGRhdGVcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgYWN0aXZlRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgYWN0aXZlRWxlbWVudCAmJlxuICAgICAgICAgICAgdGhpcy5jZW50ZXJFbC5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGFjdGl2ZUVsZW1lbnQpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbEVsZW1lbnRJbnRvVmlldyhhY3RpdmVFbGVtZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoXG4gICAgICBjaGFuZ2VzW1wib3B0aW9uc1wiXSAmJlxuICAgICAgY2hhbmdlc1tcIm9wdGlvbnNcIl0uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzW1wib3B0aW9uc1wiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1widGl0bGVcIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJ0aXRsZVwiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJ0aXRsZVwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wiZGVzY3JpcHRpb25cIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJkZXNjcmlwdGlvblwiXS5jdXJyZW50VmFsdWUgIT09XG4gICAgICAgIGNoYW5nZXNbXCJkZXNjcmlwdGlvblwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wiZGlzcGxheVR5cGVcIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJkaXNwbGF5VHlwZVwiXS5jdXJyZW50VmFsdWUgIT09XG4gICAgICAgIGNoYW5nZXNbXCJkaXNwbGF5VHlwZVwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wibW9kdWxlc1wiXSAmJlxuICAgICAgY2hhbmdlc1tcIm1vZHVsZXNcIl0uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzW1wibW9kdWxlc1wiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wiZm9udFNpemVcIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJmb250U2l6ZVwiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJmb250U2l6ZVwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1widGhlbWVcIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJ0aGVtZVwiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJ0aGVtZVwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wic3BhY2luZ1wiXSAmJlxuICAgICAgY2hhbmdlc1tcInNwYWNpbmdcIl0uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzW1wic3BhY2luZ1wiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wibGF5b3V0XCJdICYmXG4gICAgICBjaGFuZ2VzW1wibGF5b3V0XCJdLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlc1tcImxheW91dFwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wib3ZlcmxheVwiXSAmJlxuICAgICAgY2hhbmdlc1tcIm92ZXJsYXlcIl0uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzW1wib3ZlcmxheVwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wicG9zaXRpb25cIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJwb3NpdGlvblwiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJwb3NpdGlvblwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wibXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9uc1wiXSAmJlxuICAgICAgY2hhbmdlc1tcIm11bHRpU2VsZWN0YWJsZUFjY29yZGlvbnNcIl0uY3VycmVudFZhbHVlICE9PVxuICAgICAgICBjaGFuZ2VzW1wibXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9uc1wiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICAoY2hhbmdlc1tcImxhbmd1YWdlTWFwXCJdICYmIGNoYW5nZXNbXCJsYW5ndWFnZU1hcFwiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJsYW5ndWFnZU1hcFwiXS5wcmV2aW91c1ZhbHVlKSB8fFxuICAgICAgKGNoYW5nZXNbXCJzZWxlY3RlZExhbmd1YWdlXCJdICYmIGNoYW5nZXNbXCJzZWxlY3RlZExhbmd1YWdlXCJdLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlc1tcInNlbGVjdGVkTGFuZ3VhZ2VcIl0ucHJldmlvdXNWYWx1ZSlcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfVxuICB9XG5cbiAgc2V0dXBPcHRpb25zKCkge1xuICAgIC8vIE1lcmdlIHRoZSBwcm92aWRlZCBvcHRpb25zIHdpdGggdGhlIGRlZmF1bHQgb25lc1xuICAgIGNvbnN0IG1lcmdlZE9wdGlvbnMgPSB7XG4gICAgICAuLi5jcmVhdGVBY2Nlc3NpYmlsaXR5T3B0aW9ucyh0aGlzLndlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2UsIHRoaXMudHJhbnNsYXRpb25GbiksXG4gICAgICAuLi50aGlzLm9wdGlvbnMsXG4gICAgfTtcblxuICAgIC8vIElmIGFuIG9wdGlvbiB3YXMgcGFzc2VkIGluZGl2aWR1YWxseSwgb3ZlcnJpZGUgaW4gbWVyZ2VkT3B0aW9uc1xuICAgIC8vIEZvciB0aXRsZS9kZXNjcmlwdGlvbiwgdXNlIHRyYW5zbGF0aW9uIGlmIGF2YWlsYWJsZVxuICAgIG1lcmdlZE9wdGlvbnMudGl0bGUgPSB0aGlzLnRyYW5zbGF0aW9uRm4oJ3RpdGxlJywgdGhpcy50aXRsZSA/PyBtZXJnZWRPcHRpb25zLnRpdGxlID8/ICdBY2Nlc3NpYmlsaXR5IHNldHRpbmdzJyk7XG4gICAgbWVyZ2VkT3B0aW9ucy5kZXNjcmlwdGlvbiA9IHRoaXMudHJhbnNsYXRpb25GbignZGVzY3JpcHRpb24nLCB0aGlzLmRlc2NyaXB0aW9uID8/IG1lcmdlZE9wdGlvbnMuZGVzY3JpcHRpb24gPz8gJ0FkanVzdCB0aGUgc2V0dGluZ3MgYmVsb3cgdG8gY3VzdG9taXplIHRoZSBhcHBlYXJhbmNlIG9mIHRoaXMgd2Vic2l0ZS4nKTtcblxuICAgIGlmICh0aGlzLmRpc3BsYXlUeXBlKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLmRpc3BsYXlUeXBlID0gdGhpcy5kaXNwbGF5VHlwZTtcbiAgICB9XG4gICAgaWYgKHRoaXMub3ZlcmxheSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLm92ZXJsYXkgPSB0aGlzLm92ZXJsYXk7XG4gICAgfVxuICAgIGlmICh0aGlzLm11bHRpU2VsZWN0YWJsZUFjY29yZGlvbnMpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMubXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9ucyA9IHRoaXMubXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9ucztcbiAgICB9XG4gICAgaWYgKHRoaXMucG9zaXRpb24pIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMucG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uO1xuICAgIH1cbiAgICBpZiAodGhpcy5tb2R1bGVzKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLmluY2x1ZGUgPSB0aGlzLm1vZHVsZXM7XG4gICAgfVxuICAgIGlmICh0aGlzLmZvbnRTaXplKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLmZvbnRTaXplID0gdGhpcy5mb250U2l6ZTtcbiAgICAgIGlmIChcbiAgICAgICAgbWVyZ2VkT3B0aW9ucy5pbmNsdWRlICYmXG4gICAgICAgICFtZXJnZWRPcHRpb25zLmluY2x1ZGUuaW5jbHVkZXMoXCJmb250U2l6ZVwiKVxuICAgICAgKSB7XG4gICAgICAgIG1lcmdlZE9wdGlvbnMuaW5jbHVkZS5wdXNoKFwiZm9udFNpemVcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLnRoZW1lKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLnRoZW1lID0gdGhpcy50aGVtZTtcbiAgICAgIGlmIChtZXJnZWRPcHRpb25zLmluY2x1ZGUgJiYgIW1lcmdlZE9wdGlvbnMuaW5jbHVkZS5pbmNsdWRlcyhcInRoZW1lXCIpKSB7XG4gICAgICAgIG1lcmdlZE9wdGlvbnMuaW5jbHVkZS5wdXNoKFwidGhlbWVcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLnNwYWNpbmcpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMuc3BhY2luZyA9IHRoaXMuc3BhY2luZztcbiAgICAgIGlmIChtZXJnZWRPcHRpb25zLmluY2x1ZGUgJiYgIW1lcmdlZE9wdGlvbnMuaW5jbHVkZS5pbmNsdWRlcyhcInNwYWNpbmdcIikpIHtcbiAgICAgICAgbWVyZ2VkT3B0aW9ucy5pbmNsdWRlLnB1c2goXCJzcGFjaW5nXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5sYXlvdXQpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMubGF5b3V0ID0gdGhpcy5sYXlvdXQ7XG4gICAgICBpZiAobWVyZ2VkT3B0aW9ucy5pbmNsdWRlICYmICFtZXJnZWRPcHRpb25zLmluY2x1ZGUuaW5jbHVkZXMoXCJsYXlvdXRcIikpIHtcbiAgICAgICAgbWVyZ2VkT3B0aW9ucy5pbmNsdWRlLnB1c2goXCJsYXlvdXRcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTm93IHN0b3JlIHRoZSBmaW5hbCBtZXJnZWQgb3B0aW9uc1xuICAgIHRoaXMuY3VycmVudE9wdGlvbnMgPSBtZXJnZWRPcHRpb25zO1xuICAgIHRoaXMuZGF0YSA9IHRoaXMuYnVpbGREYXRhKCk7XG4gIH1cblxuICBidWlsZERhdGEoKSB7XG4gICAgLy8gQnVpbGQgdGhlIGRhdGEgb2JqZWN0IHRvIHBhc3MgdG8gdGhlIHBhbmVsXG4gICAgLy8gRGV0ZXJtaW5lIHdoaWNoIG1vZHVsZXMgdG8gaW5jbHVkZSBiYXNlZCBvbiB0aGUgY3VycmVudCBvcHRpb25zXG4gICAgY29uc3QgaW5jbHVkZWRNb2R1bGVzID0gdGhpcy5jdXJyZW50T3B0aW9ucy5pbmNsdWRlIHx8IFtdO1xuICAgIGxldCBtb2R1bGVEYXRhOiBQYW5lbERhdGFbXCJtb2R1bGVzXCJdID0ge307XG4gICAgaW5jbHVkZWRNb2R1bGVzLmZvckVhY2goKG1vZHVsZTogTW9kdWxlVHlwZXMpID0+IHtcbiAgICAgIC8vIEFkZCB0aGUgbW9kdWxlIHRvIHRoZSBkYXRhIG9iamVjdFxuICAgICAgbW9kdWxlRGF0YVttb2R1bGVdID0gdGhpcy5jdXJyZW50T3B0aW9uc1ttb2R1bGVdO1xuICAgIH0pO1xuICAgIGNvbnN0IGRhdGE6IFBhbmVsRGF0YSA9IHtcbiAgICAgIHRpdGxlOiB0aGlzLmN1cnJlbnRPcHRpb25zLnRpdGxlLFxuICAgICAgZGVzY3JpcHRpb246IHRoaXMuY3VycmVudE9wdGlvbnMuZGVzY3JpcHRpb24sXG4gICAgICBtb2R1bGVzOiBtb2R1bGVEYXRhLFxuICAgICAgbXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9uczpcbiAgICAgICAgdGhpcy5jdXJyZW50T3B0aW9ucy5tdWx0aVNlbGVjdGFibGVBY2NvcmRpb25zIHx8IGZhbHNlLFxuICAgICAgcG9zaXRpb246IHRoaXMuY3VycmVudE9wdGlvbnMucG9zaXRpb24gfHwgXCJlbmRcIixcbiAgICB9O1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgcHJpdmF0ZSB0cmFuc2xhdGlvbkZuOiBUcmFuc2xhdGlvbkZuID0gKGtleTogc3RyaW5nLCBmYWxsYmFjazogc3RyaW5nKSA9PiB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5sYW5ndWFnZU1hcCAmJlxuICAgICAgdGhpcy5zZWxlY3RlZExhbmd1YWdlICYmXG4gICAgICB0aGlzLmxhbmd1YWdlTWFwW3RoaXMuc2VsZWN0ZWRMYW5ndWFnZV0gJiZcbiAgICAgIHRoaXMubGFuZ3VhZ2VNYXBbdGhpcy5zZWxlY3RlZExhbmd1YWdlXVtrZXldXG4gICAgKSB7XG4gICAgICByZXR1cm4gdGhpcy5sYW5ndWFnZU1hcFt0aGlzLnNlbGVjdGVkTGFuZ3VhZ2VdW2tleV07XG4gICAgfVxuICAgIHJldHVybiBmYWxsYmFjaztcbiAgfTtcblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5mb2N1c1RpbWVvdXRJZCAhPT0gbnVsbCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZm9jdXNUaW1lb3V0SWQpO1xuICAgICAgdGhpcy5mb2N1c1RpbWVvdXRJZCA9IG51bGw7XG4gICAgfVxuICAgIHRoaXMuZGVzdHJveSQubmV4dCgpO1xuICAgIHRoaXMuZGVzdHJveSQuY29tcGxldGUoKTtcbiAgfVxufVxuIl19