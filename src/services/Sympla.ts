import type { Event } from "@/schema/event";
import eventSchema from "@/schema/event";
import {
	type EventResponse,
	eventResponseSchema,
} from "@/schema/event/response";
import {
	type ParticipantResponse,
	participantResponseSchema,
} from "@/schema/participants/response";

interface GetEventsArgs {
	pageSize: number;
	page: number;
}

export default class SymplaService {
	private readonly baseUrl: string = "https://api.sympla.com.br/public/";

	constructor(private readonly symplaApiKey: string) {}

	async getEvents(args?: Partial<GetEventsArgs>): Promise<EventResponse> {
		const url = new URL("v4/events", this.baseUrl);

		url.searchParams.append("sort", "DESC");
		url.searchParams.append("page_size", String(args?.pageSize ?? "200"));

		if (args?.page) {
			url.searchParams.append("page", String(args.page));
		}

		const bruteEventResponse = await fetch(url, {
			headers: { S_TOKEN: this.symplaApiKey },
		});

		const eventResponseBody = await bruteEventResponse.json();
		return eventResponseSchema.parse(eventResponseBody);
	}

	async getEvent(eventId: string): Promise<Event> {
		const url = new URL(`v4/events/${eventId}`, this.baseUrl);

		const bruteEventResponse = await fetch(url, {
			headers: { S_TOKEN: this.symplaApiKey },
		});

		const eventResponseBody = await bruteEventResponse.json();

		return eventSchema.parse(eventResponseBody.data);
	}

	async getParticipants(
		eventId: string,
		page: number,
	): Promise<ParticipantResponse> {
		const url = new URL(`v3/events/${eventId}/participants`, this.baseUrl);

		url.searchParams.append("page_size", "200");
		url.searchParams.append("page", String(page));

		const bruteParticipantsResponse = await fetch(url, {
			headers: { S_TOKEN: this.symplaApiKey },
		});

		const participantsResponseBody = await bruteParticipantsResponse.json();
		return participantResponseSchema.parse(participantsResponseBody);
	}
}
