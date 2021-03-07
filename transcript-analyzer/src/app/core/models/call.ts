export default interface Call {
    call_id: string;
    calltype_id: string;
    agent: {
        agent_id: string;
        channel_no: number;
    }[];
    customer: {
        full_name: string;
        channel_no: number;
    }[];
    call_start_time: Date;
    gs_file_url: string;
    duration: number;
}
