// a11y-trigger.directive.ts
import { Directive, Input, HostListener, } from '@angular/core';
import { Subscription } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "./weiss-accessibility-center.service";
export class WeissAccessibilityToggleDirective {
    el;
    renderer;
    accessibilityService;
    targetId = 'weissAccessibilityCenter';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vpc3MtYWNjZXNzaWJpbGl0eS1jZW50ZXIuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi93ZWlzcy1hY2Nlc3NpYmlsaXR5LWNlbnRlci5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsNEJBQTRCO0FBQzVCLE9BQU8sRUFDTCxTQUFTLEVBRVQsS0FBSyxFQUVMLFlBQVksR0FHYixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7QUFJcEMsTUFBTSxPQUFPLGlDQUFpQztJQU9sQztJQUNBO0lBQ0E7SUFSZ0IsUUFBUSxHQUFXLDBCQUEwQixDQUFDO0lBRWhFLFlBQVksR0FBWSxLQUFLLENBQUM7SUFDOUIsWUFBWSxHQUFpQixJQUFJLFlBQVksRUFBRSxDQUFDO0lBRXhELFlBQ1UsRUFBYyxFQUNkLFFBQW1CLEVBQ25CLG9CQUFxRDtRQUZyRCxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQ2QsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNuQix5QkFBb0IsR0FBcEIsb0JBQW9CLENBQWlDO0lBQzVELENBQUM7SUFFSixRQUFRO1FBQ04sZ0NBQWdDO1FBQ2hDLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUN4QixJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFDckIsZUFBZSxFQUNmLElBQUksQ0FBQyxRQUFRLENBQ2QsQ0FBQztRQUNGLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUM1RSxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxlQUFlLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDM0Usa0NBQWtDO1FBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FDeEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQ3JCLElBQUksRUFDSixtQkFBbUIsQ0FDcEIsQ0FBQztRQUNKLENBQUM7UUFFRCxtRUFBbUU7UUFDbkUsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFFNUIsMEVBQTBFO1FBQzFFLElBQUksQ0FBQyxZQUFZO1lBQ2YsSUFBSSxDQUFDLG9CQUFvQixDQUFDLDZCQUE2QixDQUFDLFNBQVMsQ0FDL0QsQ0FBQyxPQUFPLEVBQUUsRUFBRTtnQkFDVixJQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQztnQkFDNUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQ3hCLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUNyQixlQUFlLEVBQ2YsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FDMUIsQ0FBQztnQkFDRixJQUFJLE9BQU8sRUFBRSxDQUFDO29CQUNaLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLG1CQUFtQixDQUFDLENBQUM7Z0JBQ3JFLENBQUM7cUJBQU0sQ0FBQztvQkFDTixJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO2dCQUN4RSxDQUFDO1lBQ0gsQ0FBQyxDQUNGLENBQUM7SUFDTixDQUFDO0lBRUQsa0NBQWtDO0lBQzFCLG9CQUFvQjtRQUMxQixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDOUQsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUV6RSxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7WUFDMUMsc0NBQXNDO1lBQ3RDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztnQkFDcEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3JFLENBQUM7WUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7Z0JBQ2hELElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN0RSxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFHRCxPQUFPLENBQUMsTUFBbUI7UUFFekIsK0JBQStCO1FBQy9CLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyw4QkFBOEIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRUQsU0FBUyxDQUFDLEtBQW9CO1FBQzVCLHNDQUFzQztRQUN0QyxJQUNFLEtBQUssQ0FBQyxHQUFHLEtBQUssT0FBTztZQUNyQixLQUFLLENBQUMsR0FBRyxLQUFLLEdBQUc7WUFDakIsS0FBSyxDQUFDLEdBQUcsS0FBSyxVQUFVLEVBQ3hCLENBQUM7WUFDRCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyx1REFBdUQ7WUFDL0UsSUFBSSxDQUFDLG9CQUFvQixDQUFDLDhCQUE4QixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbEYsQ0FBQztJQUNILENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNsQyxDQUFDO3VHQXpGVSxpQ0FBaUM7MkZBQWpDLGlDQUFpQzs7MkZBQWpDLGlDQUFpQztrQkFIN0MsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsbUJBQW1CO2lCQUM5QjtxSkFFMkIsUUFBUTtzQkFBakMsS0FBSzt1QkFBQyxpQkFBaUI7Z0JBb0V4QixPQUFPO3NCQUROLFlBQVk7dUJBQUMsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDO2dCQU94QyxTQUFTO3NCQURSLFlBQVk7dUJBQUMsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gYTExeS10cmlnZ2VyLmRpcmVjdGl2ZS50c1xuaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgUmVuZGVyZXIyLFxuICBIb3N0TGlzdGVuZXIsXG4gIE9uSW5pdCxcbiAgT25EZXN0cm95LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlclNlcnZpY2UgfSBmcm9tICcuL3dlaXNzLWFjY2Vzc2liaWxpdHktY2VudGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbd2Vpc3NBMTF5VG9nZ2xlXScsXG59KVxuZXhwb3J0IGNsYXNzIFdlaXNzQWNjZXNzaWJpbGl0eVRvZ2dsZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgQElucHV0KCd3ZWlzc0ExMXlUb2dnbGUnKSB0YXJnZXRJZDogc3RyaW5nID0gJ3dlaXNzQWNjZXNzaWJpbGl0eUNlbnRlcic7XG5cbiAgcHJpdmF0ZSBhcmlhRXhwYW5kZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVsOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcml2YXRlIGFjY2Vzc2liaWxpdHlTZXJ2aWNlOiBXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXJTZXJ2aWNlXG4gICkge31cblxuICBuZ09uSW5pdCgpIHtcbiAgICAvLyBTZXQgbmVjZXNzYXJ5IEFSSUEgYXR0cmlidXRlc1xuICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKFxuICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LFxuICAgICAgJ2FyaWEtY29udHJvbHMnLFxuICAgICAgdGhpcy50YXJnZXRJZFxuICAgICk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ2FyaWEtaGFzcG9wdXAnLCAndHJ1ZScpO1xuICAgIC8vIElmIG5vIGlkIG9uIHRoZSBidXR0b24sIHNldCBvbmVcbiAgICBpZiAoIXRoaXMuZWwubmF0aXZlRWxlbWVudC5pZCkge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUoXG4gICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudCxcbiAgICAgICAgJ2lkJyxcbiAgICAgICAgJ3dlaXNzLWExMXktdG9nZ2xlJ1xuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBFbnN1cmUgdGhlIGVsZW1lbnQgaXMgZm9jdXNhYmxlIGlmIGl0J3Mgbm90IGluaGVyZW50bHkgZm9jdXNhYmxlXG4gICAgdGhpcy5tYWtlRWxlbWVudEZvY3VzYWJsZSgpO1xuXG4gICAgLy8gU3Vic2NyaWJlIHRvIHRoZSB3aWRnZXQgdmlzaWJpbGl0eSBvYnNlcnZhYmxlIHRvIHVwZGF0ZSAnYXJpYS1leHBhbmRlZCdcbiAgICB0aGlzLnN1YnNjcmlwdGlvbiA9XG4gICAgICB0aGlzLmFjY2Vzc2liaWxpdHlTZXJ2aWNlLnNob3dXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIkLnN1YnNjcmliZShcbiAgICAgICAgKHZpc2libGUpID0+IHtcbiAgICAgICAgICB0aGlzLmFyaWFFeHBhbmRlZCA9IHZpc2libGU7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsXG4gICAgICAgICAgICAnYXJpYS1leHBhbmRlZCcsXG4gICAgICAgICAgICBTdHJpbmcodGhpcy5hcmlhRXhwYW5kZWQpXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAodmlzaWJsZSkge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICd3ZWlzcy1hMTF5LWFjdGl2ZScpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ3dlaXNzLWExMXktYWN0aXZlJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICApO1xuICB9XG5cbiAgLy8gRW5zdXJlIHRoZSBlbGVtZW50IGlzIGZvY3VzYWJsZVxuICBwcml2YXRlIG1ha2VFbGVtZW50Rm9jdXNhYmxlKCkge1xuICAgIGNvbnN0IG5vZGVOYW1lID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgY29uc3QgZm9jdXNhYmxlRWxlbWVudHMgPSBbJ2EnLCAnYnV0dG9uJywgJ2lucHV0JywgJ3RleHRhcmVhJywgJ3NlbGVjdCddO1xuXG4gICAgaWYgKCFmb2N1c2FibGVFbGVtZW50cy5pbmNsdWRlcyhub2RlTmFtZSkpIHtcbiAgICAgIC8vIEFkZCB0YWJpbmRleCBpZiBub3QgYWxyZWFkeSBwcmVzZW50XG4gICAgICBpZiAoIXRoaXMuZWwubmF0aXZlRWxlbWVudC5oYXNBdHRyaWJ1dGUoJ3RhYmluZGV4JykpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAndGFiaW5kZXgnLCAnMCcpO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaGFzQXR0cmlidXRlKCdyb2xlJykpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAncm9sZScsICdidXR0b24nKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50LnRhcmdldCddKVxuICBvbkNsaWNrKHRhcmdldDogSFRNTEVsZW1lbnQpIHtcblxuICAgIC8vIFRvZ2dsZSB0aGUgd2lkZ2V0IHZpc2liaWxpdHlcbiAgICB0aGlzLmFjY2Vzc2liaWxpdHlTZXJ2aWNlLnRvZ2dsZVdlaXNzQWNjZXNzaWJpbGl0eUNlbnRlcih0YXJnZXQpO1xuICB9XG4gIEBIb3N0TGlzdGVuZXIoJ2tleWRvd24nLCBbJyRldmVudCddKVxuICBvbktleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICAvLyBDaGVjayBpZiBFbnRlciBvciBTcGFjZSB3YXMgcHJlc3NlZFxuICAgIGlmIChcbiAgICAgIGV2ZW50LmtleSA9PT0gJ0VudGVyJyB8fFxuICAgICAgZXZlbnQua2V5ID09PSAnICcgfHxcbiAgICAgIGV2ZW50LmtleSA9PT0gJ1NwYWNlYmFyJ1xuICAgICkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsgLy8gUHJldmVudCBkZWZhdWx0IGFjdGlvbiAobGlrZSBzY3JvbGxpbmcgZm9yIHNwYWNlYmFyKVxuICAgICAgdGhpcy5hY2Nlc3NpYmlsaXR5U2VydmljZS50b2dnbGVXZWlzc0FjY2Vzc2liaWxpdHlDZW50ZXIodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG59XG4iXX0=