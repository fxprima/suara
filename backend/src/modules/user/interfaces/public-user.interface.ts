import { User } from './user.interface';

export type PublicUserFields = Pick<
    User,
    'id' | 'username' | 'email' | 'firstname' | 'lastname'
>;

export const publicUserSelect: { [K in keyof PublicUserFields]: true } = {
    id: true,
    username: true,
    email: true,
    firstname: true,
    lastname: true,
};
