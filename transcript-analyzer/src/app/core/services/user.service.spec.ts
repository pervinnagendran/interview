import { TestBed } from '@angular/core/testing';
import UserService from './user.service';
import UserServiceMock from './mocks/user.service.mock';

describe('UserService', () => {
    let userService: UserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: UserService, useClass: UserServiceMock }
            ]
        });
        userService = TestBed.inject(UserService);
    });

    it('create an instance', () => {
        expect(userService).toBeTruthy();
    });

    it('should return the user who is logged in currently', (done: DoneFn) => {
        userService.getCurrentLoggedInUser().subscribe(
            user => {
                expect(user?.firstName).toEqual('Harvey');
                expect(user?.lastName).toEqual('Pekar');
                expect(user?.email).toEqual('harvey.pekar@crossover.com');
                done();
            });
    });

});
