import { Component, HostListener, Input, ViewChild, ViewEncapsulation, } from '@angular/core';
import { createAccessibilityOptions } from './weiss-accessibility-center.factory';
import * as i0 from "@angular/core";
import * as i1 from "./weiss-accessibility-center.service";
import * as i2 from "@angular/common";
import * as i3 from "./templates/strip/strip.component";
import * as i4 from "./templates/panel/panel.component";
export class WeissAccessibilityCenterComponent {
    constructor(weissAccessibilityCenterService) {
        this.weissAccessibilityCenterService = weissAccessibilityCenterService;
        this.showWeissAccessibilityCenter = false;
        this.firstFocusableElement = null;
        this.lastFocusableElement = null;
        this.focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable], li[tabindex="0"], li[tabindex="-1"], tr[tabindex="0"], tr[tabindex="-1"]';
        this.statusMessage = '';
        this.forceCloseSelectionPanel = false;
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
        // Optional: Log the message to see the flow
        console.log('Status message received from child:', newMessage);
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
            }
            else if (event.key === 'Escape') {
                this.weissAccessibilityCenterService.toggleWeissAccessibilityCenter(null, true);
                this.statusMessage = "Accessibility center closed";
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
        // Optional: log the merged options for debugging
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
            position: this.currentOptions.position || 'end',
        };
        return data;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: WeissAccessibilityCenterComponent, deps: [{ token: i1.WeissAccessibilityCenterService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.7", type: WeissAccessibilityCenterComponent, selector: "weiss-accessibility-center", inputs: { options: "options", title: "title", description: "description", displayType: "displayType", overlay: "overlay", position: "position", modules: "modules", fontSize: "fontSize", theme: "theme", spacing: "spacing", layout: "layout" }, host: { listeners: { "keydown": "handleKeyboardEvent($event)" } }, viewQueries: [{ propertyName: "centerEl", first: true, predicate: ["center"], descendants: true }], usesOnChanges: true, ngImport: i0, template: `
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
  `, isInline: true, dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i3.StripComponent, selector: "weiss-accessibility-strip", inputs: ["data", "closeSelectionPanel"], outputs: ["statusMessageChange"] }, { kind: "component", type: i4.PanelComponent, selector: "weiss-accessibility-panel", inputs: ["data"], outputs: ["statusMessageChange"] }], encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: WeissAccessibilityCenterComponent, decorators: [{
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
            }], handleKeyboardEvent: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIvc3JjL2xpYi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUVMLFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFVdkIsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7Ozs7OztBQWlDbEYsTUFBTSxPQUFPLGlDQUFpQztJQTZCNUMsWUFDUywrQkFBZ0U7UUFBaEUsb0NBQStCLEdBQS9CLCtCQUErQixDQUFpQztRQVpsRSxpQ0FBNEIsR0FBRyxLQUFLLENBQUM7UUFHcEMsMEJBQXFCLEdBQXVCLElBQUksQ0FBQztRQUNqRCx5QkFBb0IsR0FBdUIsSUFBSSxDQUFDO1FBQ2hELDRCQUF1QixHQUM3QiwwUEFBMFAsQ0FBQztRQUV0UCxrQkFBYSxHQUFXLEVBQUUsQ0FBQztRQUMzQiw2QkFBd0IsR0FBWSxLQUFLLENBQUM7UUFLL0MsSUFBSSxDQUFDLGNBQWMsR0FBRywwQkFBMEIsQ0FDOUMsSUFBSSxDQUFDLCtCQUErQixDQUNyQyxDQUFDO1FBQ0YsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQywrQkFBK0IsQ0FBQyw2QkFBNkIsQ0FBQyxTQUFTLENBQzFFLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDUCxJQUFJLENBQUMsNEJBQTRCLEdBQUcsSUFBSSxDQUFDO1lBQ3pDLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxDQUFDLElBQUksQ0FBQztZQUN0QyxJQUFJLElBQUksRUFBRSxDQUFDO2dCQUNULE1BQU0saUJBQWlCLEdBQ3JCLElBQUksQ0FBQyxRQUFRLEVBQUUs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YSxDQUFDLENBQUMsYUFBYSxFQUN0QyxDQUFDO1lBQ0QsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3RCLENBQUM7YUFBTSxJQUNMLE9BQU8sQ0FBQyxTQUFTLENBQUM7WUFDbEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFlBQVksS0FBSyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsYUFBYSxFQUNwRSxDQUFDO1lBQ0QsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3RCLENBQUM7YUFBTSxJQUNMLE9BQU8sQ0FBQyxVQUFVLENBQUM7WUFDbkIsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFlBQVksS0FBSyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsYUFBYSxFQUN0RSxDQUFDO1lBQ0QsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3RCLENBQUM7YUFBTSxJQUNMLE9BQU8sQ0FBQyxPQUFPLENBQUM7WUFDaEIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksS0FBSyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsYUFBYSxFQUNoRSxDQUFDO1lBQ0QsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3RCLENBQUM7YUFBTSxJQUNMLE9BQU8sQ0FBQyxTQUFTLENBQUM7WUFDbEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFlBQVksS0FBSyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsYUFBYSxFQUNwRSxDQUFDO1lBQ0QsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3RCLENBQUM7YUFBTSxJQUNMLE9BQU8sQ0FBQyxRQUFRLENBQUM7WUFDakIsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFlBQVksS0FBSyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsYUFBYSxFQUNsRSxDQUFDO1lBQ0QsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3RCLENBQUM7YUFBTSxJQUNMLE9BQU8sQ0FBQyxTQUFTLENBQUM7WUFDbEIsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFlBQVks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QUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTBCVDtvQkFDRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtpQkFDdEM7b0dBRXNCLFFBQVE7c0JBQTVCLFNBQVM7dUJBQUMsUUFBUTtnQkFFVixPQUFPO3NCQUFmLEtBQUs7Z0JBQ0csS0FBSztzQkFBYixLQUFLO2dCQUNHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFDRyxPQUFPO3NCQUFmLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxPQUFPO3NCQUFmLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxLQUFLO3NCQUFiLEtBQUs7Z0JBQ0csT0FBTztzQkFBZixLQUFLO2dCQUNHLE1BQU07c0JBQWQsS0FBSztnQkF3RE4sbUJBQW1CO3NCQURsQixZQUFZO3VCQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSG9zdExpc3RlbmVyLFxuICBJbnB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBBY2Nlc3NpYmlsaXR5T3B0aW9ucyxcbiAgRGlzcGxheVR5cGUsXG4gIE1vZHVsZU9wdGlvbnMsXG4gIE1vZHVsZVR5cGVzLFxuICBQYW5lbERhdGEsXG4gIFBvc2l0aW9uT3B0aW9uc1xufSBmcm9tICcuL3dlaXNzLWFjY2Vzc2liaWxpdHktY2VudGVyLmludGVyZmFjZXMnO1xuaW1wb3J0IHsgV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZSB9IGZyb20gJy4vd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuc2VydmljZSc7XG5pbXBvcnQgeyBjcmVhdGVBY2Nlc3NpYmlsaXR5T3B0aW9ucyB9IGZyb20gJy4vd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuZmFjdG9yeSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3dlaXNzLWFjY2Vzc2liaWxpdHktY2VudGVyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8YXJ0aWNsZVxuICAgICAgcm9sZT1cImRpYWxvZ1wiXG4gICAgICBhcmlhLW1vZGFsPVwidHJ1ZVwiXG4gICAgICBbaGlkZGVuXT1cIiFzaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyXCJcbiAgICAgICNjZW50ZXJcbiAgICA+XG4gICAgPGRpdiBjbGFzcz1cImJhY2tncm91bmQtb3ZlcmxheVwiICpuZ0lmPVwiY3VycmVudE9wdGlvbnMub3ZlcmxheVwiIChjbGljayk9XCJ3ZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlLnRvZ2dsZVdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlcihudWxsLCB0cnVlKVwiPjwvZGl2PlxuICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImN1cnJlbnRPcHRpb25zLmRpc3BsYXlUeXBlID09PSAncGFuZWwnXCI+XG4gICAgICAgIDx3ZWlzcy1hY2Nlc3NpYmlsaXR5LXBhbmVsIChzdGF0dXNNZXNzYWdlQ2hhbmdlKT1cIm9uU3RhdHVzTWVzc2FnZUNoYW5nZSgkZXZlbnQpXCIgW2RhdGFdPVwiZGF0YVwiPjwvd2Vpc3MtYWNjZXNzaWJpbGl0eS1wYW5lbD5cbiAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImN1cnJlbnRPcHRpb25zLmRpc3BsYXlUeXBlID09PSAnc3RyaXAnXCI+XG4gICAgICAgIDx3ZWlzcy1hY2Nlc3NpYmlsaXR5LXN0cmlwIFtjbG9zZVNlbGVjdGlvblBhbmVsXT1cImZvcmNlQ2xvc2VTZWxlY3Rpb25QYW5lbFwiIChzdGF0dXNNZXNzYWdlQ2hhbmdlKT1cIm9uU3RhdHVzTWVzc2FnZUNoYW5nZSgkZXZlbnQpXCIgW2RhdGFdPVwiZGF0YVwiPjwvd2Vpc3MtYWNjZXNzaWJpbGl0eS1zdHJpcD5cbiAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImN1cnJlbnRPcHRpb25zLmRpc3BsYXlUeXBlID09PSAncG9wb3ZlcidcIj5cbiAgICAgICAgPCEtLSA8d2Vpc3MtYWNjZXNzaWJpbGl0eS1wb3BvdmVyPjwvd2Vpc3MtYWNjZXNzaWJpbGl0eS1wb3BvdmVyPiAtLT5cbiAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgPGRpdlxuICAgICAgICBhcmlhLWxpdmU9XCJwb2xpdGVcIlxuICAgICAgICBpZD1cInN0YXR1c01lc3NhZ2VcIlxuICAgICAgICAqbmdJZj1cInN0YXR1c01lc3NhZ2VcIlxuICAgICAgICBjbGFzcz1cInZpc3VhbGx5LWhpZGRlblwiXG4gICAgICA+XG4gICAgICAgIHt7IHN0YXR1c01lc3NhZ2UgfX1cbiAgICAgIDwvZGl2PlxuICAgIDwvYXJ0aWNsZT5cbiAgYCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbn0pXG5leHBvcnQgY2xhc3MgV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyQ29tcG9uZW50IHtcbiAgQFZpZXdDaGlsZCgnY2VudGVyJykgY2VudGVyRWw6IGFueTtcblxuICBASW5wdXQoKSBvcHRpb25zOiBBY2Nlc3NpYmlsaXR5T3B0aW9ucyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgdGl0bGU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgZGVzY3JpcHRpb246IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgZGlzcGxheVR5cGU6IERpc3BsYXlUeXBlIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBvdmVybGF5OiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBwb3NpdGlvbjogUG9zaXRpb25PcHRpb25zIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBtb2R1bGVzOiBNb2R1bGVUeXBlc1tdIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBmb250U2l6ZTogTW9kdWxlT3B0aW9ucyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgdGhlbWU6IE1vZHVsZU9wdGlvbnMgfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIHNwYWNpbmc6IE1vZHVsZU9wdGlvbnMgfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIGxheW91dDogTW9kdWxlT3B0aW9ucyB8IHVuZGVmaW5lZDtcblxuICAvLyBNZXJnZWQgb3B0aW9ucyBvYmplY3QgdGhhdCB3aWxsIGJlIHVzZWQgd2l0aGluIHRoZSBjb21wb25lbnRcbiAgY3VycmVudE9wdGlvbnM6IEFjY2Vzc2liaWxpdHlPcHRpb25zO1xuXG4gIHB1YmxpYyBzaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyID0gZmFsc2U7XG4gIHB1YmxpYyBkYXRhOiBQYW5lbERhdGEgfCB1bmRlZmluZWQ7XG5cbiAgcHJpdmF0ZSBmaXJzdEZvY3VzYWJsZUVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgbGFzdEZvY3VzYWJsZUVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgZm9jdXNhYmxlRWxlbWVudHNTdHJpbmcgPVxuICAgICdhW2hyZWZdLCBhcmVhW2hyZWZdLCBpbnB1dDpub3QoW2Rpc2FibGVkXSksIHNlbGVjdDpub3QoW2Rpc2FibGVkXSksIHRleHRhcmVhOm5vdChbZGlzYWJsZWRdKSwgYnV0dG9uOm5vdChbZGlzYWJsZWRdKSwgaWZyYW1lLCBvYmplY3QsIGVtYmVkLCBbdGFiaW5kZXg9XCIwXCJdLCBbY29udGVudGVkaXRhYmxlXSwgbGlbdGFiaW5kZXg9XCIwXCJdLCBsaVt0YWJpbmRleD1cIi0xXCJdLCB0clt0YWJpbmRleD1cIjBcIl0sIHRyW3RhYmluZGV4PVwiLTFcIl0nO1xuXG4gIHB1YmxpYyBzdGF0dXNNZXNzYWdlOiBzdHJpbmcgPSAnJztcbiAgcHVibGljIGZvcmNlQ2xvc2VTZWxlY3Rpb25QYW5lbDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyB3ZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlOiBXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlXG4gICkge1xuICAgIHRoaXMuY3VycmVudE9wdGlvbnMgPSBjcmVhdGVBY2Nlc3NpYmlsaXR5T3B0aW9ucyhcbiAgICAgIHRoaXMud2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZVxuICAgICk7XG4gICAgdGhpcy5zZXR1cE9wdGlvbnMoKTtcbiAgICB0aGlzLndlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2Uuc2hvd1dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlciQuc3Vic2NyaWJlKFxuICAgICAgKHNob3cpID0+IHtcbiAgICAgICAgdGhpcy5zaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyID0gc2hvdztcbiAgICAgICAgdGhpcy5mb3JjZUNsb3NlU2VsZWN0aW9uUGFuZWwgPSAhc2hvdztcbiAgICAgICAgaWYgKHNob3cpIHtcbiAgICAgICAgICBjb25zdCBmb2N1c2FibGVFbGVtZW50cyA9XG4gICAgICAgICAgICB0aGlzLmNlbnRlckVsPy5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgICAgICAgIHRoaXMuZm9jdXNhYmxlRWxlbWVudHNTdHJpbmdcbiAgICAgICAgICAgICkgYXMgTm9kZUxpc3RPZjxIVE1MRWxlbWVudD47XG4gICAgICAgICAgdGhpcy5maXJzdEZvY3VzYWJsZUVsZW1lbnQgPSBmb2N1c2FibGVFbGVtZW50c1swXTtcbiAgICAgICAgICB0aGlzLmxhc3RGb2N1c2FibGVFbGVtZW50ID1cbiAgICAgICAgICAgIGZvY3VzYWJsZUVsZW1lbnRzW2ZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgIC8vIEZvY3VzIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudCwgYnV0IHdhaXQgZm9yIHRoZSBuZXh0IHRpY2sgc28gdGhlIGVsZW1lbnQgaXMgcmVuZGVyZWRcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZmlyc3RGb2N1c2FibGVFbGVtZW50Py5mb2N1cygpO1xuICAgICAgICAgIH0sIDApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG5cbiAgLy8gVGhpcyBtZXRob2QgaXMgdHJpZ2dlcmVkIHdoZW4gdGhlIGNoaWxkIGNvbXBvbmVudCBlbWl0cyBhIG5ldyBzdGF0dXMgbWVzc2FnZVxuICBvblN0YXR1c01lc3NhZ2VDaGFuZ2UobmV3TWVzc2FnZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zdGF0dXNNZXNzYWdlID0gbmV3TWVzc2FnZTtcblxuICAgIC8vIE9wdGlvbmFsOiBMb2cgdGhlIG1lc3NhZ2UgdG8gc2VlIHRoZSBmbG93XG4gICAgY29uc29sZS5sb2coJ1N0YXR1cyBtZXNzYWdlIHJlY2VpdmVkIGZyb20gY2hpbGQ6JywgbmV3TWVzc2FnZSk7XG4gIH1cblxuICAvLyBDbG9zZSBwYW5lbCB3aGVuIHVzZXIgaGl0cyBlc2NhcGUga2V5XG4gIC8vIFRyYXAgZm9jdXMgd2l0aGluIHRoZSBhY2Nlc3NpYmlsaXR5IGNlbnRlclxuICBASG9zdExpc3RlbmVyKCdrZXlkb3duJywgWyckZXZlbnQnXSlcbiAgaGFuZGxlS2V5Ym9hcmRFdmVudChldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmICh0aGlzLnNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIpIHtcbiAgICAgIGNvbnN0IGRlZXBBY3RpdmVFbGVtZW50ID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICAgIGlmIChldmVudC5rZXkgPT09ICdUYWInKSB7XG4gICAgICAgIGlmIChldmVudC5zaGlmdEtleSkge1xuICAgICAgICAgIC8qIHNoaWZ0ICsgdGFiICovXG4gICAgICAgICAgaWYgKGRlZXBBY3RpdmVFbGVtZW50ID09PSB0aGlzLmZpcnN0Rm9jdXNhYmxlRWxlbWVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMubGFzdEZvY3VzYWJsZUVsZW1lbnQ/LmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8qIHRhYiAqL1xuICAgICAgICAgIGlmIChkZWVwQWN0aXZlRWxlbWVudCA9PT0gdGhpcy5sYXN0Rm9jdXNhYmxlRWxlbWVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuZmlyc3RGb2N1c2FibGVFbGVtZW50Py5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChldmVudC5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICAgIHRoaXMud2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZS50b2dnbGVXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIoXG4gICAgICAgICAgbnVsbCxcbiAgICAgICAgICB0cnVlXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMuc3RhdHVzTWVzc2FnZSA9IFwiQWNjZXNzaWJpbGl0eSBjZW50ZXIgY2xvc2VkXCI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChcbiAgICAgIGNoYW5nZXNbJ29wdGlvbnMnXSAmJlxuICAgICAgY2hhbmdlc1snb3B0aW9ucyddLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlc1snb3B0aW9ucyddLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbJ3RpdGxlJ10gJiZcbiAgICAgIGNoYW5nZXNbJ3RpdGxlJ10uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzWyd0aXRsZSddLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbJ2Rlc2NyaXB0aW9uJ10gJiZcbiAgICAgIGNoYW5nZXNbJ2Rlc2NyaXB0aW9uJ10uY3VycmVudFZhbHVlICE9PVxuICAgICAgICBjaGFuZ2VzWydkZXNjcmlwdGlvbiddLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbJ2Rpc3BsYXlUeXBlJ10gJiZcbiAgICAgIGNoYW5nZXNbJ2Rpc3BsYXlUeXBlJ10uY3VycmVudFZhbHVlICE9PVxuICAgICAgICBjaGFuZ2VzWydkaXNwbGF5VHlwZSddLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbJ21vZHVsZXMnXSAmJlxuICAgICAgY2hhbmdlc1snbW9kdWxlcyddLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlc1snbW9kdWxlcyddLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbJ2ZvbnRTaXplJ10gJiZcbiAgICAgIGNoYW5nZXNbJ2ZvbnRTaXplJ10uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzWydmb250U2l6ZSddLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbJ3RoZW1lJ10gJiZcbiAgICAgIGNoYW5nZXNbJ3RoZW1lJ10uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzWyd0aGVtZSddLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbJ3NwYWNpbmcnXSAmJlxuICAgICAgY2hhbmdlc1snc3BhY2luZyddLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlc1snc3BhY2luZyddLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbJ2xheW91dCddICYmXG4gICAgICBjaGFuZ2VzWydsYXlvdXQnXS5jdXJyZW50VmFsdWUgIT09IGNoYW5nZXNbJ2xheW91dCddLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbJ292ZXJsYXknXSAmJlxuICAgICAgY2hhbmdlc1snb3ZlcmxheSddLmN1cnJlbnRWYWx1ZSAhPT0gY2hhbmdlc1snb3ZlcmxheSddLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfSBlbHNlIGlmIChcbiAgICAgIGNoYW5nZXNbJ3Bvc2l0aW9uJ10gJiZcbiAgICAgIGNoYW5nZXNbJ3Bvc2l0aW9uJ10uY3VycmVudFZhbHVlICE9PSBjaGFuZ2VzWydwb3NpdGlvbiddLnByZXZpb3VzVmFsdWVcbiAgICApIHtcbiAgICAgIHRoaXMuc2V0dXBPcHRpb25zKCk7XG4gICAgfVxuICB9XG5cbiAgc2V0dXBPcHRpb25zKCkge1xuICAgIC8vIE1lcmdlIHRoZSBwcm92aWRlZCBvcHRpb25zIHdpdGggdGhlIGRlZmF1bHQgb25lc1xuICAgIGNvbnN0IG1lcmdlZE9wdGlvbnMgPSB7XG4gICAgICAuLi5jcmVhdGVBY2Nlc3NpYmlsaXR5T3B0aW9ucyh0aGlzLndlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2UpLFxuICAgICAgLi4udGhpcy5vcHRpb25zLFxuICAgIH07XG5cbiAgICAvLyBJZiBhbiBvcHRpb24gd2FzIHBhc3NlZCBpbmRpdmlkdWFsbHksIG92ZXJyaWRlIGluIG1lcmdlZE9wdGlvbnNcbiAgICBpZiAodGhpcy50aXRsZSkge1xuICAgICAgbWVyZ2VkT3B0aW9ucy50aXRsZSA9IHRoaXMudGl0bGU7XG4gICAgfVxuICAgIGlmICh0aGlzLmRlc2NyaXB0aW9uKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLmRlc2NyaXB0aW9uID0gdGhpcy5kZXNjcmlwdGlvbjtcbiAgICB9XG4gICAgaWYgKHRoaXMuZGlzcGxheVR5cGUpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMuZGlzcGxheVR5cGUgPSB0aGlzLmRpc3BsYXlUeXBlO1xuICAgIH1cbiAgICBpZiAodGhpcy5vdmVybGF5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMub3ZlcmxheSA9IHRoaXMub3ZlcmxheTtcbiAgICB9XG4gICAgaWYgKHRoaXMucG9zaXRpb24pIHtcbiAgICAgIG1lcmdlZE9wdGlvbnMucG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uO1xuICAgIH1cbiAgICBpZiAodGhpcy5tb2R1bGVzKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLmluY2x1ZGUgPSB0aGlzLm1vZHVsZXM7XG4gICAgfVxuICAgIGlmICh0aGlzLmZvbnRTaXplKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLmZvbnRTaXplID0gdGhpcy5mb250U2l6ZTtcbiAgICAgIC8vIElmIGZvbnRTaXplIHdhcyBwYXNzZWQgaW4gc3BlY2lmaWNhbGx5LCBjaGVjayB0byBiZSBzdXJlIGl0J3MgaW5jbHVkZWQgaW4gdGhlIG1vZHVsZXMgbGlzdC4gSWYgbm90LCBhZGQgaXQuXG4gICAgICBpZiAoXG4gICAgICAgIG1lcmdlZE9wdGlvbnMuaW5jbHVkZSAmJlxuICAgICAgICAhbWVyZ2VkT3B0aW9ucy5pbmNsdWRlLmluY2x1ZGVzKCdmb250U2l6ZScpXG4gICAgICApIHtcbiAgICAgICAgbWVyZ2VkT3B0aW9ucy5pbmNsdWRlLnB1c2goJ2ZvbnRTaXplJyk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLnRoZW1lKSB7XG4gICAgICBtZXJnZWRPcHRpb25zLnRoZW1lID0gdGhpcy50aGVtZTtcbiAgICAgIGlmIChtZXJnZWRPcHRpb25zLmluY2x1ZGUgJiYgIW1lcmdlZE9wdGlvbnMuaW5jbHVkZS5pbmNsdWRlcygndGhlbWUnKSkge1xuICAgICAgICBtZXJnZWRPcHRpb25zLmluY2x1ZGUucHVzaCgndGhlbWUnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuc3BhY2luZykge1xuICAgICAgbWVyZ2VkT3B0aW9ucy5zcGFjaW5nID0gdGhpcy5zcGFjaW5nO1xuICAgICAgaWYgKFxuICAgICAgICBtZXJnZWRPcHRpb25zLmluY2x1ZGUgJiZcbiAgICAgICAgIW1lcmdlZE9wdGlvbnMuaW5jbHVkZS5pbmNsdWRlcygnc3BhY2luZycpXG4gICAgICApIHtcbiAgICAgICAgbWVyZ2VkT3B0aW9ucy5pbmNsdWRlLnB1c2goJ3NwYWNpbmcnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMubGF5b3V0KSB7XG4gICAgICBtZXJnZWRPcHRpb25zLmxheW91dCA9IHRoaXMubGF5b3V0O1xuICAgICAgaWYgKFxuICAgICAgICBtZXJnZWRPcHRpb25zLmluY2x1ZGUgJiZcbiAgICAgICAgIW1lcmdlZE9wdGlvbnMuaW5jbHVkZS5pbmNsdWRlcygnbGF5b3V0JylcbiAgICAgICkge1xuICAgICAgICBtZXJnZWRPcHRpb25zLmluY2x1ZGUucHVzaCgnbGF5b3V0Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTm93IHN0b3JlIHRoZSBmaW5hbCBtZXJnZWQgb3B0aW9uc1xuICAgIHRoaXMuY3VycmVudE9wdGlvbnMgPSBtZXJnZWRPcHRpb25zO1xuXG4gICAgLy8gT3B0aW9uYWw6IGxvZyB0aGUgbWVyZ2VkIG9wdGlvbnMgZm9yIGRlYnVnZ2luZ1xuICAgIHRoaXMuZGF0YSA9IHRoaXMuYnVpbGREYXRhKCk7XG5cbiAgfVxuXG4gIGJ1aWxkRGF0YSgpIHtcbiAgICAvLyBCdWlsZCB0aGUgZGF0YSBvYmplY3QgdG8gcGFzcyB0byB0aGUgcGFuZWxcbiAgICAvLyBEZXRlcm1pbmUgd2hpY2ggbW9kdWxlcyB0byBpbmNsdWRlIGJhc2VkIG9uIHRoZSBjdXJyZW50IG9wdGlvbnNcbiAgICBjb25zdCBpbmNsdWRlZE1vZHVsZXMgPSB0aGlzLmN1cnJlbnRPcHRpb25zLmluY2x1ZGUgfHwgW107XG4gICAgbGV0IG1vZHVsZURhdGE6IFBhbmVsRGF0YVsnbW9kdWxlcyddID0ge307XG4gICAgaW5jbHVkZWRNb2R1bGVzLmZvckVhY2goKG1vZHVsZTogTW9kdWxlVHlwZXMpID0+IHtcbiAgICAgIC8vIEFkZCB0aGUgbW9kdWxlIHRvIHRoZSBkYXRhIG9iamVjdFxuICAgICAgbW9kdWxlRGF0YVttb2R1bGVdID0gdGhpcy5jdXJyZW50T3B0aW9uc1ttb2R1bGVdO1xuICAgIH0pO1xuICAgIGNvbnN0IGRhdGE6IFBhbmVsRGF0YSA9IHtcbiAgICAgIHRpdGxlOiB0aGlzLmN1cnJlbnRPcHRpb25zLnRpdGxlIHx8ICdBY2Nlc3NpYmlsaXR5IHNldHRpbmdzJyxcbiAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLmN1cnJlbnRPcHRpb25zLmRlc2NyaXB0aW9uIHx8ICdBZGp1c3QgdGhlIHNldHRpbmdzIGJlbG93IHRvIGN1c3RvbWl6ZSB0aGUgYXBwZWFyYW5jZSBvZiB0aGlzIHdlYnNpdGUuJyxcbiAgICAgIG1vZHVsZXM6IG1vZHVsZURhdGEsXG4gICAgICBwb3NpdGlvbjogdGhpcy5jdXJyZW50T3B0aW9ucy5wb3NpdGlvbiB8fCAnZW5kJyxcbiAgICB9O1xuICAgIHJldHVybiBkYXRhO1xuICB9XG59XG4iXX0=