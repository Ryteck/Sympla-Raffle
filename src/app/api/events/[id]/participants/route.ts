import valideAuthorizationFunction from "@/functions/valideAuthorization";
import type { Participant } from "@/schema/participants";
import SymplaService from "@/services/Sympla";

export const revalidate = 0;

interface Params {
	params: { id: string };
}

export async function GET(request: Request, { params }: Params) {
	const { symplaApiKey } = valideAuthorizationFunction();
	const symplaService = new SymplaService(symplaApiKey);

	const participants: Participant[] = [];

	let page = 1;

	while (true) {
		const participantsResponse = await symplaService.getParticipants(
			params.id,
			page++,
		);

		participants.push(...participantsResponse.data);

		if (!participantsResponse.pagination.has_next) break;
	}

	return Response.json(participants);
}
