import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpicsListComponent } from './epics-list.component';

describe('EpicsListComponent', () => {
  let component: EpicsListComponent;
  let fixture: ComponentFixture<EpicsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EpicsListComponent]
    });
    fixture = TestBed.createComponent(EpicsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
