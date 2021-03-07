import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';

import { CoreModule } from '../../core.module';

import { UserModule } from '../../modules/user.module';

import HeaderComponent from './header.component';

@NgModule({
    declarations: [
        HeaderComponent
    ],
    imports: [
        MatButtonModule,
        MatToolbarModule,
        MatPaginatorModule,

        CoreModule,

        UserModule
    ],
    exports: [
        HeaderComponent
    ]
})
export default class HeaderModule {}
