import { Component, HostListener, Input, ViewChild, ViewEncapsulation, } from "@angular/core";
import { createAccessibilityOptions } from "./weiss-accessibility-center.factory";
import { Subject, takeUntil } from "rxjs";
import * as i0 from "@angular/core";
import * as i1 from "./weiss-accessibility-center.service";
import * as i2 from "@angular/common";
import * as i3 from "./templates/strip/strip.component";
import * as i4 from "./templates/panel/panel.component";
export class WeissAccessibilityCenterComponent {
    weissAccessibilityCenterService;
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
    targetId = null;
    firstFocusableElement = null;
    lastFocusableElement = null;
    focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable], li[tabindex="0"], li[tabindex="-1"], tr[tabindex="0"], tr[tabindex="-1"]';
    statusMessage = "";
    forceCloseSelectionPanel = false;
    focusTimeoutId = null;
    destroy$ = new Subject();
    constructor(weissAccessibilityCenterService) {
        this.weissAccessibilityCenterService = weissAccessibilityCenterService;
        this.currentOptions = createAccessibilityOptions(this.weissAccessibilityCenterService);
        this.setupOptions();
        this.weissAccessibilityCenterService.showWeissAccessibilityCenter$
            .pipe(takeUntil(this.destroy$))
            .subscribe((show) => {
            this.showWeissAccessibilityCenter = show;
            this.forceCloseSelectionPanel = !show;
            // Clear any pending focus timeout when closing
            if (!show && this.focusTimeoutId !== null) {
                clearTimeout(this.focusTimeoutId);
                this.focusTimeoutId = null;
            }
            if (show) {
                const focusableElements = this.centerEl?.nativeElement.querySelectorAll(this.focusableElementsString);
                this.firstFocusableElement = focusableElements[0];
                this.lastFocusableElement =
                    focusableElements[focusableElements.length - 1];
                // Focus the first focusable element on next tick, track timeout for cleanup
                this.focusTimeoutId = window.setTimeout(() => {
                    this.firstFocusableElement?.focus();
                    this.focusTimeoutId = null;
                }, 0);
            }
        });
        this.weissAccessibilityCenterService.targetId$
            .pipe(takeUntil(this.destroy$))
            .subscribe((id) => {
            this.targetId = id;
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
        // Clear any pending timeouts
        if (this.focusTimeoutId !== null) {
            clearTimeout(this.focusTimeoutId);
            this.focusTimeoutId = null;
        }
        this.destroy$.next();
        this.destroy$.complete();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: WeissAccessibilityCenterComponent, deps: [{ token: i1.WeissAccessibilityCenterService }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.8", type: WeissAccessibilityCenterComponent, selector: "weiss-accessibility-center", inputs: { options: "options", title: "title", description: "description", displayType: "displayType", overlay: "overlay", position: "position", modules: "modules", fontSize: "fontSize", theme: "theme", spacing: "spacing", layout: "layout", multiSelectableAccordions: "multiSelectableAccordions" }, host: { listeners: { "keydown": "handleKeyboardEvent($event)" } }, viewQueries: [{ propertyName: "centerEl", first: true, predicate: ["center"], descendants: true }], usesOnChanges: true, ngImport: i0, template: `
    <article
      role="dialog"
      aria-modal="true"
      [hidden]="!showWeissAccessibilityCenter"
      [id]="targetId"
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
      [id]="targetId"
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
        }], ctorParameters: () => [{ type: i1.WeissAccessibilityCenterService }], propDecorators: { centerEl: [{
                type: ViewChild,
                args: ["center"]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUVMLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFVdkIsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDbEYsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxNQUFNLENBQUM7Ozs7OztBQWtEMUMsTUFBTSxPQUFPLGlDQUFpQztJQW1DbkM7SUFsQ1ksUUFBUSxDQUFNO0lBRTFCLE9BQU8sQ0FBbUM7SUFDMUMsS0FBSyxDQUFxQjtJQUMxQixXQUFXLENBQXFCO0lBQ2hDLFdBQVcsQ0FBMEI7SUFDckMsT0FBTyxDQUFzQjtJQUM3QixRQUFRLENBQThCO0lBQ3RDLE9BQU8sQ0FBNEI7SUFDbkMsUUFBUSxDQUE0QjtJQUNwQyxLQUFLLENBQTRCO0lBQ2pDLE9BQU8sQ0FBNEI7SUFDbkMsTUFBTSxDQUE0QjtJQUNsQyx5QkFBeUIsQ0FBc0I7SUFFeEQsK0RBQStEO0lBQy9ELGNBQWMsQ0FBdUI7SUFFOUIsNEJBQTRCLEdBQUcsS0FBSyxDQUFDO0lBQ3JDLElBQUksQ0FBd0I7SUFDNUIsUUFBUSxHQUFrQixJQUFJLENBQUM7SUFFOUIscUJBQXFCLEdBQXVCLElBQUksQ0FBQztJQUNqRCxvQkFBb0IsR0FBdUIsSUFBSSxDQUFDO0lBQ2hELHVCQUF1QixHQUM3QiwwUEFBMFAsQ0FBQztJQUV0UCxhQUFhLEdBQVcsRUFBRSxDQUFDO0lBQzNCLHdCQUF3QixHQUFZLEtBQUssQ0FBQztJQUV6QyxjQUFjLEdBQWtCLElBQUksQ0FBQztJQUNyQyxRQUFRLEdBQUcsSUFB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QVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDRCQUE0QjtvQkFDdEMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMkNUO29CQUNELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2lCQUN0QztvR0FFc0IsUUFBUTtzQkFBNUIsU0FBUzt1QkFBQyxRQUFRO2dCQUVWLE9BQU87c0JBQWYsS0FBSztnQkFDRyxLQUFLO3NCQUFiLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFDRyxXQUFXO3NCQUFuQixLQUFLO2dCQUNHLE9BQU87c0JBQWYsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLE9BQU87c0JBQWYsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLEtBQUs7c0JBQWIsS0FBSztnQkFDRyxPQUFPO3NCQUFmLEtBQUs7Z0JBQ0csTUFBTTtzQkFBZCxLQUFLO2dCQUNHLHlCQUF5QjtzQkFBakMsS0FBSztnQkE2RU4sbUJBQW1CO3NCQURsQixZQUFZO3VCQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSG9zdExpc3RlbmVyLFxuICBJbnB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7XG4gIEFjY2Vzc2liaWxpdHlPcHRpb25zLFxuICBEaXNwbGF5VHlwZSxcbiAgTW9kdWxlT3B0aW9ucyxcbiAgTW9kdWxlVHlwZXMsXG4gIFBhbmVsRGF0YSxcbiAgUG9zaXRpb25PcHRpb25zLFxufSBmcm9tIFwiLi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5pbnRlcmZhY2VzXCI7XG5pbXBvcnQgeyBXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlIH0gZnJvbSBcIi4vd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuc2VydmljZVwiO1xuaW1wb3J0IHsgY3JlYXRlQWNjZXNzaWJpbGl0eU9wdGlvbnMgfSBmcm9tIFwiLi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5mYWN0b3J5XCI7XG5pbXBvcnQgeyBTdWJqZWN0LCB0YWtlVW50aWwgfSBmcm9tIFwicnhqc1wiO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6IFwid2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXJcIixcbiAgdGVtcGxhdGU6IGBcbiAgICA8YXJ0aWNsZVxuICAgICAgcm9sZT1cImRpYWxvZ1wiXG4gICAgICBhcmlhLW1vZGFsPVwidHJ1ZVwiXG4gICAgICBbaGlkZGVuXT1cIiFzaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyXCJcbiAgICAgIFtpZF09XCJ0YXJnZXRJZFwiXG4gICAgICAjY2VudGVyXG4gICAgPlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzcz1cImJhY2tncm91bmQtb3ZlcmxheVwiXG4gICAgICAgICpuZ0lmPVwiY3VycmVudE9wdGlvbnMub3ZlcmxheVwiXG4gICAgICAgIChjbGljayk9XCJcbiAgICAgICAgICB3ZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlLnRvZ2dsZVdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlcihcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICB0cnVlXG4gICAgICAgICAgKVxuICAgICAgICBcIlxuICAgICAgPjwvZGl2PlxuICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImN1cnJlbnRPcHRpb25zLmRpc3BsYXlUeXBlID09PSAncGFuZWwnXCI+XG4gICAgICAgIDx3ZWlzcy1hY2Nlc3NpYmlsaXR5LXBhbmVsXG4gICAgICAgICAgKHN0YXR1c01lc3NhZ2VDaGFuZ2UpPVwib25TdGF0dXNNZXNzYWdlQ2hhbmdlKCRldmVudClcIlxuICAgICAgICAgIFtkYXRhXT1cImRhdGFcIlxuICAgICAgICA+PC93ZWlzcy1hY2Nlc3NpYmlsaXR5LXBhbmVsPlxuICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiY3VycmVudE9wdGlvbnMuZGlzcGxheVR5cGUgPT09ICdzdHJpcCdcIj5cbiAgICAgICAgPHdlaXNzLWFjY2Vzc2liaWxpdHktc3RyaXBcbiAgICAgICAgICBbY2xvc2VTZWxlY3Rpb25QYW5lbF09XCJmb3JjZUNsb3NlU2VsZWN0aW9uUGFuZWxcIlxuICAgICAgICAgIChzdGF0dXNNZXNzYWdlQ2hhbmdlKT1cIm9uU3RhdHVzTWVzc2FnZUNoYW5nZSgkZXZlbnQpXCJcbiAgICAgICAgICBbZGF0YV09XCJkYXRhXCJcbiAgICAgICAgPjwvd2Vpc3MtYWNjZXNzaWJpbGl0eS1zdHJpcD5cbiAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImN1cnJlbnRPcHRpb25zLmRpc3BsYXlUeXBlID09PSAncG9wb3ZlcidcIj5cbiAgICAgICAgPCEtLSA8d2Vpc3MtYWNjZXNzaWJpbGl0eS1wb3BvdmVyPjwvd2Vpc3MtYWNjZXNzaWJpbGl0eS1wb3BvdmVyPiAtLT5cbiAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgPGRpdlxuICAgICAgICBhcmlhLWxpdmU9XCJwb2xpdGVcIlxuICAgICAgICBpZD1cInN0YXR1c01lc3NhZ2VcIlxuICAgICAgICAqbmdJZj1cInN0YXR1c01lc3NhZ2VcIlxuICAgICAgICBjbGFzcz1cInZpc3VhbGx5LWhpZGRlblwiXG4gICAgICA+XG4gICAgICAgIHt7IHN0YXR1c01lc3NhZ2UgfX1cbiAgICAgIDwvZGl2PlxuICAgIDwvYXJ0aWNsZT5cbiAgYCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyQ29tcG9uZW50IHtcbiAgQFZpZXdDaGlsZChcImNlbnRlclwiKSBjZW50ZXJFbDogYW55O1xuXG4gIEBJbnB1dCgpIG9wdGlvbnM6IEFjY2Vzc2liaWxpdHlPcHRpb25zIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSB0aXRsZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBkZXNjcmlwdGlvbjogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBkaXNwbGF5VHlwZTogRGlzcGxheVR5cGUgfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIG92ZXJsYXk6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIHBvc2l0aW9uOiBQb3NpdGlvbk9wdGlvbnMgfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIG1vZHVsZXM6IE1vZHVsZVR5cGVzW10gfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIGZvbnRTaXplOiBNb2R1bGVPcHRpb25zIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSB0aGVtZTogTW9kdWxlT3B0aW9ucyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgc3BhY2luZzogTW9kdWxlT3B0aW9ucyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgbGF5b3V0OiBNb2R1bGVPcHRpb25zIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBtdWx0aVNlbGVjdGFibGVBY2NvcmRpb25zOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXG4gIC8vIE1lcmdlZCBvcHRpb25zIG9iamVjdCB0aGF0IHdpbGwgYmUgdXNlZCB3aXRoaW4gdGhlIGNvbXBvbmVudFxuICBjdXJyZW50T3B0aW9uczogQWNjZXNzaWJpbGl0eU9wdGlvbnM7XG5cbiAgcHVibGljIHNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIgPSBmYWxzZTtcbiAgcHVibGljIGRhdGE6IFBhbmVsRGF0YSB8IHVuZGVmaW5lZDtcbiAgcHVibGljIHRhcmdldElkOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICBwcml2YXRlIGZpcnN0Rm9jdXNhYmxlRWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBsYXN0Rm9jdXNhYmxlRWxlbWVudDogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBmb2N1c2FibGVFbGVtZW50c1N0cmluZyA9XG4gICAgJ2FbaHJlZl0sIGFyZWFbaHJlZl0sIGlucHV0Om5vdChbZGlzYWJsZWRdKSwgc2VsZWN0Om5vdChbZGlzYWJsZWRdKSwgdGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pLCBidXR0b246bm90KFtkaXNhYmxlZF0pLCBpZnJhbWUsIG9iamVjdCwgZW1iZWQsIFt0YWJpbmRleD1cIjBcIl0sIFtjb250ZW50ZWRpdGFibGVdLCBsaVt0YWJpbmRleD1cIjBcIl0sIGxpW3RhYmluZGV4PVwiLTFcIl0sIHRyW3RhYmluZGV4PVwiMFwiXSwgdHJbdGFiaW5kZXg9XCItMVwiXSc7XG5cbiAgcHVibGljIHN0YXR1c01lc3NhZ2U6IHN0cmluZyA9IFwiXCI7XG4gIHB1YmxpYyBmb3JjZUNsb3NlU2VsZWN0aW9uUGFuZWw6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwcml2YXRlIGZvY3VzVGltZW91dElkOiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBkZXN0cm95JCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2U6IFdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2VcbiAgKSB7XG4gICAgdGhpcy5jdXJyZW50T3B0aW9ucyA9IGNyZWF0ZUFjY2Vzc2liaWxpdHlPcHRpb25zKFxuICAgICAgdGhpcy53ZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlXG4gICAgKTtcbiAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIHRoaXMud2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZS5zaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyJFxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgLnN1YnNjcmliZSgoc2hvdykgPT4ge1xuICAgICAgICB0aGlzLnNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIgPSBzaG93O1xuICAgICAgICB0aGlzLmZvcmNlQ2xvc2VTZWxlY3Rpb25QYW5lbCA9ICFzaG93O1xuXG4gICAgICAgIC8vIENsZWFyIGFueSBwZW5kaW5nIGZvY3VzIHRpbWVvdXQgd2hlbiBjbG9zaW5nXG4gICAgICAgIGlmICghc2hvdyAmJiB0aGlzLmZvY3VzVGltZW91dElkICE9PSBudWxsKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZm9jdXNUaW1lb3V0SWQpO1xuICAgICAgICAgIHRoaXMuZm9jdXNUaW1lb3V0SWQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNob3cpIHtcbiAgICAgICAgICBjb25zdCBmb2N1c2FibGVFbGVtZW50cyA9XG4gICAgICAgICAgICB0aGlzLmNlbnRlckVsPy5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgICAgIHRoaXMuZm9jdXNhYmxlRWxlbWVudHNTdHJpbmdcbiAgICAgICAgICAgICkgYXMgTm9kZUxpc3RPZjxIVE1MRWxlbWVudD47XG4gICAgICAgICAgdGhpcy5maXJzdEZvY3VzYWJsZUVsZW1lbnQgPSBmb2N1c2FibGVFbGVtZW50c1swXTtcbiAgICAgICAgICB0aGlzLmxhc3RGb2N1c2FibGVFbGVtZW50ID1cbiAgICAgICAgICAgIGZvY3VzYWJsZUVsZW1lbnRzW2ZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgICAgLy8gRm9jdXMgdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50IG9uIG5leHQgdGljaywgdHJhY2sgdGltZW91dCBmb3IgY2xlYW51cFxuICAgICAgICAgIHRoaXMuZm9jdXNUaW1lb3V0SWQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZpcnN0Rm9jdXNhYmxlRWxlbWVudD8uZm9jdXMoKTtcbiAgICAgICAgICAgIHRoaXMuZm9jdXNUaW1lb3V0SWQgPSBudWxsO1xuICAgICAgICAgIH0sIDApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB0aGlzLndlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2UudGFyZ2V0SWQkXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXG4gICAgICAuc3Vic2NyaWJlKChpZCkgPT4ge1xuICAgICAgICB0aGlzLnRhcmdldElkID0gaWQ7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8vIFRoaXMgbWV0aG9kIGlzIHRyaWdnZXJlZCB3aGVuIHRoZSBjaGlsZCBjb21wb25lbnQgZW1pdHMgYSBuZXcgc3RhdHVzIG1lc3NhZ2VcbiAgb25TdGF0dXNNZXNzYWdlQ2hhbmdlKG5ld01lc3NhZ2U6IHN0cmluZykge1xuICAgIHRoaXMuc3RhdHVzTWVzc2FnZSA9IG5ld01lc3NhZ2U7XG4gIH1cblxuICBwcml2YXRlIHNjcm9sbEVsZW1lbnRJbnRvVmlldyhlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgZWxlbWVudC5zY3JvbGxJbnRvVmlldyh7XG4gICAgICBiZWhhdmlvcjogXCJzbW9vdGhcIixcbiAgICAgIGJsb2NrOiBcImNlbnRlclwiLFxuICAgIH0pO1xuICB9XG5cbiAgLy8gQ2xvc2UgcGFuZWwgd2hlbiB1c2VyIGhpdHMgZXNjYXBlIGtleVxuICAvLyBUcmFwIGZvY3VzIHdpdGhpbiB0aGUgYWNjZXNzaWJpbGl0eSBjZW50ZXJcbiAgQEhvc3RMaXN0ZW5lcihcImtleWRvd25cIiwgW1wiJGV2ZW50XCJdKVxuICBoYW5kbGVLZXlib2FyZEV2ZW50KGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKHRoaXMuc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlcikge1xuICAgICAgY29uc3QgZGVlcEFjdGl2ZUVsZW1lbnQgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgICAgaWYgKGV2ZW50LmtleSA9PT0gXCJUYWJcIikge1xuICAgICAgICBpZiAoZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgICAvKiBzaGlmdCArIHRhYiAqL1xuICAgICAgICAgIGlmIChkZWVwQWN0aXZlRWxlbWVudCA9PT0gdGhpcy5maXJzdEZvY3VzYWJsZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmxhc3RGb2N1c2FibGVFbGVtZW50Py5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvKiB0YWIgKi9cbiAgICAgICAgICBpZiAoZGVlcEFjdGl2ZUVsZW1lbnQgPT09IHRoaXMubGFzdEZvY3VzYWJsZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmZpcnN0Rm9jdXNhYmxlRWxlbWVudD8uZm9jdXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zY3JvbGxFbGVtZW50SW50b1ZpZXcoZGVlcEFjdGl2ZUVsZW1lbnQpO1xuICAgICAgfSBlbHNlIGlmIChldmVudC5rZXkgPT09IFwiRXNjYXBlXCIpIHtcbiAgICAgICAgdGhpcy53ZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlLnRvZ2dsZVdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlcihcbiAgICAgICAgICBudWxsLFxuICAgICAgICAgIHRydWVcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zdGF0dXNNZXNzYWdlID0gXCJBY2Nlc3NpYmlsaXR5IGNlbnRlciBjbG9zZWRcIjtcbiAgICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5ID09PSBcIkFycm93VXBcIiB8fCBldmVudC5rZXkgPT09IFwiQXJyb3dEb3duXCIpIHtcbiAgICAgICAgLy8gV2FpdCBmb3IgRE9NIHVwZGF0ZVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBjb25zdCBhY3RpdmVFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBhY3RpdmVFbGVtZW50ICYmXG4gICAgICAgICAgICB0aGlzLmNlbnRlckVsLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoYWN0aXZlRWxlbWVudClcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsRWxlbWVudEludG9WaWV3KGFjdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgMCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChcbiAgICAgIGNoYW5nZXNbXCJvcHRpb25zXCJdICYmXG4gICAgICBjaGFuZ2VzW1wib3B0aW9uc1wiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJvcHRpb25zXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJ0aXRsZVwiXSAmJlxuICAgICAgY2hhbmdlc1tcInRpdGxlXCJdLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlc1tcInRpdGxlXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJkZXNjcmlwdGlvblwiXSAmJlxuICAgICAgY2hhbmdlc1tcImRlc2NyaXB0aW9uXCJdLmN1cnJlbnRWYWx1ZSAhPT1cbiAgICAgICAgY2hhbmdlc1tcImRlc2NyaXB0aW9uXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJkaXNwbGF5VHlwZVwiXSAmJlxuICAgICAgY2hhbmdlc1tcImRpc3BsYXlUeXBlXCJdLmN1cnJlbnRWYWx1ZSAhPT1cbiAgICAgICAgY2hhbmdlc1tcImRpc3BsYXlUeXBlXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJtb2R1bGVzXCJdICYmXG4gICAgICBjaGFuZ2VzW1wibW9kdWxlc1wiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJtb2R1bGVzXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJmb250U2l6ZVwiXSAmJlxuICAgICAgY2hhbmdlc1tcImZvbnRTaXplXCJdLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlc1tcImZvbnRTaXplXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJ0aGVtZVwiXSAmJlxuICAgICAgY2hhbmdlc1tcInRoZW1lXCJdLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlc1tcInRoZW1lXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJzcGFjaW5nXCJdICYmXG4gICAgICBjaGFuZ2VzW1wic3BhY2luZ1wiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJzcGFjaW5nXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJsYXlvdXRcIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJsYXlvdXRcIl0uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzW1wibGF5b3V0XCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJvdmVybGF5XCJdICYmXG4gICAgICBjaGFuZ2VzW1wib3ZlcmxheVwiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJvdmVybGF5XCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJwb3NpdGlvblwiXSAmJlxuICAgICAgY2hhbmdlc1tcInBvc2l0aW9uXCJdLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlc1tcInBvc2l0aW9uXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJtdWx0aVNlbGVjdGFibGVBY2NvcmRpb25zXCJdICYmXG4gICAgICBjaGFuZ2VzW1wibXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9uc1wiXS5jdXJyZW50VmFsdWUgIT09XG4gICAgICAgIGNoYW5nZXNbXCJtdWx0aVNlbGVjdGFibGVBY2NvcmRpb25zXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfVxuICB9XG5cbiAgc2V0dXBPcHRpb25zKCkge1xuICAgIC8vIE1lcmdlIHRoZSBwcm92aWRlZCBvcHRpb25zIHdpdGggdGhlIGRlZmF1bHQgb25lc1xuICAgIGNvbnN0IG1lcmdlZE9wdGlvbnMgPSB7XG4gICAgICAuLi5jcmVhdGVBY2Nlc3NpYmlsaXR5T3B0aW9ucyh0aGlzLndlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2UpLFxuICAgICAgLi4udGhpcy5vcHRpb25zLFxuICAgIH07XG5cbiAgICAvLyBJZiBhbiBvcHRpb24gd2FzIHBhc3NlZCBpbmRpdmlkdWFsbHksIG92ZXJyaWRlIGluIG1lcmdlZE9wdGlvbnNcbiAgICBpZiAodGhpcy50aXRsZSkge1xuICAgICAgbWVyZ2VkT3B0aW9ucy50aXRsZSA9IHRoaXMudGl0bGU7XG4gICAgfVxuICAgIGlmICh0aGlzLmRlc2NyaXB0aW9uKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLmRlc2NyaXB0aW9uID0gdGhpcy5kZXNjcmlwdGlvbjtcbiAgICB9XG4gICAgaWYgKHRoaXMuZGlzcGxheVR5cGUpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMuZGlzcGxheVR5cGUgPSB0aGlzLmRpc3BsYXlUeXBlO1xuICAgIH1cbiAgICBpZiAodGhpcy5vdmVybGF5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMub3ZlcmxheSA9IHRoaXMub3ZlcmxheTtcbiAgICB9XG4gICAgaWYgKHRoaXMubXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9ucykge1xuICAgICAgbWVyZ2VkT3B0aW9ucy5tdWx0aVNlbGVjdGFibGVBY2NvcmRpb25zID0gdGhpcy5tdWx0aVNlbGVjdGFibGVBY2NvcmRpb25zO1xuICAgIH1cbiAgICBpZiAodGhpcy5wb3NpdGlvbikge1xuICAgICAgbWVyZ2VkT3B0aW9ucy5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb247XG4gICAgfVxuICAgIGlmICh0aGlzLm1vZHVsZXMpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMuaW5jbHVkZSA9IHRoaXMubW9kdWxlcztcbiAgICB9XG4gICAgaWYgKHRoaXMuZm9udFNpemUpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMuZm9udFNpemUgPSB0aGlzLmZvbnRTaXplO1xuICAgICAgLy8gSWYgZm9udFNpemUgd2FzIHBhc3NlZCBpbiBzcGVjaWZpY2FsbHksIGNoZWNrIHRvIGJlIHN1cmUgaXQncyBpbmNsdWRlZCBpbiB0aGUgbW9kdWxlcyBsaXN0LiBJZiBub3QsIGFkZCBpdC5cbiAgICAgIGlmIChcbiAgICAgICAgbWVyZ2VkT3B0aW9ucy5pbmNsdWRlICYmXG4gICAgICAgICFtZXJnZWRPcHRpb25zLmluY2x1ZGUuaW5jbHVkZXMoXCJmb250U2l6ZVwiKVxuICAgICAgKSB7XG4gICAgICAgIG1lcmdlZE9wdGlvbnMuaW5jbHVkZS5wdXNoKFwiZm9udFNpemVcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLnRoZW1lKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLnRoZW1lID0gdGhpcy50aGVtZTtcbiAgICAgIGlmIChtZXJnZWRPcHRpb25zLmluY2x1ZGUgJiYgIW1lcmdlZE9wdGlvbnMuaW5jbHVkZS5pbmNsdWRlcyhcInRoZW1lXCIpKSB7XG4gICAgICAgIG1lcmdlZE9wdGlvbnMuaW5jbHVkZS5wdXNoKFwidGhlbWVcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLnNwYWNpbmcpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMuc3BhY2luZyA9IHRoaXMuc3BhY2luZztcbiAgICAgIGlmIChtZXJnZWRPcHRpb25zLmluY2x1ZGUgJiYgIW1lcmdlZE9wdGlvbnMuaW5jbHVkZS5pbmNsdWRlcyhcInNwYWNpbmdcIikpIHtcbiAgICAgICAgbWVyZ2VkT3B0aW9ucy5pbmNsdWRlLnB1c2goXCJzcGFjaW5nXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5sYXlvdXQpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMubGF5b3V0ID0gdGhpcy5sYXlvdXQ7XG4gICAgICBpZiAobWVyZ2VkT3B0aW9ucy5pbmNsdWRlICYmICFtZXJnZWRPcHRpb25zLmluY2x1ZGUuaW5jbHVkZXMoXCJsYXlvdXRcIikpIHtcbiAgICAgICAgbWVyZ2VkT3B0aW9ucy5pbmNsdWRlLnB1c2goXCJsYXlvdXRcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTm93IHN0b3JlIHRoZSBmaW5hbCBtZXJnZWQgb3B0aW9uc1xuICAgIHRoaXMuY3VycmVudE9wdGlvbnMgPSBtZXJnZWRPcHRpb25zO1xuICAgIHRoaXMuZGF0YSA9IHRoaXMuYnVpbGREYXRhKCk7XG4gIH1cblxuICBidWlsZERhdGEoKSB7XG4gICAgLy8gQnVpbGQgdGhlIGRhdGEgb2JqZWN0IHRvIHBhc3MgdG8gdGhlIHBhbmVsXG4gICAgLy8gRGV0ZXJtaW5lIHdoaWNoIG1vZHVsZXMgdG8gaW5jbHVkZSBiYXNlZCBvbiB0aGUgY3VycmVudCBvcHRpb25zXG4gICAgY29uc3QgaW5jbHVkZWRNb2R1bGVzID0gdGhpcy5jdXJyZW50T3B0aW9ucy5pbmNsdWRlIHx8IFtdO1xuICAgIGxldCBtb2R1bGVEYXRhOiBQYW5lbERhdGFbXCJtb2R1bGVzXCJdID0ge307XG4gICAgaW5jbHVkZWRNb2R1bGVzLmZvckVhY2goKG1vZHVsZTogTW9kdWxlVHlwZXMpID0+IHtcbiAgICAgIC8vIEFkZCB0aGUgbW9kdWxlIHRvIHRoZSBkYXRhIG9iamVjdFxuICAgICAgbW9kdWxlRGF0YVttb2R1bGVdID0gdGhpcy5jdXJyZW50T3B0aW9uc1ttb2R1bGVdO1xuICAgIH0pO1xuICAgIGNvbnN0IGRhdGE6IFBhbmVsRGF0YSA9IHtcbiAgICAgIHRpdGxlOiB0aGlzLmN1cnJlbnRPcHRpb25zLnRpdGxlIHx8IFwiQWNjZXNzaWJpbGl0eSBzZXR0aW5nc1wiLFxuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgIHRoaXMuY3VycmVudE9wdGlvbnMuZGVzY3JpcHRpb24gfHxcbiAgICAgICAgXCJBZGp1c3QgdGhlIHNldHRpbmdzIGJlbG93IHRvIGN1c3RvbWl6ZSB0aGUgYXBwZWFyYW5jZSBvZiB0aGlzIHdlYnNpdGUuXCIsXG4gICAgICBtb2R1bGVzOiBtb2R1bGVEYXRhLFxuICAgICAgbXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9uczpcbiAgICAgICAgdGhpcy5jdXJyZW50T3B0aW9ucy5tdWx0aVNlbGVjdGFibGVBY2NvcmRpb25zIHx8IGZhbHNlLFxuICAgICAgcG9zaXRpb246IHRoaXMuY3VycmVudE9wdGlvbnMucG9zaXRpb24gfHwgXCJlbmRcIixcbiAgICB9O1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIC8vIENsZWFyIGFueSBwZW5kaW5nIHRpbWVvdXRzXG4gICAgaWYgKHRoaXMuZm9jdXNUaW1lb3V0SWQgIT09IG51bGwpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmZvY3VzVGltZW91dElkKTtcbiAgICAgIHRoaXMuZm9jdXNUaW1lb3V0SWQgPSBudWxsO1xuICAgIH1cbiAgICB0aGlzLmRlc3Ryb3kkLm5leHQoKTtcbiAgICB0aGlzLmRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gIH1cbn1cbiJdfQ==