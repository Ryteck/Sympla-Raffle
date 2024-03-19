import valideAuthorizationFunction from "@/functions/valideAuthorization";
import SymplaService from "@/services/Sympla";

export const revalidate = 0;

interface Params {
	params: { id: string };
}

export async function GET(request: Request, { params }: Params) {
	const { symplaApiKey } = valideAuthorizationFunction();
	const symplaService = new SymplaService(symplaApiKey);
	const event = await symplaService.getEvent(params.id);
	return Response.json(event);
}
