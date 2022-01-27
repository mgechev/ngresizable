import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgResizableComponent } from './ngresizable.component';

describe('NgResizableComponent', () => {
  let component: NgResizableComponent;
  let fixture: ComponentFixture<NgResizableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgResizableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgResizableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
