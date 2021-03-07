import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

import { CoreModule } from '../../core.module';

import { UserModule } from '../../modules/user.module';

import SubHeaderComponent from './sub-header.component';

@NgModule({
    declarations: [
        SubHeaderComponent
    ],
    imports: [
        MatButtonModule,
        MatToolbarModule,

        CoreModule,

        UserModule
    ],
    exports: [
        SubHeaderComponent
    ]
})
export default class SubHeaderModule {}
