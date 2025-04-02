import { UserPayload } from "src/modules/auth/interfaces/user-payload.interface";

export interface RequestWithUser extends Request {
    user : UserPayload
}
