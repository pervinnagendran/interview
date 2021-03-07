export default interface CallDetail {
    call_id: string;
    file_url: string;
    calltype_id: string;
    call_datetime: Date;
    duration: number;
    agent: {
        agent_id: string;
        channel_no: number;
    }[];
    customer: {
        full_name: string;
        channel_no: number;
    }[];
    script: {
        order: number;
        similarity: number;
        sentence: string;
        matching_sentence?: string;
        isHovered?: boolean;
    }[];
    transcript: {
        order: number;
        similarity: number;
        sentence: string;
        matching_sentence: string;
        channel: number;
        timeFrom: number;
        timeTo: number;
        speaker?: string;
        match_info?: string;
    }[];
}
