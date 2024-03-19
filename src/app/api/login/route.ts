import { eventResponseSchema } from "@/schema/event/response";

export async function POST(request: Request) {
	const { symplaApiKey } = await request.json();

	const url = new URL("https://api.sympla.com.br/public/v4/events");
	url.searchParams.append("page_size", "1");

	const response = await fetch(url, { headers: { S_TOKEN: symplaApiKey } });
	const eventResponse = eventResponseSchema.parse(await response.json());

	console.log(eventResponse);
	return Response.json({ message: "The Api Key is valid" });
}
