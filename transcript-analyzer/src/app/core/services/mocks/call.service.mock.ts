import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import CALLS_MOCK from './data/calls.json';
import CALL_DETAILS_MOCK from './data/call-details.json';
import Call from '../../models/call';
import CallDetail from '../../models/call-detail';

@Injectable()
export default class CallServiceMock {

    /**
     * Get all the {@link Call} from {@link CALLS_MOCK}
     * @param agentId - Agent Id
     * @return Observable<Call[]>
     */
    getCallsById(agentId: string): Observable<Call[]> {
        return of(CALLS_MOCK)
            .pipe(
                map(calls => calls.filter((call: Call) => call.agent.some(a => a.agent_id === agentId))),
                map((calls => calls.sort((a: Call,  b: Call) =>
                    new Date(a.call_start_time).getTime() - new Date(b.call_start_time).getTime()))),
                shareReplay(1));
    }

    /**
     * Get the {@link CallDetail} from {@link CALL_DETAILS_MOCK}
     * @param callId - Call Id
     * @return Observable<CallDetail>
     */
    getCallDetailsById(callId: string): Observable<CallDetail> {
        return of(CALL_DETAILS_MOCK)
            .pipe(
                map(callDetails => callDetails.find((callDetail: CallDetail) => callDetail.call_id === callId)),
                shareReplay(1));
    }

}
