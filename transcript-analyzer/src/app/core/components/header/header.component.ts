import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import AutoUnsubscribe from '../../decorators/auto-usnsubscribe';
import User from '../../models/user';
import UserService from '../../services/user.service';

@Component({
    selector: 'app-gc-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
@AutoUnsubscribe()
export default class HeaderComponent implements OnInit {

    private userSubscription$: Subscription | null = null;

    get user(): User | null {
        return this._user;
    }
    private _user: User | null = null;

    constructor(
        private _userSvc: UserService
    ) {}

    ngOnInit(): void {
        this.userSubscription$ = this._userSvc.getCurrentLoggedInUser()
            .subscribe(
                u => console.log(u),
                e => console.error(e)
            );
    }
}
