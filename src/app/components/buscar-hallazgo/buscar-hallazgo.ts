import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Optional } from '@angular/core';
import { HallazgosListaComponent } from '../hallazgos-lista/hallazgos-lista.component';

@Component({
  selector: 'app-buscar-hallazgo',
  imports: [CommonModule,
      HallazgosListaComponent,
      MatButtonModule,
      MatIconModule],
  templateUrl: './buscar-hallazgo.html',
  styleUrl: './buscar-hallazgo.css'
})
export class BuscarHallazgo {
   constructor(
    @Optional() public dialogRef: MatDialogRef<BuscarHallazgo>,
  ) {}

  cerrarDialogo() {
    this.dialogRef.close();
  }
}
