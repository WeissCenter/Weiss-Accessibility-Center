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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUVMLFNBQVMsRUFDVCxpQkFBaUIsRUFJakIsVUFBVSxFQUNYLE1BQU0sZUFBZSxDQUFDO0FBVXZCLE9BQU8sRUFBRSwwQkFBMEIsRUFBaUIsTUFBTSxzQ0FBc0MsQ0FBQztBQUNqRyxPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLE1BQU0sQ0FBQzs7Ozs7O0FBbUQxQyxNQUFNLE9BQU8saUNBQWlDO0lBK0RuQztJQUNDO0lBL0RpQyxRQUFRLENBQTJCO0lBRXJFLE9BQU8sQ0FBbUM7SUFDMUMsS0FBSyxDQUFxQjtJQUMxQixXQUFXLENBQXFCO0lBQ2hDLFdBQVcsQ0FBMEI7SUFDckMsT0FBTyxDQUFzQjtJQUM3QixRQUFRLENBQThCO0lBQ3RDLE9BQU8sQ0FBNEI7SUFDbkMsUUFBUSxDQUE0QjtJQUNwQyxLQUFLLENBQTRCO0lBQ2pDLE9BQU8sQ0FBNEI7SUFDbkMsTUFBTSxDQUE0QjtJQUNsQyx5QkFBeUIsQ0FBc0I7SUFDeEQ7Ozs7OztPQU1HO0lBQ00sV0FBVyxDQUFpRDtJQUNyRTs7T0FFRztJQUNNLGdCQUFnQixDQUFVO0lBRW5DLCtEQUErRDtJQUMvRCxjQUFjLENBQXVCO0lBRTlCLDRCQUE0QixHQUFHLEtBQUssQ0FBQztJQUNyQyxJQUFJLENBQXdCO0lBRTNCLHFCQUFxQixHQUF1QixJQUFJLENBQUM7SUFDakQsb0JBQW9CLEdBQXVCLElBQUksQ0FBQztJQUNoRCx1QkFBdUIsR0FDN0IsMFBBQTBQLENBQUM7SUFFdFAsYUFBYSxHQUFXLEVBQUUsQ0FBQztJQUMzQix3QkFBd0IsR0FBWSxLQUFLLENBQUM7SUFFekMsY0FBYyxHQUFrQixJQUFJLENBQUM7SUFDckMsUUFBUSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7SUFFaEMsY0FBYyxHQUFHLDRCQUE0QixDQUFDO0lBRXJEOztPQUVHO0lBQ0gsY0FBYyxDQUFDLEdBQVcsRUFBRSxRQUFnQjtRQUMxQyxJQUNFLElBQUksQ0FBQyxXQUFXO1lBQ2hCLElBQUksQ0FBQyxnQkFBZ0I7WUFDckIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUM7WUFDdkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFDNUMsQ0FBQztZQUNELE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0RCxDQUFDO1FBQ0QsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUVELFlBQ1MsK0JBQWdFLEVBQy9ELFFBQW1CO1FBRHBCLG9DQUErQixHQUEvQiwrQkFBK0IsQ0FBaUM7UUFDL0QsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUUzQixJQUFJLENBQUMsY0FBYyxHQUFHLDBCQUEwQixDQUM5QyxJQUFJLENBQUMsK0JBQStCLEVBQ3BDLElBQUksQ0FBQyxhQUFhLENBQ25CLENBQUM7UUFDRixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFcEIsSUFBSSxDQUFDLCtCQUErQixDQUFDLDZCQUE2QjthQUMvRCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUM5QixTQUFTLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNsQixJQUFJLENBQUMsNEJBQTRCLEdBQUcsSUFBSSxDQUFDO1lBQ3pDLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLElBQUksQ0FBQztZQUV0QyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxjQUFjLEtBQUssSUFBSSxFQUFFLENBQUM7Z0JBQzFDLFlBQVksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQ2xDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1lBQzdCLENBQUM7WUFFRCxJQUFJLElBQUksRUFBRSxDQUFDO2dCQUNULE1BQU0saUJBQWlCLEdBQ3JCLElBQUksQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLGdCQUFnQixDQUMzQyxJQUFJLENBQUMsdUJBQXVCLENBQ0YsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLHFCQUFxQixHQUFHLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNsRCxJQUFJLENBQUMsb0JBQW9CO29CQUN2QixpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBRWxELElBQUksQ0FBQyxjQUFjLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7b0JBQzNDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxLQUFLLEVBQUUsQ0FBQztvQkFDcEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7Z0JBQzdCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNSLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxlQUFlO1FBQ2IscURBQXFEO1FBQ3JELElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLElBQUksRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO1FBQzVGLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxTQUFTO2FBQzNDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQzlCLFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFO1lBQ2hCLE1BQU0sS0FBSyxHQUFHLEVBQUUsSUFBSSw0QkFBNEIsQ0FBQztZQUNqRCxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkUsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsK0VBQStFO0lBQy9FLHFCQUFxQixDQUFDLFVBQWtCO1FBQ3RDLElBQUksQ0FBQyxhQUFhLEdBQUcsVUFBVSxDQUFDO0lBQ2xDLENBQUM7SUFFTyxxQkFBcUIsQ0FBQyxPQUFnQjtRQUM1QyxPQUFPLENBQUMsY0FBYyxDQUFDO1lBQ3JCLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLEtBQUssRUFBRSxRQUFRO1NBQ2hCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCx3Q0FBd0M7SUFDeEMsNkNBQTZDO0lBRTdDLG1CQUFtQixDQUFDLEtBQW9CO1FBQ3RDLElBQUksSUFBSSxDQUFDLDRCQUE0QixFQUFFLENBQUM7WUFDdEMsTUFBTSxpQkFBaUIsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDO1lBQ2pELElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyxLQUFLLEVBQUUsQ0FBQztnQkFDeEIsSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ25CLGlCQUFpQjtvQkFDakIsSUFBSSxpQkFBaUIsS0FBSyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQzt3QkFDckQsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO3dCQUN2QixJQUFJLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxFQUFFLENBQUM7b0JBQ3JDLENBQUM7Z0JBQ0gsQ0FBQztxQkFBTSxDQUFDO29CQUNOLFNBQVM7b0JBQ1QsSUFBSSxpQkFBaUIsS0FBSyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQzt3QkFDcEQsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO3dCQUN2QixJQUFJLENBQUMscUJBQXFCLEVBQUUsS0FBSyxFQUFFLENBQUM7b0JBQ3RDLENBQUM7Z0JBQ0gsQ0FBQztnQkFDRCxJQUFJLENBQUMscUJBQXFCLENBQUMsaUJBQTRCLENBQUMsQ0FBQztZQUMzRCxDQUFDO2lCQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyxRQUFRLEVBQUUsQ0FBQztnQkFDbEMsSUFBSSxDQUFDLCtCQUErQixDQUFDLDhCQUE4QixDQUNqRSxJQUFJLEVBQ0osSUFBSSxDQUNMLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLGFBQWEsR0FBRyw2QkFBNkIsQ0FBQztZQUNyRCxDQUFDO2lCQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyxTQUFTLElBQUksS0FBSyxDQUFDLEdBQUcsS0FBSyxXQUFXLEVBQUUsQ0FBQztnQkFDaEUsc0JBQXNCO2dCQUN0QixVQUFVLENBQUMsR0FBRyxFQUFFO29CQUNkLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUM7b0JBQzdDLElBQ0UsYUFBYTt3QkFDYixJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQ25ELENBQUM7d0JBQ0QsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsQ0FBQyxDQUFDO29CQUM1QyxDQUFDO2dCQUNILENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNSLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUNFLE9BQU8sQ0FBQyxTQUFTLENBQUM7WUFDbEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFlBQVksS0FBSyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsYUFBYSxFQUNwRSxDQUFDO1lBQ0QsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3RCLENBQUM7YUFBTSxJQUNMLE9BQU8sQ0FBQyxPQUFPLENBQUM7WUFDaEIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksS0FBSyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsYUFBYSxFQUNoRSxDQUFDO1lBQ0QsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3RCLENBQUM7YUFBTSxJQUNMLE9BQU8sQ0FBQyxhQUFhLENBQUM7WUFDdEIsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFlBQVk7Z0JBQ2pDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxhQUFhLEVBQ3RDLENBQUM7WUFDRCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDdEIsQ0FBQzthQUFNLElBQ0wsT0FBTyxDQUFDLGFBQWEsQ0FBQztZQUN0QixPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsWUFBWTtnQkFDakMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLGFBQWEsRUFDdEMsQ0FBQztZQUNELElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN0QixDQUFDO2FBQU0sSUFDTCxPQUFPLENBQUMsU0FBUyxDQUFDO1lBQ2xCLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxZQUFZLEtBQUssT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLGFBQWEsRUFDcEUsQ0FBQztZQUNELElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN0QixDQUFDO2FBQU0sSUFDTCxPQUFPLENBQUMsVUFBVSxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxZQUFZLEtBQUssT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLGFBQWEsRUFDdEUsQ0FBQztZQUNELElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN0QixDQUFDO2FBQU0sSUFDTCxPQUFPLENBQUMsT0FBTyxDQUFDO1lBQ2hCLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxZQUFZLEtBQUssT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGFBQWEsRUFDaEUsQ0FBQztZQUNELElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN0QixDQUFDO2FBQU0sSUFDTCxPQUFPLENBQUMsU0FBUyxDQUFDO1lBQ2xCLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxZQUFZLEtBQUssT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLGFBQWEsRUFDcEUsQ0FBQztZQUNELElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN0QixDQUFDO2FBQU0sSUFDTCxPQUFPLENBQUMsUUFBUSxDQUFDO1lBQ2pCLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLEtBQUssT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLGFBQWEsRUFDbEUsQ0FBQztZQUNELElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN0QixDQUFDO2FBQU0sSUFDTCxPQUFPLENBQUMsU0FBUyxDQUFDO1lBQ2xCLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxZQUFZLEtBQUssT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLGFBQWEsRUFDcEUsQ0FBQztZQUNELElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN0QixDQUFDO2FBQU0sSUFDTCxPQUFPLENBQUMsVUFBVSxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxZQUFZLEtBQUssT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLGFBQWEsRUFDdEUsQ0FBQztZQUNELElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN0QixDQUFDO2FBQU0sSUFDTCxPQUFPLENBQUMsMkJBQTJCLENBQUM7WUFDcEMsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUMsWUFBWTtnQkFDL0MsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUMsYUFBYSxFQUNwRCxDQUFDO1lBQ0QsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3RCLENBQUM7YUFBTSxJQUNMLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxZQUFZLEtBQUssT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLGFBQWEsQ0FBQztZQUN4RyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFlBQVksS0FBSyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFDdkgsQ0FBQztZQUNELElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN0QixDQUFDO0lBQ0gsQ0FBQztJQUVELFlBQVk7UUFDVixtREFBbUQ7UUFDbkQsTUFBTSxhQUFhLEdBQUc7WUFDcEIsR0FBRywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsK0JBQStCLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUN2RixHQUFHLElBQUksQ0FBQyxPQUFPO1NBQ2hCLENBQUM7UUFFRixrRUFBa0U7UUFDbEUsc0RBQXNEO1FBQ3RELGFBQWEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssSUFBSSxhQUFhLENBQUMsS0FBSyxJQUFJLHdCQUF3QixDQUFDLENBQUM7UUFDakgsYUFBYSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsV0FBVyxJQUFJLGFBQWEsQ0FBQyxXQUFXLElBQUksd0VBQXdFLENBQUMsQ0FBQztRQUV6TCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNyQixhQUFhLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDL0MsQ0FBQztRQUNELElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxTQUFTLEVBQUUsQ0FBQztZQUMvQixhQUFhLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDdkMsQ0FBQztRQUNELElBQUksSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7WUFDbkMsYUFBYSxDQUFDLHlCQUF5QixHQUFHLElBQUksQ0FBQyx5QkFBeUIsQ0FBQztRQUMzRSxDQUFDO1FBQ0QsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbEIsYUFBYSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3pDLENBQUM7UUFDRCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNqQixhQUFhLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDdkMsQ0FBQztRQUNELElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2xCLGFBQWEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUN2QyxJQUNFLGFBQWEsQ0FBQyxPQUFPO2dCQUNyQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUMzQyxDQUFDO2dCQUNELGFBQWEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3pDLENBQUM7UUFDSCxDQUFDO1FBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDZixhQUFhLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDakMsSUFBSSxhQUFhLENBQUMsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDdEUsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdEMsQ0FBQztRQUNILENBQUM7UUFDRCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNqQixhQUFhLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDckMsSUFBSSxhQUFhLENBQUMsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQztnQkFDeEUsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDeEMsQ0FBQztRQUNILENBQUM7UUFDRCxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNoQixhQUFhLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDbkMsSUFBSSxhQUFhLENBQUMsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztnQkFDdkUsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdkMsQ0FBQztRQUNILENBQUM7UUFFRCxxQ0FBcUM7UUFDckMsSUFBSSxDQUFDLGNBQWMsR0FBRyxhQUFhLENBQUM7UUFDcEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDL0IsQ0FBQztJQUVELFNBQVM7UUFDUCw2Q0FBNkM7UUFDN0Msa0VBQWtFO1FBQ2xFLE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUMxRCxJQUFJLFVBQVUsR0FBeUIsRUFBRSxDQUFDO1FBQzFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFtQixFQUFFLEVBQUU7WUFDOUMsb0NBQW9DO1lBQ3BDLFVBQVUsQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxJQUFJLEdBQWM7WUFDdEIsS0FBSyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSztZQUNoQyxXQUFXLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXO1lBQzVDLE9BQU8sRUFBRSxVQUFVO1lBQ25CLHlCQUF5QixFQUN2QixJQUFJLENBQUMsY0FBYyxDQUFDLHlCQUF5QixJQUFJLEtBQUs7WUFDeEQsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxJQUFJLEtBQUs7U0FDaEQsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVPLGFBQWEsR0FBa0IsQ0FBQyxHQUFXLEVBQUUsUUFBZ0IsRUFBRSxFQUFFO1FBQ3ZFLElBQ0UsSUFBSSxDQUFDLFdBQVc7WUFDaEIsSUFBSSxDQUFDLGdCQUFnQjtZQUNyQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztZQUN2QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUM1QyxDQUFDO1lBQ0QsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RELENBQUM7UUFDRCxPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDLENBQUM7SUFFRixXQUFXO1FBQ1QsSUFBSSxJQUFJLENBQUMsY0FBYyxLQUFLLElBQUksRUFBRSxDQUFDO1lBQ2pDLFlBQVksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7UUFDN0IsQ0FBQztRQUNELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMzQixDQUFDO3VHQWhWVSxpQ0FBaUM7MkZBQWpDLGlDQUFpQyxna0JBQ2YsVUFBVSxrREFoRDdCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRDVDs7MkZBR1UsaUNBQWlDO2tCQWpEN0MsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsNEJBQTRCO29CQUN0QyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNENUO29CQUNELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2lCQUN0Qzs0SEFFNEMsUUFBUTtzQkFBbEQsU0FBUzt1QkFBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO2dCQUVoQyxPQUFPO3NCQUFmLEtBQUs7Z0JBQ0csS0FBSztzQkFBYixLQUFLO2dCQUNHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFDRyxPQUFPO3NCQUFmLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxPQUFPO3NCQUFmLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxLQUFLO3NCQUFiLEtBQUs7Z0JBQ0csT0FBTztzQkFBZixLQUFLO2dCQUNHLE1BQU07c0JBQWQsS0FBSztnQkFDRyx5QkFBeUI7c0JBQWpDLEtBQUs7Z0JBUUcsV0FBVztzQkFBbkIsS0FBSztnQkFJRyxnQkFBZ0I7c0JBQXhCLEtBQUs7Z0JBb0dOLG1CQUFtQjtzQkFEbEIsWUFBWTt1QkFBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5wdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE9uRGVzdHJveSxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgUmVuZGVyZXIyLFxuICBFbGVtZW50UmVmXG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQge1xuICBBY2Nlc3NpYmlsaXR5T3B0aW9ucyxcbiAgRGlzcGxheVR5cGUsXG4gIE1vZHVsZU9wdGlvbnMsXG4gIE1vZHVsZVR5cGVzLFxuICBQYW5lbERhdGEsXG4gIFBvc2l0aW9uT3B0aW9ucyxcbn0gZnJvbSBcIi4vd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuaW50ZXJmYWNlc1wiO1xuaW1wb3J0IHsgV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZSB9IGZyb20gXCIuL3dlaXNzLWFjY2Vzc2liaWxpdHktY2VudGVyLnNlcnZpY2VcIjtcbmltcG9ydCB7IGNyZWF0ZUFjY2Vzc2liaWxpdHlPcHRpb25zLCBUcmFuc2xhdGlvbkZuIH0gZnJvbSBcIi4vd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuZmFjdG9yeVwiO1xuaW1wb3J0IHsgU3ViamVjdCwgdGFrZVVudGlsIH0gZnJvbSBcInJ4anNcIjtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiBcIndlaXNzLWFjY2Vzc2liaWxpdHktY2VudGVyXCIsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdlxuICAgICAgcm9sZT1cImRpYWxvZ1wiXG4gICAgICBhcmlhLWxhYmVsbGVkYnk9XCJhY2Nlc3NpYmlsaXR5Q2VudGVyVGl0bGVcIlxuICAgICAgYXJpYS1tb2RhbD1cInRydWVcIlxuICAgICAgW2F0dHIubmFtZV09XCJhY2Nlc3NpYmxlTmFtZVwiXG4gICAgICBbaGlkZGVuXT1cIiFzaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyXCJcbiAgICAgICNjZW50ZXJcbiAgICA+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzPVwiYmFja2dyb3VuZC1vdmVybGF5XCJcbiAgICAgICAgKm5nSWY9XCJjdXJyZW50T3B0aW9ucy5vdmVybGF5XCJcbiAgICAgICAgKGNsaWNrKT1cIlxuICAgICAgICAgIHdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2UudG9nZ2xlV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyKFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIHRydWVcbiAgICAgICAgICApXG4gICAgICAgIFwiXG4gICAgICA+PC9kaXY+XG4gICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiY3VycmVudE9wdGlvbnMuZGlzcGxheVR5cGUgPT09ICdwYW5lbCdcIj5cbiAgICAgICAgPHdlaXNzLWFjY2Vzc2liaWxpdHktcGFuZWxcbiAgICAgICAgICAoc3RhdHVzTWVzc2FnZUNoYW5nZSk9XCJvblN0YXR1c01lc3NhZ2VDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgICAgW2RhdGFdPVwiZGF0YVwiXG4gICAgICAgID48L3dlaXNzLWFjY2Vzc2liaWxpdHktcGFuZWw+XG4gICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJjdXJyZW50T3B0aW9ucy5kaXNwbGF5VHlwZSA9PT0gJ3N0cmlwJ1wiPlxuICAgICAgICA8d2Vpc3MtYWNjZXNzaWJpbGl0eS1zdHJpcFxuICAgICAgICAgIFtjbG9zZVNlbGVjdGlvblBhbmVsXT1cImZvcmNlQ2xvc2VTZWxlY3Rpb25QYW5lbFwiXG4gICAgICAgICAgKHN0YXR1c01lc3NhZ2VDaGFuZ2UpPVwib25TdGF0dXNNZXNzYWdlQ2hhbmdlKCRldmVudClcIlxuICAgICAgICAgIFtkYXRhXT1cImRhdGFcIlxuICAgICAgICA+PC93ZWlzcy1hY2Nlc3NpYmlsaXR5LXN0cmlwPlxuICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiY3VycmVudE9wdGlvbnMuZGlzcGxheVR5cGUgPT09ICdwb3BvdmVyJ1wiPlxuICAgICAgICA8IS0tIDx3ZWlzcy1hY2Nlc3NpYmlsaXR5LXBvcG92ZXI+PC93ZWlzcy1hY2Nlc3NpYmlsaXR5LXBvcG92ZXI+IC0tPlxuICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICA8ZGl2XG4gICAgICAgIGFyaWEtbGl2ZT1cInBvbGl0ZVwiXG4gICAgICAgIGlkPVwic3RhdHVzTWVzc2FnZVwiXG4gICAgICAgICpuZ0lmPVwic3RhdHVzTWVzc2FnZVwiXG4gICAgICAgIGNsYXNzPVwidmlzdWFsbHktaGlkZGVuXCJcbiAgICAgID5cbiAgICAgICAge3sgc3RhdHVzTWVzc2FnZSB9fVxuICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICBgLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQge1xuICBAVmlld0NoaWxkKFwiY2VudGVyXCIsIHsgcmVhZDogRWxlbWVudFJlZiB9KSBjZW50ZXJFbCE6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIEBJbnB1dCgpIG9wdGlvbnM6IEFjY2Vzc2liaWxpdHlPcHRpb25zIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSB0aXRsZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBkZXNjcmlwdGlvbjogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBkaXNwbGF5VHlwZTogRGlzcGxheVR5cGUgfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIG92ZXJsYXk6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIHBvc2l0aW9uOiBQb3NpdGlvbk9wdGlvbnMgfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIG1vZHVsZXM6IE1vZHVsZVR5cGVzW10gfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIGZvbnRTaXplOiBNb2R1bGVPcHRpb25zIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSB0aGVtZTogTW9kdWxlT3B0aW9ucyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgc3BhY2luZzogTW9kdWxlT3B0aW9ucyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgbGF5b3V0OiBNb2R1bGVPcHRpb25zIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBtdWx0aVNlbGVjdGFibGVBY2NvcmRpb25zOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICAvKipcbiAgICogT3B0aW9uYWwgbGFuZ3VhZ2UgbWFwIGZvciBjdXN0b20gdHJhbnNsYXRpb25zLiBFeGFtcGxlOlxuICAgKiB7XG4gICAqICAgZW46IHsgdGl0bGU6ICdBY2Nlc3NpYmlsaXR5JywgZGVzY3JpcHRpb246ICcuLi4nIH0sXG4gICAqICAgZXM6IHsgdGl0bGU6ICdBY2Nlc2liaWxpZGFkJywgZGVzY3JpcHRpb246ICcuLi4nIH1cbiAgICogfVxuICAgKi9cbiAgQElucHV0KCkgbGFuZ3VhZ2VNYXA/OiB7IFtsYW5nOiBzdHJpbmddOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9IH07XG4gIC8qKlxuICAgKiBDdXJyZW50bHkgc2VsZWN0ZWQgbGFuZ3VhZ2UgY29kZVxuICAgKi9cbiAgQElucHV0KCkgc2VsZWN0ZWRMYW5ndWFnZT86IHN0cmluZztcblxuICAvLyBNZXJnZWQgb3B0aW9ucyBvYmplY3QgdGhhdCB3aWxsIGJlIHVzZWQgd2l0aGluIHRoZSBjb21wb25lbnRcbiAgY3VycmVudE9wdGlvbnM6IEFjY2Vzc2liaWxpdHlPcHRpb25zO1xuXG4gIHB1YmxpYyBzaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyID0gZmFsc2U7XG4gIHB1YmxpYyBkYXRhOiBQYW5lbERhdGEgfCB1bmRlZmluZWQ7XG5cbiAgcHJpdmF0ZSBmaXJzdEZvY3VzYWJsZUVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgbGFzdEZvY3VzYWJsZUVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgZm9jdXNhYmxlRWxlbWVudHNTdHJpbmcgPVxuICAgICdhW2hyZWZdLCBhcmVhW2hyZWZdLCBpbnB1dDpub3QoW2Rpc2FibGVkXSksIHNlbGVjdDpub3QoW2Rpc2FibGVkXSksIHRleHRhcmVhOm5vdChbZGlzYWJsZWRdKSwgYnV0dG9uOm5vdChbZGlzYWJsZWRdKSwgaWZyYW1lLCBvYmplY3QsIGVtYmVkLCBbdGFiaW5kZXg9XCIwXCJdLCBbY29udGVudGVkaXRhYmxlXSwgbGlbdGFiaW5kZXg9XCIwXCJdLCBsaVt0YWJpbmRleD1cIi0xXCJdLCB0clt0YWJpbmRleD1cIjBcIl0sIHRyW3RhYmluZGV4PVwiLTFcIl0nO1xuXG4gIHB1YmxpYyBzdGF0dXNNZXNzYWdlOiBzdHJpbmcgPSBcIlwiO1xuICBwdWJsaWMgZm9yY2VDbG9zZVNlbGVjdGlvblBhbmVsOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBmb2N1c1RpbWVvdXRJZDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgZGVzdHJveSQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIHB1YmxpYyBhY2Nlc3NpYmxlTmFtZSA9IFwiV2Vpc3MgQWNjZXNzaWJpbGl0eSBDZW50ZXJcIjtcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdHJhbnNsYXRlZCBzdHJpbmcgZm9yIGEgZ2l2ZW4ga2V5LCB1c2luZyBsYW5ndWFnZU1hcCBpZiBhdmFpbGFibGVcbiAgICovXG4gIGdldFRyYW5zbGF0aW9uKGtleTogc3RyaW5nLCBmYWxsYmFjazogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBpZiAoXG4gICAgICB0aGlzLmxhbmd1YWdlTWFwICYmXG4gICAgICB0aGlzLnNlbGVjdGVkTGFuZ3VhZ2UgJiZcbiAgICAgIHRoaXMubGFuZ3VhZ2VNYXBbdGhpcy5zZWxlY3RlZExhbmd1YWdlXSAmJlxuICAgICAgdGhpcy5sYW5ndWFnZU1hcFt0aGlzLnNlbGVjdGVkTGFuZ3VhZ2VdW2tleV1cbiAgICApIHtcbiAgICAgIHJldHVybiB0aGlzLmxhbmd1YWdlTWFwW3RoaXMuc2VsZWN0ZWRMYW5ndWFnZV1ba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbGxiYWNrO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2U6IFdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyXG4gICkge1xuICAgIHRoaXMuY3VycmVudE9wdGlvbnMgPSBjcmVhdGVBY2Nlc3NpYmlsaXR5T3B0aW9ucyhcbiAgICAgIHRoaXMud2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZSxcbiAgICAgIHRoaXMudHJhbnNsYXRpb25GblxuICAgICk7XG4gICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcblxuICAgIHRoaXMud2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZS5zaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyJFxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgLnN1YnNjcmliZSgoc2hvdykgPT4ge1xuICAgICAgICB0aGlzLnNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIgPSBzaG93O1xuICAgICAgICB0aGlzLmZvcmNlQ2xvc2VTZWxlY3Rpb25QYW5lbCA9ICFzaG93O1xuXG4gICAgICAgIGlmICghc2hvdyAmJiB0aGlzLmZvY3VzVGltZW91dElkICE9PSBudWxsKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZm9jdXNUaW1lb3V0SWQpO1xuICAgICAgICAgIHRoaXMuZm9jdXNUaW1lb3V0SWQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNob3cpIHtcbiAgICAgICAgICBjb25zdCBmb2N1c2FibGVFbGVtZW50cyA9XG4gICAgICAgICAgICB0aGlzLmNlbnRlckVsPy5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgICAgIHRoaXMuZm9jdXNhYmxlRWxlbWVudHNTdHJpbmdcbiAgICAgICAgICAgICkgYXMgTm9kZUxpc3RPZjxIVE1MRWxlbWVudD47XG4gICAgICAgICAgdGhpcy5maXJzdEZvY3VzYWJsZUVsZW1lbnQgPSBmb2N1c2FibGVFbGVtZW50c1swXTtcbiAgICAgICAgICB0aGlzLmxhc3RGb2N1c2FibGVFbGVtZW50ID1cbiAgICAgICAgICAgIGZvY3VzYWJsZUVsZW1lbnRzW2ZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgICAgdGhpcy5mb2N1c1RpbWVvdXRJZCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmlyc3RGb2N1c2FibGVFbGVtZW50Py5mb2N1cygpO1xuICAgICAgICAgICAgdGhpcy5mb2N1c1RpbWVvdXRJZCA9IG51bGw7XG4gICAgICAgICAgfSwgMCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIC8vIEFwcGx5IGlkIHRvIHRoZSBhY3R1YWwgPGRpdj4gYWZ0ZXIgaXQncyBpbiB0aGUgRE9NXG4gICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5jZW50ZXJFbC5uYXRpdmVFbGVtZW50LCAnaWQnLCAnd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXInKTtcbiAgICB0aGlzLndlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2UudGFyZ2V0SWQkXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXG4gICAgICAuc3Vic2NyaWJlKChpZCkgPT4ge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGlkID8/ICd3ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlcic7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMuY2VudGVyRWwubmF0aXZlRWxlbWVudCwgJ2lkJywgdmFsdWUpO1xuICAgICAgfSk7XG4gIH1cblxuICAvLyBUaGlzIG1ldGhvZCBpcyB0cmlnZ2VyZWQgd2hlbiB0aGUgY2hpbGQgY29tcG9uZW50IGVtaXRzIGEgbmV3IHN0YXR1cyBtZXNzYWdlXG4gIG9uU3RhdHVzTWVzc2FnZUNoYW5nZShuZXdNZXNzYWdlOiBzdHJpbmcpIHtcbiAgICB0aGlzLnN0YXR1c01lc3NhZ2UgPSBuZXdNZXNzYWdlO1xuICB9XG5cbiAgcHJpdmF0ZSBzY3JvbGxFbGVtZW50SW50b1ZpZXcoZWxlbWVudDogRWxlbWVudCkge1xuICAgIGVsZW1lbnQuc2Nyb2xsSW50b1ZpZXcoe1xuICAgICAgYmVoYXZpb3I6IFwic21vb3RoXCIsXG4gICAgICBibG9jazogXCJjZW50ZXJcIixcbiAgICB9KTtcbiAgfVxuXG4gIC8vIENsb3NlIHBhbmVsIHdoZW4gdXNlciBoaXRzIGVzY2FwZSBrZXlcbiAgLy8gVHJhcCBmb2N1cyB3aXRoaW4gdGhlIGFjY2Vzc2liaWxpdHkgY2VudGVyXG4gIEBIb3N0TGlzdGVuZXIoXCJrZXlkb3duXCIsIFtcIiRldmVudFwiXSlcbiAgaGFuZGxlS2V5Ym9hcmRFdmVudChldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmICh0aGlzLnNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIpIHtcbiAgICAgIGNvbnN0IGRlZXBBY3RpdmVFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICAgIGlmIChldmVudC5rZXkgPT09IFwiVGFiXCIpIHtcbiAgICAgICAgaWYgKGV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgICAgLyogc2hpZnQgKyB0YWIgKi9cbiAgICAgICAgICBpZiAoZGVlcEFjdGl2ZUVsZW1lbnQgPT09IHRoaXMuZmlyc3RGb2N1c2FibGVFbGVtZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5sYXN0Rm9jdXNhYmxlRWxlbWVudD8uZm9jdXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLyogdGFiICovXG4gICAgICAgICAgaWYgKGRlZXBBY3RpdmVFbGVtZW50ID09PSB0aGlzLmxhc3RGb2N1c2FibGVFbGVtZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5maXJzdEZvY3VzYWJsZUVsZW1lbnQ/LmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2Nyb2xsRWxlbWVudEludG9WaWV3KGRlZXBBY3RpdmVFbGVtZW50IGFzIEVsZW1lbnQpO1xuICAgICAgfSBlbHNlIGlmIChldmVudC5rZXkgPT09IFwiRXNjYXBlXCIpIHtcbiAgICAgICAgdGhpcy53ZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlLnRvZ2dsZVdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlcihcbiAgICAgICAgICBudWxsLFxuICAgICAgICAgIHRydWVcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zdGF0dXNNZXNzYWdlID0gXCJBY2Nlc3NpYmlsaXR5IGNlbnRlciBjbG9zZWRcIjtcbiAgICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5ID09PSBcIkFycm93VXBcIiB8fCBldmVudC5rZXkgPT09IFwiQXJyb3dEb3duXCIpIHtcbiAgICAgICAgLy8gV2FpdCBmb3IgRE9NIHVwZGF0ZVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBjb25zdCBhY3RpdmVFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBhY3RpdmVFbGVtZW50ICYmXG4gICAgICAgICAgICB0aGlzLmNlbnRlckVsLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoYWN0aXZlRWxlbWVudClcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsRWxlbWVudEludG9WaWV3KGFjdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgMCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChcbiAgICAgIGNoYW5nZXNbXCJvcHRpb25zXCJdICYmXG4gICAgICBjaGFuZ2VzW1wib3B0aW9uc1wiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJvcHRpb25zXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJ0aXRsZVwiXSAmJlxuICAgICAgY2hhbmdlc1tcInRpdGxlXCJdLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlc1tcInRpdGxlXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJkZXNjcmlwdGlvblwiXSAmJlxuICAgICAgY2hhbmdlc1tcImRlc2NyaXB0aW9uXCJdLmN1cnJlbnRWYWx1ZSAhPT1cbiAgICAgICAgY2hhbmdlc1tcImRlc2NyaXB0aW9uXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJkaXNwbGF5VHlwZVwiXSAmJlxuICAgICAgY2hhbmdlc1tcImRpc3BsYXlUeXBlXCJdLmN1cnJlbnRWYWx1ZSAhPT1cbiAgICAgICAgY2hhbmdlc1tcImRpc3BsYXlUeXBlXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJtb2R1bGVzXCJdICYmXG4gICAgICBjaGFuZ2VzW1wibW9kdWxlc1wiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJtb2R1bGVzXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJmb250U2l6ZVwiXSAmJlxuICAgICAgY2hhbmdlc1tcImZvbnRTaXplXCJdLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlc1tcImZvbnRTaXplXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJ0aGVtZVwiXSAmJlxuICAgICAgY2hhbmdlc1tcInRoZW1lXCJdLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlc1tcInRoZW1lXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJzcGFjaW5nXCJdICYmXG4gICAgICBjaGFuZ2VzW1wic3BhY2luZ1wiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJzcGFjaW5nXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJsYXlvdXRcIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJsYXlvdXRcIl0uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzW1wibGF5b3V0XCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJvdmVybGF5XCJdICYmXG4gICAgICBjaGFuZ2VzW1wib3ZlcmxheVwiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJvdmVybGF5XCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJwb3NpdGlvblwiXSAmJlxuICAgICAgY2hhbmdlc1tcInBvc2l0aW9uXCJdLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlc1tcInBvc2l0aW9uXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJtdWx0aVNlbGVjdGFibGVBY2NvcmRpb25zXCJdICYmXG4gICAgICBjaGFuZ2VzW1wibXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9uc1wiXS5jdXJyZW50VmFsdWUgIT09XG4gICAgICAgIGNoYW5nZXNbXCJtdWx0aVNlbGVjdGFibGVBY2NvcmRpb25zXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIChjaGFuZ2VzW1wibGFuZ3VhZ2VNYXBcIl0gJiYgY2hhbmdlc1tcImxhbmd1YWdlTWFwXCJdLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlc1tcImxhbmd1YWdlTWFwXCJdLnByZXZpb3VzVmFsdWUpIHx8XG4gICAgICAoY2hhbmdlc1tcInNlbGVjdGVkTGFuZ3VhZ2VcIl0gJiYgY2hhbmdlc1tcInNlbGVjdGVkTGFuZ3VhZ2VcIl0uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzW1wic2VsZWN0ZWRMYW5ndWFnZVwiXS5wcmV2aW91c1ZhbHVlKVxuICAgICkge1xuICAgICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcbiAgICB9XG4gIH1cblxuICBzZXR1cE9wdGlvbnMoKSB7XG4gICAgLy8gTWVyZ2UgdGhlIHByb3ZpZGVkIG9wdGlvbnMgd2l0aCB0aGUgZGVmYXVsdCBvbmVzXG4gICAgY29uc3QgbWVyZ2VkT3B0aW9ucyA9IHtcbiAgICAgIC4uLmNyZWF0ZUFjY2Vzc2liaWxpdHlPcHRpb25zKHRoaXMud2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZSwgdGhpcy50cmFuc2xhdGlvbkZuKSxcbiAgICAgIC4uLnRoaXMub3B0aW9ucyxcbiAgICB9O1xuXG4gICAgLy8gSWYgYW4gb3B0aW9uIHdhcyBwYXNzZWQgaW5kaXZpZHVhbGx5LCBvdmVycmlkZSBpbiBtZXJnZWRPcHRpb25zXG4gICAgLy8gRm9yIHRpdGxlL2Rlc2NyaXB0aW9uLCB1c2UgdHJhbnNsYXRpb24gaWYgYXZhaWxhYmxlXG4gICAgbWVyZ2VkT3B0aW9ucy50aXRsZSA9IHRoaXMudHJhbnNsYXRpb25GbigndGl0bGUnLCB0aGlzLnRpdGxlID8/IG1lcmdlZE9wdGlvbnMudGl0bGUgPz8gJ0FjY2Vzc2liaWxpdHkgc2V0dGluZ3MnKTtcbiAgICBtZXJnZWRPcHRpb25zLmRlc2NyaXB0aW9uID0gdGhpcy50cmFuc2xhdGlvbkZuKCdkZXNjcmlwdGlvbicsIHRoaXMuZGVzY3JpcHRpb24gPz8gbWVyZ2VkT3B0aW9ucy5kZXNjcmlwdGlvbiA/PyAnQWRqdXN0IHRoZSBzZXR0aW5ncyBiZWxvdyB0byBjdXN0b21pemUgdGhlIGFwcGVhcmFuY2Ugb2YgdGhpcyB3ZWJzaXRlLicpO1xuXG4gICAgaWYgKHRoaXMuZGlzcGxheVR5cGUpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMuZGlzcGxheVR5cGUgPSB0aGlzLmRpc3BsYXlUeXBlO1xuICAgIH1cbiAgICBpZiAodGhpcy5vdmVybGF5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMub3ZlcmxheSA9IHRoaXMub3ZlcmxheTtcbiAgICB9XG4gICAgaWYgKHRoaXMubXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9ucykge1xuICAgICAgbWVyZ2VkT3B0aW9ucy5tdWx0aVNlbGVjdGFibGVBY2NvcmRpb25zID0gdGhpcy5tdWx0aVNlbGVjdGFibGVBY2NvcmRpb25zO1xuICAgIH1cbiAgICBpZiAodGhpcy5wb3NpdGlvbikge1xuICAgICAgbWVyZ2VkT3B0aW9ucy5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb247XG4gICAgfVxuICAgIGlmICh0aGlzLm1vZHVsZXMpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMuaW5jbHVkZSA9IHRoaXMubW9kdWxlcztcbiAgICB9XG4gICAgaWYgKHRoaXMuZm9udFNpemUpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMuZm9udFNpemUgPSB0aGlzLmZvbnRTaXplO1xuICAgICAgaWYgKFxuICAgICAgICBtZXJnZWRPcHRpb25zLmluY2x1ZGUgJiZcbiAgICAgICAgIW1lcmdlZE9wdGlvbnMuaW5jbHVkZS5pbmNsdWRlcyhcImZvbnRTaXplXCIpXG4gICAgICApIHtcbiAgICAgICAgbWVyZ2VkT3B0aW9ucy5pbmNsdWRlLnB1c2goXCJmb250U2l6ZVwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMudGhlbWUpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMudGhlbWUgPSB0aGlzLnRoZW1lO1xuICAgICAgaWYgKG1lcmdlZE9wdGlvbnMuaW5jbHVkZSAmJiAhbWVyZ2VkT3B0aW9ucy5pbmNsdWRlLmluY2x1ZGVzKFwidGhlbWVcIikpIHtcbiAgICAgICAgbWVyZ2VkT3B0aW9ucy5pbmNsdWRlLnB1c2goXCJ0aGVtZVwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuc3BhY2luZykge1xuICAgICAgbWVyZ2VkT3B0aW9ucy5zcGFjaW5nID0gdGhpcy5zcGFjaW5nO1xuICAgICAgaWYgKG1lcmdlZE9wdGlvbnMuaW5jbHVkZSAmJiAhbWVyZ2VkT3B0aW9ucy5pbmNsdWRlLmluY2x1ZGVzKFwic3BhY2luZ1wiKSkge1xuICAgICAgICBtZXJnZWRPcHRpb25zLmluY2x1ZGUucHVzaChcInNwYWNpbmdcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLmxheW91dCkge1xuICAgICAgbWVyZ2VkT3B0aW9ucy5sYXlvdXQgPSB0aGlzLmxheW91dDtcbiAgICAgIGlmIChtZXJnZWRPcHRpb25zLmluY2x1ZGUgJiYgIW1lcmdlZE9wdGlvbnMuaW5jbHVkZS5pbmNsdWRlcyhcImxheW91dFwiKSkge1xuICAgICAgICBtZXJnZWRPcHRpb25zLmluY2x1ZGUucHVzaChcImxheW91dFwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBOb3cgc3RvcmUgdGhlIGZpbmFsIG1lcmdlZCBvcHRpb25zXG4gICAgdGhpcy5jdXJyZW50T3B0aW9ucyA9IG1lcmdlZE9wdGlvbnM7XG4gICAgdGhpcy5kYXRhID0gdGhpcy5idWlsZERhdGEoKTtcbiAgfVxuXG4gIGJ1aWxkRGF0YSgpIHtcbiAgICAvLyBCdWlsZCB0aGUgZGF0YSBvYmplY3QgdG8gcGFzcyB0byB0aGUgcGFuZWxcbiAgICAvLyBEZXRlcm1pbmUgd2hpY2ggbW9kdWxlcyB0byBpbmNsdWRlIGJhc2VkIG9uIHRoZSBjdXJyZW50IG9wdGlvbnNcbiAgICBjb25zdCBpbmNsdWRlZE1vZHVsZXMgPSB0aGlzLmN1cnJlbnRPcHRpb25zLmluY2x1ZGUgfHwgW107XG4gICAgbGV0IG1vZHVsZURhdGE6IFBhbmVsRGF0YVtcIm1vZHVsZXNcIl0gPSB7fTtcbiAgICBpbmNsdWRlZE1vZHVsZXMuZm9yRWFjaCgobW9kdWxlOiBNb2R1bGVUeXBlcykgPT4ge1xuICAgICAgLy8gQWRkIHRoZSBtb2R1bGUgdG8gdGhlIGRhdGEgb2JqZWN0XG4gICAgICBtb2R1bGVEYXRhW21vZHVsZV0gPSB0aGlzLmN1cnJlbnRPcHRpb25zW21vZHVsZV07XG4gICAgfSk7XG4gICAgY29uc3QgZGF0YTogUGFuZWxEYXRhID0ge1xuICAgICAgdGl0bGU6IHRoaXMuY3VycmVudE9wdGlvbnMudGl0bGUsXG4gICAgICBkZXNjcmlwdGlvbjogdGhpcy5jdXJyZW50T3B0aW9ucy5kZXNjcmlwdGlvbixcbiAgICAgIG1vZHVsZXM6IG1vZHVsZURhdGEsXG4gICAgICBtdWx0aVNlbGVjdGFibGVBY2NvcmRpb25zOlxuICAgICAgICB0aGlzLmN1cnJlbnRPcHRpb25zLm11bHRpU2VsZWN0YWJsZUFjY29yZGlvbnMgfHwgZmFsc2UsXG4gICAgICBwb3NpdGlvbjogdGhpcy5jdXJyZW50T3B0aW9ucy5wb3NpdGlvbiB8fCBcImVuZFwiLFxuICAgIH07XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBwcml2YXRlIHRyYW5zbGF0aW9uRm46IFRyYW5zbGF0aW9uRm4gPSAoa2V5OiBzdHJpbmcsIGZhbGxiYWNrOiBzdHJpbmcpID0+IHtcbiAgICBpZiAoXG4gICAgICB0aGlzLmxhbmd1YWdlTWFwICYmXG4gICAgICB0aGlzLnNlbGVjdGVkTGFuZ3VhZ2UgJiZcbiAgICAgIHRoaXMubGFuZ3VhZ2VNYXBbdGhpcy5zZWxlY3RlZExhbmd1YWdlXSAmJlxuICAgICAgdGhpcy5sYW5ndWFnZU1hcFt0aGlzLnNlbGVjdGVkTGFuZ3VhZ2VdW2tleV1cbiAgICApIHtcbiAgICAgIHJldHVybiB0aGlzLmxhbmd1YWdlTWFwW3RoaXMuc2VsZWN0ZWRMYW5ndWFnZV1ba2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbGxiYWNrO1xuICB9O1xuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmZvY3VzVGltZW91dElkICE9PSBudWxsKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5mb2N1c1RpbWVvdXRJZCk7XG4gICAgICB0aGlzLmZvY3VzVGltZW91dElkID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5kZXN0cm95JC5uZXh0KCk7XG4gICAgdGhpcy5kZXN0cm95JC5jb21wbGV0ZSgpO1xuICB9XG59XG4iXX0=