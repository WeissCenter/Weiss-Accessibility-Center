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
        // this.weissAccessibilityCenterService.targetId$
        //   .pipe(takeUntil(this.destroy$))
        //   .subscribe((id) => {
        //     const value = id ?? 'weiss-accessibility-center';
        //     this.renderer.setAttribute(this.centerEl.nativeElement, 'id', value);
        //   });
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
      id="blargh"
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
      id="blargh"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUVMLFNBQVMsRUFDVCxpQkFBaUIsRUFJakIsVUFBVSxFQUNYLE1BQU0sZUFBZSxDQUFDO0FBVXZCLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7Ozs7QUFrRDFDLE1BQU0sT0FBTyxpQ0FBaUM7SUFrQ25DO0lBQ0M7SUFsQ2lDLFFBQVEsQ0FBMkI7SUFFckUsT0FBTyxDQUFtQztJQUMxQyxLQUFLLENBQXFCO0lBQzFCLFdBQVcsQ0FBcUI7SUFDaEMsV0FBVyxDQUEwQjtJQUNyQyxPQUFPLENBQXNCO0lBQzdCLFFBQVEsQ0FBOEI7SUFDdEMsT0FBTyxDQUE0QjtJQUNuQyxRQUFRLENBQTRCO0lBQ3BDLEtBQUssQ0FBNEI7SUFDakMsT0FBTyxDQUE0QjtJQUNuQyxNQUFNLENBQTRCO0lBQ2xDLHlCQUF5QixDQUFzQjtJQUV4RCwrREFBK0Q7SUFDL0QsY0FBYyxDQUF1QjtJQUU5Qiw0QkFBNEIsR0FBRyxLQUFLLENBQUM7SUFDckMsSUFBSSxDQUF3QjtJQUUzQixxQkFBcUIsR0FBdUIsSUFBSSxDQUFDO0lBQ2pELG9CQUFvQixHQUF1QixJQUFJLENBQUM7SUFDaEQsdUJBQXVCLEdBQzdCLDBQQUEwUCxDQUFDO0lBRXRQLGFBQWEsR0FBVyxFQUFFLENBQUM7SUFDM0Isd0JBQXdCLEdBQVksS0FBSyxDQUFDO0lBRXpDLGNBQWMsR0FBa0IsSUFBSSxDQUFDO0lBQ3JDLFFBQVEsR0FBRyxJQUFJLE9BQU8sRUFB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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EyQ1Q7b0JBQ0QsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7aUJBQ3RDOzRIQUU0QyxRQUFRO3NCQUFsRCxTQUFTO3VCQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7Z0JBRWhDLE9BQU87c0JBQWYsS0FBSztnQkFDRyxLQUFLO3NCQUFiLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFDRyxXQUFXO3NCQUFuQixLQUFLO2dCQUNHLE9BQU87c0JBQWYsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLE9BQU87c0JBQWYsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLEtBQUs7c0JBQWIsS0FBSztnQkFDRyxPQUFPO3NCQUFmLEtBQUs7Z0JBQ0csTUFBTTtzQkFBZCxLQUFLO2dCQUNHLHlCQUF5QjtzQkFBakMsS0FBSztnQkFpRk4sbUJBQW1CO3NCQURsQixZQUFZO3VCQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSG9zdExpc3RlbmVyLFxuICBJbnB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbiAgT25EZXN0cm95LFxuICBBZnRlclZpZXdJbml0LFxuICBSZW5kZXJlcjIsXG4gIEVsZW1lbnRSZWZcbn0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7XG4gIEFjY2Vzc2liaWxpdHlPcHRpb25zLFxuICBEaXNwbGF5VHlwZSxcbiAgTW9kdWxlT3B0aW9ucyxcbiAgTW9kdWxlVHlwZXMsXG4gIFBhbmVsRGF0YSxcbiAgUG9zaXRpb25PcHRpb25zLFxufSBmcm9tIFwiLi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5pbnRlcmZhY2VzXCI7XG5pbXBvcnQgeyBXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlIH0gZnJvbSBcIi4vd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuc2VydmljZVwiO1xuaW1wb3J0IHsgY3JlYXRlQWNjZXNzaWJpbGl0eU9wdGlvbnMgfSBmcm9tIFwiLi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5mYWN0b3J5XCI7XG5pbXBvcnQgeyBTdWJqZWN0LCB0YWtlVW50aWwgfSBmcm9tIFwicnhqc1wiO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6IFwid2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXJcIixcbiAgdGVtcGxhdGU6IGBcbiAgICA8YXJ0aWNsZVxuICAgICAgcm9sZT1cImRpYWxvZ1wiXG4gICAgICBhcmlhLW1vZGFsPVwidHJ1ZVwiXG4gICAgICBbaGlkZGVuXT1cIiFzaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyXCJcbiAgICAgIGlkPVwiYmxhcmdoXCJcbiAgICAgICNjZW50ZXJcbiAgICA+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzPVwiYmFja2dyb3VuZC1vdmVybGF5XCJcbiAgICAgICAgKm5nSWY9XCJjdXJyZW50T3B0aW9ucy5vdmVybGF5XCJcbiAgICAgICAgKGNsaWNrKT1cIlxuICAgICAgICAgIHdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2UudG9nZ2xlV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyKFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIHRydWVcbiAgICAgICAgICApXG4gICAgICAgIFwiXG4gICAgICA+PC9kaXY+XG4gICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiY3VycmVudE9wdGlvbnMuZGlzcGxheVR5cGUgPT09ICdwYW5lbCdcIj5cbiAgICAgICAgPHdlaXNzLWFjY2Vzc2liaWxpdHktcGFuZWxcbiAgICAgICAgICAoc3RhdHVzTWVzc2FnZUNoYW5nZSk9XCJvblN0YXR1c01lc3NhZ2VDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgICAgW2RhdGFdPVwiZGF0YVwiXG4gICAgICAgID48L3dlaXNzLWFjY2Vzc2liaWxpdHktcGFuZWw+XG4gICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJjdXJyZW50T3B0aW9ucy5kaXNwbGF5VHlwZSA9PT0gJ3N0cmlwJ1wiPlxuICAgICAgICA8d2Vpc3MtYWNjZXNzaWJpbGl0eS1zdHJpcFxuICAgICAgICAgIFtjbG9zZVNlbGVjdGlvblBhbmVsXT1cImZvcmNlQ2xvc2VTZWxlY3Rpb25QYW5lbFwiXG4gICAgICAgICAgKHN0YXR1c01lc3NhZ2VDaGFuZ2UpPVwib25TdGF0dXNNZXNzYWdlQ2hhbmdlKCRldmVudClcIlxuICAgICAgICAgIFtkYXRhXT1cImRhdGFcIlxuICAgICAgICA+PC93ZWlzcy1hY2Nlc3NpYmlsaXR5LXN0cmlwPlxuICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiY3VycmVudE9wdGlvbnMuZGlzcGxheVR5cGUgPT09ICdwb3BvdmVyJ1wiPlxuICAgICAgICA8IS0tIDx3ZWlzcy1hY2Nlc3NpYmlsaXR5LXBvcG92ZXI+PC93ZWlzcy1hY2Nlc3NpYmlsaXR5LXBvcG92ZXI+IC0tPlxuICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICA8ZGl2XG4gICAgICAgIGFyaWEtbGl2ZT1cInBvbGl0ZVwiXG4gICAgICAgIGlkPVwic3RhdHVzTWVzc2FnZVwiXG4gICAgICAgICpuZ0lmPVwic3RhdHVzTWVzc2FnZVwiXG4gICAgICAgIGNsYXNzPVwidmlzdWFsbHktaGlkZGVuXCJcbiAgICAgID5cbiAgICAgICAge3sgc3RhdHVzTWVzc2FnZSB9fVxuICAgICAgPC9kaXY+XG4gICAgPC9hcnRpY2xlPlxuICBgLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQge1xuICBAVmlld0NoaWxkKFwiY2VudGVyXCIsIHsgcmVhZDogRWxlbWVudFJlZiB9KSBjZW50ZXJFbCE6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIEBJbnB1dCgpIG9wdGlvbnM6IEFjY2Vzc2liaWxpdHlPcHRpb25zIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSB0aXRsZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBkZXNjcmlwdGlvbjogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBkaXNwbGF5VHlwZTogRGlzcGxheVR5cGUgfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIG92ZXJsYXk6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIHBvc2l0aW9uOiBQb3NpdGlvbk9wdGlvbnMgfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIG1vZHVsZXM6IE1vZHVsZVR5cGVzW10gfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIGZvbnRTaXplOiBNb2R1bGVPcHRpb25zIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSB0aGVtZTogTW9kdWxlT3B0aW9ucyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgc3BhY2luZzogTW9kdWxlT3B0aW9ucyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgbGF5b3V0OiBNb2R1bGVPcHRpb25zIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBtdWx0aVNlbGVjdGFibGVBY2NvcmRpb25zOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXG4gIC8vIE1lcmdlZCBvcHRpb25zIG9iamVjdCB0aGF0IHdpbGwgYmUgdXNlZCB3aXRoaW4gdGhlIGNvbXBvbmVudFxuICBjdXJyZW50T3B0aW9uczogQWNjZXNzaWJpbGl0eU9wdGlvbnM7XG5cbiAgcHVibGljIHNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIgPSBmYWxzZTtcbiAgcHVibGljIGRhdGE6IFBhbmVsRGF0YSB8IHVuZGVmaW5lZDtcblxuICBwcml2YXRlIGZpcnN0Rm9jdXNhYmxlRWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBsYXN0Rm9jdXNhYmxlRWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBmb2N1c2FibGVFbGVtZW50c1N0cmluZyA9XG4gICAgJ2FbaHJlZl0sIGFyZWFbaHJlZl0sIGlucHV0Om5vdChbZGlzYWJsZWRdKSwgc2VsZWN0Om5vdChbZGlzYWJsZWRdKSwgdGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pLCBidXR0b246bm90KFtkaXNhYmxlZF0pLCBpZnJhbWUsIG9iamVjdCwgZW1iZWQsIFt0YWJpbmRleD1cIjBcIl0sIFtjb250ZW50ZWRpdGFibGVdLCBsaVt0YWJpbmRleD1cIjBcIl0sIGxpW3RhYmluZGV4PVwiLTFcIl0sIHRyW3RhYmluZGV4PVwiMFwiXSwgdHJbdGFiaW5kZXg9XCItMVwiXSc7XG5cbiAgcHVibGljIHN0YXR1c01lc3NhZ2U6IHN0cmluZyA9IFwiXCI7XG4gIHB1YmxpYyBmb3JjZUNsb3NlU2VsZWN0aW9uUGFuZWw6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwcml2YXRlIGZvY3VzVGltZW91dElkOiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBkZXN0cm95JCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2U6IFdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyXG4gICkge1xuICAgIHRoaXMuY3VycmVudE9wdGlvbnMgPSBjcmVhdGVBY2Nlc3NpYmlsaXR5T3B0aW9ucyhcbiAgICAgIHRoaXMud2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZVxuICAgICk7XG4gICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcblxuICAgIHRoaXMud2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZS5zaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyJFxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgLnN1YnNjcmliZSgoc2hvdykgPT4ge1xuICAgICAgICB0aGlzLnNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIgPSBzaG93O1xuICAgICAgICB0aGlzLmZvcmNlQ2xvc2VTZWxlY3Rpb25QYW5lbCA9ICFzaG93O1xuXG4gICAgICAgIGlmICghc2hvdyAmJiB0aGlzLmZvY3VzVGltZW91dElkICE9PSBudWxsKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZm9jdXNUaW1lb3V0SWQpO1xuICAgICAgICAgIHRoaXMuZm9jdXNUaW1lb3V0SWQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNob3cpIHtcbiAgICAgICAgICBjb25zdCBmb2N1c2FibGVFbGVtZW50cyA9XG4gICAgICAgICAgICB0aGlzLmNlbnRlckVsPy5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgICAgIHRoaXMuZm9jdXNhYmxlRWxlbWVudHNTdHJpbmdcbiAgICAgICAgICAgICkgYXMgTm9kZUxpc3RPZjxIVE1MRWxlbWVudD47XG4gICAgICAgICAgdGhpcy5maXJzdEZvY3VzYWJsZUVsZW1lbnQgPSBmb2N1c2FibGVFbGVtZW50c1swXTtcbiAgICAgICAgICB0aGlzLmxhc3RGb2N1c2FibGVFbGVtZW50ID1cbiAgICAgICAgICAgIGZvY3VzYWJsZUVsZW1lbnRzW2ZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgICAgdGhpcy5mb2N1c1RpbWVvdXRJZCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmlyc3RGb2N1c2FibGVFbGVtZW50Py5mb2N1cygpO1xuICAgICAgICAgICAgdGhpcy5mb2N1c1RpbWVvdXRJZCA9IG51bGw7XG4gICAgICAgICAgfSwgMCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIC8vIEFwcGx5IGlkIHRvIHRoZSBhY3R1YWwgPGFydGljbGU+IGFmdGVyIGl0J3MgaW4gdGhlIERPTVxuICAgIC8vIHRoaXMud2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZS50YXJnZXRJZCRcbiAgICAvLyAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSlcbiAgICAvLyAgIC5zdWJzY3JpYmUoKGlkKSA9PiB7XG4gICAgLy8gICAgIGNvbnN0IHZhbHVlID0gaWQgPz8gJ3dlaXNzLWFjY2Vzc2liaWxpdHktY2VudGVyJztcbiAgICAvLyAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5jZW50ZXJFbC5uYXRpdmVFbGVtZW50LCAnaWQnLCB2YWx1ZSk7XG4gICAgLy8gICB9KTtcbiAgfVxuXG4gIC8vIFRoaXMgbWV0aG9kIGlzIHRyaWdnZXJlZCB3aGVuIHRoZSBjaGlsZCBjb21wb25lbnQgZW1pdHMgYSBuZXcgc3RhdHVzIG1lc3NhZ2VcbiAgb25TdGF0dXNNZXNzYWdlQ2hhbmdlKG5ld01lc3NhZ2U6IHN0cmluZykge1xuICAgIHRoaXMuc3RhdHVzTWVzc2FnZSA9IG5ld01lc3NhZ2U7XG4gIH1cblxuICBwcml2YXRlIHNjcm9sbEVsZW1lbnRJbnRvVmlldyhlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgZWxlbWVudC5zY3JvbGxJbnRvVmlldyh7XG4gICAgICBiZWhhdmlvcjogXCJzbW9vdGhcIixcbiAgICAgIGJsb2NrOiBcImNlbnRlclwiLFxuICAgIH0pO1xuICB9XG5cbiAgLy8gQ2xvc2UgcGFuZWwgd2hlbiB1c2VyIGhpdHMgZXNjYXBlIGtleVxuICAvLyBUcmFwIGZvY3VzIHdpdGhpbiB0aGUgYWNjZXNzaWJpbGl0eSBjZW50ZXJcbiAgQEhvc3RMaXN0ZW5lcihcImtleWRvd25cIiwgW1wiJGV2ZW50XCJdKVxuICBoYW5kbGVLZXlib2FyZEV2ZW50KGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKHRoaXMuc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlcikge1xuICAgICAgY29uc3QgZGVlcEFjdGl2ZUVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgICAgaWYgKGV2ZW50LmtleSA9PT0gXCJUYWJcIikge1xuICAgICAgICBpZiAoZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgICAvKiBzaGlmdCArIHRhYiAqL1xuICAgICAgICAgIGlmIChkZWVwQWN0aXZlRWxlbWVudCA9PT0gdGhpcy5maXJzdEZvY3VzYWJsZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmxhc3RGb2N1c2FibGVFbGVtZW50Py5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvKiB0YWIgKi9cbiAgICAgICAgICBpZiAoZGVlcEFjdGl2ZUVsZW1lbnQgPT09IHRoaXMubGFzdEZvY3VzYWJsZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmZpcnN0Rm9jdXNhYmxlRWxlbWVudD8uZm9jdXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zY3JvbGxFbGVtZW50SW50b1ZpZXcoZGVlcEFjdGl2ZUVsZW1lbnQgYXMgRWxlbWVudCk7XG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleSA9PT0gXCJFc2NhcGVcIikge1xuICAgICAgICB0aGlzLndlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2UudG9nZ2xlV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyKFxuICAgICAgICAgIG51bGwsXG4gICAgICAgICAgdHJ1ZVxuICAgICAgICApO1xuICAgICAgICB0aGlzLnN0YXR1c01lc3NhZ2UgPSBcIkFjY2Vzc2liaWxpdHkgY2VudGVyIGNsb3NlZFwiO1xuICAgICAgfSBlbHNlIGlmIChldmVudC5rZXkgPT09IFwiQXJyb3dVcFwiIHx8IGV2ZW50LmtleSA9PT0gXCJBcnJvd0Rvd25cIikge1xuICAgICAgICAvLyBXYWl0IGZvciBET00gdXBkYXRlXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGFjdGl2ZUVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGFjdGl2ZUVsZW1lbnQgJiZcbiAgICAgICAgICAgIHRoaXMuY2VudGVyRWwubmF0aXZlRWxlbWVudC5jb250YWlucyhhY3RpdmVFbGVtZW50KVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxFbGVtZW50SW50b1ZpZXcoYWN0aXZlRWxlbWVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCAwKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKFxuICAgICAgY2hhbmdlc1tcIm9wdGlvbnNcIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJvcHRpb25zXCJdLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlc1tcIm9wdGlvbnNcIl0ucHJldmlvdXNWYWx1ZVxuICAgICkge1xuICAgICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgY2hhbmdlc1tcInRpdGxlXCJdICYmXG4gICAgICBjaGFuZ2VzW1widGl0bGVcIl0uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzW1widGl0bGVcIl0ucHJldmlvdXNWYWx1ZVxuICAgICkge1xuICAgICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgY2hhbmdlc1tcImRlc2NyaXB0aW9uXCJdICYmXG4gICAgICBjaGFuZ2VzW1wiZGVzY3JpcHRpb25cIl0uY3VycmVudFZhbHVlICE9PVxuICAgICAgICBjaGFuZ2VzW1wiZGVzY3JpcHRpb25cIl0ucHJldmlvdXNWYWx1ZVxuICAgICkge1xuICAgICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgY2hhbmdlc1tcImRpc3BsYXlUeXBlXCJdICYmXG4gICAgICBjaGFuZ2VzW1wiZGlzcGxheVR5cGVcIl0uY3VycmVudFZhbHVlICE9PVxuICAgICAgICBjaGFuZ2VzW1wiZGlzcGxheVR5cGVcIl0ucHJldmlvdXNWYWx1ZVxuICAgICkge1xuICAgICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgY2hhbmdlc1tcIm1vZHVsZXNcIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJtb2R1bGVzXCJdLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlc1tcIm1vZHVsZXNcIl0ucHJldmlvdXNWYWx1ZVxuICAgICkge1xuICAgICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgY2hhbmdlc1tcImZvbnRTaXplXCJdICYmXG4gICAgICBjaGFuZ2VzW1wiZm9udFNpemVcIl0uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzW1wiZm9udFNpemVcIl0ucHJldmlvdXNWYWx1ZVxuICAgICkge1xuICAgICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgY2hhbmdlc1tcInRoZW1lXCJdICYmXG4gICAgICBjaGFuZ2VzW1widGhlbWVcIl0uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzW1widGhlbWVcIl0ucHJldmlvdXNWYWx1ZVxuICAgICkge1xuICAgICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgY2hhbmdlc1tcInNwYWNpbmdcIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJzcGFjaW5nXCJdLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlc1tcInNwYWNpbmdcIl0ucHJldmlvdXNWYWx1ZVxuICAgICkge1xuICAgICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgY2hhbmdlc1tcImxheW91dFwiXSAmJlxuICAgICAgY2hhbmdlc1tcImxheW91dFwiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJsYXlvdXRcIl0ucHJldmlvdXNWYWx1ZVxuICAgICkge1xuICAgICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgY2hhbmdlc1tcIm92ZXJsYXlcIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJvdmVybGF5XCJdLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlc1tcIm92ZXJsYXlcIl0ucHJldmlvdXNWYWx1ZVxuICAgICkge1xuICAgICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgY2hhbmdlc1tcInBvc2l0aW9uXCJdICYmXG4gICAgICBjaGFuZ2VzW1wicG9zaXRpb25cIl0uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzW1wicG9zaXRpb25cIl0ucHJldmlvdXNWYWx1ZVxuICAgICkge1xuICAgICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgY2hhbmdlc1tcIm11bHRpU2VsZWN0YWJsZUFjY29yZGlvbnNcIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJtdWx0aVNlbGVjdGFibGVBY2NvcmRpb25zXCJdLmN1cnJlbnRWYWx1ZSAhPT1cbiAgICAgICAgY2hhbmdlc1tcIm11bHRpU2VsZWN0YWJsZUFjY29yZGlvbnNcIl0ucHJldmlvdXNWYWx1ZVxuICAgICkge1xuICAgICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcbiAgICB9XG4gIH1cblxuICBzZXR1cE9wdGlvbnMoKSB7XG4gICAgLy8gTWVyZ2UgdGhlIHByb3ZpZGVkIG9wdGlvbnMgd2l0aCB0aGUgZGVmYXVsdCBvbmVzXG4gICAgY29uc3QgbWVyZ2VkT3B0aW9ucyA9IHtcbiAgICAgIC4uLmNyZWF0ZUFjY2Vzc2liaWxpdHlPcHRpb25zKHRoaXMud2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZSksXG4gICAgICAuLi50aGlzLm9wdGlvbnMsXG4gICAgfTtcblxuICAgIC8vIElmIGFuIG9wdGlvbiB3YXMgcGFzc2VkIGluZGl2aWR1YWxseSwgb3ZlcnJpZGUgaW4gbWVyZ2VkT3B0aW9uc1xuICAgIGlmICh0aGlzLnRpdGxlKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLnRpdGxlID0gdGhpcy50aXRsZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZGVzY3JpcHRpb24pIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMuZGVzY3JpcHRpb24gPSB0aGlzLmRlc2NyaXB0aW9uO1xuICAgIH1cbiAgICBpZiAodGhpcy5kaXNwbGF5VHlwZSkge1xuICAgICAgbWVyZ2VkT3B0aW9ucy5kaXNwbGF5VHlwZSA9IHRoaXMuZGlzcGxheVR5cGU7XG4gICAgfVxuICAgIGlmICh0aGlzLm92ZXJsYXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgbWVyZ2VkT3B0aW9ucy5vdmVybGF5ID0gdGhpcy5vdmVybGF5O1xuICAgIH1cbiAgICBpZiAodGhpcy5tdWx0aVNlbGVjdGFibGVBY2NvcmRpb25zKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLm11bHRpU2VsZWN0YWJsZUFjY29yZGlvbnMgPSB0aGlzLm11bHRpU2VsZWN0YWJsZUFjY29yZGlvbnM7XG4gICAgfVxuICAgIGlmICh0aGlzLnBvc2l0aW9uKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLnBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbjtcbiAgICB9XG4gICAgaWYgKHRoaXMubW9kdWxlcykge1xuICAgICAgbWVyZ2VkT3B0aW9ucy5pbmNsdWRlID0gdGhpcy5tb2R1bGVzO1xuICAgIH1cbiAgICBpZiAodGhpcy5mb250U2l6ZSkge1xuICAgICAgbWVyZ2VkT3B0aW9ucy5mb250U2l6ZSA9IHRoaXMuZm9udFNpemU7XG4gICAgICAvLyBJZiBmb250U2l6ZSB3YXMgcGFzc2VkIGluIHNwZWNpZmljYWxseSwgY2hlY2sgdG8gYmUgc3VyZSBpdCdzIGluY2x1ZGVkIGluIHRoZSBtb2R1bGVzIGxpc3QuIElmIG5vdCwgYWRkIGl0LlxuICAgICAgaWYgKFxuICAgICAgICBtZXJnZWRPcHRpb25zLmluY2x1ZGUgJiZcbiAgICAgICAgIW1lcmdlZE9wdGlvbnMuaW5jbHVkZS5pbmNsdWRlcyhcImZvbnRTaXplXCIpXG4gICAgICApIHtcbiAgICAgICAgbWVyZ2VkT3B0aW9ucy5pbmNsdWRlLnB1c2goXCJmb250U2l6ZVwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMudGhlbWUpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMudGhlbWUgPSB0aGlzLnRoZW1lO1xuICAgICAgaWYgKG1lcmdlZE9wdGlvbnMuaW5jbHVkZSAmJiAhbWVyZ2VkT3B0aW9ucy5pbmNsdWRlLmluY2x1ZGVzKFwidGhlbWVcIikpIHtcbiAgICAgICAgbWVyZ2VkT3B0aW9ucy5pbmNsdWRlLnB1c2goXCJ0aGVtZVwiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuc3BhY2luZykge1xuICAgICAgbWVyZ2VkT3B0aW9ucy5zcGFjaW5nID0gdGhpcy5zcGFjaW5nO1xuICAgICAgaWYgKG1lcmdlZE9wdGlvbnMuaW5jbHVkZSAmJiAhbWVyZ2VkT3B0aW9ucy5pbmNsdWRlLmluY2x1ZGVzKFwic3BhY2luZ1wiKSkge1xuICAgICAgICBtZXJnZWRPcHRpb25zLmluY2x1ZGUucHVzaChcInNwYWNpbmdcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLmxheW91dCkge1xuICAgICAgbWVyZ2VkT3B0aW9ucy5sYXlvdXQgPSB0aGlzLmxheW91dDtcbiAgICAgIGlmIChtZXJnZWRPcHRpb25zLmluY2x1ZGUgJiYgIW1lcmdlZE9wdGlvbnMuaW5jbHVkZS5pbmNsdWRlcyhcImxheW91dFwiKSkge1xuICAgICAgICBtZXJnZWRPcHRpb25zLmluY2x1ZGUucHVzaChcImxheW91dFwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBOb3cgc3RvcmUgdGhlIGZpbmFsIG1lcmdlZCBvcHRpb25zXG4gICAgdGhpcy5jdXJyZW50T3B0aW9ucyA9IG1lcmdlZE9wdGlvbnM7XG4gICAgdGhpcy5kYXRhID0gdGhpcy5idWlsZERhdGEoKTtcbiAgfVxuXG4gIGJ1aWxkRGF0YSgpIHtcbiAgICAvLyBCdWlsZCB0aGUgZGF0YSBvYmplY3QgdG8gcGFzcyB0byB0aGUgcGFuZWxcbiAgICAvLyBEZXRlcm1pbmUgd2hpY2ggbW9kdWxlcyB0byBpbmNsdWRlIGJhc2VkIG9uIHRoZSBjdXJyZW50IG9wdGlvbnNcbiAgICBjb25zdCBpbmNsdWRlZE1vZHVsZXMgPSB0aGlzLmN1cnJlbnRPcHRpb25zLmluY2x1ZGUgfHwgW107XG4gICAgbGV0IG1vZHVsZURhdGE6IFBhbmVsRGF0YVtcIm1vZHVsZXNcIl0gPSB7fTtcbiAgICBpbmNsdWRlZE1vZHVsZXMuZm9yRWFjaCgobW9kdWxlOiBNb2R1bGVUeXBlcykgPT4ge1xuICAgICAgLy8gQWRkIHRoZSBtb2R1bGUgdG8gdGhlIGRhdGEgb2JqZWN0XG4gICAgICBtb2R1bGVEYXRhW21vZHVsZV0gPSB0aGlzLmN1cnJlbnRPcHRpb25zW21vZHVsZV07XG4gICAgfSk7XG4gICAgY29uc3QgZGF0YTogUGFuZWxEYXRhID0ge1xuICAgICAgdGl0bGU6IHRoaXMuY3VycmVudE9wdGlvbnMudGl0bGUgfHwgXCJBY2Nlc3NpYmlsaXR5IHNldHRpbmdzXCIsXG4gICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgdGhpcy5jdXJyZW50T3B0aW9ucy5kZXNjcmlwdGlvbiB8fFxuICAgICAgICBcIkFkanVzdCB0aGUgc2V0dGluZ3MgYmVsb3cgdG8gY3VzdG9taXplIHRoZSBhcHBlYXJhbmNlIG9mIHRoaXMgd2Vic2l0ZS5cIixcbiAgICAgIG1vZHVsZXM6IG1vZHVsZURhdGEsXG4gICAgICBtdWx0aVNlbGVjdGFibGVBY2NvcmRpb25zOlxuICAgICAgICB0aGlzLmN1cnJlbnRPcHRpb25zLm11bHRpU2VsZWN0YWJsZUFjY29yZGlvbnMgfHwgZmFsc2UsXG4gICAgICBwb3NpdGlvbjogdGhpcy5jdXJyZW50T3B0aW9ucy5wb3NpdGlvbiB8fCBcImVuZFwiLFxuICAgIH07XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5mb2N1c1RpbWVvdXRJZCAhPT0gbnVsbCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZm9jdXNUaW1lb3V0SWQpO1xuICAgICAgdGhpcy5mb2N1c1RpbWVvdXRJZCA9IG51bGw7XG4gICAgfVxuICAgIHRoaXMuZGVzdHJveSQubmV4dCgpO1xuICAgIHRoaXMuZGVzdHJveSQuY29tcGxldGUoKTtcbiAgfVxufVxuIl19