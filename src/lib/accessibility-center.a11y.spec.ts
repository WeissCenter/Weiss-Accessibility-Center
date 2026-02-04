import { WeissAccessibilityCenterComponent } from './weiss-accessibility-center.component';
import { BehaviorSubject } from 'rxjs';

describe('Accessibility live announcements (logic)', () => {
  it('resetStatusMessage default and statusMessage update', () => {
    const serviceStub: any = {
      showWeissAccessibilityCenter$: new BehaviorSubject<boolean>(true).asObservable(),
      targetId$: new BehaviorSubject<string>('weiss-accessibility-center').asObservable(),
      weissAccessibilityFontSizes: [{ name: 'Default', value: 'default' }],
      weissAccessibilityThemes: [{ name: 'Default', value: 'default' }],
      weissAccessibilitySpacing: [{ name: 'Default', value: 'default' }],
      weissAccessibilityLayouts: [{ name: 'Default', value: 'default' }],
    };
    const rendererStub: any = {
      setAttribute: jest.fn(),
    };

    const component = new WeissAccessibilityCenterComponent(serviceStub, rendererStub);

    // Default reset message
    expect(component.resetStatusMessage).toBe('All settings have been reset to default.');

    // Simulate emission from child
    component.onStatusMessageChange(component.resetStatusMessage);
    expect(component.statusMessage).toBe('All settings have been reset to default.');
  });
});