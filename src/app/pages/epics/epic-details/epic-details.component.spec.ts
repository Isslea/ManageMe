import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpicDetailsComponent } from './epic-details.component';

describe('EpicDetailsComponent', () => {
  let component: EpicDetailsComponent;
  let fixture: ComponentFixture<EpicDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EpicDetailsComponent]
    });
    fixture = TestBed.createComponent(EpicDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
