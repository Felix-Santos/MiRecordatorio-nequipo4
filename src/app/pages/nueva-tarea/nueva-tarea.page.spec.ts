import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuevaTareaPage } from './nueva-tarea.page';

describe('NuevaTareaPage', () => {
  let component: NuevaTareaPage;
  let fixture: ComponentFixture<NuevaTareaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaTareaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
