import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Optional } from '@angular/core';
import { HallazgoFormComponent } from '../components/hallazgo-form/hallazgo-form.component';


@Component({
  selector: 'app-hallazgo-dialog',
  imports: [ CommonModule,
    HallazgoFormComponent,
    MatButtonModule,
    MatIconModule],
  templateUrl: './hallazgo-dialog.html',
  styleUrl: './hallazgo-dialog.css'
})
export class HallazgoDialog {
  constructor(
    @Optional() public dialogRef: MatDialogRef<HallazgoDialog>
  ) {}

  cerrarDialogo() {
    this.dialogRef.close();
  }
}




