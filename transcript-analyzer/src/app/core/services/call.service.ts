import { Injectable } from '@angular/core';
import CallServiceMock from './mocks/call.service.mock';

@Injectable({
    providedIn: 'root'
})
export default class CallService extends CallServiceMock {}
