import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';
import { TimeIntervalPipe } from './pipes/time-interval/time-interval.pipe';

@NgModule({
    declarations: [
        TimeIntervalPipe
    ],
    imports: [
        CommonModule,
        FlexModule
    ],
    exports: [
        CommonModule,
        FlexModule,
        TimeIntervalPipe
    ]
})
export class CoreModule {}
