import { generateToken } from "@/libs/token";
import SymplaService from "@/services/Sympla";

export async function POST(request: Request) {
	const body = await request.json();
	const symplaApiKey = String(body.symplaApiKey);
	const symplaService = new SymplaService(symplaApiKey);
	await symplaService.getEvents({ pageSize: 1 });
	const token = generateToken({ symplaApiKey });
	return Response.json({ token });
}
