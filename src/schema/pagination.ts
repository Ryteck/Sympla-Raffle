import { z } from "zod";

export const paginationSchema = z.object({
	has_next: z.boolean(),
	has_prev: z.boolean(),
	quantity: z.number(),
	offset: z.number(),
	page: z.number(),
	page_size: z.number(),
	total_page: z.number(),
	// hits: z.number(),
});
