import { verifyToken } from "@/libs/token";
import type { TokenPayload } from "@/schema/tokenPayload";
import { headers } from "next/headers";

export default function valideAuthorizationFunction(): TokenPayload {
	const headersList = headers();

	const authorization = headersList.get("Authorization");

	if (authorization === null)
		throw new Error("Authorization not sent or empty");

	const authorizationParams = authorization.split(" ");

	if (authorizationParams.length !== 2)
		throw new Error("Poorly formatted authorization");

	const [prefix, token] = authorizationParams;

	if (prefix !== "Bearer")
		throw new Error("Authorization with incorrect format");

	return verifyToken(token);
}
