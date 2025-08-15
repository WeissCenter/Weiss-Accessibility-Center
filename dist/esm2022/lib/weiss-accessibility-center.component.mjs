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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUVMLFNBQVMsRUFDVCxpQkFBaUIsRUFJakIsVUFBVSxFQUNYLE1BQU0sZUFBZSxDQUFDO0FBVXZCLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7Ozs7QUFrRDFDLE1BQU0sT0FBTyxpQ0FBaUM7SUFrQ25DO0lBQ0M7SUFsQ2lDLFFBQVEsQ0FBMkI7SUFFckUsT0FBTyxDQUFtQztJQUMxQyxLQUFLLENBQXFCO0lBQzFCLFdBQVcsQ0FBcUI7SUFDaEMsV0FBVyxDQUEwQjtJQUNyQyxPQUFPLENBQXNCO0lBQzdCLFFBQVEsQ0FBOEI7SUFDdEMsT0FBTyxDQUE0QjtJQUNuQyxRQUFRLENBQTRCO0lBQ3BDLEtBQUssQ0FBNEI7SUFDakMsT0FBTyxDQUE0QjtJQUNuQyxNQUFNLENBQTRCO0lBQ2xDLHlCQUF5QixDQUFzQjtJQUV4RCwrREFBK0Q7SUFDL0QsY0FBYyxDQUF1QjtJQUU5Qiw0QkFBNEIsR0FBRyxLQUFLLENBQUM7SUFDckMsSUFBSSxDQUF3QjtJQUUzQixxQkFBcUIsR0FBdUIsSUFBSSxDQUFDO0lBQ2pELG9CQUFvQixHQUF1QixJQUFJLENBQUM7SUFDaEQsdUJBQXVCLEdBQzdCLDBQQUEwUCxDQUFDO0lBRXRQLGFBQWEsR0FBVyxFQUFFLENBQUM7SUFDM0Isd0JBQXdCLEdBQVksS0FBSyxDQUFDO0lBRXpDLGNBQWMsR0FBa0IsSUFBSSxDQUFDO0lBQ3JDLFFBQVEsR0FBRyxJQUFJLE9BQU8sRUFB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QUMzQixDQUFDO3VHQXJTVSxpQ0FBaUM7MkZBQWpDLGlDQUFpQyw4ZkFDZixVQUFVLGtEQS9DN0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EyQ1Q7OzJGQUdVLGlDQUFpQztrQkFoRDdDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLDRCQUE0QjtvQkFDdEMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMkNUO29CQUNELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2lCQUN0Qzs0SEFFNEMsUUFBUTtzQkFBbEQsU0FBUzt1QkFBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFO2dCQUVoQyxPQUFPO3NCQUFmLEtBQUs7Z0JBQ0csS0FBSztzQkFBYixLQUFLO2dCQUNHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFDRyxPQUFPO3NCQUFmLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxPQUFPO3NCQUFmLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxLQUFLO3NCQUFiLEtBQUs7Z0JBQ0csT0FBTztzQkFBZixLQUFLO2dCQUNHLE1BQU07c0JBQWQsS0FBSztnQkFDRyx5QkFBeUI7c0JBQWpDLEtBQUs7Z0JBaUZOLG1CQUFtQjtzQkFEbEIsWUFBWTt1QkFBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEhvc3RMaXN0ZW5lcixcbiAgSW5wdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIE9uRGVzdHJveSxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgUmVuZGVyZXIyLFxuICBFbGVtZW50UmVmXG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQge1xuICBBY2Nlc3NpYmlsaXR5T3B0aW9ucyxcbiAgRGlzcGxheVR5cGUsXG4gIE1vZHVsZU9wdGlvbnMsXG4gIE1vZHVsZVR5cGVzLFxuICBQYW5lbERhdGEsXG4gIFBvc2l0aW9uT3B0aW9ucyxcbn0gZnJvbSBcIi4vd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuaW50ZXJmYWNlc1wiO1xuaW1wb3J0IHsgV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZSB9IGZyb20gXCIuL3dlaXNzLWFjY2Vzc2liaWxpdHktY2VudGVyLnNlcnZpY2VcIjtcbmltcG9ydCB7IGNyZWF0ZUFjY2Vzc2liaWxpdHlPcHRpb25zIH0gZnJvbSBcIi4vd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuZmFjdG9yeVwiO1xuaW1wb3J0IHsgU3ViamVjdCwgdGFrZVVudGlsIH0gZnJvbSBcInJ4anNcIjtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiBcIndlaXNzLWFjY2Vzc2liaWxpdHktY2VudGVyXCIsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGFydGljbGVcbiAgICAgIHJvbGU9XCJkaWFsb2dcIlxuICAgICAgYXJpYS1tb2RhbD1cInRydWVcIlxuICAgICAgW2hpZGRlbl09XCIhc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclwiXG4gICAgICBpZD1cImJsYXJnaFwiXG4gICAgICAjY2VudGVyXG4gICAgPlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzcz1cImJhY2tncm91bmQtb3ZlcmxheVwiXG4gICAgICAgICpuZ0lmPVwiY3VycmVudE9wdGlvbnMub3ZlcmxheVwiXG4gICAgICAgIChjbGljayk9XCJcbiAgICAgICAgICB3ZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlLnRvZ2dsZVdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlcihcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICB0cnVlXG4gICAgICAgICAgKVxuICAgICAgICBcIlxuICAgICAgPjwvZGl2PlxuICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImN1cnJlbnRPcHRpb25zLmRpc3BsYXlUeXBlID09PSAncGFuZWwnXCI+XG4gICAgICAgIDx3ZWlzcy1hY2Nlc3NpYmlsaXR5LXBhbmVsXG4gICAgICAgICAgKHN0YXR1c01lc3NhZ2VDaGFuZ2UpPVwib25TdGF0dXNNZXNzYWdlQ2hhbmdlKCRldmVudClcIlxuICAgICAgICAgIFtkYXRhXT1cImRhdGFcIlxuICAgICAgICA+PC93ZWlzcy1hY2Nlc3NpYmlsaXR5LXBhbmVsPlxuICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiY3VycmVudE9wdGlvbnMuZGlzcGxheVR5cGUgPT09ICdzdHJpcCdcIj5cbiAgICAgICAgPHdlaXNzLWFjY2Vzc2liaWxpdHktc3RyaXBcbiAgICAgICAgICBbY2xvc2VTZWxlY3Rpb25QYW5lbF09XCJmb3JjZUNsb3NlU2VsZWN0aW9uUGFuZWxcIlxuICAgICAgICAgIChzdGF0dXNNZXNzYWdlQ2hhbmdlKT1cIm9uU3RhdHVzTWVzc2FnZUNoYW5nZSgkZXZlbnQpXCJcbiAgICAgICAgICBbZGF0YV09XCJkYXRhXCJcbiAgICAgICAgPjwvd2Vpc3MtYWNjZXNzaWJpbGl0eS1zdHJpcD5cbiAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImN1cnJlbnRPcHRpb25zLmRpc3BsYXlUeXBlID09PSAncG9wb3ZlcidcIj5cbiAgICAgICAgPCEtLSA8d2Vpc3MtYWNjZXNzaWJpbGl0eS1wb3BvdmVyPjwvd2Vpc3MtYWNjZXNzaWJpbGl0eS1wb3BvdmVyPiAtLT5cbiAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgPGRpdlxuICAgICAgICBhcmlhLWxpdmU9XCJwb2xpdGVcIlxuICAgICAgICBpZD1cInN0YXR1c01lc3NhZ2VcIlxuICAgICAgICAqbmdJZj1cInN0YXR1c01lc3NhZ2VcIlxuICAgICAgICBjbGFzcz1cInZpc3VhbGx5LWhpZGRlblwiXG4gICAgICA+XG4gICAgICAgIHt7IHN0YXR1c01lc3NhZ2UgfX1cbiAgICAgIDwvZGl2PlxuICAgIDwvYXJ0aWNsZT5cbiAgYCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25EZXN0cm95LCBBZnRlclZpZXdJbml0IHtcbiAgQFZpZXdDaGlsZChcImNlbnRlclwiLCB7IHJlYWQ6IEVsZW1lbnRSZWYgfSkgY2VudGVyRWwhOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICBASW5wdXQoKSBvcHRpb25zOiBBY2Nlc3NpYmlsaXR5T3B0aW9ucyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgdGl0bGU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgZGVzY3JpcHRpb246IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgZGlzcGxheVR5cGU6IERpc3BsYXlUeXBlIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBvdmVybGF5OiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBwb3NpdGlvbjogUG9zaXRpb25PcHRpb25zIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBtb2R1bGVzOiBNb2R1bGVUeXBlc1tdIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBmb250U2l6ZTogTW9kdWxlT3B0aW9ucyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgdGhlbWU6IE1vZHVsZU9wdGlvbnMgfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIHNwYWNpbmc6IE1vZHVsZU9wdGlvbnMgfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIGxheW91dDogTW9kdWxlT3B0aW9ucyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgbXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9uczogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxuICAvLyBNZXJnZWQgb3B0aW9ucyBvYmplY3QgdGhhdCB3aWxsIGJlIHVzZWQgd2l0aGluIHRoZSBjb21wb25lbnRcbiAgY3VycmVudE9wdGlvbnM6IEFjY2Vzc2liaWxpdHlPcHRpb25zO1xuXG4gIHB1YmxpYyBzaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyID0gZmFsc2U7XG4gIHB1YmxpYyBkYXRhOiBQYW5lbERhdGEgfCB1bmRlZmluZWQ7XG5cbiAgcHJpdmF0ZSBmaXJzdEZvY3VzYWJsZUVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgbGFzdEZvY3VzYWJsZUVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgZm9jdXNhYmxlRWxlbWVudHNTdHJpbmcgPVxuICAgICdhW2hyZWZdLCBhcmVhW2hyZWZdLCBpbnB1dDpub3QoW2Rpc2FibGVkXSksIHNlbGVjdDpub3QoW2Rpc2FibGVkXSksIHRleHRhcmVhOm5vdChbZGlzYWJsZWRdKSwgYnV0dG9uOm5vdChbZGlzYWJsZWRdKSwgaWZyYW1lLCBvYmplY3QsIGVtYmVkLCBbdGFiaW5kZXg9XCIwXCJdLCBbY29udGVudGVkaXRhYmxlXSwgbGlbdGFiaW5kZXg9XCIwXCJdLCBsaVt0YWJpbmRleD1cIi0xXCJdLCB0clt0YWJpbmRleD1cIjBcIl0sIHRyW3RhYmluZGV4PVwiLTFcIl0nO1xuXG4gIHB1YmxpYyBzdGF0dXNNZXNzYWdlOiBzdHJpbmcgPSBcIlwiO1xuICBwdWJsaWMgZm9yY2VDbG9zZVNlbGVjdGlvblBhbmVsOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBmb2N1c1RpbWVvdXRJZDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgZGVzdHJveSQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyB3ZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlOiBXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMlxuICApIHtcbiAgICB0aGlzLmN1cnJlbnRPcHRpb25zID0gY3JlYXRlQWNjZXNzaWJpbGl0eU9wdGlvbnMoXG4gICAgICB0aGlzLndlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2VcbiAgICApO1xuICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG5cbiAgICB0aGlzLndlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2Uuc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlciRcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSlcbiAgICAgIC5zdWJzY3JpYmUoKHNob3cpID0+IHtcbiAgICAgICAgdGhpcy5zaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyID0gc2hvdztcbiAgICAgICAgdGhpcy5mb3JjZUNsb3NlU2VsZWN0aW9uUGFuZWwgPSAhc2hvdztcblxuICAgICAgICBpZiAoIXNob3cgJiYgdGhpcy5mb2N1c1RpbWVvdXRJZCAhPT0gbnVsbCkge1xuICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmZvY3VzVGltZW91dElkKTtcbiAgICAgICAgICB0aGlzLmZvY3VzVGltZW91dElkID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaG93KSB7XG4gICAgICAgICAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHMgPVxuICAgICAgICAgICAgdGhpcy5jZW50ZXJFbD8ubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFxuICAgICAgICAgICAgICB0aGlzLmZvY3VzYWJsZUVsZW1lbnRzU3RyaW5nXG4gICAgICAgICAgICApIGFzIE5vZGVMaXN0T2Y8SFRNTEVsZW1lbnQ+O1xuICAgICAgICAgIHRoaXMuZmlyc3RGb2N1c2FibGVFbGVtZW50ID0gZm9jdXNhYmxlRWxlbWVudHNbMF07XG4gICAgICAgICAgdGhpcy5sYXN0Rm9jdXNhYmxlRWxlbWVudCA9XG4gICAgICAgICAgICBmb2N1c2FibGVFbGVtZW50c1tmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggLSAxXTtcblxuICAgICAgICAgIHRoaXMuZm9jdXNUaW1lb3V0SWQgPSB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmZpcnN0Rm9jdXNhYmxlRWxlbWVudD8uZm9jdXMoKTtcbiAgICAgICAgICAgIHRoaXMuZm9jdXNUaW1lb3V0SWQgPSBudWxsO1xuICAgICAgICAgIH0sIDApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICAvLyBBcHBseSBpZCB0byB0aGUgYWN0dWFsIDxhcnRpY2xlPiBhZnRlciBpdCdzIGluIHRoZSBET01cbiAgICB0aGlzLndlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2UudGFyZ2V0SWQkXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXG4gICAgICAuc3Vic2NyaWJlKChpZCkgPT4ge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGlkID8/ICd3ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlcic7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMuY2VudGVyRWwubmF0aXZlRWxlbWVudCwgJ2lkJywgdmFsdWUpO1xuICAgICAgfSk7XG4gIH1cblxuICAvLyBUaGlzIG1ldGhvZCBpcyB0cmlnZ2VyZWQgd2hlbiB0aGUgY2hpbGQgY29tcG9uZW50IGVtaXRzIGEgbmV3IHN0YXR1cyBtZXNzYWdlXG4gIG9uU3RhdHVzTWVzc2FnZUNoYW5nZShuZXdNZXNzYWdlOiBzdHJpbmcpIHtcbiAgICB0aGlzLnN0YXR1c01lc3NhZ2UgPSBuZXdNZXNzYWdlO1xuICB9XG5cbiAgcHJpdmF0ZSBzY3JvbGxFbGVtZW50SW50b1ZpZXcoZWxlbWVudDogRWxlbWVudCkge1xuICAgIGVsZW1lbnQuc2Nyb2xsSW50b1ZpZXcoe1xuICAgICAgYmVoYXZpb3I6IFwic21vb3RoXCIsXG4gICAgICBibG9jazogXCJjZW50ZXJcIixcbiAgICB9KTtcbiAgfVxuXG4gIC8vIENsb3NlIHBhbmVsIHdoZW4gdXNlciBoaXRzIGVzY2FwZSBrZXlcbiAgLy8gVHJhcCBmb2N1cyB3aXRoaW4gdGhlIGFjY2Vzc2liaWxpdHkgY2VudGVyXG4gIEBIb3N0TGlzdGVuZXIoXCJrZXlkb3duXCIsIFtcIiRldmVudFwiXSlcbiAgaGFuZGxlS2V5Ym9hcmRFdmVudChldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmICh0aGlzLnNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIpIHtcbiAgICAgIGNvbnN0IGRlZXBBY3RpdmVFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICAgIGlmIChldmVudC5rZXkgPT09IFwiVGFiXCIpIHtcbiAgICAgICAgaWYgKGV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgICAgLyogc2hpZnQgKyB0YWIgKi9cbiAgICAgICAgICBpZiAoZGVlcEFjdGl2ZUVsZW1lbnQgPT09IHRoaXMuZmlyc3RGb2N1c2FibGVFbGVtZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5sYXN0Rm9jdXNhYmxlRWxlbWVudD8uZm9jdXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLyogdGFiICovXG4gICAgICAgICAgaWYgKGRlZXBBY3RpdmVFbGVtZW50ID09PSB0aGlzLmxhc3RGb2N1c2FibGVFbGVtZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5maXJzdEZvY3VzYWJsZUVsZW1lbnQ/LmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2Nyb2xsRWxlbWVudEludG9WaWV3KGRlZXBBY3RpdmVFbGVtZW50IGFzIEVsZW1lbnQpO1xuICAgICAgfSBlbHNlIGlmIChldmVudC5rZXkgPT09IFwiRXNjYXBlXCIpIHtcbiAgICAgICAgdGhpcy53ZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlLnRvZ2dsZVdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlcihcbiAgICAgICAgICBudWxsLFxuICAgICAgICAgIHRydWVcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zdGF0dXNNZXNzYWdlID0gXCJBY2Nlc3NpYmlsaXR5IGNlbnRlciBjbG9zZWRcIjtcbiAgICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5ID09PSBcIkFycm93VXBcIiB8fCBldmVudC5rZXkgPT09IFwiQXJyb3dEb3duXCIpIHtcbiAgICAgICAgLy8gV2FpdCBmb3IgRE9NIHVwZGF0ZVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBjb25zdCBhY3RpdmVFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBhY3RpdmVFbGVtZW50ICYmXG4gICAgICAgICAgICB0aGlzLmNlbnRlckVsLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoYWN0aXZlRWxlbWVudClcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsRWxlbWVudEludG9WaWV3KGFjdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgMCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChcbiAgICAgIGNoYW5nZXNbXCJvcHRpb25zXCJdICYmXG4gICAgICBjaGFuZ2VzW1wib3B0aW9uc1wiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJvcHRpb25zXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJ0aXRsZVwiXSAmJlxuICAgICAgY2hhbmdlc1tcInRpdGxlXCJdLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlc1tcInRpdGxlXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJkZXNjcmlwdGlvblwiXSAmJlxuICAgICAgY2hhbmdlc1tcImRlc2NyaXB0aW9uXCJdLmN1cnJlbnRWYWx1ZSAhPT1cbiAgICAgICAgY2hhbmdlc1tcImRlc2NyaXB0aW9uXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJkaXNwbGF5VHlwZVwiXSAmJlxuICAgICAgY2hhbmdlc1tcImRpc3BsYXlUeXBlXCJdLmN1cnJlbnRWYWx1ZSAhPT1cbiAgICAgICAgY2hhbmdlc1tcImRpc3BsYXlUeXBlXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJtb2R1bGVzXCJdICYmXG4gICAgICBjaGFuZ2VzW1wibW9kdWxlc1wiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJtb2R1bGVzXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJmb250U2l6ZVwiXSAmJlxuICAgICAgY2hhbmdlc1tcImZvbnRTaXplXCJdLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlc1tcImZvbnRTaXplXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJ0aGVtZVwiXSAmJlxuICAgICAgY2hhbmdlc1tcInRoZW1lXCJdLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlc1tcInRoZW1lXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJzcGFjaW5nXCJdICYmXG4gICAgICBjaGFuZ2VzW1wic3BhY2luZ1wiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJzcGFjaW5nXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJsYXlvdXRcIl0gJiZcbiAgICAgIGNoYW5nZXNbXCJsYXlvdXRcIl0uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzW1wibGF5b3V0XCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJvdmVybGF5XCJdICYmXG4gICAgICBjaGFuZ2VzW1wib3ZlcmxheVwiXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbXCJvdmVybGF5XCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJwb3NpdGlvblwiXSAmJlxuICAgICAgY2hhbmdlc1tcInBvc2l0aW9uXCJdLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlc1tcInBvc2l0aW9uXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbXCJtdWx0aVNlbGVjdGFibGVBY2NvcmRpb25zXCJdICYmXG4gICAgICBjaGFuZ2VzW1wibXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9uc1wiXS5jdXJyZW50VmFsdWUgIT09XG4gICAgICAgIGNoYW5nZXNbXCJtdWx0aVNlbGVjdGFibGVBY2NvcmRpb25zXCJdLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfVxuICB9XG5cbiAgc2V0dXBPcHRpb25zKCkge1xuICAgIC8vIE1lcmdlIHRoZSBwcm92aWRlZCBvcHRpb25zIHdpdGggdGhlIGRlZmF1bHQgb25lc1xuICAgIGNvbnN0IG1lcmdlZE9wdGlvbnMgPSB7XG4gICAgICAuLi5jcmVhdGVBY2Nlc3NpYmlsaXR5T3B0aW9ucyh0aGlzLndlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2UpLFxuICAgICAgLi4udGhpcy5vcHRpb25zLFxuICAgIH07XG5cbiAgICAvLyBJZiBhbiBvcHRpb24gd2FzIHBhc3NlZCBpbmRpdmlkdWFsbHksIG92ZXJyaWRlIGluIG1lcmdlZE9wdGlvbnNcbiAgICBpZiAodGhpcy50aXRsZSkge1xuICAgICAgbWVyZ2VkT3B0aW9ucy50aXRsZSA9IHRoaXMudGl0bGU7XG4gICAgfVxuICAgIGlmICh0aGlzLmRlc2NyaXB0aW9uKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLmRlc2NyaXB0aW9uID0gdGhpcy5kZXNjcmlwdGlvbjtcbiAgICB9XG4gICAgaWYgKHRoaXMuZGlzcGxheVR5cGUpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMuZGlzcGxheVR5cGUgPSB0aGlzLmRpc3BsYXlUeXBlO1xuICAgIH1cbiAgICBpZiAodGhpcy5vdmVybGF5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMub3ZlcmxheSA9IHRoaXMub3ZlcmxheTtcbiAgICB9XG4gICAgaWYgKHRoaXMubXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9ucykge1xuICAgICAgbWVyZ2VkT3B0aW9ucy5tdWx0aVNlbGVjdGFibGVBY2NvcmRpb25zID0gdGhpcy5tdWx0aVNlbGVjdGFibGVBY2NvcmRpb25zO1xuICAgIH1cbiAgICBpZiAodGhpcy5wb3NpdGlvbikge1xuICAgICAgbWVyZ2VkT3B0aW9ucy5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb247XG4gICAgfVxuICAgIGlmICh0aGlzLm1vZHVsZXMpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMuaW5jbHVkZSA9IHRoaXMubW9kdWxlcztcbiAgICB9XG4gICAgaWYgKHRoaXMuZm9udFNpemUpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMuZm9udFNpemUgPSB0aGlzLmZvbnRTaXplO1xuICAgICAgLy8gSWYgZm9udFNpemUgd2FzIHBhc3NlZCBpbiBzcGVjaWZpY2FsbHksIGNoZWNrIHRvIGJlIHN1cmUgaXQncyBpbmNsdWRlZCBpbiB0aGUgbW9kdWxlcyBsaXN0LiBJZiBub3QsIGFkZCBpdC5cbiAgICAgIGlmIChcbiAgICAgICAgbWVyZ2VkT3B0aW9ucy5pbmNsdWRlICYmXG4gICAgICAgICFtZXJnZWRPcHRpb25zLmluY2x1ZGUuaW5jbHVkZXMoXCJmb250U2l6ZVwiKVxuICAgICAgKSB7XG4gICAgICAgIG1lcmdlZE9wdGlvbnMuaW5jbHVkZS5wdXNoKFwiZm9udFNpemVcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLnRoZW1lKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLnRoZW1lID0gdGhpcy50aGVtZTtcbiAgICAgIGlmIChtZXJnZWRPcHRpb25zLmluY2x1ZGUgJiYgIW1lcmdlZE9wdGlvbnMuaW5jbHVkZS5pbmNsdWRlcyhcInRoZW1lXCIpKSB7XG4gICAgICAgIG1lcmdlZE9wdGlvbnMuaW5jbHVkZS5wdXNoKFwidGhlbWVcIik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLnNwYWNpbmcpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMuc3BhY2luZyA9IHRoaXMuc3BhY2luZztcbiAgICAgIGlmIChtZXJnZWRPcHRpb25zLmluY2x1ZGUgJiYgIW1lcmdlZE9wdGlvbnMuaW5jbHVkZS5pbmNsdWRlcyhcInNwYWNpbmdcIikpIHtcbiAgICAgICAgbWVyZ2VkT3B0aW9ucy5pbmNsdWRlLnB1c2goXCJzcGFjaW5nXCIpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5sYXlvdXQpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMubGF5b3V0ID0gdGhpcy5sYXlvdXQ7XG4gICAgICBpZiAobWVyZ2VkT3B0aW9ucy5pbmNsdWRlICYmICFtZXJnZWRPcHRpb25zLmluY2x1ZGUuaW5jbHVkZXMoXCJsYXlvdXRcIikpIHtcbiAgICAgICAgbWVyZ2VkT3B0aW9ucy5pbmNsdWRlLnB1c2goXCJsYXlvdXRcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTm93IHN0b3JlIHRoZSBmaW5hbCBtZXJnZWQgb3B0aW9uc1xuICAgIHRoaXMuY3VycmVudE9wdGlvbnMgPSBtZXJnZWRPcHRpb25zO1xuICAgIHRoaXMuZGF0YSA9IHRoaXMuYnVpbGREYXRhKCk7XG4gIH1cblxuICBidWlsZERhdGEoKSB7XG4gICAgLy8gQnVpbGQgdGhlIGRhdGEgb2JqZWN0IHRvIHBhc3MgdG8gdGhlIHBhbmVsXG4gICAgLy8gRGV0ZXJtaW5lIHdoaWNoIG1vZHVsZXMgdG8gaW5jbHVkZSBiYXNlZCBvbiB0aGUgY3VycmVudCBvcHRpb25zXG4gICAgY29uc3QgaW5jbHVkZWRNb2R1bGVzID0gdGhpcy5jdXJyZW50T3B0aW9ucy5pbmNsdWRlIHx8IFtdO1xuICAgIGxldCBtb2R1bGVEYXRhOiBQYW5lbERhdGFbXCJtb2R1bGVzXCJdID0ge307XG4gICAgaW5jbHVkZWRNb2R1bGVzLmZvckVhY2goKG1vZHVsZTogTW9kdWxlVHlwZXMpID0+IHtcbiAgICAgIC8vIEFkZCB0aGUgbW9kdWxlIHRvIHRoZSBkYXRhIG9iamVjdFxuICAgICAgbW9kdWxlRGF0YVttb2R1bGVdID0gdGhpcy5jdXJyZW50T3B0aW9uc1ttb2R1bGVdO1xuICAgIH0pO1xuICAgIGNvbnN0IGRhdGE6IFBhbmVsRGF0YSA9IHtcbiAgICAgIHRpdGxlOiB0aGlzLmN1cnJlbnRPcHRpb25zLnRpdGxlIHx8IFwiQWNjZXNzaWJpbGl0eSBzZXR0aW5nc1wiLFxuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgIHRoaXMuY3VycmVudE9wdGlvbnMuZGVzY3JpcHRpb24gfHxcbiAgICAgICAgXCJBZGp1c3QgdGhlIHNldHRpbmdzIGJlbG93IHRvIGN1c3RvbWl6ZSB0aGUgYXBwZWFyYW5jZSBvZiB0aGlzIHdlYnNpdGUuXCIsXG4gICAgICBtb2R1bGVzOiBtb2R1bGVEYXRhLFxuICAgICAgbXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9uczpcbiAgICAgICAgdGhpcy5jdXJyZW50T3B0aW9ucy5tdWx0aVNlbGVjdGFibGVBY2NvcmRpb25zIHx8IGZhbHNlLFxuICAgICAgcG9zaXRpb246IHRoaXMuY3VycmVudE9wdGlvbnMucG9zaXRpb24gfHwgXCJlbmRcIixcbiAgICB9O1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZm9jdXNUaW1lb3V0SWQgIT09IG51bGwpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmZvY3VzVGltZW91dElkKTtcbiAgICAgIHRoaXMuZm9jdXNUaW1lb3V0SWQgPSBudWxsO1xuICAgIH1cbiAgICB0aGlzLmRlc3Ryb3kkLm5leHQoKTtcbiAgICB0aGlzLmRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gIH1cbn1cbiJdfQ==