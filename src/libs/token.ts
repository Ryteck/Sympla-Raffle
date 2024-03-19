import type { TokenPayload } from "@/schema/tokenPayload";
import tokenPayloadSchema from "@/schema/tokenPayload";
import EnvironmentService from "@/services/Environment";
import { sign, verify } from "jsonwebtoken";

const environmentService = new EnvironmentService();
const { TOKEN_SECRET } = environmentService.getData();

export const generateToken = (payload: TokenPayload): string =>
	sign(payload, TOKEN_SECRET);

export const verifyToken = (token: string): TokenPayload =>
	tokenPayloadSchema.parse(verify(token, TOKEN_SECRET));
