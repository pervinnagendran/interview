import { TestBed } from '@angular/core/testing';
import AgentService from './agent.service';
import AgentServiceMock from './mocks/agent.service.mock';

describe('AgentService', () => {
    let agentService: AgentService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: AgentService, useClass: AgentServiceMock }
            ]
        });
        agentService = TestBed.inject(AgentService);
    });

    it('create an instance', () => {
        expect(agentService).toBeTruthy();
    });

    it('should return list of all agents', (done: DoneFn) => {
        agentService.getAllAgents().subscribe(
            agents => {
                expect(agents.length).toEqual(5);
                expect(agents[0].agent_id).toEqual('A7f63308a');
                expect(agents[1].agent_id).toEqual('7f63308ab');
                done();
            });
    });

});
