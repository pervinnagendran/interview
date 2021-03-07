import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CoreModule } from 'src/app/core/core.module';


import { ROUTES } from './analyzer.routes';
import { CommonModule } from '@angular/common';
import AnalyzerComponent from './analyzer.component';
import { MatSliderModule } from '@angular/material/slider';

@NgModule({
    declarations: [
        AnalyzerComponent
    ],
    imports: [
        CommonModule,
        CoreModule,
        RouterModule.forChild(ROUTES),
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule,
        MatSelectModule,
        MatTableModule,
        MatTooltipModule,
        MatSliderModule
    ]
})
export class AnalyzerModule {}
