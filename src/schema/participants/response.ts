import { z } from "zod";
import participantSchema from ".";
import { paginationSchema } from "../pagination";

export const participantResponseSchema = z.object({
	data: participantSchema.array(),
	// sort: z.object({
	// 	field_sort: z.string(),
	// 	sort: z.string(),
	// }),
	pagination: paginationSchema,
});

export type ParticipantResponse = z.infer<typeof participantResponseSchema>;
