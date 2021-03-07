import { ComponentFixture, TestBed } from '@angular/core/testing';
import AnalyzerComponent from './analyzer.component';
import AgentService from '../../../core/services/agent.service';
import AgentServiceMock from '../../../core/services/mocks/agent.service.mock';
import CallService from '../../../core/services/call.service';
import CallServiceMock from '../../../core/services/mocks/call.service.mock';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('AnalyzerComponent', () => {
    let fixture: ComponentFixture<AnalyzerComponent>;
    let component: AnalyzerComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                AnalyzerComponent
            ],
            imports: [
                FormsModule,
                ReactiveFormsModule
            ],
            providers: [
                { provide: AgentService, useClass: AgentServiceMock },
                { provide: CallService, useClass: CallServiceMock }
            ]
        }).compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(AnalyzerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('create an instance', () => {
        expect(component).toBeTruthy();
    });

    it('should load all the agents', (done: DoneFn) => {
        component.agents$.subscribe(
            agents => {
                expect(agents.length).toEqual(5);
                expect(agents[0].agent_id).toEqual('A7f63308a');
                expect(agents[1].agent_id).toEqual('7f63308ab');
                done();
            });
    });

    it('should load calls for a particular agent', (done: DoneFn) => {
        component.calls$.subscribe(
            calls => {
                expect(calls.length).toEqual(1);
                expect(calls[0].call_id).toEqual('572a41e7a');
                done();
            });
        component.form.controls.agent.setValue({ agent_id: 'A7f63308a' });
    });

    it('should load details of a call made by an agent', (done: DoneFn) => {
        component.agents$.subscribe();
        component.calls$.subscribe();
        component.form.controls.agent.setValue({ agent_id: 'A7f63308a' });
        component.form.controls.call.setValue({ call_id: '572a41e7a' });
        component.callDetails$.subscribe(
            callDetail => {
                expect(callDetail.call_id).toEqual('572a41e7a');
                expect(callDetail.agent[0].agent_id).toEqual('A7f63308a');
                expect(callDetail.customer[0].full_name).toEqual('Luke Skywalker');
                done();
            });
    });

});
