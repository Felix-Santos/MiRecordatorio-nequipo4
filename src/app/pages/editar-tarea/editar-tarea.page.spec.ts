import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarTareaPage } from './editar-tarea.page';

describe('EditarTareaPage', () => {
  let component: EditarTareaPage;
  let fixture: ComponentFixture<EditarTareaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarTareaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
