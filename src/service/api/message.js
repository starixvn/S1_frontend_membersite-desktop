import { messageRequest } from "./base";

export const api_message_GetAnnouncement = langId =>
	messageRequest.post(`/GetAnnouncement/${langId}`);
