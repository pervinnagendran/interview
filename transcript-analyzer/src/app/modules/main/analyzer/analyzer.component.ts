import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    OnInit,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import {
    distinctUntilChanged,
    filter,
    finalize,
    map,
    shareReplay,
    startWith,
    switchMap,
    take,
    tap,
    withLatestFrom
} from 'rxjs/operators';
import AgentService from '../../../core/services/agent.service';
import CallService from '../../../core/services/call.service';
import TemplateService from 'src/app/core/services/template.service';
import Agent from '../../../core/models/agent';
import Call from '../../../core/models/call';
import CallDetail from '../../../core/models/call-detail';

@Component({
    selector: 'app-analyzer',
    templateUrl: './analyzer.component.html',
    styleUrls: ['./analyzer.component.scss'],
    providers: [
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                appearance: 'fill'
            }
        },
        {
            provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
            useValue: {
                position: 'above'
            }
        }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class AnalyzerComponent implements OnInit, AfterViewInit {
    @ViewChild('subHeader')
    subHeader?: TemplateRef<any>;

    private _form!: FormGroup;
    get form(): FormGroup {
        return this._form;
    }
    set form(formGroup: FormGroup) {
        this._form = formGroup;
    }

    readonly displayedColumns: string[];
    agents$!: Observable<Agent[]>;
    calls$!: Observable<Call[]>;
    source$!: BehaviorSubject<any>;
    callDetails$!: BehaviorSubject<CallDetail>;

    constructor(
        private readonly _tplService: TemplateService,
        private readonly _fb: FormBuilder,
        private readonly _agentService: AgentService,
        private readonly _callService: CallService
    ) {
        this.displayedColumns = [
            'time',
            'speaker',
            'sentence'
        ];
        this.source$ = new BehaviorSubject(null);
        this.callDetails$ = new BehaviorSubject({} as CallDetail);
    }

    ngOnInit(): void {
        this.initForm();
        this.initAgents();
        this.initCalls();
        this.initCallDetails();
        this.initSensitivity();
    }

    ngAfterViewInit(): void {
        this._tplService.register('subHeader', this.subHeader);
    }

    /**
     * Initializes the {@link FormGroup} to hold the selections
     */
    private initForm(): void {
        this.form = this._fb.group({
            agent: null,
            call: {
                value: null,
                disabled: true
            },
            sensitivity: 38
        });
    }

    /**
     * Initializes the {@link Agent} available for selection
     */
    private initAgents(): void {
        this.agents$ = this._agentService.getAllAgents()
            .pipe(shareReplay(1));
    }

    /**
     * Initializes the {@link Call} available for selection for a particular agent
     */
    private initCalls(): void {
        this.calls$ = this.form.controls.agent.valueChanges
            .pipe(
                distinctUntilChanged(),
                filter(agent => !!agent),
                switchMap((agent: Agent) =>
                    this._callService.getCallsById(agent.agent_id)
                        .pipe(
                            finalize(() => {
                                this.form.controls.call.reset();
                                this.form.controls.call.enable();
                                this.source$.next(null);
                                this.form.controls.sensitivity.reset(38, { emitEvent: false });
                            })
                        )));
    }

    /**
     * Initializes the {@link CallDetail} available for selection for a particular agent and call
     */
    private initCallDetails(): void {
        this.form.controls.call.valueChanges
            .pipe(
                filter(call => !!call),
                withLatestFrom(this.form.controls.agent.valueChanges.pipe(filter(agent => !!agent))),
                distinctUntilChanged(),
                switchMap(([call]) =>
                    this._callService.getCallDetailsById((call as Call).call_id)
                        .pipe(finalize(() => this.form.controls.sensitivity.reset(38, { emitEvent: false })))),
                tap(callDetail => this.callDetails$.next(callDetail ?? {} as CallDetail)))
            .subscribe();
    }

    /**
     * Process the {@link CallDetail} for the selected matching sensitivity
     */
    private initSensitivity(): void {
        const callDetails$ = this.callDetails$
            .pipe(
                tap(() => this.source$.next(null)),
                filter(callDetail => callDetail?.transcript?.length > 0));
        combineLatest([this.form.controls.sensitivity.valueChanges.pipe(startWith(38)), callDetails$])
            .pipe(
                switchMap(([sensitivity, callDetail]) => {
                    return this.agents$
                        .pipe(
                            map(agents => {
                                callDetail.transcript.forEach((t, index) => {
                                    t.match_info = this.getMatchInfo(callDetail.script, t.matching_sentence, t.similarity, sensitivity);
                                    t.speaker = this.getSpeaker(callDetail, agents, index);
                                });
                                return callDetail;
                            }));
                }),
                map(callDetail => ({
                    real: this.getMatchPercent(callDetail.transcript, 'match_info'),
                    expected: this.getMatchPercent(callDetail.script, 'matching_sentence'),
                    transcripts: new MatTableDataSource(callDetail.transcript ?? []),
                    scripts: new MatTableDataSource(callDetail.script ?? [])
                })),
                tap(source => this.source$.next(source)))
            .subscribe();
    }

    /**
     * Get Information on match for a sentence in comparison with the scripts
     * @param script - Script for a Call
     * @param match - Matching Sentence
     * @param similarity - Percentile of similarity with the script
     * @param sensitivity - Matching sensitivity
     * @return string
     */
    private getMatchInfo(script: any[], match: string, similarity: number, sensitivity: number): string {
        if (match && similarity && ((similarity * 100) >= sensitivity)) {
            const index = script.findIndex(d => d.sentence === match);
            if (index !== -1) {
                return `${similarity * 100}% matching with line #${index + 1} "${match}"`;
            }
        }
        return '';
    }

    /**
     * Get name of the speaker for all channels in the Transcript
     * @param callDetail - Call Detail for which speaker should be initialized
     * @param agents - All the agents available
     * @param index - Index of the current Transcript
     * @return string
     */
    private getSpeaker(callDetail: CallDetail, agents: Agent[], index: number): string {
        const [current, prev] = [callDetail.transcript[index], callDetail.transcript[index - 1]];
        if (prev?.channel === current.channel) {
            return '';
        }
        const customer = callDetail.customer.find(c => c.channel_no === current.channel);
        if (customer) {
            return customer.full_name.split(/\s/)[0];
        }
        const agent = callDetail.agent.find(a => a.channel_no === current.channel);
        return agents.find(a => a.agent_id === agent?.agent_id)?.full_name.split(/\s/)[0] ?? 'Unknown';
    }

    /**
     * Get percentile of match for Transcript and Script
     * @param scripts - Script\Transcript to calculate the real and expected match
     * @param prop - Property name to check for match
     * @return number
     */
    private getMatchPercent(scripts: any[], prop: string): number {
        return Math.floor((scripts.reduce((count, script) => !!script[prop] ? count + 1 : count, 0) / scripts.length) * 100);
    }

    /**
     * Select the matching script when hovered on the matching transcript
     * @param match - Matching Sentence
     */
    selectMatch(match?: string): void {
        this.source$.asObservable()
            .pipe(
                map(source => {
                    match
                        ? source.scripts.data.forEach((d: { sentence: string; isHovered: boolean; }) => {
                            if (d.sentence === match) {
                                d.isHovered = true;
                                return;
                            }
                        })
                        : source.scripts.data.forEach((d: { isHovered: boolean; }) => d.isHovered = false);
                    return source;
                }),
                take(1))
            .subscribe();
    }

    /**
     * Check whether a sentence falls under the match sensitivity and has any matches from script
     * @param match - Matching Sentence
     * @param similarity - Similarity with the script
     */
    hasMatch = (match: string, similarity: number): boolean => !!match && (similarity * 100) >= this.form.controls.sensitivity.value;

    /**
     * Get concatenated customer name from the Call
     * @param call - Call of a particular agent
     */
    getCustomerName = (call: Call): string => call.customer.map(c => c.full_name).join(', ');

}
