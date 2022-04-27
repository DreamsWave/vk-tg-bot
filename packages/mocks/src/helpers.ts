import * as attachments from './attachments';

export const getAttachment = <T extends keyof typeof attachments, V extends keyof typeof attachments[T]>(type: T, variant: V): typeof attachments[T][V] => {
	return attachments[type][variant];
};
