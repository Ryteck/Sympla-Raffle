import { z } from "zod";
import eventSchema from ".";
import { paginationSchema } from "../pagination";

export const eventResponseSchema = z.object({
	data: eventSchema.array(),
	// sort: z.object({
	// 	field_sort: z.string(),
	// 	sort: z.string(),
	// }),
	pagination: paginationSchema,
});

export type EventResponse = z.infer<typeof eventResponseSchema>;
