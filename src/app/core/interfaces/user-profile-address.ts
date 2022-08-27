import { UserProfile } from './user-profile';

export interface UserProfileAddress {
	address: string;
	profile: UserProfile|null|undefined;
}