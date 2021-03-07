import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import AGENTS_MOCK from './data/agents.json';
import Agent from '../../models/agent';

@Injectable()
export default class AgentServiceMock {

    /**
     * Get all the {@link Agent} from {@link AGENTS_MOCK}
     * @return Observable<Agent>
     */
    getAllAgents(): Observable<Agent[]> {
        return of(AGENTS_MOCK);
    }
}
