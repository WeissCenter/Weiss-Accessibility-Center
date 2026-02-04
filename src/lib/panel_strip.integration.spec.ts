import { TestBed } from '@angular/core/testing';
import { WeissAccessibilityCenterService } from './weiss-accessibility-center.service';
import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Input, Output, PLATFORM_ID, Renderer2, Inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

describe('Panel/Strip reset integration', () => {
  @Component({
    selector: 'weiss-accessibility-panel',
    standalone: true,
    template: `
      <button class="panel-reset" type="button"
        (click)="weissAccessibilityCenterService.resetSettings(); statusMessageChange.emit(resetStatusMessage)">
        Reset all settings
      </button>
    `,
  })
  class MockPanelComponent {
    @Input() data: any;
    @Input() closeLabel?: string;
    @Input() resetAllLabel?: string;
    @Input() resetStatusMessage?: string;
    @Output() statusMessageChange = new EventEmitter<string>();
    constructor(@Inject(WeissAccessibilityCenterService) public weissAccessibilityCenterService: any) {}
  }

  @Component({
    selector: 'weiss-accessibility-strip',
    standalone: true,
    template: `
      <button class="strip-reset" type="button"
        (click)="weissAccessibilityCenterService.resetSettings(); statusMessageChange.emit(resetStatusMessage)">
        Reset
      </button>
    `,
  })
  class MockStripComponent {
    @Input() data: any;
    @Input() closeLabel?: string;
    @Input() resetLabel?: string;
    @Input() resetStatusMessage?: string;
    @Output() statusMessageChange = new EventEmitter<string>();
    constructor(@Inject(WeissAccessibilityCenterService) public weissAccessibilityCenterService: any) {}
  }

  @Component({
    selector: 'host-a11y-test',
    standalone: true,
    imports: [MockPanelComponent, MockStripComponent],
    template: `
      <div>
        <weiss-accessibility-panel [resetStatusMessage]="defaultMsg" (statusMessageChange)="statusMessage = $event"></weiss-accessibility-panel>
        <weiss-accessibility-strip [resetStatusMessage]="defaultMsg" (statusMessageChange)="statusMessage = $event"></weiss-accessibility-strip>
        <div id="statusMessage" aria-live="polite" role="status" aria-atomic="true">{{ statusMessage }}</div>
      </div>
    `,
  })
  class HostA11yTestComponent {
    defaultMsg = 'All settings have been reset to default.';
    statusMessage = '';
  }

  beforeEach(async () => {
    class MockWeissService {
      resetSettings(): void {}
    }
    await TestBed.configureTestingModule({
      imports: [BrowserModule, HostA11yTestComponent],
      providers: [
        { provide: DOCUMENT, useValue: document },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: WeissAccessibilityCenterService, useClass: MockWeissService },
      ],
    }).compileComponents();
  });

  it('announces reset via live region in panel view', () => {
    const fixture = TestBed.createComponent(HostA11yTestComponent);
    fixture.detectChanges();

    const root: HTMLElement = fixture.debugElement.nativeElement;
    const btn = root.querySelector('button.panel-reset') as HTMLButtonElement;
    expect(btn).toBeTruthy();

    btn.click();
    fixture.detectChanges();

    const liveRegion = root.querySelector('#statusMessage') as HTMLElement;
    expect(liveRegion).toBeTruthy();
    expect(liveRegion.getAttribute('aria-live')).toBe('polite');
    expect(liveRegion.getAttribute('role')).toBe('status');
    expect(liveRegion.getAttribute('aria-atomic')).toBe('true');
    expect(liveRegion.textContent?.trim()).toBe('All settings have been reset to default.');
  });

  it('announces reset via live region in strip view', () => {
    const fixture = TestBed.createComponent(HostA11yTestComponent);
    fixture.detectChanges();

    const root: HTMLElement = fixture.debugElement.nativeElement;
    const btn = root.querySelector('button.strip-reset') as HTMLButtonElement;
    expect(btn).toBeTruthy();

    btn.click();
    fixture.detectChanges();

    const liveRegion = root.querySelector('#statusMessage') as HTMLElement;
    expect(liveRegion).toBeTruthy();
    expect(liveRegion.textContent?.trim()).toBe('All settings have been reset to default.');
  });
});