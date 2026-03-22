import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-tarea',
  templateUrl: './editar-tarea.page.html',
  styleUrls: ['./editar-tarea.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EditarTareaPage implements OnInit {

  tarea: any;

  tareas = [
    {
      title: "Preparar presentación",
      date: "25/05/2022",
      status: "Pendiente",
      priority: "Alta",
      completed: false
    },
    {
      title: "Estudiar Ionic",
      date: "26/05/2022",
      status: "Pendiente",
      priority: "Media",
      completed: false
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.tarea = this.tareas[Number(id)];
  }

}