import { TestBed } from '@angular/core/testing';
import CallService from './call.service';
import CallServiceMock from './mocks/call.service.mock';

describe('CallService', () => {
    let callService: CallService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: CallService, useClass: CallServiceMock }
            ]
        });
        callService = TestBed.inject(CallService);
    });

    it('create an instance', () => {
        expect(callService).toBeTruthy();
    });

    it('should return list of all calls for a agent', (done: DoneFn) => {
        callService.getCallsById('A7f63308a').subscribe(
            calls => {
                expect(calls.length).toEqual(1);
                expect(calls[0].call_id).toEqual('572a41e7a');
                done();
            });
    });

    it('should return the detail for a call made by the agent', (done: DoneFn) => {
        callService.getCallDetailsById('572a41e7a').subscribe(
            callDetail => {
                expect(callDetail.call_id).toEqual('572a41e7a');
                expect(callDetail.agent[0].agent_id).toEqual('A7f63308a');
                expect(callDetail.customer[0].full_name).toEqual('Luke Skywalker');
                done();
            });
    });

});
