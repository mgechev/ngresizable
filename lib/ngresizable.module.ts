import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgResizableComponent } from './ngresizable.component';

@NgModule({
  imports: [CommonModule],
  declarations: [NgResizableComponent],
  exports: [NgResizableComponent]
})
export class NgResizableModule {}
