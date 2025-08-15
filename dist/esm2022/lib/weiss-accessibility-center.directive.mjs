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
        this.renderer.setAttribute(this.el.nativeElement, 'aria-expanded', 'false');
        this.renderer.setAttribute(this.el.nativeElement, 'aria-haspopup', 'true');
        // If no id on the button, set one
        if (!this.el.nativeElement.id) {
            this.renderer.setAttribute(this.el.nativeElement, 'id', 'weiss-a11y-toggle');
        }
        // Initial push and aria-controls sync
        this.pushTargetIdToService();
        this.updateAriaControls();
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
    ngOnChanges(changes) {
        if (changes['targetId']) {
            this.pushTargetIdToService();
            this.updateAriaControls();
        }
    }
    pushTargetIdToService() {
        this.accessibilityService.setTargetId(this.targetId ?? null);
    }
    updateAriaControls() {
        if (this.targetId) {
            this.renderer.setAttribute(this.el.nativeElement, 'aria-controls', this.targetId);
        }
        else {
            this.renderer.removeAttribute(this.el.nativeElement, 'aria-controls');
        }
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
        this.accessibilityService.toggleWeissAccessibilityCenter(target);
    }
    onKeyDown(event) {
        if (event.key === 'Enter' ||
            event.key === ' ' ||
            event.key === 'Spacebar') {
            event.preventDefault();
            this.accessibilityService.toggleWeissAccessibilityCenter(this.el.nativeElement);
        }
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
        // Optionally clear the id if this was the only trigger
        // this.accessibilityService.setTargetId(null);
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.8", ngImport: i0, type: WeissAccessibilityToggleDirective, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i1.WeissAccessibilityCenterService }], target: i0.ɵɵFactoryTarget.Directive });
    static ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "18.2.8", type: WeissAccessibilityToggleDirective, selector: "[weissA11yToggle]", inputs: { targetId: ["weissA11yToggle", "targetId"] }, host: { listeners: { "click": "onClick($event.target)", "keydown": "onKeyDown($event)" } }, usesOnChanges: true, ngImport: i0 });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsNEJBQTRCO0FBQzVCLE9BQU8sRUFDTCxTQUFTLEVBRVQsS0FBSyxFQUVMLFlBQVksR0FLYixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7QUFLcEMsTUFBTSxPQUFPLGlDQUFpQztJQU9sQztJQUNBO0lBQ0E7SUFSZ0IsUUFBUSxDQUFVO0lBRXBDLFlBQVksR0FBWSxLQUFLLENBQUM7SUFDOUIsWUFBWSxHQUFpQixJQUFJLFlBQVksRUFBRSxDQUFDO0lBRXhELFlBQ1UsRUFBYyxFQUNkLFFBQW1CLEVBQ25CLG9CQUFxRDtRQUZyRCxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQ2QsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNuQix5QkFBb0IsR0FBcEIsb0JBQW9CLENBQWlDO0lBQzVELENBQUM7SUFFSixRQUFRO1FBQ04sZ0NBQWdDO1FBQ2hDLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM1RSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxlQUFlLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFM0Usa0NBQWtDO1FBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxJQUFJLEVBQUUsbUJBQW1C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O0lBQ0gsQ0FBQztJQUdELE9BQU8sQ0FBQyxNQUFtQjtRQUN6QixJQUFJLENBQUMsb0JBQW9CLENBQUMsOEJBQThCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUdELFNBQVMsQ0FBQyxLQUFvQjtRQUM1QixJQUNFLEtBQUssQ0FBQyxHQUFHLEtBQUssT0FBTztZQUNyQixLQUFLLENBQUMsR0FBRyxLQUFLLEdBQUc7WUFDakIsS0FBSyxDQUFDLEdBQUcsS0FBSyxVQUFVLEVBQ3hCLENBQUM7WUFDRCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLG9CQUFvQixDQUFDLDhCQUE4QixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbEYsQ0FBQztJQUNILENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNoQyx1REFBdUQ7UUFDdkQsK0NBQStDO0lBQ2pELENBQUM7dUdBeEdVLGlDQUFpQzsyRkFBakMsaUNBQWlDOzsyRkFBakMsaUNBQWlDO2tCQUg3QyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxtQkFBbUI7aUJBQzlCO3FKQUUyQixRQUFRO3NCQUFqQyxLQUFLO3VCQUFDLGlCQUFpQjtnQkFtRnhCLE9BQU87c0JBRE4sWUFBWTt1QkFBQyxPQUFPLEVBQUUsQ0FBQyxlQUFlLENBQUM7Z0JBTXhDLFNBQVM7c0JBRFIsWUFBWTt1QkFBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBhMTF5LXRyaWdnZXIuZGlyZWN0aXZlLnRzXG5pbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIElucHV0LFxuICBSZW5kZXJlcjIsXG4gIEhvc3RMaXN0ZW5lcixcbiAgT25Jbml0LFxuICBPbkRlc3Ryb3ksXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlIH0gZnJvbSAnLi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5zZXJ2aWNlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbd2Vpc3NBMTF5VG9nZ2xlXScsXG59KVxuZXhwb3J0IGNsYXNzIFdlaXNzQWNjZXNzaWJpbGl0eVRvZ2dsZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBPbkNoYW5nZXMge1xuICBASW5wdXQoJ3dlaXNzQTExeVRvZ2dsZScpIHRhcmdldElkITogc3RyaW5nO1xuXG4gIHByaXZhdGUgYXJpYUV4cGFuZGVkOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBlbDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJpdmF0ZSBhY2Nlc3NpYmlsaXR5U2VydmljZTogV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyU2VydmljZVxuICApIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gU2V0IG5lY2Vzc2FyeSBBUklBIGF0dHJpYnV0ZXNcbiAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnYXJpYS1oYXNwb3B1cCcsICd0cnVlJyk7XG5cbiAgICAvLyBJZiBubyBpZCBvbiB0aGUgYnV0dG9uLCBzZXQgb25lXG4gICAgaWYgKCF0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaWQpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ2lkJywgJ3dlaXNzLWExMXktdG9nZ2xlJyk7XG4gICAgfVxuXG4gICAgLy8gSW5pdGlhbCBwdXNoIGFuZCBhcmlhLWNvbnRyb2xzIHN5bmNcbiAgICB0aGlzLnB1c2hUYXJnZXRJZFRvU2VydmljZSgpO1xuICAgIHRoaXMudXBkYXRlQXJpYUNvbnRyb2xzKCk7XG5cbiAgICAvLyBFbnN1cmUgdGhlIGVsZW1lbnQgaXMgZm9jdXNhYmxlIGlmIGl0J3Mgbm90IGluaGVyZW50bHkgZm9jdXNhYmxlXG4gICAgdGhpcy5tYWtlRWxlbWVudEZvY3VzYWJsZSgpO1xuXG4gICAgLy8gU3Vic2NyaWJlIHRvIHRoZSB3aWRnZXQgdmlzaWJpbGl0eSBvYnNlcnZhYmxlIHRvIHVwZGF0ZSAnYXJpYS1leHBhbmRlZCdcbiAgICB0aGlzLnN1YnNjcmlwdGlvbiA9XG4gICAgICB0aGlzLmFjY2Vzc2liaWxpdHlTZXJ2aWNlLnNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIkLnN1YnNjcmliZShcbiAgICAgICAgKHZpc2libGUpID0+IHtcbiAgICAgICAgICB0aGlzLmFyaWFFeHBhbmRlZCA9IHZpc2libGU7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICAnYXJpYS1leHBhbmRlZCcsXG4gICAgICAgICAgICBTdHJpbmcodGhpcy5hcmlhRXhwYW5kZWQpXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAodmlzaWJsZSkge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICd3ZWlzcy1hMTF5LWFjdGl2ZScpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ3dlaXNzLWExMXktYWN0aXZlJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzWyd0YXJnZXRJZCddKSB7XG4gICAgICB0aGlzLnB1c2hUYXJnZXRJZFRvU2VydmljZSgpO1xuICAgICAgdGhpcy51cGRhdGVBcmlhQ29udHJvbHMoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHB1c2hUYXJnZXRJZFRvU2VydmljZSgpIHtcbiAgICB0aGlzLmFjY2Vzc2liaWxpdHlTZXJ2aWNlLnNldFRhcmdldElkKHRoaXMudGFyZ2V0SWQgPz8gbnVsbCk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZUFyaWFDb250cm9scygpIHtcbiAgICBpZiAodGhpcy50YXJnZXRJZCkge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnYXJpYS1jb250cm9scycsIHRoaXMudGFyZ2V0SWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUF0dHJpYnV0ZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICdhcmlhLWNvbnRyb2xzJyk7XG4gICAgfVxuICB9XG5cbiAgLy8gRW5zdXJlIHRoZSBlbGVtZW50IGlzIGZvY3VzYWJsZVxuICBwcml2YXRlIG1ha2VFbGVtZW50Rm9jdXNhYmxlKCkge1xuICAgIGNvbnN0IG5vZGVOYW1lID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHMgPSBbJ2EnLCAnYnV0dG9uJywgJ2lucHV0JywgJ3RleHRhcmVhJywgJ3NlbGVjdCddO1xuXG4gICAgaWYgKCFmb2N1c2FibGVFbGVtZW50cy5pbmNsdWRlcyhub2RlTmFtZSkpIHtcbiAgICAgIC8vIEFkZCB0YWJpbmRleCBpZiBub3QgYWxyZWFkeSBwcmVzZW50XG4gICAgICBpZiAoIXRoaXMuZWwubmF0aXZlRWxlbWVudC5oYXNBdHRyaWJ1dGUoJ3RhYmluZGV4JykpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAndGFiaW5kZXgnLCAnMCcpO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaGFzQXR0cmlidXRlKCdyb2xlJykpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAncm9sZScsICdidXR0b24nKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50LnRhcmdldCddKVxuICBvbkNsaWNrKHRhcmdldDogSFRNTEVsZW1lbnQpIHtcbiAgICB0aGlzLmFjY2Vzc2liaWxpdHlTZXJ2aWNlLnRvZ2dsZVdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlcih0YXJnZXQpO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bicsIFsnJGV2ZW50J10pXG4gIG9uS2V5RG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmIChcbiAgICAgIGV2ZW50LmtleSA9PT0gJ0VudGVyJyB8fFxuICAgICAgZXZlbnQua2V5ID09PSAnICcgfHxcbiAgICAgIGV2ZW50LmtleSA9PT0gJ1NwYWNlYmFyJ1xuICAgICkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMuYWNjZXNzaWJpbGl0eVNlcnZpY2UudG9nZ2xlV2Vpc3NBY2Nlc3NpYmlsaXR5Q2VudGVyKHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAvLyBPcHRpb25hbGx5IGNsZWFyIHRoZSBpZCBpZiB0aGlzIHdhcyB0aGUgb25seSB0cmlnZ2VyXG4gICAgLy8gdGhpcy5hY2Nlc3NpYmlsaXR5U2VydmljZS5zZXRUYXJnZXRJZChudWxsKTtcbiAgfVxufVxuIl19