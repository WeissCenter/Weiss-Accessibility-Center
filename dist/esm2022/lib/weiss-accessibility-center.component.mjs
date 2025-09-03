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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: WeissAccessibilityCenterComponent, deps: [{ token: i1.WeissAccessibilityCenterService }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.8", type: WeissAccessibilityCenterComponent, selector: "weiss-accessibility-center", inputs: { options: "options", title: "title", description: "description", displayType: "displayType", overlay: "overlay", position: "position", modules: "modules", fontSize: "fontSize", theme: "theme", spacing: "spacing", layout: "layout", multiSelectableAccordions: "multiSelectableAccordions" }, host: { listeners: { "keydown": "handleKeyboardEvent($event)" } }, viewQueries: [{ propertyName: "centerEl", first: true, predicate: ["center"], descendants: true, read: ElementRef }], usesOnChanges: true, ngImport: i0, template: `
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i3.StripComponent, selector: "weiss-accessibility-strip", inputs: ["data", "closeSelectionPanel"], outputs: ["statusMessageChange"] }, { kind: "component", type: i4.PanelComponent, selector: "weiss-accessibility-panel", inputs: ["data"], outputs: ["statusMessageChange"] }], encapsulation: i0.ViewEncapsulation.None });
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
            }], handleKeyboardEvent: [{
                type: HostListener,
                args: ["keydown", ["$event"]]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUVMLFNBQVMsRUFDVCxpQkFBaUIsRUFJakIsVUFBVSxFQUNYLE1BQU0sZUFBZSxDQUFDO0FBVXZCLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7Ozs7QUFtRDFDLE1BQU0sT0FBTyxpQ0FBaUM7SUFvQ25DO0lBQ0M7SUFwQ2lDLFFBQVEsQ0FBMkI7SUFFckUsT0FBTyxDQUFtQztJQUMxQyxLQUFLLENBQXFCO0lBQzFCLFdBQVcsQ0FBcUI7SUFDaEMsV0FBVyxDQUEwQjtJQUNyQyxPQUFPLENBQXNCO0lBQzdCLFFBQVEsQ0FBOEI7SUFDdEMsT0FBTyxDQUE0QjtJQUNuQyxRQUFRLENBQTRCO0lBQ3BDLEtBQUssQ0FBNEI7SUFDakMsT0FBTyxDQUE0QjtJQUNuQyxNQUFNLENBQTRCO0lBQ2xDLHlCQUF5QixDQUFzQjtJQUV4RCwrREFBK0Q7SUFDL0QsY0FBYyxDQUF1QjtJQUU5Qiw0QkFBNEIsR0FBRyxLQUFLLENBQUM7SUFDckMsSUFBSSxDQUF3QjtJQUUzQixxQkFBcUIsR0FBdUIsSUFBSSxDQUFDO0lBQ2pELG9CQUFvQixHQUF1QixJQUFJLENBQUM7SUFDaEQsdUJBQXVCLEdBQzdCLDBQQUEwUCxDQUFDO0lBRXRQLGFBQWEsR0FBVyxFQUFFLENBQUM7SUFDM0Isd0JBQXdCLEdBQVksS0FBSyxDQUFDO0lBRXpDLGNBQWMsR0FBa0IsSUFBSSxDQUFDO0lBQ3JDLFFBQVEsR0FBRyxJQUFJLE9BQU8sRUFB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VUFBVSxDQUFDLENBQUMsWUFBWSxLQUFLLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxhQUFhLEVBQ3RFLENBQUM7WUFDRCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDdEIsQ0FBQzthQUFNLElBQ0wsT0FBTyxDQUFDLE9BQU8sQ0FBQztZQUNoQixPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWSxLQUFLLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxhQUFhLEVBQ2hFLENBQUM7WUFDRCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDdEIsQ0FBQzthQUFNLElBQ0wsT0FBTyxDQUFDLFNBQVMsQ0FBQztZQUNsQixPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsWUFBWSxLQUFLLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxhQUFhLEVBQ3BFLENBQUM7WUFDRCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDdEIsQ0FBQzthQUFNLElBQ0wsT0FBTyxDQUFDLFFBQVEsQ0FBQztZQUNqQixPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsWUFBWSxLQUFLLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxhQUFhLEVBQ2xFLENBQUM7WUFDRCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDdEIsQ0FBQzthQUFNLElBQ0wsT0FBTyxDQUFDLFNBQVMsQ0FBQztZQUNsQixPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsWUFBWSxLQUFLLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxhQUFhLEVBQ3BFLENBQUM7WUFDRCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDdEIsQ0FBQzthQUFNLElBQ0wsT0FBTyxDQUFDLFVBQVUsQ0FBQztZQUNuQixPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsWUFBWSxLQUFLLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxhQUFhLEVBQ3RFLENBQUM7WUFDRCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDdEIsQ0FBQzthQUFNLElBQ0wsT0FBTyxDQUFDLDJCQUEyQixD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QUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1FBQzdCLENBQUM7UUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDM0IsQ0FBQzt1R0F4U1UsaUNBQWlDOzJGQUFqQyxpQ0FBaUMsOGZBQ2YsVUFBVSxrREFoRDdCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRDVDs7MkZBR1UsaUNBQWlDO2tCQWpEN0MsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsNEJBQTRCO29CQUN0QyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNENUO29CQUNELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2lCQUN0Qzs0SEFFNEMsUUFBUTtzQkFBbEQsU0FBUzt1QkFBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO2dCQUVoQyxPQUFPO3NCQUFmLEtBQUs7Z0JBQ0csS0FBSztzQkFBYixLQUFLO2dCQUNHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFDRyxPQUFPO3NCQUFmLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxPQUFPO3NCQUFmLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxLQUFLO3NCQUFiLEtBQUs7Z0JBQ0csT0FBTztzQkFBZixLQUFLO2dCQUNHLE1BQU07c0JBQWQsS0FBSztnQkFDRyx5QkFBeUI7c0JBQWpDLEtBQUs7Z0JBb0ZOLG1CQUFtQjtzQkFEbEIsWUFBWTt1QkFBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5wdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE9uRGVzdHJveSxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgUmVuZGVyZXIyLFxuICBFbGVtZW50UmVmXG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQge1xuICBBY2Nlc3NpYmlsaXR5T3B0aW9ucyxcbiAgRGlzcGxheVR5cGUsXG4gIE1vZHVsZU9wdGlvbnMsXG4gIE1vZHVsZVR5cGVzLFxuICBQYW5lbERhdGEsXG4gIFBvc2l0aW9uT3B0aW9ucyxcbn0gZnJvbSBcIi4vd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuaW50ZXJmYWNlc1wiO1xuaW1wb3J0IHsgV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZSB9IGZyb20gXCIuL3dlaXNzLWFjY2Vzc2liaWxpdHktY2VudGVyLnNlcnZpY2VcIjtcbmltcG9ydCB7IGNyZWF0ZUFjY2Vzc2liaWxpdHlPcHRpb25zIH0gZnJvbSBcIi4vd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuZmFjdG9yeVwiO1xuaW1wb3J0IHsgU3ViamVjdCwgdGFrZVVudGlsIH0gZnJvbSBcInJ4anNcIjtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiBcIndlaXNzLWFjY2Vzc2liaWxpdHktY2VudGVyXCIsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdlxuICAgICAgcm9sZT1cImRpYWxvZ1wiXG4gICAgICBhcmlhLWxhYmVsbGVkYnk9XCJhY2Nlc3NpYmlsaXR5Q2VudGVyVGl0bGVcIlxuICAgICAgYXJpYS1tb2RhbD1cInRydWVcIlxuICAgICAgW2F0dHIubmFtZV09XCJhY2Nlc3NpYmxlTmFtZVwiXG4gICAgICBbaGlkZGVuXT1cIiFzaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyXCJcbiAgICAgICNjZW50ZXJcbiAgICA+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzPVwiYmFja2dyb3VuZC1vdmVybGF5XCJcbiAgICAgICAgKm5nSWY9XCJjdXJyZW50T3B0aW9ucy5vdmVybGF5XCJcbiAgICAgICAgKGNsaWNrKT1cIlxuICAgICAgICAgIHdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2UudG9nZ2xlV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyKFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIHRydWVcbiAgICAgICAgICApXG4gICAgICAgIFwiXG4gICAgICA+PC9kaXY+XG4gICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiY3VycmVudE9wdGlvbnMuZGlzcGxheVR5cGUgPT09ICdwYW5lbCdcIj5cbiAgICAgICAgPHdlaXNzLWFjY2Vzc2liaWxpdHktcGFuZWxcbiAgICAgICAgICAoc3RhdHVzTWVzc2FnZUNoYW5nZSk9XCJvblN0YXR1c01lc3NhZ2VDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgICAgW2RhdGFdPVwiZGF0YVwiXG4gICAgICAgID48L3dlaXNzLWFjY2Vzc2liaWxpdHktcGFuZWw+XG4gICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJjdXJyZW50T3B0aW9ucy5kaXNwbGF5VHlwZSA9PT0gJ3N0cmlwJ1wiPlxuICAgICAgICA8d2Vpc3MtYWNjZXNzaWJpbGl0eS1zdHJpcFxuICAgICAgICAgIFtjbG9zZVNlbGVjdGlvblBhbmVsXT1cImZvcmNlQ2xvc2VTZWxlY3Rpb25QYW5lbFwiXG4gICAgICAgICAgKHN0YXR1c01lc3NhZ2VDaGFuZ2UpPVwib25TdGF0dXNNZXNzYWdlQ2hhbmdlKCRldmVudClcIlxuICAgICAgICAgIFtkYXRhXT1cImRhdGFcIlxuICAgICAgICA+PC93ZWlzcy1hY2Nlc3NpYmlsaXR5LXN0cmlwPlxuICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiY3VycmVudE9wdGlvbnMuZGlzcGxheVR5cGUgPT09ICdwb3BvdmVyJ1wiPlxuICAgICAgICA8IS0tIDx3ZWlzcy1hY2Nlc3NpYmlsaXR5LXBvcG92ZXI+PC93ZWlzcy1hY2Nlc3NpYmlsaXR5LXBvcG92ZXI+IC0tPlxuICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICA8ZGl2XG4gICAgICAgIGFyaWEtbGl2ZT1cInBvbGl0ZVwiXG4gICAgICAgIGlkPVwic3RhdHVzTWVzc2FnZVwiXG4gICAgICAgICpuZ0lmPVwic3RhdHVzTWVzc2FnZVwiXG4gICAgICAgIGNsYXNzPVwidmlzdWFsbHktaGlkZGVuXCJcbiAgICAgID5cbiAgICAgICAge3sgc3RhdHVzTWVzc2FnZSB9fVxuICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICBgLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQge1xuICBAVmlld0NoaWxkKFwiY2VudGVyXCIsIHsgcmVhZDogRWxlbWVudFJlZiB9KSBjZW50ZXJFbCE6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIEBJbnB1dCgpIG9wdGlvbnM6IEFjY2Vzc2liaWxpdHlPcHRpb25zIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSB0aXRsZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBkZXNjcmlwdGlvbjogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBkaXNwbGF5VHlwZTogRGlzcGxheVR5cGUgfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIG92ZXJsYXk6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIHBvc2l0aW9uOiBQb3NpdGlvbk9wdGlvbnMgfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIG1vZHVsZXM6IE1vZHVsZVR5cGVzW10gfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIGZvbnRTaXplOiBNb2R1bGVPcHRpb25zIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSB0aGVtZTogTW9kdWxlT3B0aW9ucyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgc3BhY2luZzogTW9kdWxlT3B0aW9ucyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgbGF5b3V0OiBNb2R1bGVPcHRpb25zIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBtdWx0aVNlbGVjdGFibGVBY2NvcmRpb25zOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXG4gIC8vIE1lcmdlZCBvcHRpb25zIG9iamVjdCB0aGF0IHdpbGwgYmUgdXNlZCB3aXRoaW4gdGhlIGNvbXBvbmVudFxuICBjdXJyZW50T3B0aW9uczogQWNjZXNzaWJpbGl0eU9wdGlvbnM7XG5cbiAgcHVibGljIHNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIgPSBmYWxzZTtcbiAgcHVibGljIGRhdGE6IFBhbmVsRGF0YSB8IHVuZGVmaW5lZDtcblxuICBwcml2YXRlIGZpcnN0Rm9jdXNhYmxlRWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBsYXN0Rm9jdXNhYmxlRWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBmb2N1c2FibGVFbGVtZW50c1N0cmluZyA9XG4gICAgJ2FbaHJlZl0sIGFyZWFbaHJlZl0sIGlucHV0Om5vdChbZGlzYWJsZWRdKSwgc2VsZWN0Om5vdChbZGlzYWJsZWRdKSwgdGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pLCBidXR0b246bm90KFtkaXNhYmxlZF0pLCBpZnJhbWUsIG9iamVjdCwgZW1iZWQsIFt0YWJpbmRleD1cIjBcIl0sIFtjb250ZW50ZWRpdGFibGVdLCBsaVt0YWJpbmRleD1cIjBcIl0sIGxpW3RhYmluZGV4PVwiLTFcIl0sIHRyW3RhYmluZGV4PVwiMFwiXSwgdHJbdGFiaW5kZXg9XCItMVwiXSc7XG5cbiAgcHVibGljIHN0YXR1c01lc3NhZ2U6IHN0cmluZyA9IFwiXCI7XG4gIHB1YmxpYyBmb3JjZUNsb3NlU2VsZWN0aW9uUGFuZWw6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwcml2YXRlIGZvY3VzVGltZW91dElkOiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBkZXN0cm95JCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgcHVibGljIGFjY2Vzc2libGVOYW1lID0gXCJXZWlzcyBBY2Nlc3NpYmlsaXR5IENlbnRlclwiO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyB3ZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlOiBXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMlxuICApIHtcbiAgICB0aGlzLmN1cnJlbnRPcHRpb25zID0gY3JlYXRlQWNjZXNzaWJpbGl0eU9wdGlvbnMoXG4gICAgICB0aGlzLndlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2VcbiAgICApO1xuICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG5cbiAgICB0aGlzLndlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2Uuc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlciRcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSlcbiAgICAgIC5zdWJzY3JpYmUoKHNob3cpID0+IHtcbiAgICAgICAgdGhpcy5zaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyID0gc2hvdztcbiAgICAgICAgdGhpcy5mb3JjZUNsb3NlU2VsZWN0aW9uUGFuZWwgPSAhc2hvdztcblxuICAgICAgICBpZiAoIXNob3cgJiYgdGhpcy5mb2N1c1RpbWVvdXRJZCAhPT0gbnVsbCkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmZvY3VzVGltZW91dElkKTtcbiAgICAgICAgICB0aGlzLmZvY3VzVGltZW91dElkID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaG93KSB7XG4gICAgICAgICAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHMgPVxuICAgICAgICAgICAgdGhpcy5jZW50ZXJFbD8ubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgICAgICB0aGlzLmZvY3VzYWJsZUVsZW1lbnRzU3RyaW5nXG4gICAgICAgICAgICApIGFzIE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+O1xuICAgICAgICAgIHRoaXMuZmlyc3RGb2N1c2FibGVFbGVtZW50ID0gZm9jdXNhYmxlRWxlbWVudHNbMF07XG4gICAgICAgICAgdGhpcy5sYXN0Rm9jdXNhYmxlRWxlbWVudCA9XG4gICAgICAgICAgICBmb2N1c2FibGVFbGVtZW50c1tmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxXTtcblxuICAgICAgICAgIHRoaXMuZm9jdXNUaW1lb3V0SWQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZpcnN0Rm9jdXNhYmxlRWxlbWVudD8uZm9jdXMoKTtcbiAgICAgICAgICAgIHRoaXMuZm9jdXNUaW1lb3V0SWQgPSBudWxsO1xuICAgICAgICAgIH0sIDApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICAvLyBBcHBseSBpZCB0byB0aGUgYWN0dWFsIDxkaXY+IGFmdGVyIGl0J3MgaW4gdGhlIERPTVxuICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMuY2VudGVyRWwubmF0aXZlRWxlbWVudCwgJ2lkJywgJ3dlaXNzLWFjY2Vzc2liaWxpdHktY2VudGVyJyk7XG4gICAgdGhpcy53ZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlLnRhcmdldElkJFxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgLnN1YnNjcmliZSgoaWQpID0+IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBpZCA/PyAnd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXInO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLmNlbnRlckVsLm5hdGl2ZUVsZW1lbnQsICdpZCcsIHZhbHVlKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgLy8gVGhpcyBtZXRob2QgaXMgdHJpZ2dlcmVkIHdoZW4gdGhlIGNoaWxkIGNvbXBvbmVudCBlbWl0cyBhIG5ldyBzdGF0dXMgbWVzc2FnZVxuICBvblN0YXR1c01lc3NhZ2VDaGFuZ2UobmV3TWVzc2FnZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zdGF0dXNNZXNzYWdlID0gbmV3TWVzc2FnZTtcbiAgfVxuXG4gIHByaXZhdGUgc2Nyb2xsRWxlbWVudEludG9WaWV3KGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICBlbGVtZW50LnNjcm9sbEludG9WaWV3KHtcbiAgICAgIGJlaGF2aW9yOiBcInNtb290aFwiLFxuICAgICAgYmxvY2s6IFwiY2VudGVyXCIsXG4gICAgfSk7XG4gIH1cblxuICAvLyBDbG9zZSBwYW5lbCB3aGVuIHVzZXIgaGl0cyBlc2NhcGUga2V5XG4gIC8vIFRyYXAgZm9jdXMgd2l0aGluIHRoZSBhY2Nlc3NpYmlsaXR5IGNlbnRlclxuICBASG9zdExpc3RlbmVyKFwia2V5ZG93blwiLCBbXCIkZXZlbnRcIl0pXG4gIGhhbmRsZUtleWJvYXJkRXZlbnQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAodGhpcy5zaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyKSB7XG4gICAgICBjb25zdCBkZWVwQWN0aXZlRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICBpZiAoZXZlbnQua2V5ID09PSBcIlRhYlwiKSB7XG4gICAgICAgIGlmIChldmVudC5zaGlmdEtleSkge1xuICAgICAgICAgIC8qIHNoaWZ0ICsgdGFiICovXG4gICAgICAgICAgaWYgKGRlZXBBY3RpdmVFbGVtZW50ID09PSB0aGlzLmZpcnN0Rm9jdXNhYmxlRWxlbWVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMubGFzdEZvY3VzYWJsZUVsZW1lbnQ/LmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8qIHRhYiAqL1xuICAgICAgICAgIGlmIChkZWVwQWN0aXZlRWxlbWVudCA9PT0gdGhpcy5sYXN0Rm9jdXNhYmxlRWxlbWVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuZmlyc3RGb2N1c2FibGVFbGVtZW50Py5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNjcm9sbEVsZW1lbnRJbnRvVmlldyhkZWVwQWN0aXZlRWxlbWVudCBhcyBFbGVtZW50KTtcbiAgICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5ID09PSBcIkVzY2FwZVwiKSB7XG4gICAgICAgIHRoaXMud2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZS50b2dnbGVXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIoXG4gICAgICAgICAgbnVsbCxcbiAgICAgICAgICB0cnVlXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc3RhdHVzTWVzc2FnZSA9IFwiQWNjZXNzaWJpbGl0eSBjZW50ZXIgY2xvc2VkXCI7XG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleSA9PT0gXCJBcnJvd1VwXCIgfHwgZXZlbnQua2V5ID09PSBcIkFycm93RG93blwiKSB7XG4gICAgICAgIC8vIFdhaXQgZm9yIERPTSB1cGRhdGVcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgYWN0aXZlRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgYWN0aXZlRWxlbWVudCAmJlxuICAgICAgICAgICAgdGhpcy5jZW50ZXJFbC5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGFjdGl2ZUVsZW1lbnQpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbEVsZW1lbnRJbnRvVmlldyhhY3RpdmVFbGVtZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoXG4gICAgICBjaGFuZ2VzW1wib3B0aW9uc1wiXSAmJlxuICAgICAgY2hhbmdlc1tcIm9wdGlvbnNcIl0uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzW1wib3B0aW9uc1wiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1widGl0bGVcIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJ0aXRsZVwiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJ0aXRsZVwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wiZGVzY3JpcHRpb25cIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJkZXNjcmlwdGlvblwiXS5jdXJyZW50VmFsdWUgIT09XG4gICAgICAgIGNoYW5nZXNbXCJkZXNjcmlwdGlvblwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wiZGlzcGxheVR5cGVcIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJkaXNwbGF5VHlwZVwiXS5jdXJyZW50VmFsdWUgIT09XG4gICAgICAgIGNoYW5nZXNbXCJkaXNwbGF5VHlwZVwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wibW9kdWxlc1wiXSAmJlxuICAgICAgY2hhbmdlc1tcIm1vZHVsZXNcIl0uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzW1wibW9kdWxlc1wiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wiZm9udFNpemVcIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJmb250U2l6ZVwiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJmb250U2l6ZVwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1widGhlbWVcIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJ0aGVtZVwiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJ0aGVtZVwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wic3BhY2luZ1wiXSAmJlxuICAgICAgY2hhbmdlc1tcInNwYWNpbmdcIl0uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzW1wic3BhY2luZ1wiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wibGF5b3V0XCJdICYmXG4gICAgICBjaGFuZ2VzW1wibGF5b3V0XCJdLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlc1tcImxheW91dFwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wib3ZlcmxheVwiXSAmJlxuICAgICAgY2hhbmdlc1tcIm92ZXJsYXlcIl0uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzW1wib3ZlcmxheVwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wicG9zaXRpb25cIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJwb3NpdGlvblwiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJwb3NpdGlvblwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wibXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9uc1wiXSAmJlxuICAgICAgY2hhbmdlc1tcIm11bHRpU2VsZWN0YWJsZUFjY29yZGlvbnNcIl0uY3VycmVudFZhbHVlICE9PVxuICAgICAgICBjaGFuZ2VzW1wibXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9uc1wiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH1cbiAgfVxuXG4gIHNldHVwT3B0aW9ucygpIHtcbiAgICAvLyBNZXJnZSB0aGUgcHJvdmlkZWQgb3B0aW9ucyB3aXRoIHRoZSBkZWZhdWx0IG9uZXNcbiAgICBjb25zdCBtZXJnZWRPcHRpb25zID0ge1xuICAgICAgLi4uY3JlYXRlQWNjZXNzaWJpbGl0eU9wdGlvbnModGhpcy53ZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlKSxcbiAgICAgIC4uLnRoaXMub3B0aW9ucyxcbiAgICB9O1xuXG4gICAgLy8gSWYgYW4gb3B0aW9uIHdhcyBwYXNzZWQgaW5kaXZpZHVhbGx5LCBvdmVycmlkZSBpbiBtZXJnZWRPcHRpb25zXG4gICAgaWYgKHRoaXMudGl0bGUpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMudGl0bGUgPSB0aGlzLnRpdGxlO1xuICAgIH1cbiAgICBpZiAodGhpcy5kZXNjcmlwdGlvbikge1xuICAgICAgbWVyZ2VkT3B0aW9ucy5kZXNjcmlwdGlvbiA9IHRoaXMuZGVzY3JpcHRpb247XG4gICAgfVxuICAgIGlmICh0aGlzLmRpc3BsYXlUeXBlKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLmRpc3BsYXlUeXBlID0gdGhpcy5kaXNwbGF5VHlwZTtcbiAgICB9XG4gICAgaWYgKHRoaXMub3ZlcmxheSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLm92ZXJsYXkgPSB0aGlzLm92ZXJsYXk7XG4gICAgfVxuICAgIGlmICh0aGlzLm11bHRpU2VsZWN0YWJsZUFjY29yZGlvbnMpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMubXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9ucyA9IHRoaXMubXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9ucztcbiAgICB9XG4gICAgaWYgKHRoaXMucG9zaXRpb24pIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMucG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uO1xuICAgIH1cbiAgICBpZiAodGhpcy5tb2R1bGVzKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLmluY2x1ZGUgPSB0aGlzLm1vZHVsZXM7XG4gICAgfVxuICAgIGlmICh0aGlzLmZvbnRTaXplKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLmZvbnRTaXplID0gdGhpcy5mb250U2l6ZTtcbiAgICAgIC8vIElmIGZvbnRTaXplIHdhcyBwYXNzZWQgaW4gc3BlY2lmaWNhbGx5LCBjaGVjayB0byBiZSBzdXJlIGl0J3MgaW5jbHVkZWQgaW4gdGhlIG1vZHVsZXMgbGlzdC4gSWYgbm90LCBhZGQgaXQuXG4gICAgICBpZiAoXG4gICAgICAgIG1lcmdlZE9wdGlvbnMuaW5jbHVkZSAmJlxuICAgICAgICAhbWVyZ2VkT3B0aW9ucy5pbmNsdWRlLmluY2x1ZGVzKFwiZm9udFNpemVcIilcbiAgICAgICkge1xuICAgICAgICBtZXJnZWRPcHRpb25zLmluY2x1ZGUucHVzaChcImZvbnRTaXplXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy50aGVtZSkge1xuICAgICAgbWVyZ2VkT3B0aW9ucy50aGVtZSA9IHRoaXMudGhlbWU7XG4gICAgICBpZiAobWVyZ2VkT3B0aW9ucy5pbmNsdWRlICYmICFtZXJnZWRPcHRpb25zLmluY2x1ZGUuaW5jbHVkZXMoXCJ0aGVtZVwiKSkge1xuICAgICAgICBtZXJnZWRPcHRpb25zLmluY2x1ZGUucHVzaChcInRoZW1lXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5zcGFjaW5nKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLnNwYWNpbmcgPSB0aGlzLnNwYWNpbmc7XG4gICAgICBpZiAobWVyZ2VkT3B0aW9ucy5pbmNsdWRlICYmICFtZXJnZWRPcHRpb25zLmluY2x1ZGUuaW5jbHVkZXMoXCJzcGFjaW5nXCIpKSB7XG4gICAgICAgIG1lcmdlZE9wdGlvbnMuaW5jbHVkZS5wdXNoKFwic3BhY2luZ1wiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMubGF5b3V0KSB7XG4gICAgICBtZXJnZWRPcHRpb25zLmxheW91dCA9IHRoaXMubGF5b3V0O1xuICAgICAgaWYgKG1lcmdlZE9wdGlvbnMuaW5jbHVkZSAmJiAhbWVyZ2VkT3B0aW9ucy5pbmNsdWRlLmluY2x1ZGVzKFwibGF5b3V0XCIpKSB7XG4gICAgICAgIG1lcmdlZE9wdGlvbnMuaW5jbHVkZS5wdXNoKFwibGF5b3V0XCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE5vdyBzdG9yZSB0aGUgZmluYWwgbWVyZ2VkIG9wdGlvbnNcbiAgICB0aGlzLmN1cnJlbnRPcHRpb25zID0gbWVyZ2VkT3B0aW9ucztcbiAgICB0aGlzLmRhdGEgPSB0aGlzLmJ1aWxkRGF0YSgpO1xuICB9XG5cbiAgYnVpbGREYXRhKCkge1xuICAgIC8vIEJ1aWxkIHRoZSBkYXRhIG9iamVjdCB0byBwYXNzIHRvIHRoZSBwYW5lbFxuICAgIC8vIERldGVybWluZSB3aGljaCBtb2R1bGVzIHRvIGluY2x1ZGUgYmFzZWQgb24gdGhlIGN1cnJlbnQgb3B0aW9uc1xuICAgIGNvbnN0IGluY2x1ZGVkTW9kdWxlcyA9IHRoaXMuY3VycmVudE9wdGlvbnMuaW5jbHVkZSB8fCBbXTtcbiAgICBsZXQgbW9kdWxlRGF0YTogUGFuZWxEYXRhW1wibW9kdWxlc1wiXSA9IHt9O1xuICAgIGluY2x1ZGVkTW9kdWxlcy5mb3JFYWNoKChtb2R1bGU6IE1vZHVsZVR5cGVzKSA9PiB7XG4gICAgICAvLyBBZGQgdGhlIG1vZHVsZSB0byB0aGUgZGF0YSBvYmplY3RcbiAgICAgIG1vZHVsZURhdGFbbW9kdWxlXSA9IHRoaXMuY3VycmVudE9wdGlvbnNbbW9kdWxlXTtcbiAgICB9KTtcbiAgICBjb25zdCBkYXRhOiBQYW5lbERhdGEgPSB7XG4gICAgICB0aXRsZTogdGhpcy5jdXJyZW50T3B0aW9ucy50aXRsZSB8fCBcIkFjY2Vzc2liaWxpdHkgc2V0dGluZ3NcIixcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICB0aGlzLmN1cnJlbnRPcHRpb25zLmRlc2NyaXB0aW9uIHx8XG4gICAgICAgIFwiQWRqdXN0IHRoZSBzZXR0aW5ncyBiZWxvdyB0byBjdXN0b21pemUgdGhlIGFwcGVhcmFuY2Ugb2YgdGhpcyB3ZWJzaXRlLlwiLFxuICAgICAgbW9kdWxlczogbW9kdWxlRGF0YSxcbiAgICAgIG11bHRpU2VsZWN0YWJsZUFjY29yZGlvbnM6XG4gICAgICAgIHRoaXMuY3VycmVudE9wdGlvbnMubXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9ucyB8fCBmYWxzZSxcbiAgICAgIHBvc2l0aW9uOiB0aGlzLmN1cnJlbnRPcHRpb25zLnBvc2l0aW9uIHx8IFwiZW5kXCIsXG4gICAgfTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmZvY3VzVGltZW91dElkICE9PSBudWxsKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5mb2N1c1RpbWVvdXRJZCk7XG4gICAgICB0aGlzLmZvY3VzVGltZW91dElkID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5kZXN0cm95JC5uZXh0KCk7XG4gICAgdGhpcy5kZXN0cm95JC5jb21wbGV0ZSgpO1xuICB9XG59XG4iXX0=