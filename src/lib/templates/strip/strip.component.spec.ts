import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripComponent } from './strip.component';

describe('StripComponent', () => {
  let component: StripComponent;
  let fixture: ComponentFixture<StripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StripComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
