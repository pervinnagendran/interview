import { Injectable } from '@angular/core';
import AgentServiceMock from './mocks/agent.service.mock';

@Injectable({
    providedIn: 'root'
})
export default class AgentService extends AgentServiceMock {}
