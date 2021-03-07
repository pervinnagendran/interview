import { Injectable } from '@angular/core';

import UserServiceMock from './mocks/user.service.mock';

@Injectable()
export default class UserService extends UserServiceMock {}
