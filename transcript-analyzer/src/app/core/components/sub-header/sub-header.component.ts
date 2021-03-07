import { AfterViewInit, Component, TemplateRef } from '@angular/core';

import TemplateService from '../../services/template.service';

@Component({
    selector: 'app-gc-sub-header',
    templateUrl: './sub-header.component.html',
    styleUrls: ['./sub-header.component.scss']
})
export default class SubHeaderComponent implements AfterViewInit {

    get content(): TemplateRef<any> | null {
        return this._tplService.get('subHeader') || null;
    }
    readonly _content?: TemplateRef<any> | null;

    constructor(private _tplService: TemplateService) {
        console.log(this._content);
    }

    ngAfterViewInit(): void {
        console.log(this._content);
    }

    // TODO: Implement logic
}
