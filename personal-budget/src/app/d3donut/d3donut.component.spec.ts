import { ComponentFixture, TestBed } from '@angular/core/testing';

import { D3donutComponent } from './d3donut.component';

describe('D3donutComponent', () => {
  let component: D3donutComponent;
  let fixture: ComponentFixture<D3donutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ D3donutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(D3donutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
