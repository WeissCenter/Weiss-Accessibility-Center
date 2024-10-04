// a11y-trigger.directive.ts
import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  HostListener,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { WeissAccessibilityCenterService } from './weiss-accessibility-center.service';
import { Subscription } from 'rxjs';
@Directive({
  selector: '[weissA11yToggle]',
})
export class WeissAccessibilityToggleDirective implements OnInit, OnDestroy {
  @Input('weissA11yToggle') targetId: string = 'weissAccessibilityCenter';

  private ariaExpanded: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private accessibilityService: WeissAccessibilityCenterService
  ) {}

  ngOnInit() {
    // Set necessary ARIA attributes
    this.renderer.setAttribute(
      this.el.nativeElement,
      'aria-controls',
      this.targetId
    );
    this.renderer.setAttribute(this.el.nativeElement, 'aria-expanded', 'false');
    this.renderer.setAttribute(this.el.nativeElement, 'aria-haspopup', 'true');
    // If no id on the button, set one
    if (!this.el.nativeElement.id) {
      this.renderer.setAttribute(
        this.el.nativeElement,
        'id',
        'weiss-a11y-toggle'
      );
    }

    // Ensure the element is focusable if it's not inherently focusable
    this.makeElementFocusable();

    // Subscribe to the widget visibility observable to update 'aria-expanded'
    this.subscription =
      this.accessibilityService.showWeissAccessibilityCenter$.subscribe(
        (visible) => {
          this.ariaExpanded = visible;
          this.renderer.setAttribute(
            this.el.nativeElement,
            'aria-expanded',
            String(this.ariaExpanded)
          );
          if (visible) {
            this.renderer.addClass(this.el.nativeElement, 'weiss-a11y-active');
          } else {
            this.renderer.removeClass(this.el.nativeElement, 'weiss-a11y-active');
          }
        }
      );
  }

  // Ensure the element is focusable
  private makeElementFocusable() {
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

  @HostListener('click', ['$event.target'])
  onClick(target: HTMLElement) {

    // Toggle the widget visibility
    this.accessibilityService.toggleWeissAccessibilityCenter(target);
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Check if Enter or Space was pressed
    if (
      event.key === 'Enter' ||
      event.key === ' ' ||
      event.key === 'Spacebar'
    ) {
      event.preventDefault(); // Prevent default action (like scrolling for spacebar)
      this.accessibilityService.toggleWeissAccessibilityCenter(this.el.nativeElement);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
