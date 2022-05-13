import { UserInterface } from '@verto/js/dist/common/faces';

export interface UserProfile {
	address: string;
	profile: UserInterface|null|undefined;
}