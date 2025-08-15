// a11y-trigger.directive.ts
import { Directive, Input, HostListener, } from '@angular/core';
import { Subscription } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "./weiss-accessibility-center.service";
export class WeissAccessibilityToggleDirective {
    el;
    renderer;
    accessibilityService;
    targetId;
    ariaExpanded = false;
    subscription = new Subscription();
    constructor(el, renderer, accessibilityService) {
        this.el = el;
        this.renderer = renderer;
        this.accessibilityService = accessibilityService;
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
        this.accessibilityService.setTargetId(this.targetId ?? null);
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: WeissAccessibilityToggleDirective, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i1.WeissAccessibilityCenterService }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.8", type: WeissAccessibilityToggleDirective, selector: "[weissA11yToggle]", inputs: { targetId: ["weissA11yToggle", "targetId"] }, host: { listeners: { "click": "onClick($event.target)", "keydown": "onKeyDown($event)" } }, ngImport: i0 });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: WeissAccessibilityToggleDirective, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsNEJBQTRCO0FBQzVCLE9BQU8sRUFDTCxTQUFTLEVBRVQsS0FBSyxFQUVMLFlBQVksR0FHYixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7QUFJcEMsTUFBTSxPQUFPLGlDQUFpQztJQU9sQztJQUNBO0lBQ0E7SUFSZ0IsUUFBUSxDQUFVO0lBRXBDLFlBQVksR0FBWSxLQUFLLENBQUM7SUFDOUIsWUFBWSxHQUFpQixJQUFJLFlBQVksRUFBRSxDQUFDO0lBRXhELFlBQ1UsRUFBYyxFQUNkLFFBQW1CLEVBQ25CLG9CQUFxRDtRQUZyRCxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQ2QsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNuQix5QkFBb0IsR0FBcEIsb0JBQW9CLENBQWlDO0lBQzVELENBQUM7SUFFSixRQUFRO1FBQ04sZ0NBQWdDO1FBQ2hDLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUN4QixJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFDckIsZUFBZSxFQUNmLElBQUksQ0FBQyxRQUFRLENBQ2QsQ0FBQztRQUNGLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM1RSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxlQUFlLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDM0Usa0NBQWtDO1FBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEs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QUFZLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDbEMsQ0FBQzt1R0EzRlUsaUNBQWlDOzJGQUFqQyxpQ0FBaUM7OzJGQUFqQyxpQ0FBaUM7a0JBSDdDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjtpQkFDOUI7cUpBRTJCLFFBQVE7c0JBQWpDLEtBQUs7dUJBQUMsaUJBQWlCO2dCQXNFeEIsT0FBTztzQkFETixZQUFZO3VCQUFDLE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQztnQkFPeEMsU0FBUztzQkFEUixZQUFZO3VCQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGExMXktdHJpZ2dlci5kaXJlY3RpdmUudHNcbmltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIFJlbmRlcmVyMixcbiAgSG9zdExpc3RlbmVyLFxuICBPbkluaXQsXG4gIE9uRGVzdHJveSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlIH0gZnJvbSAnLi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW3dlaXNzQTExeVRvZ2dsZV0nLFxufSlcbmV4cG9ydCBjbGFzcyBXZWlzc0FjY2Vzc2liaWxpdHlUb2dnbGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgnd2Vpc3NBMTF5VG9nZ2xlJykgdGFyZ2V0SWQhOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBhcmlhRXhwYW5kZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVsOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcml2YXRlIGFjY2Vzc2liaWxpdHlTZXJ2aWNlOiBXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlXG4gICkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBTZXQgbmVjZXNzYXJ5IEFSSUEgYXR0cmlidXRlc1xuICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKFxuICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LFxuICAgICAgJ2FyaWEtY29udHJvbHMnLFxuICAgICAgdGhpcy50YXJnZXRJZFxuICAgICk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ2FyaWEtaGFzcG9wdXAnLCAndHJ1ZScpO1xuICAgIC8vIElmIG5vIGlkIG9uIHRoZSBidXR0b24sIHNldCBvbmVcbiAgICBpZiAoIXRoaXMuZWwubmF0aXZlRWxlbWVudC5pZCkge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUoXG4gICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudCxcbiAgICAgICAgJ2lkJyxcbiAgICAgICAgJ3dlaXNzLWExMXktdG9nZ2xlJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLmFjY2Vzc2liaWxpdHlTZXJ2aWNlLnNldFRhcmdldElkKHRoaXMudGFyZ2V0SWQgPz8gbnVsbCk7XG5cbiAgICAvLyBFbnN1cmUgdGhlIGVsZW1lbnQgaXMgZm9jdXNhYmxlIGlmIGl0J3Mgbm90IGluaGVyZW50bHkgZm9jdXNhYmxlXG4gICAgdGhpcy5tYWtlRWxlbWVudEZvY3VzYWJsZSgpO1xuXG4gICAgLy8gU3Vic2NyaWJlIHRvIHRoZSB3aWRnZXQgdmlzaWJpbGl0eSBvYnNlcnZhYmxlIHRvIHVwZGF0ZSAnYXJpYS1leHBhbmRlZCdcbiAgICB0aGlzLnN1YnNjcmlwdGlvbiA9XG4gICAgICB0aGlzLmFjY2Vzc2liaWxpdHlTZXJ2aWNlLnNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIkLnN1YnNjcmliZShcbiAgICAgICAgKHZpc2libGUpID0+IHtcbiAgICAgICAgICB0aGlzLmFyaWFFeHBhbmRlZCA9IHZpc2libGU7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICAnYXJpYS1leHBhbmRlZCcsXG4gICAgICAgICAgICBTdHJpbmcodGhpcy5hcmlhRXhwYW5kZWQpXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAodmlzaWJsZSkge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICd3ZWlzcy1hMTF5LWFjdGl2ZScpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ3dlaXNzLWExMXktYWN0aXZlJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApO1xuICB9XG5cbiAgLy8gRW5zdXJlIHRoZSBlbGVtZW50IGlzIGZvY3VzYWJsZVxuICBwcml2YXRlIG1ha2VFbGVtZW50Rm9jdXNhYmxlKCkge1xuICAgIGNvbnN0IG5vZGVOYW1lID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHMgPSBbJ2EnLCAnYnV0dG9uJywgJ2lucHV0JywgJ3RleHRhcmVhJywgJ3NlbGVjdCddO1xuXG4gICAgaWYgKCFmb2N1c2FibGVFbGVtZW50cy5pbmNsdWRlcyhub2RlTmFtZSkpIHtcbiAgICAgIC8vIEFkZCB0YWJpbmRleCBpZiBub3QgYWxyZWFkeSBwcmVzZW50XG4gICAgICBpZiAoIXRoaXMuZWwubmF0aXZlRWxlbWVudC5oYXNBdHRyaWJ1dGUoJ3RhYmluZGV4JykpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAndGFiaW5kZXgnLCAnMCcpO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaGFzQXR0cmlidXRlKCdyb2xlJykpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAncm9sZScsICdidXR0b24nKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50LnRhcmdldCddKVxuICBvbkNsaWNrKHRhcmdldDogSFRNTEVsZW1lbnQpIHtcblxuICAgIC8vIFRvZ2dsZSB0aGUgd2lkZ2V0IHZpc2liaWxpdHlcbiAgICB0aGlzLmFjY2Vzc2liaWxpdHlTZXJ2aWNlLnRvZ2dsZVdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlcih0YXJnZXQpO1xuICB9XG4gIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24nLCBbJyRldmVudCddKVxuICBvbktleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAvLyBDaGVjayBpZiBFbnRlciBvciBTcGFjZSB3YXMgcHJlc3NlZFxuICAgIGlmIChcbiAgICAgIGV2ZW50LmtleSA9PT0gJ0VudGVyJyB8fFxuICAgICAgZXZlbnQua2V5ID09PSAnICcgfHxcbiAgICAgIGV2ZW50LmtleSA9PT0gJ1NwYWNlYmFyJ1xuICAgICkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsgLy8gUHJldmVudCBkZWZhdWx0IGFjdGlvbiAobGlrZSBzY3JvbGxpbmcgZm9yIHNwYWNlYmFyKVxuICAgICAgdGhpcy5hY2Nlc3NpYmlsaXR5U2VydmljZS50b2dnbGVXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG59XG4iXX0=