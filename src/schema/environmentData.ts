import { z } from "zod";

const environmentDataSchema = z.object({
	TOKEN_SECRET: z.string(),
});

export default environmentDataSchema;

export type EnvironmentData = z.infer<typeof environmentDataSchema>;
