import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Horario } from '../../../models/horario';
import { HorarioService } from '../../../services/horario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-detail-horario',
  templateUrl: './detail-horario.component.html',
  styleUrl: './detail-horario.component.css'
})
export class DetailHorarioComponent {
  detalleFormGroup!:FormGroup;
  id:number=0;

  constructor (private servicioHorario: HorarioService, private formBuilder:FormBuilder,
               private enrutador: Router, private _snackBar: MatSnackBar, private ruta:ActivatedRoute) {};
  
  ngOnInit(){
    this.crearFormGrup();
    this.id = this.ruta.snapshot.params["id"];
    if (this.id!=0 && this.id!=undefined) {
      this.servicioHorario.getHorario(this.id).subscribe({
        next: (data:Horario)=>{
          this.detalleFormGroup.get("id")?.setValue(data.id);
          this.detalleFormGroup.get("dia")?.setValue(data.dia);
          this.detalleFormGroup.get("horaInicio")?.setValue(data.horaInicio);
          this.detalleFormGroup.get("horaFin")?.setValue(data.horaFin);
        },
        error:(err)=>{
          console.log(err);
        }
      })
    } else {
      this.id=0;
    }
  }

  crearFormGrup(){
    this.detalleFormGroup = this.formBuilder.group({
      id:[""],
      dia:["",[Validators.required,Validators.minLength(5)]],
      horaInicio:[""],
      horaFin:[""]
    });
  }

  grabarCurso(){
    const nuevoHorario:Horario={
      id: parseInt(this.detalleFormGroup.get("id")!.value),
      dia: this.detalleFormGroup.get("dia")!.value,
      horaInicio: this.detalleFormGroup.get("horaInicio")!.value,
      horaFin: this.detalleFormGroup.get("horaFin")!.value
    };
    this.servicioHorario.postHorario(nuevoHorario).subscribe({
      next:(data:Horario) => {
        console.log(data);
            this._snackBar.open("El horario se grabó","OK",{duration: 1000});
            this.enrutador.navigate(["/list-horario"]);
        },
        error:(err) => {
        this._snackBar.open(err.error.message,"OK",{duration: 2000});        
        console.log(err);

      }
    });
  }
}
