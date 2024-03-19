import { z } from "zod";

const tokenPayloadSchema = z.object({
	symplaApiKey: z.string(),
});

export default tokenPayloadSchema;

export type TokenPayload = z.infer<typeof tokenPayloadSchema>;
