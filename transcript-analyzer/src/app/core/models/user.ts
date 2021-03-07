export default class User {
    firstName!: string;
    lastName!: string;
    email!: string;

    get avatar(): UserAvatar | null {
        return this._avatar;
    }
    set avatar(a: UserAvatar | null) {
        this._avatar = a;
    }
    private _avatar!: UserAvatar | null;
}

export class UserAvatar {
    34?: string | null;
    48?: string | null;
    64?: string | null;
}
