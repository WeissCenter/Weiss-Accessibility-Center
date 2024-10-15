// a11y-trigger.directive.ts
import { Directive, Input, HostListener, } from '@angular/core';
import { Subscription } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "./weiss-accessibility-center.service";
export class WeissAccessibilityToggleDirective {
    constructor(el, renderer, accessibilityService) {
        this.el = el;
        this.renderer = renderer;
        this.accessibilityService = accessibilityService;
        this.targetId = 'weissAccessibilityCenter';
        this.ariaExpanded = false;
        this.subscription = new Subscription();
    }
    ngOnInit() {
        // Set necessary ARIA attributes
        this.renderer.setAttribute(this.el.nativeElement, 'aria-controls', this.targetId);
        this.renderer.setAttribute(this.el.nativeElement, 'aria-expanded', 'false');
        this.renderer.setAttribute(this.el.nativeElement, 'aria-haspopup', 'true');
        // If no id on the button, set one
        if (!this.el.nativeElement.id) {
            this.renderer.setAttribute(this.el.nativeElement, 'id', 'weiss-a11y-toggle');
        }
        // Ensure the element is focusable if it's not inherently focusable
        this.makeElementFocusable();
        // Subscribe to the widget visibility observable to update 'aria-expanded'
        this.subscription =
            this.accessibilityService.showWeissAccessibilityCenter$.subscribe((visible) => {
                this.ariaExpanded = visible;
                this.renderer.setAttribute(this.el.nativeElement, 'aria-expanded', String(this.ariaExpanded));
                if (visible) {
                    this.renderer.addClass(this.el.nativeElement, 'weiss-a11y-active');
                }
                else {
                    this.renderer.removeClass(this.el.nativeElement, 'weiss-a11y-active');
                }
            });
    }
    // Ensure the element is focusable
    makeElementFocusable() {
        const nodeName = this.el.nativeElement.nodeName.toLowerCase();
        const focusableElements = ['a', 'button', 'input', 'textarea', 'select'];
        if (!focusableElements.includes(nodeName)) {
            // Add tabindex if not already present
            if (!this.el.nativeElement.hasAttribute('tabindex')) {
                this.renderer.setAttribute(this.el.nativeElement, 'tabindex', '0');
            }
            if (!this.el.nativeElement.hasAttribute('role')) {
                this.renderer.setAttribute(this.el.nativeElement, 'role', 'button');
            }
        }
    }
    onClick(target) {
        // Toggle the widget visibility
        this.accessibilityService.toggleWeissAccessibilityCenter(target);
    }
    onKeyDown(event) {
        // Check if Enter or Space was pressed
        if (event.key === 'Enter' ||
            event.key === ' ' ||
            event.key === 'Spacebar') {
            event.preventDefault(); // Prevent default action (like scrolling for spacebar)
            this.accessibilityService.toggleWeissAccessibilityCenter(this.el.nativeElement);
        }
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: WeissAccessibilityToggleDirective, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i1.WeissAccessibilityCenterService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.7", type: WeissAccessibilityToggleDirective, selector: "[weissA11yToggle]", inputs: { targetId: ["weissA11yToggle", "targetId"] }, host: { listeners: { "click": "onClick($event.target)", "keydown": "onKeyDown($event)" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: WeissAccessibilityToggleDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[weissA11yToggle]',
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i1.WeissAccessibilityCenterService }], propDecorators: { targetId: [{
                type: Input,
                args: ['weissA11yToggle']
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event.target']]
            }], onKeyDown: [{
                type: HostListener,
                args: ['keydown', ['$event']]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvd2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIvc3JjL2xpYi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsNEJBQTRCO0FBQzVCLE9BQU8sRUFDTCxTQUFTLEVBRVQsS0FBSyxFQUVMLFlBQVksR0FHYixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7QUFJcEMsTUFBTSxPQUFPLGlDQUFpQztJQU01QyxZQUNVLEVBQWMsRUFDZCxRQUFtQixFQUNuQixvQkFBcUQ7UUFGckQsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUNkLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFpQztRQVJyQyxhQUFRLEdBQVcsMEJBQTBCLENBQUM7UUFFaEUsaUJBQVksR0FBWSxLQUFLLENBQUM7UUFDOUIsaUJBQVksR0FBaUIsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQU1yRCxDQUFDO0lBRUosUUFBUTtRQUNOLGdDQUFnQztRQUNoQyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FDeEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQ3JCLGVBQWUsRUFDZixJQUFJLENBQUMsUUFBUSxDQUNkLENBQUM7UUFDRixJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDNUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsZUFBZSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzNFLGtDQUFrQztRQUNs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R0F6RlUsaUNBQWlDO2tHQUFqQyxpQ0FBaUM7OzJGQUFqQyxpQ0FBaUM7a0JBSDdDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjtpQkFDOUI7cUpBRTJCLFFBQVE7c0JBQWpDLEtBQUs7dUJBQUMsaUJBQWlCO2dCQW9FeEIsT0FBTztzQkFETixZQUFZO3VCQUFDLE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQztnQkFPeEMsU0FBUztzQkFEUixZQUFZO3VCQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGExMXktdHJpZ2dlci5kaXJlY3RpdmUudHNcbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIFJlbmRlcmVyMixcbiAgSG9zdExpc3RlbmVyLFxuICBPbkluaXQsXG4gIE9uRGVzdHJveSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlIH0gZnJvbSAnLi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW3dlaXNzQTExeVRvZ2dsZV0nLFxufSlcbmV4cG9ydCBjbGFzcyBXZWlzc0FjY2Vzc2liaWxpdHlUb2dnbGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgnd2Vpc3NBMTF5VG9nZ2xlJykgdGFyZ2V0SWQ6IHN0cmluZyA9ICd3ZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXInO1xuXG4gIHByaXZhdGUgYXJpYUV4cGFuZGVkOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJpdmF0ZSBhY2Nlc3NpYmlsaXR5U2VydmljZTogV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZVxuICApIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gU2V0IG5lY2Vzc2FyeSBBUklBIGF0dHJpYnV0ZXNcbiAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZShcbiAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudCxcbiAgICAgICdhcmlhLWNvbnRyb2xzJyxcbiAgICAgIHRoaXMudGFyZ2V0SWRcbiAgICApO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdhcmlhLWhhc3BvcHVwJywgJ3RydWUnKTtcbiAgICAvLyBJZiBubyBpZCBvbiB0aGUgYnV0dG9uLCBzZXQgb25lXG4gICAgaWYgKCF0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaWQpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKFxuICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICdpZCcsXG4gICAgICAgICd3ZWlzcy1hMTF5LXRvZ2dsZSdcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gRW5zdXJlIHRoZSBlbGVtZW50IGlzIGZvY3VzYWJsZSBpZiBpdCdzIG5vdCBpbmhlcmVudGx5IGZvY3VzYWJsZVxuICAgIHRoaXMubWFrZUVsZW1lbnRGb2N1c2FibGUoKTtcblxuICAgIC8vIFN1YnNjcmliZSB0byB0aGUgd2lkZ2V0IHZpc2liaWxpdHkgb2JzZXJ2YWJsZSB0byB1cGRhdGUgJ2FyaWEtZXhwYW5kZWQnXG4gICAgdGhpcy5zdWJzY3JpcHRpb24gPVxuICAgICAgdGhpcy5hY2Nlc3NpYmlsaXR5U2VydmljZS5zaG93V2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyJC5zdWJzY3JpYmUoXG4gICAgICAgICh2aXNpYmxlKSA9PiB7XG4gICAgICAgICAgdGhpcy5hcmlhRXhwYW5kZWQgPSB2aXNpYmxlO1xuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKFxuICAgICAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LFxuICAgICAgICAgICAgJ2FyaWEtZXhwYW5kZWQnLFxuICAgICAgICAgICAgU3RyaW5nKHRoaXMuYXJpYUV4cGFuZGVkKVxuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKHZpc2libGUpIHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnd2Vpc3MtYTExeS1hY3RpdmUnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICd3ZWlzcy1hMTF5LWFjdGl2ZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKTtcbiAgfVxuXG4gIC8vIEVuc3VyZSB0aGUgZWxlbWVudCBpcyBmb2N1c2FibGVcbiAgcHJpdmF0ZSBtYWtlRWxlbWVudEZvY3VzYWJsZSgpIHtcbiAgICBjb25zdCBub2RlTmFtZSA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IGZvY3VzYWJsZUVsZW1lbnRzID0gWydhJywgJ2J1dHRvbicsICdpbnB1dCcsICd0ZXh0YXJlYScsICdzZWxlY3QnXTtcblxuICAgIGlmICghZm9jdXNhYmxlRWxlbWVudHMuaW5jbHVkZXMobm9kZU5hbWUpKSB7XG4gICAgICAvLyBBZGQgdGFiaW5kZXggaWYgbm90IGFscmVhZHkgcHJlc2VudFxuICAgICAgaWYgKCF0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaGFzQXR0cmlidXRlKCd0YWJpbmRleCcpKSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ3RhYmluZGV4JywgJzAnKTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5lbC5uYXRpdmVFbGVtZW50Lmhhc0F0dHJpYnV0ZSgncm9sZScpKSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ3JvbGUnLCAnYnV0dG9uJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignY2xpY2snLCBbJyRldmVudC50YXJnZXQnXSlcbiAgb25DbGljayh0YXJnZXQ6IEhUTUxFbGVtZW50KSB7XG5cbiAgICAvLyBUb2dnbGUgdGhlIHdpZGdldCB2aXNpYmlsaXR5XG4gICAgdGhpcy5hY2Nlc3NpYmlsaXR5U2VydmljZS50b2dnbGVXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIodGFyZ2V0KTtcbiAgfVxuICBASG9zdExpc3RlbmVyKCdrZXlkb3duJywgWyckZXZlbnQnXSlcbiAgb25LZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgLy8gQ2hlY2sgaWYgRW50ZXIgb3IgU3BhY2Ugd2FzIHByZXNzZWRcbiAgICBpZiAoXG4gICAgICBldmVudC5rZXkgPT09ICdFbnRlcicgfHxcbiAgICAgIGV2ZW50LmtleSA9PT0gJyAnIHx8XG4gICAgICBldmVudC5rZXkgPT09ICdTcGFjZWJhcidcbiAgICApIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vIFByZXZlbnQgZGVmYXVsdCBhY3Rpb24gKGxpa2Ugc2Nyb2xsaW5nIGZvciBzcGFjZWJhcilcbiAgICAgIHRoaXMuYWNjZXNzaWJpbGl0eVNlcnZpY2UudG9nZ2xlV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxufVxuIl19