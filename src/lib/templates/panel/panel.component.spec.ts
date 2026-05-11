import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelComponent } from './panel.component';
import { PanelData } from '../../weiss-accessibility-center.interfaces';

describe('PanelComponent', () => {
  let component: PanelComponent;
  let fixture: ComponentFixture<PanelComponent>;
  const panelData: PanelData = {
    title: 'Accessibility settings',
    description: 'Adjust the settings below.',
    position: 'end',
    modules: {
      fontSize: {
        title: 'Text size',
        description: 'Adjust text size.',
        data: [{ name: 'Default', value: 'default' }],
      },
      theme: {
        title: 'Color theme',
        description: 'Adjust color theme.',
        data: [{ name: 'Default', value: 'default' }],
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens an accordion section when its heading button is clicked', () => {
    component.data = panelData;
    component.ngOnInit();
    fixture.detectChanges();

    const root: HTMLElement = fixture.nativeElement;
    const button = root.querySelector(
      'button[aria-controls="accessibilityText"]'
    ) as HTMLButtonElement;
    const content = root.querySelector('#accessibilityText') as HTMLElement;

    expect(button).toBeTruthy();
    expect(content.hidden).toBe(true);

    button.click();
    fixture.detectChanges();

    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(content.hidden).toBe(false);
  });

  it('closes other accordion sections unless multi-select is enabled', () => {
    component.data = panelData;
    component.ngOnInit();

    component.toggleSection('fontSize');
    component.toggleSection('theme');

    expect(component.expand.fontSize).toBe(false);
    expect(component.expand.theme).toBe(true);
  });
});
