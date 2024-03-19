import valideAuthorizationFunction from "@/functions/valideAuthorization";
import type { Event } from "@/schema/event";
import SymplaService from "@/services/Sympla";

export const revalidate = 0;

export async function GET() {
	const { symplaApiKey } = valideAuthorizationFunction();
	const symplaService = new SymplaService(symplaApiKey);

	const events: Event[] = [];

	let page = 1;

	while (true) {
		const eventResponse = await symplaService.getEvents({
			page: page++,
		});

		events.push(...eventResponse.data);

		if (!eventResponse.pagination.has_next) break;
	}

	return Response.json(events);
}
