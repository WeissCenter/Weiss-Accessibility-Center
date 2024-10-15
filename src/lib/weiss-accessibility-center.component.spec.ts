import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeissAccessibilityCenterComponent } from './weiss-accessibility-center.component';

describe('WeissAccessibilityCenterComponent', () => {
  let component: WeissAccessibilityCenterComponent;
  let fixture: ComponentFixture<WeissAccessibilityCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeissAccessibilityCenterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeissAccessibilityCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
