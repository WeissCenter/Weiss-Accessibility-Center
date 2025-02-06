import { Component, HostListener, Input, ViewChild, ViewEncapsulation, } from '@angular/core';
import { createAccessibilityOptions } from './weiss-accessibility-center.factory';
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
    statusMessage = '';
    forceCloseSelectionPanel = false;
    constructor(weissAccessibilityCenterService) {
        this.weissAccessibilityCenterService = weissAccessibilityCenterService;
        this.currentOptions = createAccessibilityOptions(this.weissAccessibilityCenterService);
        this.setupOptions();
        this.weissAccessibilityCenterService.showWeissAccessibilityCenter$.subscribe((show) => {
            this.showWeissAccessibilityCenter = show;
            this.forceCloseSelectionPanel = !show;
            if (show) {
                const focusableElements = this.centerEl?.nativeElement.querySelectorAll(this.focusableElementsString);
                this.firstFocusableElement = focusableElements[0];
                this.lastFocusableElement =
                    focusableElements[focusableElements.length - 1];
                // Focus the first focusable element, but wait for the next tick so the element is rendered
                setTimeout(() => {
                    this.firstFocusableElement?.focus();
                }, 0);
            }
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
            if (event.key === 'Tab') {
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
            else if (event.key === 'Escape') {
                this.weissAccessibilityCenterService.toggleWeissAccessibilityCenter(null, true);
                this.statusMessage = "Accessibility center closed";
            }
            else if (event.key === "ArrowUp" ||
                event.key === "ArrowDown") {
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
        if (changes['options'] &&
            changes['options'].currentValue !== changes['options'].previousValue) {
            this.setupOptions();
        }
        else if (changes['title'] &&
            changes['title'].currentValue !== changes['title'].previousValue) {
            this.setupOptions();
        }
        else if (changes['description'] &&
            changes['description'].currentValue !==
                changes['description'].previousValue) {
            this.setupOptions();
        }
        else if (changes['displayType'] &&
            changes['displayType'].currentValue !==
                changes['displayType'].previousValue) {
            this.setupOptions();
        }
        else if (changes['modules'] &&
            changes['modules'].currentValue !== changes['modules'].previousValue) {
            this.setupOptions();
        }
        else if (changes['fontSize'] &&
            changes['fontSize'].currentValue !== changes['fontSize'].previousValue) {
            this.setupOptions();
        }
        else if (changes['theme'] &&
            changes['theme'].currentValue !== changes['theme'].previousValue) {
            this.setupOptions();
        }
        else if (changes['spacing'] &&
            changes['spacing'].currentValue !== changes['spacing'].previousValue) {
            this.setupOptions();
        }
        else if (changes['layout'] &&
            changes['layout'].currentValue !== changes['layout'].previousValue) {
            this.setupOptions();
        }
        else if (changes['overlay'] &&
            changes['overlay'].currentValue !== changes['overlay'].previousValue) {
            this.setupOptions();
        }
        else if (changes['position'] &&
            changes['position'].currentValue !== changes['position'].previousValue) {
            this.setupOptions();
        }
        else if (changes['multiSelectableAccordions'] &&
            changes['multiSelectableAccordions'].currentValue !==
                changes['multiSelectableAccordions'].previousValue) {
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
                !mergedOptions.include.includes('fontSize')) {
                mergedOptions.include.push('fontSize');
            }
        }
        if (this.theme) {
            mergedOptions.theme = this.theme;
            if (mergedOptions.include && !mergedOptions.include.includes('theme')) {
                mergedOptions.include.push('theme');
            }
        }
        if (this.spacing) {
            mergedOptions.spacing = this.spacing;
            if (mergedOptions.include &&
                !mergedOptions.include.includes('spacing')) {
                mergedOptions.include.push('spacing');
            }
        }
        if (this.layout) {
            mergedOptions.layout = this.layout;
            if (mergedOptions.include &&
                !mergedOptions.include.includes('layout')) {
                mergedOptions.include.push('layout');
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
            title: this.currentOptions.title || 'Accessibility settings',
            description: this.currentOptions.description || 'Adjust the settings below to customize the appearance of this website.',
            modules: moduleData,
            multiSelectableAccordions: this.currentOptions.multiSelectableAccordions || false,
            position: this.currentOptions.position || 'end',
        };
        return data;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: WeissAccessibilityCenterComponent, deps: [{ token: i1.WeissAccessibilityCenterService }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.8", type: WeissAccessibilityCenterComponent, selector: "weiss-accessibility-center", inputs: { options: "options", title: "title", description: "description", displayType: "displayType", overlay: "overlay", position: "position", modules: "modules", fontSize: "fontSize", theme: "theme", spacing: "spacing", layout: "layout", multiSelectableAccordions: "multiSelectableAccordions" }, host: { listeners: { "keydown": "handleKeyboardEvent($event)" } }, viewQueries: [{ propertyName: "centerEl", first: true, predicate: ["center"], descendants: true }], usesOnChanges: true, ngImport: i0, template: `
    <article
      role="dialog"
      aria-modal="true"
      [hidden]="!showWeissAccessibilityCenter"
      #center
    >
    <div class="background-overlay" *ngIf="currentOptions.overlay" (click)="weissAccessibilityCenterService.toggleWeissAccessibilityCenter(null, true)"></div>
      <ng-container *ngIf="currentOptions.displayType === 'panel'">
        <weiss-accessibility-panel (statusMessageChange)="onStatusMessageChange($event)" [data]="data"></weiss-accessibility-panel>
      </ng-container>
      <ng-container *ngIf="currentOptions.displayType === 'strip'">
        <weiss-accessibility-strip [closeSelectionPanel]="forceCloseSelectionPanel" (statusMessageChange)="onStatusMessageChange($event)" [data]="data"></weiss-accessibility-strip>
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
                    selector: 'weiss-accessibility-center',
                    template: `
    <article
      role="dialog"
      aria-modal="true"
      [hidden]="!showWeissAccessibilityCenter"
      #center
    >
    <div class="background-overlay" *ngIf="currentOptions.overlay" (click)="weissAccessibilityCenterService.toggleWeissAccessibilityCenter(null, true)"></div>
      <ng-container *ngIf="currentOptions.displayType === 'panel'">
        <weiss-accessibility-panel (statusMessageChange)="onStatusMessageChange($event)" [data]="data"></weiss-accessibility-panel>
      </ng-container>
      <ng-container *ngIf="currentOptions.displayType === 'strip'">
        <weiss-accessibility-strip [closeSelectionPanel]="forceCloseSelectionPanel" (statusMessageChange)="onStatusMessageChange($event)" [data]="data"></weiss-accessibility-strip>
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
                args: ['center']
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
                args: ['keydown', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUVMLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFVdkIsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7Ozs7OztBQWlDbEYsTUFBTSxPQUFPLGlDQUFpQztJQStCbkM7SUE5QlksUUFBUSxDQUFNO0lBRTFCLE9BQU8sQ0FBbUM7SUFDMUMsS0FBSyxDQUFxQjtJQUMxQixXQUFXLENBQXFCO0lBQ2hDLFdBQVcsQ0FBMEI7SUFDckMsT0FBTyxDQUFzQjtJQUM3QixRQUFRLENBQThCO0lBQ3RDLE9BQU8sQ0FBNEI7SUFDbkMsUUFBUSxDQUE0QjtJQUNwQyxLQUFLLENBQTRCO0lBQ2pDLE9BQU8sQ0FBNEI7SUFDbkMsTUFBTSxDQUE0QjtJQUNsQyx5QkFBeUIsQ0FBc0I7SUFFeEQsK0RBQStEO0lBQy9ELGNBQWMsQ0FBdUI7SUFFOUIsNEJBQTRCLEdBQUcsS0FBSyxDQUFDO0lBQ3JDLElBQUksQ0FBd0I7SUFFM0IscUJBQXFCLEdBQXVCLElBQUksQ0FBQztJQUNqRCxvQkFBb0IsR0FBdUIsSUFBSSxDQUFDO0lBQ2hELHVCQUF1QixHQUM3QiwwUEFBMFAsQ0FBQztJQUV0UCxhQUFhLEdBQVcsRUFBRSxDQUFDO0lBQzNCLHdCQUF3QixHQUFZLEtBQUssQ0FBQztJQUVqRCxZQUNTLCtCQUFnRTtRQUFoRSxvQ0FBK0IsR0FBL0IsK0JBQStCLENBQWlDO1FBRXZFLElBQUksQ0FBQyxjQUFjLEdBQUcsMEJBQTBCLENBQzlDLElBQUksQ0FBQywrQkFBK0IsQ0FDckMsQ0FBQztRQUNGLElB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QUM7YUFBTSxJQUNMLE9BQU8sQ0FBQyxVQUFVLENBQUM7WUFDbkIsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFlBQVksS0FBSyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsYUFBYSxFQUN0RSxDQUFDO1lBQ0QsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3RCLENBQUM7YUFBTSxJQUNMLE9BQU8sQ0FBQyxPQUFPLENBQUM7WUFDaEIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksS0FBSyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsYUFBYSxFQUNoRSxDQUFDO1lBQ0QsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3RCLENBQUM7YUFBTSxJQUNMLE9BQU8sQ0FBQyxTQUFTLENBQUM7WUFDbEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFlBQVksS0FBSyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsYUFBYSxFQUNwRSxDQUFDO1lBQ0QsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3RCLENBQUM7YUFBTSxJQUNMLE9BQU8sQ0FBQyxRQUFRLENBQUM7WUFDakIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksS0FBSyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsYUFBYSxFQUNsRSxDQUFDO1lBQ0QsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3RCLENBQUM7YUFBTSxJQUNMLE9BQU8sQ0FBQyxTQUFTLENBQUM7WUFDbEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFlBQVksS0FBSyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsYUFBYSxFQUNwRSxDQUFDO1lBQ0QsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3RCLENBQUM7YUFBTSxJQUNMLE9BQU8sQ0FBQyxVQUFVLENBQUM7WUFDbkIsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFlBQVksS0FBSyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsYUFBYSxFQUN0RSxDQUFDO1lBQ0QsSUFBSSxDQUFDLFlBQVks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Ozs7Ozs7OztHQTBCVDs7MkZBR1UsaUNBQWlDO2tCQS9CN0MsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsNEJBQTRCO29CQUN0QyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMEJUO29CQUNELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2lCQUN0QztvR0FFc0IsUUFBUTtzQkFBNUIsU0FBUzt1QkFBQyxRQUFRO2dCQUVWLE9BQU87c0JBQWYsS0FBSztnQkFDRyxLQUFLO3NCQUFiLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFDRyxXQUFXO3NCQUFuQixLQUFLO2dCQUNHLE9BQU87c0JBQWYsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLE9BQU87c0JBQWYsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLEtBQUs7c0JBQWIsS0FBSztnQkFDRyxPQUFPO3NCQUFmLEtBQUs7Z0JBQ0csTUFBTTtzQkFBZCxLQUFLO2dCQUNHLHlCQUF5QjtzQkFBakMsS0FBSztnQkE0RE4sbUJBQW1CO3NCQURsQixZQUFZO3VCQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSG9zdExpc3RlbmVyLFxuICBJbnB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBBY2Nlc3NpYmlsaXR5T3B0aW9ucyxcbiAgRGlzcGxheVR5cGUsXG4gIE1vZHVsZU9wdGlvbnMsXG4gIE1vZHVsZVR5cGVzLFxuICBQYW5lbERhdGEsXG4gIFBvc2l0aW9uT3B0aW9uc1xufSBmcm9tICcuL3dlaXNzLWFjY2Vzc2liaWxpdHktY2VudGVyLmludGVyZmFjZXMnO1xuaW1wb3J0IHsgV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZSB9IGZyb20gJy4vd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBjcmVhdGVBY2Nlc3NpYmlsaXR5T3B0aW9ucyB9IGZyb20gJy4vd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuZmFjdG9yeSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3dlaXNzLWFjY2Vzc2liaWxpdHktY2VudGVyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8YXJ0aWNsZVxuICAgICAgcm9sZT1cImRpYWxvZ1wiXG4gICAgICBhcmlhLW1vZGFsPVwidHJ1ZVwiXG4gICAgICBbaGlkZGVuXT1cIiFzaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyXCJcbiAgICAgICNjZW50ZXJcbiAgICA+XG4gICAgPGRpdiBjbGFzcz1cImJhY2tncm91bmQtb3ZlcmxheVwiICpuZ0lmPVwiY3VycmVudE9wdGlvbnMub3ZlcmxheVwiIChjbGljayk9XCJ3ZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlLnRvZ2dsZVdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlcihudWxsLCB0cnVlKVwiPjwvZGl2PlxuICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImN1cnJlbnRPcHRpb25zLmRpc3BsYXlUeXBlID09PSAncGFuZWwnXCI+XG4gICAgICAgIDx3ZWlzcy1hY2Nlc3NpYmlsaXR5LXBhbmVsIChzdGF0dXNNZXNzYWdlQ2hhbmdlKT1cIm9uU3RhdHVzTWVzc2FnZUNoYW5nZSgkZXZlbnQpXCIgW2RhdGFdPVwiZGF0YVwiPjwvd2Vpc3MtYWNjZXNzaWJpbGl0eS1wYW5lbD5cbiAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImN1cnJlbnRPcHRpb25zLmRpc3BsYXlUeXBlID09PSAnc3RyaXAnXCI+XG4gICAgICAgIDx3ZWlzcy1hY2Nlc3NpYmlsaXR5LXN0cmlwIFtjbG9zZVNlbGVjdGlvblBhbmVsXT1cImZvcmNlQ2xvc2VTZWxlY3Rpb25QYW5lbFwiIChzdGF0dXNNZXNzYWdlQ2hhbmdlKT1cIm9uU3RhdHVzTWVzc2FnZUNoYW5nZSgkZXZlbnQpXCIgW2RhdGFdPVwiZGF0YVwiPjwvd2Vpc3MtYWNjZXNzaWJpbGl0eS1zdHJpcD5cbiAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImN1cnJlbnRPcHRpb25zLmRpc3BsYXlUeXBlID09PSAncG9wb3ZlcidcIj5cbiAgICAgICAgPCEtLSA8d2Vpc3MtYWNjZXNzaWJpbGl0eS1wb3BvdmVyPjwvd2Vpc3MtYWNjZXNzaWJpbGl0eS1wb3BvdmVyPiAtLT5cbiAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgPGRpdlxuICAgICAgICBhcmlhLWxpdmU9XCJwb2xpdGVcIlxuICAgICAgICBpZD1cInN0YXR1c01lc3NhZ2VcIlxuICAgICAgICAqbmdJZj1cInN0YXR1c01lc3NhZ2VcIlxuICAgICAgICBjbGFzcz1cInZpc3VhbGx5LWhpZGRlblwiXG4gICAgICA+XG4gICAgICAgIHt7IHN0YXR1c01lc3NhZ2UgfX1cbiAgICAgIDwvZGl2PlxuICAgIDwvYXJ0aWNsZT5cbiAgYCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyQ29tcG9uZW50IHtcbiAgQFZpZXdDaGlsZCgnY2VudGVyJykgY2VudGVyRWw6IGFueTtcblxuICBASW5wdXQoKSBvcHRpb25zOiBBY2Nlc3NpYmlsaXR5T3B0aW9ucyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgdGl0bGU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgZGVzY3JpcHRpb246IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgZGlzcGxheVR5cGU6IERpc3BsYXlUeXBlIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBvdmVybGF5OiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBwb3NpdGlvbjogUG9zaXRpb25PcHRpb25zIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBtb2R1bGVzOiBNb2R1bGVUeXBlc1tdIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBmb250U2l6ZTogTW9kdWxlT3B0aW9ucyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgdGhlbWU6IE1vZHVsZU9wdGlvbnMgfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIHNwYWNpbmc6IE1vZHVsZU9wdGlvbnMgfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIGxheW91dDogTW9kdWxlT3B0aW9ucyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgbXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9uczogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxuICAvLyBNZXJnZWQgb3B0aW9ucyBvYmplY3QgdGhhdCB3aWxsIGJlIHVzZWQgd2l0aGluIHRoZSBjb21wb25lbnRcbiAgY3VycmVudE9wdGlvbnM6IEFjY2Vzc2liaWxpdHlPcHRpb25zO1xuXG4gIHB1YmxpYyBzaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyID0gZmFsc2U7XG4gIHB1YmxpYyBkYXRhOiBQYW5lbERhdGEgfCB1bmRlZmluZWQ7XG5cbiAgcHJpdmF0ZSBmaXJzdEZvY3VzYWJsZUVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgbGFzdEZvY3VzYWJsZUVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgZm9jdXNhYmxlRWxlbWVudHNTdHJpbmcgPVxuICAgICdhW2hyZWZdLCBhcmVhW2hyZWZdLCBpbnB1dDpub3QoW2Rpc2FibGVkXSksIHNlbGVjdDpub3QoW2Rpc2FibGVkXSksIHRleHRhcmVhOm5vdChbZGlzYWJsZWRdKSwgYnV0dG9uOm5vdChbZGlzYWJsZWRdKSwgaWZyYW1lLCBvYmplY3QsIGVtYmVkLCBbdGFiaW5kZXg9XCIwXCJdLCBbY29udGVudGVkaXRhYmxlXSwgbGlbdGFiaW5kZXg9XCIwXCJdLCBsaVt0YWJpbmRleD1cIi0xXCJdLCB0clt0YWJpbmRleD1cIjBcIl0sIHRyW3RhYmluZGV4PVwiLTFcIl0nO1xuXG4gIHB1YmxpYyBzdGF0dXNNZXNzYWdlOiBzdHJpbmcgPSAnJztcbiAgcHVibGljIGZvcmNlQ2xvc2VTZWxlY3Rpb25QYW5lbDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyB3ZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlOiBXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlXG4gICkge1xuICAgIHRoaXMuY3VycmVudE9wdGlvbnMgPSBjcmVhdGVBY2Nlc3NpYmlsaXR5T3B0aW9ucyhcbiAgICAgIHRoaXMud2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZVxuICAgICk7XG4gICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcbiAgICB0aGlzLndlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2Uuc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlciQuc3Vic2NyaWJlKFxuICAgICAgKHNob3cpID0+IHtcbiAgICAgICAgdGhpcy5zaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyID0gc2hvdztcbiAgICAgICAgdGhpcy5mb3JjZUNsb3NlU2VsZWN0aW9uUGFuZWwgPSAhc2hvdztcbiAgICAgICAgaWYgKHNob3cpIHtcbiAgICAgICAgICBjb25zdCBmb2N1c2FibGVFbGVtZW50cyA9XG4gICAgICAgICAgICB0aGlzLmNlbnRlckVsPy5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgICAgIHRoaXMuZm9jdXNhYmxlRWxlbWVudHNTdHJpbmdcbiAgICAgICAgICAgICkgYXMgTm9kZUxpc3RPZjxIVE1MRWxlbWVudD47XG4gICAgICAgICAgdGhpcy5maXJzdEZvY3VzYWJsZUVsZW1lbnQgPSBmb2N1c2FibGVFbGVtZW50c1swXTtcbiAgICAgICAgICB0aGlzLmxhc3RGb2N1c2FibGVFbGVtZW50ID1cbiAgICAgICAgICAgIGZvY3VzYWJsZUVsZW1lbnRzW2ZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgIC8vIEZvY3VzIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudCwgYnV0IHdhaXQgZm9yIHRoZSBuZXh0IHRpY2sgc28gdGhlIGVsZW1lbnQgaXMgcmVuZGVyZWRcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmlyc3RGb2N1c2FibGVFbGVtZW50Py5mb2N1cygpO1xuICAgICAgICAgIH0sIDApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG5cbiAgLy8gVGhpcyBtZXRob2QgaXMgdHJpZ2dlcmVkIHdoZW4gdGhlIGNoaWxkIGNvbXBvbmVudCBlbWl0cyBhIG5ldyBzdGF0dXMgbWVzc2FnZVxuICBvblN0YXR1c01lc3NhZ2VDaGFuZ2UobmV3TWVzc2FnZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zdGF0dXNNZXNzYWdlID0gbmV3TWVzc2FnZTtcbiAgfVxuXG4gIHByaXZhdGUgc2Nyb2xsRWxlbWVudEludG9WaWV3KGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICBlbGVtZW50LnNjcm9sbEludG9WaWV3KHtcbiAgICAgIGJlaGF2aW9yOiBcInNtb290aFwiLFxuICAgICAgYmxvY2s6IFwiY2VudGVyXCIsXG4gICAgfSk7XG4gIH1cblxuICAvLyBDbG9zZSBwYW5lbCB3aGVuIHVzZXIgaGl0cyBlc2NhcGUga2V5XG4gIC8vIFRyYXAgZm9jdXMgd2l0aGluIHRoZSBhY2Nlc3NpYmlsaXR5IGNlbnRlclxuICBASG9zdExpc3RlbmVyKCdrZXlkb3duJywgWyckZXZlbnQnXSlcbiAgaGFuZGxlS2V5Ym9hcmRFdmVudChldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmICh0aGlzLnNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIpIHtcbiAgICAgIGNvbnN0IGRlZXBBY3RpdmVFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICAgIGlmIChldmVudC5rZXkgPT09ICdUYWInKSB7XG4gICAgICAgIGlmIChldmVudC5zaGlmdEtleSkge1xuICAgICAgICAgIC8qIHNoaWZ0ICsgdGFiICovXG4gICAgICAgICAgaWYgKGRlZXBBY3RpdmVFbGVtZW50ID09PSB0aGlzLmZpcnN0Rm9jdXNhYmxlRWxlbWVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMubGFzdEZvY3VzYWJsZUVsZW1lbnQ/LmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8qIHRhYiAqL1xuICAgICAgICAgIGlmIChkZWVwQWN0aXZlRWxlbWVudCA9PT0gdGhpcy5sYXN0Rm9jdXNhYmxlRWxlbWVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuZmlyc3RGb2N1c2FibGVFbGVtZW50Py5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNjcm9sbEVsZW1lbnRJbnRvVmlldyhkZWVwQWN0aXZlRWxlbWVudCk7XG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LmtleSA9PT0gJ0VzY2FwZScpIHtcbiAgICAgICAgdGhpcy53ZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlLnRvZ2dsZVdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlcihcbiAgICAgICAgICBudWxsLFxuICAgICAgICAgIHRydWVcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5zdGF0dXNNZXNzYWdlID0gXCJBY2Nlc3NpYmlsaXR5IGNlbnRlciBjbG9zZWRcIjtcbiAgICAgIH0gZWxzZSBpZiAoZXZlbnQua2V5ID09PSBcIkFycm93VXBcIiB8fFxuICAgICAgICBldmVudC5rZXkgPT09IFwiQXJyb3dEb3duXCIpIHtcbiAgICAgICAgLy8gV2FpdCBmb3IgRE9NIHVwZGF0ZVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBjb25zdCBhY3RpdmVFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBhY3RpdmVFbGVtZW50ICYmXG4gICAgICAgICAgICB0aGlzLmNlbnRlckVsLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoYWN0aXZlRWxlbWVudClcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsRWxlbWVudEludG9WaWV3KGFjdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgIH1cblxuICAgICAgICB9LCAwKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKFxuICAgICAgY2hhbmdlc1snb3B0aW9ucyddICYmXG4gICAgICBjaGFuZ2VzWydvcHRpb25zJ10uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzWydvcHRpb25zJ10ucHJldmlvdXNWYWx1ZVxuICAgICkge1xuICAgICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgY2hhbmdlc1sndGl0bGUnXSAmJlxuICAgICAgY2hhbmdlc1sndGl0bGUnXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbJ3RpdGxlJ10ucHJldmlvdXNWYWx1ZVxuICAgICkge1xuICAgICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgY2hhbmdlc1snZGVzY3JpcHRpb24nXSAmJlxuICAgICAgY2hhbmdlc1snZGVzY3JpcHRpb24nXS5jdXJyZW50VmFsdWUgIT09XG4gICAgICAgIGNoYW5nZXNbJ2Rlc2NyaXB0aW9uJ10ucHJldmlvdXNWYWx1ZVxuICAgICkge1xuICAgICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgY2hhbmdlc1snZGlzcGxheVR5cGUnXSAmJlxuICAgICAgY2hhbmdlc1snZGlzcGxheVR5cGUnXS5jdXJyZW50VmFsdWUgIT09XG4gICAgICAgIGNoYW5nZXNbJ2Rpc3BsYXlUeXBlJ10ucHJldmlvdXNWYWx1ZVxuICAgICkge1xuICAgICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgY2hhbmdlc1snbW9kdWxlcyddICYmXG4gICAgICBjaGFuZ2VzWydtb2R1bGVzJ10uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzWydtb2R1bGVzJ10ucHJldmlvdXNWYWx1ZVxuICAgICkge1xuICAgICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgY2hhbmdlc1snZm9udFNpemUnXSAmJlxuICAgICAgY2hhbmdlc1snZm9udFNpemUnXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbJ2ZvbnRTaXplJ10ucHJldmlvdXNWYWx1ZVxuICAgICkge1xuICAgICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgY2hhbmdlc1sndGhlbWUnXSAmJlxuICAgICAgY2hhbmdlc1sndGhlbWUnXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbJ3RoZW1lJ10ucHJldmlvdXNWYWx1ZVxuICAgICkge1xuICAgICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgY2hhbmdlc1snc3BhY2luZyddICYmXG4gICAgICBjaGFuZ2VzWydzcGFjaW5nJ10uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzWydzcGFjaW5nJ10ucHJldmlvdXNWYWx1ZVxuICAgICkge1xuICAgICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgY2hhbmdlc1snbGF5b3V0J10gJiZcbiAgICAgIGNoYW5nZXNbJ2xheW91dCddLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlc1snbGF5b3V0J10ucHJldmlvdXNWYWx1ZVxuICAgICkge1xuICAgICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgY2hhbmdlc1snb3ZlcmxheSddICYmXG4gICAgICBjaGFuZ2VzWydvdmVybGF5J10uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzWydvdmVybGF5J10ucHJldmlvdXNWYWx1ZVxuICAgICkge1xuICAgICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgY2hhbmdlc1sncG9zaXRpb24nXSAmJlxuICAgICAgY2hhbmdlc1sncG9zaXRpb24nXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbJ3Bvc2l0aW9uJ10ucHJldmlvdXNWYWx1ZVxuICAgICkge1xuICAgICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgY2hhbmdlc1snbXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9ucyddICYmXG4gICAgICBjaGFuZ2VzWydtdWx0aVNlbGVjdGFibGVBY2NvcmRpb25zJ10uY3VycmVudFZhbHVlICE9PVxuICAgICAgICBjaGFuZ2VzWydtdWx0aVNlbGVjdGFibGVBY2NvcmRpb25zJ10ucHJldmlvdXNWYWx1ZVxuICAgICkge1xuICAgICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcbiAgICB9XG4gIH1cblxuICBzZXR1cE9wdGlvbnMoKSB7XG4gICAgLy8gTWVyZ2UgdGhlIHByb3ZpZGVkIG9wdGlvbnMgd2l0aCB0aGUgZGVmYXVsdCBvbmVzXG4gICAgY29uc3QgbWVyZ2VkT3B0aW9ucyA9IHtcbiAgICAgIC4uLmNyZWF0ZUFjY2Vzc2liaWxpdHlPcHRpb25zKHRoaXMud2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZSksXG4gICAgICAuLi50aGlzLm9wdGlvbnMsXG4gICAgfTtcblxuICAgIC8vIElmIGFuIG9wdGlvbiB3YXMgcGFzc2VkIGluZGl2aWR1YWxseSwgb3ZlcnJpZGUgaW4gbWVyZ2VkT3B0aW9uc1xuICAgIGlmICh0aGlzLnRpdGxlKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLnRpdGxlID0gdGhpcy50aXRsZTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZGVzY3JpcHRpb24pIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMuZGVzY3JpcHRpb24gPSB0aGlzLmRlc2NyaXB0aW9uO1xuICAgIH1cbiAgICBpZiAodGhpcy5kaXNwbGF5VHlwZSkge1xuICAgICAgbWVyZ2VkT3B0aW9ucy5kaXNwbGF5VHlwZSA9IHRoaXMuZGlzcGxheVR5cGU7XG4gICAgfVxuICAgIGlmICh0aGlzLm92ZXJsYXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgbWVyZ2VkT3B0aW9ucy5vdmVybGF5ID0gdGhpcy5vdmVybGF5O1xuICAgIH1cbiAgICBpZiAodGhpcy5tdWx0aVNlbGVjdGFibGVBY2NvcmRpb25zKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLm11bHRpU2VsZWN0YWJsZUFjY29yZGlvbnMgPSB0aGlzLm11bHRpU2VsZWN0YWJsZUFjY29yZGlvbnM7XG4gICAgfVxuICAgIGlmICh0aGlzLnBvc2l0aW9uKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLnBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbjtcbiAgICB9XG4gICAgaWYgKHRoaXMubW9kdWxlcykge1xuICAgICAgbWVyZ2VkT3B0aW9ucy5pbmNsdWRlID0gdGhpcy5tb2R1bGVzO1xuICAgIH1cbiAgICBpZiAodGhpcy5mb250U2l6ZSkge1xuICAgICAgbWVyZ2VkT3B0aW9ucy5mb250U2l6ZSA9IHRoaXMuZm9udFNpemU7XG4gICAgICAvLyBJZiBmb250U2l6ZSB3YXMgcGFzc2VkIGluIHNwZWNpZmljYWxseSwgY2hlY2sgdG8gYmUgc3VyZSBpdCdzIGluY2x1ZGVkIGluIHRoZSBtb2R1bGVzIGxpc3QuIElmIG5vdCwgYWRkIGl0LlxuICAgICAgaWYgKFxuICAgICAgICBtZXJnZWRPcHRpb25zLmluY2x1ZGUgJiZcbiAgICAgICAgIW1lcmdlZE9wdGlvbnMuaW5jbHVkZS5pbmNsdWRlcygnZm9udFNpemUnKVxuICAgICAgKSB7XG4gICAgICAgIG1lcmdlZE9wdGlvbnMuaW5jbHVkZS5wdXNoKCdmb250U2l6ZScpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy50aGVtZSkge1xuICAgICAgbWVyZ2VkT3B0aW9ucy50aGVtZSA9IHRoaXMudGhlbWU7XG4gICAgICBpZiAobWVyZ2VkT3B0aW9ucy5pbmNsdWRlICYmICFtZXJnZWRPcHRpb25zLmluY2x1ZGUuaW5jbHVkZXMoJ3RoZW1lJykpIHtcbiAgICAgICAgbWVyZ2VkT3B0aW9ucy5pbmNsdWRlLnB1c2goJ3RoZW1lJyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLnNwYWNpbmcpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMuc3BhY2luZyA9IHRoaXMuc3BhY2luZztcbiAgICAgIGlmIChcbiAgICAgICAgbWVyZ2VkT3B0aW9ucy5pbmNsdWRlICYmXG4gICAgICAgICFtZXJnZWRPcHRpb25zLmluY2x1ZGUuaW5jbHVkZXMoJ3NwYWNpbmcnKVxuICAgICAgKSB7XG4gICAgICAgIG1lcmdlZE9wdGlvbnMuaW5jbHVkZS5wdXNoKCdzcGFjaW5nJyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLmxheW91dCkge1xuICAgICAgbWVyZ2VkT3B0aW9ucy5sYXlvdXQgPSB0aGlzLmxheW91dDtcbiAgICAgIGlmIChcbiAgICAgICAgbWVyZ2VkT3B0aW9ucy5pbmNsdWRlICYmXG4gICAgICAgICFtZXJnZWRPcHRpb25zLmluY2x1ZGUuaW5jbHVkZXMoJ2xheW91dCcpXG4gICAgICApIHtcbiAgICAgICAgbWVyZ2VkT3B0aW9ucy5pbmNsdWRlLnB1c2goJ2xheW91dCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE5vdyBzdG9yZSB0aGUgZmluYWwgbWVyZ2VkIG9wdGlvbnNcbiAgICB0aGlzLmN1cnJlbnRPcHRpb25zID0gbWVyZ2VkT3B0aW9ucztcbiAgICB0aGlzLmRhdGEgPSB0aGlzLmJ1aWxkRGF0YSgpO1xuXG4gIH1cblxuICBidWlsZERhdGEoKSB7XG4gICAgLy8gQnVpbGQgdGhlIGRhdGEgb2JqZWN0IHRvIHBhc3MgdG8gdGhlIHBhbmVsXG4gICAgLy8gRGV0ZXJtaW5lIHdoaWNoIG1vZHVsZXMgdG8gaW5jbHVkZSBiYXNlZCBvbiB0aGUgY3VycmVudCBvcHRpb25zXG4gICAgY29uc3QgaW5jbHVkZWRNb2R1bGVzID0gdGhpcy5jdXJyZW50T3B0aW9ucy5pbmNsdWRlIHx8IFtdO1xuICAgIGxldCBtb2R1bGVEYXRhOiBQYW5lbERhdGFbJ21vZHVsZXMnXSA9IHt9O1xuICAgIGluY2x1ZGVkTW9kdWxlcy5mb3JFYWNoKChtb2R1bGU6IE1vZHVsZVR5cGVzKSA9PiB7XG4gICAgICAvLyBBZGQgdGhlIG1vZHVsZSB0byB0aGUgZGF0YSBvYmplY3RcbiAgICAgIG1vZHVsZURhdGFbbW9kdWxlXSA9IHRoaXMuY3VycmVudE9wdGlvbnNbbW9kdWxlXTtcbiAgICB9KTtcbiAgICBjb25zdCBkYXRhOiBQYW5lbERhdGEgPSB7XG4gICAgICB0aXRsZTogdGhpcy5jdXJyZW50T3B0aW9ucy50aXRsZSB8fCAnQWNjZXNzaWJpbGl0eSBzZXR0aW5ncycsXG4gICAgICBkZXNjcmlwdGlvbjogdGhpcy5jdXJyZW50T3B0aW9ucy5kZXNjcmlwdGlvbiB8fCAnQWRqdXN0IHRoZSBzZXR0aW5ncyBiZWxvdyB0byBjdXN0b21pemUgdGhlIGFwcGVhcmFuY2Ugb2YgdGhpcyB3ZWJzaXRlLicsXG4gICAgICBtb2R1bGVzOiBtb2R1bGVEYXRhLFxuICAgICAgbXVsdGlTZWxlY3RhYmxlQWNjb3JkaW9uczogdGhpcy5jdXJyZW50T3B0aW9ucy5tdWx0aVNlbGVjdGFibGVBY2NvcmRpb25zIHx8IGZhbHNlLFxuICAgICAgcG9zaXRpb246IHRoaXMuY3VycmVudE9wdGlvbnMucG9zaXRpb24gfHwgJ2VuZCcsXG4gICAgfTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxufVxuIl19