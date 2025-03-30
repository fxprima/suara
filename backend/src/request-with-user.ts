export interface RequestWithUser extends Request {
    user : {
        id: string;
        username: string;
        email: string;
    }
}
