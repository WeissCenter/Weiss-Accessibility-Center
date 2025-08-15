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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: WeissAccessibilityCenterComponent, deps: [{ token: i1.WeissAccessibilityCenterService }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component });
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i3.StripComponent, selector: "weiss-accessibility-strip", inputs: ["data", "closeSelectionPanel"], outputs: ["statusMessageChange"] }, { kind: "component", type: i4.PanelComponent, selector: "weiss-accessibility-panel", inputs: ["data"], outputs: ["statusMessageChange"] }], encapsulation: i0.ViewEncapsulation.None });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUVMLFNBQVMsRUFDVCxpQkFBaUIsRUFJakIsVUFBVSxFQUNYLE1BQU0sZUFBZSxDQUFDO0FBVXZCLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7Ozs7QUFpRDFDLE1BQU0sT0FBTyxpQ0FBaUM7SUFrQ25DO0lBQ0M7SUFsQ2lDLFFBQVEsQ0FBMkI7SUFFckUsT0FBTyxDQUFtQztJQUMxQyxLQUFLLENBQXFCO0lBQzFCLFdBQVcsQ0FBcUI7SUFDaEMsV0FBVyxDQUEwQjtJQUNyQyxPQUFPLENBQXNCO0lBQzdCLFFBQVEsQ0FBOEI7SUFDdEMsT0FBTyxDQUE0QjtJQUNuQyxRQUFRLENBQTRCO0lBQ3BDLEtBQUssQ0FBNEI7SUFDakMsT0FBTyxDQUE0QjtJQUNuQyxNQUFNLENBQTRCO0lBQ2xDLHlCQUF5QixDQUFzQjtJQUV4RCwrREFBK0Q7SUFDL0QsY0FBYyxDQUF1QjtJQUU5Qiw0QkFBNEIsR0FBRyxLQUFLLENBQUM7SUFDckMsSUFBSSxDQUF3QjtJQUUzQixxQkFBcUIsR0FBdUIsSUFBSSxDQUFDO0lBQ2pELG9CQUFvQixHQUF1QixJQUFJLENBQUM7SUFDaEQsdUJBQXVCLEdBQzdCLDBQQUEwUCxDQUFDO0lBRXRQLGFBQWEsR0FBVyxFQUFFLENBQUM7SUFDM0Isd0JBQXdCLEdBQVksS0FBSyxDQUFDO0lBRXpDLGNBQWMsR0FBa0IsSUFBSSxDQUFDO0lBQ3JDLFFBQVEsR0FBRyxJQUFJLE9BQU8sRUFB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QUMzQixDQUFDO3VHQXJTVSxpQ0FBaUM7MkZBQWpDLGlDQUFpQyw4ZkFDZixVQUFVLGtEQTlDN0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTBDVDs7MkZBR1UsaUNBQWlDO2tCQS9DN0MsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsNEJBQTRCO29CQUN0QyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTBDVDtvQkFDRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtpQkFDdEM7NEhBRTRDLFFBQVE7c0JBQWxELFNBQVM7dUJBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRTtnQkFFaEMsT0FBTztzQkFBZixLQUFLO2dCQUNHLEtBQUs7c0JBQWIsS0FBSztnQkFDRyxXQUFXO3NCQUFuQixLQUFLO2dCQUNHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBQ0csT0FBTztzQkFBZixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csT0FBTztzQkFBZixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csS0FBSztzQkFBYixLQUFLO2dCQUNHLE9BQU87c0JBQWYsS0FBSztnQkFDRyxNQUFNO3NCQUFkLEtBQUs7Z0JBQ0cseUJBQXlCO3NCQUFqQyxLQUFLO2dCQWlGTixtQkFBbUI7c0JBRGxCLFlBQVk7dUJBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBIb3N0TGlzdGVuZXIsXG4gIElucHV0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBPbkRlc3Ryb3ksXG4gIEFmdGVyVmlld0luaXQsXG4gIFJlbmRlcmVyMixcbiAgRWxlbWVudFJlZlxufSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHtcbiAgQWNjZXNzaWJpbGl0eU9wdGlvbnMsXG4gIERpc3BsYXlUeXBlLFxuICBNb2R1bGVPcHRpb25zLFxuICBNb2R1bGVUeXBlcyxcbiAgUGFuZWxEYXRhLFxuICBQb3NpdGlvbk9wdGlvbnMsXG59IGZyb20gXCIuL3dlaXNzLWFjY2Vzc2liaWxpdHktY2VudGVyLmludGVyZmFjZXNcIjtcbmltcG9ydCB7IFdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2UgfSBmcm9tIFwiLi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5zZXJ2aWNlXCI7XG5pbXBvcnQgeyBjcmVhdGVBY2Nlc3NpYmlsaXR5T3B0aW9ucyB9IGZyb20gXCIuL3dlaXNzLWFjY2Vzc2liaWxpdHktY2VudGVyLmZhY3RvcnlcIjtcbmltcG9ydCB7IFN1YmplY3QsIHRha2VVbnRpbCB9IGZyb20gXCJyeGpzXCI7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogXCJ3ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlclwiLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxhcnRpY2xlXG4gICAgICByb2xlPVwiZGlhbG9nXCJcbiAgICAgIGFyaWEtbW9kYWw9XCJ0cnVlXCJcbiAgICAgIFtoaWRkZW5dPVwiIXNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJcIlxuICAgICAgI2NlbnRlclxuICAgID5cbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3M9XCJiYWNrZ3JvdW5kLW92ZXJsYXlcIlxuICAgICAgICAqbmdJZj1cImN1cnJlbnRPcHRpb25zLm92ZXJsYXlcIlxuICAgICAgICAoY2xpY2spPVwiXG4gICAgICAgICAgd2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZS50b2dnbGVXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIoXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgIClcbiAgICAgICAgXCJcbiAgICAgID48L2Rpdj5cbiAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJjdXJyZW50T3B0aW9ucy5kaXNwbGF5VHlwZSA9PT0gJ3BhbmVsJ1wiPlxuICAgICAgICA8d2Vpc3MtYWNjZXNzaWJpbGl0eS1wYW5lbFxuICAgICAgICAgIChzdGF0dXNNZXNzYWdlQ2hhbmdlKT1cIm9uU3RhdHVzTWVzc2FnZUNoYW5nZSgkZXZlbnQpXCJcbiAgICAgICAgICBbZGF0YV09XCJkYXRhXCJcbiAgICAgICAgPjwvd2Vpc3MtYWNjZXNzaWJpbGl0eS1wYW5lbD5cbiAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImN1cnJlbnRPcHRpb25zLmRpc3BsYXlUeXBlID09PSAnc3RyaXAnXCI+XG4gICAgICAgIDx3ZWlzcy1hY2Nlc3NpYmlsaXR5LXN0cmlwXG4gICAgICAgICAgW2Nsb3NlU2VsZWN0aW9uUGFuZWxdPVwiZm9yY2VDbG9zZVNlbGVjdGlvblBhbmVsXCJcbiAgICAgICAgICAoc3RhdHVzTWVzc2FnZUNoYW5nZSk9XCJvblN0YXR1c01lc3NhZ2VDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgICAgW2RhdGFdPVwiZGF0YVwiXG4gICAgICAgID48L3dlaXNzLWFjY2Vzc2liaWxpdHktc3RyaXA+XG4gICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJjdXJyZW50T3B0aW9ucy5kaXNwbGF5VHlwZSA9PT0gJ3BvcG92ZXInXCI+XG4gICAgICAgIDwhLS0gPHdlaXNzLWFjY2Vzc2liaWxpdHktcG9wb3Zlcj48L3dlaXNzLWFjY2Vzc2liaWxpdHktcG9wb3Zlcj4gLS0+XG4gICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgIDxkaXZcbiAgICAgICAgYXJpYS1saXZlPVwicG9saXRlXCJcbiAgICAgICAgaWQ9XCJzdGF0dXNNZXNzYWdlXCJcbiAgICAgICAgKm5nSWY9XCJzdGF0dXNNZXNzYWdlXCJcbiAgICAgICAgY2xhc3M9XCJ2aXN1YWxseS1oaWRkZW5cIlxuICAgICAgPlxuICAgICAgICB7eyBzdGF0dXNNZXNzYWdlIH19XG4gICAgICA8L2Rpdj5cbiAgICA8L2FydGljbGU+XG4gIGAsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIFdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCB7XG4gIEBWaWV3Q2hpbGQoXCJjZW50ZXJcIiwgeyByZWFkOiBFbGVtZW50UmVmIH0pIGNlbnRlckVsITogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgQElucHV0KCkgb3B0aW9uczogQWNjZXNzaWJpbGl0eU9wdGlvbnMgfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIHRpdGxlOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIGRlc2NyaXB0aW9uOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIGRpc3BsYXlUeXBlOiBEaXNwbGF5VHlwZSB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgb3ZlcmxheTogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgcG9zaXRpb246IFBvc2l0aW9uT3B0aW9ucyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgbW9kdWxlczogTW9kdWxlVHlwZXNbXSB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgZm9udFNpemU6IE1vZHVsZU9wdGlvbnMgfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIHRoZW1lOiBNb2R1bGVPcHRpb25zIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBzcGFjaW5nOiBNb2R1bGVPcHRpb25zIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBsYXlvdXQ6IE1vZHVsZU9wdGlvbnMgfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIG11bHRpU2VsZWN0YWJsZUFjY29yZGlvbnM6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cbiAgLy8gTWVyZ2VkIG9wdGlvbnMgb2JqZWN0IHRoYXQgd2lsbCBiZSB1c2VkIHdpdGhpbiB0aGUgY29tcG9uZW50XG4gIGN1cnJlbnRPcHRpb25zOiBBY2Nlc3NpYmlsaXR5T3B0aW9ucztcblxuICBwdWJsaWMgc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlciA9IGZhbHNlO1xuICBwdWJsaWMgZGF0YTogUGFuZWxEYXRhIHwgdW5kZWZpbmVkO1xuXG4gIHByaXZhdGUgZmlyc3RGb2N1c2FibGVFbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGxhc3RGb2N1c2FibGVFbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGZvY3VzYWJsZUVsZW1lbnRzU3RyaW5nID1cbiAgICAnYVtocmVmXSwgYXJlYVtocmVmXSwgaW5wdXQ6bm90KFtkaXNhYmxlZF0pLCBzZWxlY3Q6bm90KFtkaXNhYmxlZF0pLCB0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSksIGJ1dHRvbjpub3QoW2Rpc2FibGVkXSksIGlmcmFtZSwgb2JqZWN0LCBlbWJlZCwgW3RhYmluZGV4PVwiMFwiXSwgW2NvbnRlbnRlZGl0YWJsZV0sIGxpW3RhYmluZGV4PVwiMFwiXSwgbGlbdGFiaW5kZXg9XCItMVwiXSwgdHJbdGFiaW5kZXg9XCIwXCJdLCB0clt0YWJpbmRleD1cIi0xXCJdJztcblxuICBwdWJsaWMgc3RhdHVzTWVzc2FnZTogc3RyaW5nID0gXCJcIjtcbiAgcHVibGljIGZvcmNlQ2xvc2VTZWxlY3Rpb25QYW5lbDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHByaXZhdGUgZm9jdXNUaW1lb3V0SWQ6IG51bWJlciB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGRlc3Ryb3kkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgd2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZTogV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZSxcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjJcbiAgKSB7XG4gICAgdGhpcy5jdXJyZW50T3B0aW9ucyA9IGNyZWF0ZUFjY2Vzc2liaWxpdHlPcHRpb25zKFxuICAgICAgdGhpcy53ZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlXG4gICAgKTtcbiAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuXG4gICAgdGhpcy53ZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlLnNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIkXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXG4gICAgICAuc3Vic2NyaWJlKChzaG93KSA9PiB7XG4gICAgICAgIHRoaXMuc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlciA9IHNob3c7XG4gICAgICAgIHRoaXMuZm9yY2VDbG9zZVNlbGVjdGlvblBhbmVsID0gIXNob3c7XG5cbiAgICAgICAgaWYgKCFzaG93ICYmIHRoaXMuZm9jdXNUaW1lb3V0SWQgIT09IG51bGwpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5mb2N1c1RpbWVvdXRJZCk7XG4gICAgICAgICAgdGhpcy5mb2N1c1RpbWVvdXRJZCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2hvdykge1xuICAgICAgICAgIGNvbnN0IGZvY3VzYWJsZUVsZW1lbnRzID1cbiAgICAgICAgICAgIHRoaXMuY2VudGVyRWw/Lm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgICAgICAgdGhpcy5mb2N1c2FibGVFbGVtZW50c1N0cmluZ1xuICAgICAgICAgICAgKSBhcyBOb2RlTGlzdE9mPEhUTUxFbGVtZW50PjtcbiAgICAgICAgICB0aGlzLmZpcnN0Rm9jdXNhYmxlRWxlbWVudCA9IGZvY3VzYWJsZUVsZW1lbnRzWzBdO1xuICAgICAgICAgIHRoaXMubGFzdEZvY3VzYWJsZUVsZW1lbnQgPVxuICAgICAgICAgICAgZm9jdXNhYmxlRWxlbWVudHNbZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0gMV07XG5cbiAgICAgICAgICB0aGlzLmZvY3VzVGltZW91dElkID0gd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5maXJzdEZvY3VzYWJsZUVsZW1lbnQ/LmZvY3VzKCk7XG4gICAgICAgICAgICB0aGlzLmZvY3VzVGltZW91dElkID0gbnVsbDtcbiAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgLy8gQXBwbHkgaWQgdG8gdGhlIGFjdHVhbCA8YXJ0aWNsZT4gYWZ0ZXIgaXQncyBpbiB0aGUgRE9NXG4gICAgdGhpcy53ZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlLnRhcmdldElkJFxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgLnN1YnNjcmliZSgoaWQpID0+IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBpZCA/PyAnd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXInO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLmNlbnRlckVsLm5hdGl2ZUVsZW1lbnQsICdpZCcsIHZhbHVlKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgLy8gVGhpcyBtZXRob2QgaXMgdHJpZ2dlcmVkIHdoZW4gdGhlIGNoaWxkIGNvbXBvbmVudCBlbWl0cyBhIG5ldyBzdGF0dXMgbWVzc2FnZVxuICBvblN0YXR1c01lc3NhZ2VDaGFuZ2UobmV3TWVzc2FnZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zdGF0dXNNZXNzYWdlID0gbmV3TWVzc2FnZTtcbiAgfVxuXG4gIHByaXZhdGUgc2Nyb2xsRWxlbWVudEludG9WaWV3KGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICBlbGVtZW50LnNjcm9sbEludG9WaWV3KHtcbiAgICAgIGJlaGF2aW9yOiBcInNtb290aFwiLFxuICAgICAgYmxvY2s6IFwiY2VudGVyXCIsXG4gICAgfSk7XG4gIH1cblxuICAvLyBDbG9zZSBwYW5lbCB3aGVuIHVzZXIgaGl0cyBlc2NhcGUga2V5XG4gIC8vIFRyYXAgZm9jdXMgd2l0aGluIHRoZSBhY2Nlc3NpYmlsaXR5IGNlbnRlclxuICBASG9zdExpc3RlbmVyKFwia2V5ZG93blwiLCBbXCIkZXZlbnRcIl0pXG4gIGhhbmRsZUtleWJvYXJkRXZlbnQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAodGhpcy5zaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyKSB7XG4gICAgICBjb25zdCBkZWVwQWN0aXZlRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICBpZiAoZXZlbnQua2V5ID09PSBcIlRhYlwiKSB7XG4gICAgICAgIGlmIChldmVudC5zaGlmdEtleSkge1xuICAgICAgICAgIC8qIHNoaWZ0ICsgdGFiICovXG4gICAgICAgICAgaWYgKGRlZXBBY3RpdmVFbGVtZW50ID09PSB0aGlzLmZpcnN0Rm9jdXNhYmxlRWxlbWVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMubGFzdEZvY3VzYWJsZUVsZW1lbnQ/LmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8qIHRhYiAqL1xuICAgICAgICAgIGlmIChkZWVwQWN0aXZlRWxlbWVudCA9PT0gdGhpcy5sYXN0Rm9jdXNhYmxlRWxlbWVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuZmlyc3RGb2N1c2FibGVFbGVtZW50Py5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNjcm9sbEVsZW1lbnRJbnRvVmlldyhkZWVwQWN0aXZlRWxlbWVudCBhcyBFbGVtZW50KTtcbiAgICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5ID09PSBcIkVzY2FwZVwiKSB7XG4gICAgICAgIHRoaXMud2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZS50b2dnbGVXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIoXG4gICAgICAgICAgbnVsbCxcbiAgICAgICAgICB0cnVlXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc3RhdHVzTWVzc2FnZSA9IFwiQWNjZXNzaWJpbGl0eSBjZW50ZXIgY2xvc2VkXCI7XG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleSA9PT0gXCJBcnJvd1VwXCIgfHwgZXZlbnQua2V5ID09PSBcIkFycm93RG93blwiKSB7XG4gICAgICAgIC8vIFdhaXQgZm9yIERPTSB1cGRhdGVcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgYWN0aXZlRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgYWN0aXZlRWxlbWVudCAmJlxuICAgICAgICAgICAgdGhpcy5jZW50ZXJFbC5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGFjdGl2ZUVsZW1lbnQpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbEVsZW1lbnRJbnRvVmlldyhhY3RpdmVFbGVtZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoXG4gICAgICBjaGFuZ2VzW1wib3B0aW9uc1wiXSAmJlxuICAgICAgY2hhbmdlc1tcIm9wdGlvbnNcIl0uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzW1wib3B0aW9uc1wiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1widGl0bGVcIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJ0aXRsZVwiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJ0aXRsZVwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wiZGVzY3JpcHRpb25cIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJkZXNjcmlwdGlvblwiXS5jdXJyZW50VmFsdWUgIT09XG4gICAgICAgIGNoYW5nZXNbXCJkZXNjcmlwdGlvblwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wiZGlzcGxheVR5cGVcIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJkaXNwbGF5VHlwZVwiXS5jdXJyZW50VmFsdWUgIT09XG4gICAgICAgIGNoYW5nZXNbXCJkaXNwbGF5VHlwZVwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wibW9kdWxlc1wiXSAmJlxuICAgICAgY2hhbmdlc1tcIm1vZHVsZXNcIl0uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzW1wibW9kdWxlc1wiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wiZm9udFNpemVcIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJmb250U2l6ZVwiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJmb250U2l6ZVwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1widGhlbWVcIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJ0aGVtZVwiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJ0aGVtZVwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wic3BhY2luZ1wiXSAmJlxuICAgICAgY2hhbmdlc1tcInNwYWNpbmdcIl0uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzW1wic3BhY2luZ1wiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wibGF5b3V0XCJdICYmXG4gICAgICBjaGFuZ2VzW1wibGF5b3V0XCJdLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlc1tcImxheW91dFwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wib3ZlcmxheVwiXSAmJlxuICAgICAgY2hhbmdlc1tcIm92ZXJsYXlcIl0uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzW1wib3ZlcmxheVwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wicG9zaXRpb25cIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJwb3NpdGlvblwiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJwb3NpdGlvblwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wibXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9uc1wiXSAmJlxuICAgICAgY2hhbmdlc1tcIm11bHRpU2VsZWN0YWJsZUFjY29yZGlvbnNcIl0uY3VycmVudFZhbHVlICE9PVxuICAgICAgICBjaGFuZ2VzW1wibXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9uc1wiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH1cbiAgfVxuXG4gIHNldHVwT3B0aW9ucygpIHtcbiAgICAvLyBNZXJnZSB0aGUgcHJvdmlkZWQgb3B0aW9ucyB3aXRoIHRoZSBkZWZhdWx0IG9uZXNcbiAgICBjb25zdCBtZXJnZWRPcHRpb25zID0ge1xuICAgICAgLi4uY3JlYXRlQWNjZXNzaWJpbGl0eU9wdGlvbnModGhpcy53ZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlKSxcbiAgICAgIC4uLnRoaXMub3B0aW9ucyxcbiAgICB9O1xuXG4gICAgLy8gSWYgYW4gb3B0aW9uIHdhcyBwYXNzZWQgaW5kaXZpZHVhbGx5LCBvdmVycmlkZSBpbiBtZXJnZWRPcHRpb25zXG4gICAgaWYgKHRoaXMudGl0bGUpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMudGl0bGUgPSB0aGlzLnRpdGxlO1xuICAgIH1cbiAgICBpZiAodGhpcy5kZXNjcmlwdGlvbikge1xuICAgICAgbWVyZ2VkT3B0aW9ucy5kZXNjcmlwdGlvbiA9IHRoaXMuZGVzY3JpcHRpb247XG4gICAgfVxuICAgIGlmICh0aGlzLmRpc3BsYXlUeXBlKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLmRpc3BsYXlUeXBlID0gdGhpcy5kaXNwbGF5VHlwZTtcbiAgICB9XG4gICAgaWYgKHRoaXMub3ZlcmxheSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLm92ZXJsYXkgPSB0aGlzLm92ZXJsYXk7XG4gICAgfVxuICAgIGlmICh0aGlzLm11bHRpU2VsZWN0YWJsZUFjY29yZGlvbnMpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMubXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9ucyA9IHRoaXMubXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9ucztcbiAgICB9XG4gICAgaWYgKHRoaXMucG9zaXRpb24pIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMucG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uO1xuICAgIH1cbiAgICBpZiAodGhpcy5tb2R1bGVzKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLmluY2x1ZGUgPSB0aGlzLm1vZHVsZXM7XG4gICAgfVxuICAgIGlmICh0aGlzLmZvbnRTaXplKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLmZvbnRTaXplID0gdGhpcy5mb250U2l6ZTtcbiAgICAgIC8vIElmIGZvbnRTaXplIHdhcyBwYXNzZWQgaW4gc3BlY2lmaWNhbGx5LCBjaGVjayB0byBiZSBzdXJlIGl0J3MgaW5jbHVkZWQgaW4gdGhlIG1vZHVsZXMgbGlzdC4gSWYgbm90LCBhZGQgaXQuXG4gICAgICBpZiAoXG4gICAgICAgIG1lcmdlZE9wdGlvbnMuaW5jbHVkZSAmJlxuICAgICAgICAhbWVyZ2VkT3B0aW9ucy5pbmNsdWRlLmluY2x1ZGVzKFwiZm9udFNpemVcIilcbiAgICAgICkge1xuICAgICAgICBtZXJnZWRPcHRpb25zLmluY2x1ZGUucHVzaChcImZvbnRTaXplXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy50aGVtZSkge1xuICAgICAgbWVyZ2VkT3B0aW9ucy50aGVtZSA9IHRoaXMudGhlbWU7XG4gICAgICBpZiAobWVyZ2VkT3B0aW9ucy5pbmNsdWRlICYmICFtZXJnZWRPcHRpb25zLmluY2x1ZGUuaW5jbHVkZXMoXCJ0aGVtZVwiKSkge1xuICAgICAgICBtZXJnZWRPcHRpb25zLmluY2x1ZGUucHVzaChcInRoZW1lXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5zcGFjaW5nKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLnNwYWNpbmcgPSB0aGlzLnNwYWNpbmc7XG4gICAgICBpZiAobWVyZ2VkT3B0aW9ucy5pbmNsdWRlICYmICFtZXJnZWRPcHRpb25zLmluY2x1ZGUuaW5jbHVkZXMoXCJzcGFjaW5nXCIpKSB7XG4gICAgICAgIG1lcmdlZE9wdGlvbnMuaW5jbHVkZS5wdXNoKFwic3BhY2luZ1wiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMubGF5b3V0KSB7XG4gICAgICBtZXJnZWRPcHRpb25zLmxheW91dCA9IHRoaXMubGF5b3V0O1xuICAgICAgaWYgKG1lcmdlZE9wdGlvbnMuaW5jbHVkZSAmJiAhbWVyZ2VkT3B0aW9ucy5pbmNsdWRlLmluY2x1ZGVzKFwibGF5b3V0XCIpKSB7XG4gICAgICAgIG1lcmdlZE9wdGlvbnMuaW5jbHVkZS5wdXNoKFwibGF5b3V0XCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE5vdyBzdG9yZSB0aGUgZmluYWwgbWVyZ2VkIG9wdGlvbnNcbiAgICB0aGlzLmN1cnJlbnRPcHRpb25zID0gbWVyZ2VkT3B0aW9ucztcbiAgICB0aGlzLmRhdGEgPSB0aGlzLmJ1aWxkRGF0YSgpO1xuICB9XG5cbiAgYnVpbGREYXRhKCkge1xuICAgIC8vIEJ1aWxkIHRoZSBkYXRhIG9iamVjdCB0byBwYXNzIHRvIHRoZSBwYW5lbFxuICAgIC8vIERldGVybWluZSB3aGljaCBtb2R1bGVzIHRvIGluY2x1ZGUgYmFzZWQgb24gdGhlIGN1cnJlbnQgb3B0aW9uc1xuICAgIGNvbnN0IGluY2x1ZGVkTW9kdWxlcyA9IHRoaXMuY3VycmVudE9wdGlvbnMuaW5jbHVkZSB8fCBbXTtcbiAgICBsZXQgbW9kdWxlRGF0YTogUGFuZWxEYXRhW1wibW9kdWxlc1wiXSA9IHt9O1xuICAgIGluY2x1ZGVkTW9kdWxlcy5mb3JFYWNoKChtb2R1bGU6IE1vZHVsZVR5cGVzKSA9PiB7XG4gICAgICAvLyBBZGQgdGhlIG1vZHVsZSB0byB0aGUgZGF0YSBvYmplY3RcbiAgICAgIG1vZHVsZURhdGFbbW9kdWxlXSA9IHRoaXMuY3VycmVudE9wdGlvbnNbbW9kdWxlXTtcbiAgICB9KTtcbiAgICBjb25zdCBkYXRhOiBQYW5lbERhdGEgPSB7XG4gICAgICB0aXRsZTogdGhpcy5jdXJyZW50T3B0aW9ucy50aXRsZSB8fCBcIkFjY2Vzc2liaWxpdHkgc2V0dGluZ3NcIixcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICB0aGlzLmN1cnJlbnRPcHRpb25zLmRlc2NyaXB0aW9uIHx8XG4gICAgICAgIFwiQWRqdXN0IHRoZSBzZXR0aW5ncyBiZWxvdyB0byBjdXN0b21pemUgdGhlIGFwcGVhcmFuY2Ugb2YgdGhpcyB3ZWJzaXRlLlwiLFxuICAgICAgbW9kdWxlczogbW9kdWxlRGF0YSxcbiAgICAgIG11bHRpU2VsZWN0YWJsZUFjY29yZGlvbnM6XG4gICAgICAgIHRoaXMuY3VycmVudE9wdGlvbnMubXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9ucyB8fCBmYWxzZSxcbiAgICAgIHBvc2l0aW9uOiB0aGlzLmN1cnJlbnRPcHRpb25zLnBvc2l0aW9uIHx8IFwiZW5kXCIsXG4gICAgfTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmZvY3VzVGltZW91dElkICE9PSBudWxsKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5mb2N1c1RpbWVvdXRJZCk7XG4gICAgICB0aGlzLmZvY3VzVGltZW91dElkID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5kZXN0cm95JC5uZXh0KCk7XG4gICAgdGhpcy5kZXN0cm95JC5jb21wbGV0ZSgpO1xuICB9XG59XG4iXX0=