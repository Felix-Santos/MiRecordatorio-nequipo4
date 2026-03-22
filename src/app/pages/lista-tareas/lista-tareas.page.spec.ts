import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaTareasPage } from './lista-tareas.page';

describe('ListaTareasPage', () => {
  let component: ListaTareasPage;
  let fixture: ComponentFixture<ListaTareasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaTareasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
