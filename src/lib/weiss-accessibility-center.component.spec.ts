import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { WeissAccessibilityCenterComponent } from './weiss-accessibility-center.component';
import { WeissAccessibilityCenterService } from './weiss-accessibility-center.service';

describe('WeissAccessibilityCenterComponent', () => {
  let component: WeissAccessibilityCenterComponent;
  let fixture: ComponentFixture<WeissAccessibilityCenterComponent>;
  let service: WeissAccessibilityCenterService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeissAccessibilityCenterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeissAccessibilityCenterComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(WeissAccessibilityCenterService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('focuses the panel heading when panel mode opens', fakeAsync(() => {
    component.displayType = 'panel';
    component.setupOptions();
    fixture.detectChanges();

    const trigger = document.createElement('button');
    document.body.appendChild(trigger);

    service.toggleWeissAccessibilityCenter(trigger);
    tick();
    fixture.detectChanges();

    const heading = fixture.nativeElement.querySelector('[data-weiss-initial-focus="true"]') as HTMLElement;

    expect(heading).toBeTruthy();
    expect(heading.id).toBe('accessibilityCenterTitle');
    expect(document.activeElement).toBe(heading);

    trigger.remove();
  }));

  it('focuses the first strip action when strip mode opens', fakeAsync(() => {
    component.displayType = 'strip';
    component.setupOptions();
    fixture.detectChanges();

    const trigger = document.createElement('button');
    document.body.appendChild(trigger);

    service.toggleWeissAccessibilityCenter(trigger);
    tick();
    fixture.detectChanges();

    const initialAction = fixture.nativeElement.querySelector('[data-weiss-initial-focus="true"]') as HTMLElement;
    const closeButton = fixture.nativeElement.querySelector('.weiss-accessibility-center-strip > button') as HTMLElement;

    expect(initialAction).toBeTruthy();
    expect(initialAction).not.toBe(closeButton);
    expect(document.activeElement).toBe(initialAction);

    trigger.remove();
  }));
});
