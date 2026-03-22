import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PapeleraPage } from './papelera.page';

describe('PapeleraPage', () => {
  let component: PapeleraPage;
  let fixture: ComponentFixture<PapeleraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PapeleraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
