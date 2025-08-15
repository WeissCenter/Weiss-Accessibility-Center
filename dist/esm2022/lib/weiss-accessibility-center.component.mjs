import { Component, HostListener, Input, ViewChild, ViewEncapsulation } from "@angular/core";
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
        // Removed targetId$ subscription and local state; template binds via async pipe.
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
      [attr.id]="(weissAccessibilityCenterService.targetId$ | async) ?? null"
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i3.StripComponent, selector: "weiss-accessibility-strip", inputs: ["data", "closeSelectionPanel"], outputs: ["statusMessageChange"] }, { kind: "component", type: i4.PanelComponent, selector: "weiss-accessibility-panel", inputs: ["data"], outputs: ["statusMessageChange"] }, { kind: "pipe", type: i2.AsyncPipe, name: "async" }], encapsulation: i0.ViewEncapsulation.None });
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
      [attr.id]="(weissAccessibilityCenterService.targetId$ | async) ?? null"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUVMLFNBQVMsRUFDVCxpQkFBaUIsRUFFbEIsTUFBTSxlQUFlLENBQUM7QUFVdkIsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDbEYsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxNQUFNLENBQUM7Ozs7OztBQWtEMUMsTUFBTSxPQUFPLGlDQUFpQztJQWtDbkM7SUFqQ1ksUUFBUSxDQUFNO0lBRTFCLE9BQU8sQ0FBbUM7SUFDMUMsS0FBSyxDQUFxQjtJQUMxQixXQUFXLENBQXFCO0lBQ2hDLFdBQVcsQ0FBMEI7SUFDckMsT0FBTyxDQUFzQjtJQUM3QixRQUFRLENBQThCO0lBQ3RDLE9BQU8sQ0FBNEI7SUFDbkMsUUFBUSxDQUE0QjtJQUNwQyxLQUFLLENBQTRCO0lBQ2pDLE9BQU8sQ0FBNEI7SUFDbkMsTUFBTSxDQUE0QjtJQUNsQyx5QkFBeUIsQ0FBc0I7SUFFeEQsK0RBQStEO0lBQy9ELGNBQWMsQ0FBdUI7SUFFOUIsNEJBQTRCLEdBQUcsS0FBSyxDQUFDO0lBQ3JDLElBQUksQ0FBd0I7SUFFM0IscUJBQXFCLEdBQXVCLElBQUksQ0FBQztJQUNqRCxvQkFBb0IsR0FBdUIsSUFBSSxDQUFDO0lBQ2hELHVCQUF1QixHQUM3QiwwUEFBMFAsQ0FBQztJQUV0UCxhQUFhLEdBQVcsRUFBRSxDQUFDO0lBQzNCLHdCQUF3QixHQUFZLEtBQUssQ0FBQztJQUV6QyxjQUFjLEdBQWtCLElBQUksQ0FBQztJQUNyQyxRQUFRLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztJQUV2QyxZQUNT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QUFLO2dCQUNHLEtBQUs7c0JBQWIsS0FBSztnQkFDRyxXQUFXO3NCQUFuQixLQUFLO2dCQUNHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBQ0csT0FBTztzQkFBZixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csT0FBTztzQkFBZixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csS0FBSztzQkFBYixLQUFLO2dCQUNHLE9BQU87c0JBQWYsS0FBSztnQkFDRyxNQUFNO3NCQUFkLEtBQUs7Z0JBQ0cseUJBQXlCO3NCQUFqQyxLQUFLO2dCQXdFTixtQkFBbUI7c0JBRGxCLFlBQVk7dUJBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBIb3N0TGlzdGVuZXIsXG4gIElucHV0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBPbkRlc3Ryb3lcbn0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7XG4gIEFjY2Vzc2liaWxpdHlPcHRpb25zLFxuICBEaXNwbGF5VHlwZSxcbiAgTW9kdWxlT3B0aW9ucyxcbiAgTW9kdWxlVHlwZXMsXG4gIFBhbmVsRGF0YSxcbiAgUG9zaXRpb25PcHRpb25zLFxufSBmcm9tIFwiLi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5pbnRlcmZhY2VzXCI7XG5pbXBvcnQgeyBXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlIH0gZnJvbSBcIi4vd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuc2VydmljZVwiO1xuaW1wb3J0IHsgY3JlYXRlQWNjZXNzaWJpbGl0eU9wdGlvbnMgfSBmcm9tIFwiLi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5mYWN0b3J5XCI7XG5pbXBvcnQgeyBTdWJqZWN0LCB0YWtlVW50aWwgfSBmcm9tIFwicnhqc1wiO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6IFwid2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXJcIixcbiAgdGVtcGxhdGU6IGBcbiAgICA8YXJ0aWNsZVxuICAgICAgcm9sZT1cImRpYWxvZ1wiXG4gICAgICBhcmlhLW1vZGFsPVwidHJ1ZVwiXG4gICAgICBbaGlkZGVuXT1cIiFzaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyXCJcbiAgICAgIFthdHRyLmlkXT1cIih3ZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlLnRhcmdldElkJCB8IGFzeW5jKSA/PyBudWxsXCJcbiAgICAgICNjZW50ZXJcbiAgICA+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzPVwiYmFja2dyb3VuZC1vdmVybGF5XCJcbiAgICAgICAgKm5nSWY9XCJjdXJyZW50T3B0aW9ucy5vdmVybGF5XCJcbiAgICAgICAgKGNsaWNrKT1cIlxuICAgICAgICAgIHdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2UudG9nZ2xlV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyKFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIHRydWVcbiAgICAgICAgICApXG4gICAgICAgIFwiXG4gICAgICA+PC9kaXY+XG4gICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiY3VycmVudE9wdGlvbnMuZGlzcGxheVR5cGUgPT09ICdwYW5lbCdcIj5cbiAgICAgICAgPHdlaXNzLWFjY2Vzc2liaWxpdHktcGFuZWxcbiAgICAgICAgICAoc3RhdHVzTWVzc2FnZUNoYW5nZSk9XCJvblN0YXR1c01lc3NhZ2VDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgICAgW2RhdGFdPVwiZGF0YVwiXG4gICAgICAgID48L3dlaXNzLWFjY2Vzc2liaWxpdHktcGFuZWw+XG4gICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJjdXJyZW50T3B0aW9ucy5kaXNwbGF5VHlwZSA9PT0gJ3N0cmlwJ1wiPlxuICAgICAgICA8d2Vpc3MtYWNjZXNzaWJpbGl0eS1zdHJpcFxuICAgICAgICAgIFtjbG9zZVNlbGVjdGlvblBhbmVsXT1cImZvcmNlQ2xvc2VTZWxlY3Rpb25QYW5lbFwiXG4gICAgICAgICAgKHN0YXR1c01lc3NhZ2VDaGFuZ2UpPVwib25TdGF0dXNNZXNzYWdlQ2hhbmdlKCRldmVudClcIlxuICAgICAgICAgIFtkYXRhXT1cImRhdGFcIlxuICAgICAgICA+PC93ZWlzcy1hY2Nlc3NpYmlsaXR5LXN0cmlwPlxuICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiY3VycmVudE9wdGlvbnMuZGlzcGxheVR5cGUgPT09ICdwb3BvdmVyJ1wiPlxuICAgICAgICA8IS0tIDx3ZWlzcy1hY2Nlc3NpYmlsaXR5LXBvcG92ZXI+PC93ZWlzcy1hY2Nlc3NpYmlsaXR5LXBvcG92ZXI+IC0tPlxuICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICA8ZGl2XG4gICAgICAgIGFyaWEtbGl2ZT1cInBvbGl0ZVwiXG4gICAgICAgIGlkPVwic3RhdHVzTWVzc2FnZVwiXG4gICAgICAgICpuZ0lmPVwic3RhdHVzTWVzc2FnZVwiXG4gICAgICAgIGNsYXNzPVwidmlzdWFsbHktaGlkZGVuXCJcbiAgICAgID5cbiAgICAgICAge3sgc3RhdHVzTWVzc2FnZSB9fVxuICAgICAgPC9kaXY+XG4gICAgPC9hcnRpY2xlPlxuICBgLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxufSlcbmV4cG9ydCBjbGFzcyBXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBAVmlld0NoaWxkKFwiY2VudGVyXCIpIGNlbnRlckVsOiBhbnk7XG5cbiAgQElucHV0KCkgb3B0aW9uczogQWNjZXNzaWJpbGl0eU9wdGlvbnMgfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIHRpdGxlOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIGRlc2NyaXB0aW9uOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIGRpc3BsYXlUeXBlOiBEaXNwbGF5VHlwZSB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgb3ZlcmxheTogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgcG9zaXRpb246IFBvc2l0aW9uT3B0aW9ucyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgbW9kdWxlczogTW9kdWxlVHlwZXNbXSB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgZm9udFNpemU6IE1vZHVsZU9wdGlvbnMgfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIHRoZW1lOiBNb2R1bGVPcHRpb25zIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBzcGFjaW5nOiBNb2R1bGVPcHRpb25zIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBsYXlvdXQ6IE1vZHVsZU9wdGlvbnMgfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIG11bHRpU2VsZWN0YWJsZUFjY29yZGlvbnM6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cbiAgLy8gTWVyZ2VkIG9wdGlvbnMgb2JqZWN0IHRoYXQgd2lsbCBiZSB1c2VkIHdpdGhpbiB0aGUgY29tcG9uZW50XG4gIGN1cnJlbnRPcHRpb25zOiBBY2Nlc3NpYmlsaXR5T3B0aW9ucztcblxuICBwdWJsaWMgc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlciA9IGZhbHNlO1xuICBwdWJsaWMgZGF0YTogUGFuZWxEYXRhIHwgdW5kZWZpbmVkO1xuXG4gIHByaXZhdGUgZmlyc3RGb2N1c2FibGVFbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGxhc3RGb2N1c2FibGVFbGVtZW50OiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGZvY3VzYWJsZUVsZW1lbnRzU3RyaW5nID1cbiAgICAnYVtocmVmXSwgYXJlYVtocmVmXSwgaW5wdXQ6bm90KFtkaXNhYmxlZF0pLCBzZWxlY3Q6bm90KFtkaXNhYmxlZF0pLCB0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSksIGJ1dHRvbjpub3QoW2Rpc2FibGVkXSksIGlmcmFtZSwgb2JqZWN0LCBlbWJlZCwgW3RhYmluZGV4PVwiMFwiXSwgW2NvbnRlbnRlZGl0YWJsZV0sIGxpW3RhYmluZGV4PVwiMFwiXSwgbGlbdGFiaW5kZXg9XCItMVwiXSwgdHJbdGFiaW5kZXg9XCIwXCJdLCB0clt0YWJpbmRleD1cIi0xXCJdJztcblxuICBwdWJsaWMgc3RhdHVzTWVzc2FnZTogc3RyaW5nID0gXCJcIjtcbiAgcHVibGljIGZvcmNlQ2xvc2VTZWxlY3Rpb25QYW5lbDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHByaXZhdGUgZm9jdXNUaW1lb3V0SWQ6IG51bWJlciB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGRlc3Ryb3kkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgd2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZTogV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZVxuICApIHtcbiAgICB0aGlzLmN1cnJlbnRPcHRpb25zID0gY3JlYXRlQWNjZXNzaWJpbGl0eU9wdGlvbnMoXG4gICAgICB0aGlzLndlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2VcbiAgICApO1xuICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgdGhpcy53ZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlLnNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIkXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXG4gICAgICAuc3Vic2NyaWJlKChzaG93KSA9PiB7XG4gICAgICAgIHRoaXMuc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlciA9IHNob3c7XG4gICAgICAgIHRoaXMuZm9yY2VDbG9zZVNlbGVjdGlvblBhbmVsID0gIXNob3c7XG5cbiAgICAgICAgLy8gQ2xlYXIgYW55IHBlbmRpbmcgZm9jdXMgdGltZW91dCB3aGVuIGNsb3NpbmdcbiAgICAgICAgaWYgKCFzaG93ICYmIHRoaXMuZm9jdXNUaW1lb3V0SWQgIT09IG51bGwpIHtcbiAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5mb2N1c1RpbWVvdXRJZCk7XG4gICAgICAgICAgdGhpcy5mb2N1c1RpbWVvdXRJZCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2hvdykge1xuICAgICAgICAgIGNvbnN0IGZvY3VzYWJsZUVsZW1lbnRzID1cbiAgICAgICAgICAgIHRoaXMuY2VudGVyRWw/Lm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgICAgICAgICAgdGhpcy5mb2N1c2FibGVFbGVtZW50c1N0cmluZ1xuICAgICAgICAgICAgKSBhcyBOb2RlTGlzdE9mPEhUTUxFbGVtZW50PjtcbiAgICAgICAgICB0aGlzLmZpcnN0Rm9jdXNhYmxlRWxlbWVudCA9IGZvY3VzYWJsZUVsZW1lbnRzWzBdO1xuICAgICAgICAgIHRoaXMubGFzdEZvY3VzYWJsZUVsZW1lbnQgPVxuICAgICAgICAgICAgZm9jdXNhYmxlRWxlbWVudHNbZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0gMV07XG5cbiAgICAgICAgICAvLyBGb2N1cyB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnQgb24gbmV4dCB0aWNrLCB0cmFjayB0aW1lb3V0IGZvciBjbGVhbnVwXG4gICAgICAgICAgdGhpcy5mb2N1c1RpbWVvdXRJZCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmlyc3RGb2N1c2FibGVFbGVtZW50Py5mb2N1cygpO1xuICAgICAgICAgICAgdGhpcy5mb2N1c1RpbWVvdXRJZCA9IG51bGw7XG4gICAgICAgICAgfSwgMCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIC8vIFJlbW92ZWQgdGFyZ2V0SWQkIHN1YnNjcmlwdGlvbiBhbmQgbG9jYWwgc3RhdGU7IHRlbXBsYXRlIGJpbmRzIHZpYSBhc3luYyBwaXBlLlxuICB9XG5cbiAgLy8gVGhpcyBtZXRob2QgaXMgdHJpZ2dlcmVkIHdoZW4gdGhlIGNoaWxkIGNvbXBvbmVudCBlbWl0cyBhIG5ldyBzdGF0dXMgbWVzc2FnZVxuICBvblN0YXR1c01lc3NhZ2VDaGFuZ2UobmV3TWVzc2FnZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zdGF0dXNNZXNzYWdlID0gbmV3TWVzc2FnZTtcbiAgfVxuXG4gIHByaXZhdGUgc2Nyb2xsRWxlbWVudEludG9WaWV3KGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICBlbGVtZW50LnNjcm9sbEludG9WaWV3KHtcbiAgICAgIGJlaGF2aW9yOiBcInNtb290aFwiLFxuICAgICAgYmxvY2s6IFwiY2VudGVyXCIsXG4gICAgfSk7XG4gIH1cblxuICAvLyBDbG9zZSBwYW5lbCB3aGVuIHVzZXIgaGl0cyBlc2NhcGUga2V5XG4gIC8vIFRyYXAgZm9jdXMgd2l0aGluIHRoZSBhY2Nlc3NpYmlsaXR5IGNlbnRlclxuICBASG9zdExpc3RlbmVyKFwia2V5ZG93blwiLCBbXCIkZXZlbnRcIl0pXG4gIGhhbmRsZUtleWJvYXJkRXZlbnQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAodGhpcy5zaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyKSB7XG4gICAgICBjb25zdCBkZWVwQWN0aXZlRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICBpZiAoZXZlbnQua2V5ID09PSBcIlRhYlwiKSB7XG4gICAgICAgIGlmIChldmVudC5zaGlmdEtleSkge1xuICAgICAgICAgIC8qIHNoaWZ0ICsgdGFiICovXG4gICAgICAgICAgaWYgKGRlZXBBY3RpdmVFbGVtZW50ID09PSB0aGlzLmZpcnN0Rm9jdXNhYmxlRWxlbWVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMubGFzdEZvY3VzYWJsZUVsZW1lbnQ/LmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8qIHRhYiAqL1xuICAgICAgICAgIGlmIChkZWVwQWN0aXZlRWxlbWVudCA9PT0gdGhpcy5sYXN0Rm9jdXNhYmxlRWxlbWVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuZmlyc3RGb2N1c2FibGVFbGVtZW50Py5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNjcm9sbEVsZW1lbnRJbnRvVmlldyhkZWVwQWN0aXZlRWxlbWVudCBhcyBFbGVtZW50KTtcbiAgICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5ID09PSBcIkVzY2FwZVwiKSB7XG4gICAgICAgIHRoaXMud2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZS50b2dnbGVXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIoXG4gICAgICAgICAgbnVsbCxcbiAgICAgICAgICB0cnVlXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc3RhdHVzTWVzc2FnZSA9IFwiQWNjZXNzaWJpbGl0eSBjZW50ZXIgY2xvc2VkXCI7XG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleSA9PT0gXCJBcnJvd1VwXCIgfHwgZXZlbnQua2V5ID09PSBcIkFycm93RG93blwiKSB7XG4gICAgICAgIC8vIFdhaXQgZm9yIERPTSB1cGRhdGVcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgYWN0aXZlRWxlbWVudCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgYWN0aXZlRWxlbWVudCAmJlxuICAgICAgICAgICAgdGhpcy5jZW50ZXJFbC5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGFjdGl2ZUVsZW1lbnQpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbEVsZW1lbnRJbnRvVmlldyhhY3RpdmVFbGVtZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoXG4gICAgICBjaGFuZ2VzW1wib3B0aW9uc1wiXSAmJlxuICAgICAgY2hhbmdlc1tcIm9wdGlvbnNcIl0uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzW1wib3B0aW9uc1wiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1widGl0bGVcIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJ0aXRsZVwiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJ0aXRsZVwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wiZGVzY3JpcHRpb25cIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJkZXNjcmlwdGlvblwiXS5jdXJyZW50VmFsdWUgIT09XG4gICAgICAgIGNoYW5nZXNbXCJkZXNjcmlwdGlvblwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wiZGlzcGxheVR5cGVcIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJkaXNwbGF5VHlwZVwiXS5jdXJyZW50VmFsdWUgIT09XG4gICAgICAgIGNoYW5nZXNbXCJkaXNwbGF5VHlwZVwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wibW9kdWxlc1wiXSAmJlxuICAgICAgY2hhbmdlc1tcIm1vZHVsZXNcIl0uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzW1wibW9kdWxlc1wiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wiZm9udFNpemVcIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJmb250U2l6ZVwiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJmb250U2l6ZVwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1widGhlbWVcIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJ0aGVtZVwiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJ0aGVtZVwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wic3BhY2luZ1wiXSAmJlxuICAgICAgY2hhbmdlc1tcInNwYWNpbmdcIl0uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzW1wic3BhY2luZ1wiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wibGF5b3V0XCJdICYmXG4gICAgICBjaGFuZ2VzW1wibGF5b3V0XCJdLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlc1tcImxheW91dFwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wib3ZlcmxheVwiXSAmJlxuICAgICAgY2hhbmdlc1tcIm92ZXJsYXlcIl0uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzW1wib3ZlcmxheVwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wicG9zaXRpb25cIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJwb3NpdGlvblwiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJwb3NpdGlvblwiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICBjaGFuZ2VzW1wibXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9uc1wiXSAmJlxuICAgICAgY2hhbmdlc1tcIm11bHRpU2VsZWN0YWJsZUFjY29yZGlvbnNcIl0uY3VycmVudFZhbHVlICE9PVxuICAgICAgICBjaGFuZ2VzW1wibXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9uc1wiXS5wcmV2aW91c1ZhbHVlXG4gICAgKSB7XG4gICAgICB0aGlzLnNldHVwT3B0aW9ucygpO1xuICAgIH1cbiAgfVxuXG4gIHNldHVwT3B0aW9ucygpIHtcbiAgICAvLyBNZXJnZSB0aGUgcHJvdmlkZWQgb3B0aW9ucyB3aXRoIHRoZSBkZWZhdWx0IG9uZXNcbiAgICBjb25zdCBtZXJnZWRPcHRpb25zID0ge1xuICAgICAgLi4uY3JlYXRlQWNjZXNzaWJpbGl0eU9wdGlvbnModGhpcy53ZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlKSxcbiAgICAgIC4uLnRoaXMub3B0aW9ucyxcbiAgICB9O1xuXG4gICAgLy8gSWYgYW4gb3B0aW9uIHdhcyBwYXNzZWQgaW5kaXZpZHVhbGx5LCBvdmVycmlkZSBpbiBtZXJnZWRPcHRpb25zXG4gICAgaWYgKHRoaXMudGl0bGUpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMudGl0bGUgPSB0aGlzLnRpdGxlO1xuICAgIH1cbiAgICBpZiAodGhpcy5kZXNjcmlwdGlvbikge1xuICAgICAgbWVyZ2VkT3B0aW9ucy5kZXNjcmlwdGlvbiA9IHRoaXMuZGVzY3JpcHRpb247XG4gICAgfVxuICAgIGlmICh0aGlzLmRpc3BsYXlUeXBlKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLmRpc3BsYXlUeXBlID0gdGhpcy5kaXNwbGF5VHlwZTtcbiAgICB9XG4gICAgaWYgKHRoaXMub3ZlcmxheSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLm92ZXJsYXkgPSB0aGlzLm92ZXJsYXk7XG4gICAgfVxuICAgIGlmICh0aGlzLm11bHRpU2VsZWN0YWJsZUFjY29yZGlvbnMpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMubXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9ucyA9IHRoaXMubXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9ucztcbiAgICB9XG4gICAgaWYgKHRoaXMucG9zaXRpb24pIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMucG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uO1xuICAgIH1cbiAgICBpZiAodGhpcy5tb2R1bGVzKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLmluY2x1ZGUgPSB0aGlzLm1vZHVsZXM7XG4gICAgfVxuICAgIGlmICh0aGlzLmZvbnRTaXplKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLmZvbnRTaXplID0gdGhpcy5mb250U2l6ZTtcbiAgICAgIC8vIElmIGZvbnRTaXplIHdhcyBwYXNzZWQgaW4gc3BlY2lmaWNhbGx5LCBjaGVjayB0byBiZSBzdXJlIGl0J3MgaW5jbHVkZWQgaW4gdGhlIG1vZHVsZXMgbGlzdC4gSWYgbm90LCBhZGQgaXQuXG4gICAgICBpZiAoXG4gICAgICAgIG1lcmdlZE9wdGlvbnMuaW5jbHVkZSAmJlxuICAgICAgICAhbWVyZ2VkT3B0aW9ucy5pbmNsdWRlLmluY2x1ZGVzKFwiZm9udFNpemVcIilcbiAgICAgICkge1xuICAgICAgICBtZXJnZWRPcHRpb25zLmluY2x1ZGUucHVzaChcImZvbnRTaXplXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy50aGVtZSkge1xuICAgICAgbWVyZ2VkT3B0aW9ucy50aGVtZSA9IHRoaXMudGhlbWU7XG4gICAgICBpZiAobWVyZ2VkT3B0aW9ucy5pbmNsdWRlICYmICFtZXJnZWRPcHRpb25zLmluY2x1ZGUuaW5jbHVkZXMoXCJ0aGVtZVwiKSkge1xuICAgICAgICBtZXJnZWRPcHRpb25zLmluY2x1ZGUucHVzaChcInRoZW1lXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5zcGFjaW5nKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLnNwYWNpbmcgPSB0aGlzLnNwYWNpbmc7XG4gICAgICBpZiAobWVyZ2VkT3B0aW9ucy5pbmNsdWRlICYmICFtZXJnZWRPcHRpb25zLmluY2x1ZGUuaW5jbHVkZXMoXCJzcGFjaW5nXCIpKSB7XG4gICAgICAgIG1lcmdlZE9wdGlvbnMuaW5jbHVkZS5wdXNoKFwic3BhY2luZ1wiKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMubGF5b3V0KSB7XG4gICAgICBtZXJnZWRPcHRpb25zLmxheW91dCA9IHRoaXMubGF5b3V0O1xuICAgICAgaWYgKG1lcmdlZE9wdGlvbnMuaW5jbHVkZSAmJiAhbWVyZ2VkT3B0aW9ucy5pbmNsdWRlLmluY2x1ZGVzKFwibGF5b3V0XCIpKSB7XG4gICAgICAgIG1lcmdlZE9wdGlvbnMuaW5jbHVkZS5wdXNoKFwibGF5b3V0XCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE5vdyBzdG9yZSB0aGUgZmluYWwgbWVyZ2VkIG9wdGlvbnNcbiAgICB0aGlzLmN1cnJlbnRPcHRpb25zID0gbWVyZ2VkT3B0aW9ucztcbiAgICB0aGlzLmRhdGEgPSB0aGlzLmJ1aWxkRGF0YSgpO1xuICB9XG5cbiAgYnVpbGREYXRhKCkge1xuICAgIC8vIEJ1aWxkIHRoZSBkYXRhIG9iamVjdCB0byBwYXNzIHRvIHRoZSBwYW5lbFxuICAgIC8vIERldGVybWluZSB3aGljaCBtb2R1bGVzIHRvIGluY2x1ZGUgYmFzZWQgb24gdGhlIGN1cnJlbnQgb3B0aW9uc1xuICAgIGNvbnN0IGluY2x1ZGVkTW9kdWxlcyA9IHRoaXMuY3VycmVudE9wdGlvbnMuaW5jbHVkZSB8fCBbXTtcbiAgICBsZXQgbW9kdWxlRGF0YTogUGFuZWxEYXRhW1wibW9kdWxlc1wiXSA9IHt9O1xuICAgIGluY2x1ZGVkTW9kdWxlcy5mb3JFYWNoKChtb2R1bGU6IE1vZHVsZVR5cGVzKSA9PiB7XG4gICAgICAvLyBBZGQgdGhlIG1vZHVsZSB0byB0aGUgZGF0YSBvYmplY3RcbiAgICAgIG1vZHVsZURhdGFbbW9kdWxlXSA9IHRoaXMuY3VycmVudE9wdGlvbnNbbW9kdWxlXTtcbiAgICB9KTtcbiAgICBjb25zdCBkYXRhOiBQYW5lbERhdGEgPSB7XG4gICAgICB0aXRsZTogdGhpcy5jdXJyZW50T3B0aW9ucy50aXRsZSB8fCBcIkFjY2Vzc2liaWxpdHkgc2V0dGluZ3NcIixcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICB0aGlzLmN1cnJlbnRPcHRpb25zLmRlc2NyaXB0aW9uIHx8XG4gICAgICAgIFwiQWRqdXN0IHRoZSBzZXR0aW5ncyBiZWxvdyB0byBjdXN0b21pemUgdGhlIGFwcGVhcmFuY2Ugb2YgdGhpcyB3ZWJzaXRlLlwiLFxuICAgICAgbW9kdWxlczogbW9kdWxlRGF0YSxcbiAgICAgIG11bHRpU2VsZWN0YWJsZUFjY29yZGlvbnM6XG4gICAgICAgIHRoaXMuY3VycmVudE9wdGlvbnMubXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9ucyB8fCBmYWxzZSxcbiAgICAgIHBvc2l0aW9uOiB0aGlzLmN1cnJlbnRPcHRpb25zLnBvc2l0aW9uIHx8IFwiZW5kXCIsXG4gICAgfTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIC8vIENsZWFyIGFueSBwZW5kaW5nIHRpbWVvdXRzXG4gICAgaWYgKHRoaXMuZm9jdXNUaW1lb3V0SWQgIT09IG51bGwpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmZvY3VzVGltZW91dElkKTtcbiAgICAgIHRoaXMuZm9jdXNUaW1lb3V0SWQgPSBudWxsO1xuICAgIH1cbiAgICB0aGlzLmRlc3Ryb3kkLm5leHQoKTtcbiAgICB0aGlzLmRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gIH1cbn1cbiJdfQ==