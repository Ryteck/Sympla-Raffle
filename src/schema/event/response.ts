import { z } from "zod";
import eventSchema from ".";

export const eventResponseSchema = z.object({
	data: eventSchema.array(),
	sort: z.object({
		field_sort: z.string(),
		sort: z.string(),
	}),
	pagination: z.object({
		has_next: z.boolean(),
		has_prev: z.boolean(),
		quantity: z.number(),
		offset: z.number(),
		page: z.number(),
		page_size: z.number(),
		total_page: z.number(),
		hits: z.number(),
	}),
});
