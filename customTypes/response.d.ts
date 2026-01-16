export interface Response {
    status?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
    message?:
        | 'CHANNEL_NOT_FOUND'
        | 'INVALID_INPUT'
        | 'MISSING_INPUT'
        | 'NO_PERMISSION'
        | 'NOT_FOUND'
        | 'NOT_A_MEMBER'
        | 'SOMETHING_WENT_WRONG'
        | 'UNAUTHORIZED'
        | 'USER_NOT_FOUND';
}
