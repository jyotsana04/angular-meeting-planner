import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplemodalComponent } from './samplemodal.component';

describe('SamplemodalComponent', () => {
  let component: SamplemodalComponent;
  let fixture: ComponentFixture<SamplemodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamplemodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplemodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
