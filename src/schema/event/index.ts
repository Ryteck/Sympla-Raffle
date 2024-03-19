import { z } from "zod";

const eventSchema = z.object({
	id: z.number(),
	start_date: z.string(),
	end_date: z.string(),
	name: z.string(),
	detail: z.string(),
	// private_event: z.number(),
	// published: z.number(),
	// cancelled: z.number(),
	image: z.string(),
	url: z.string(),
	// address: z.object({
	// 	name: z.string(),
	// 	address: z.string().nullish(),
	// 	address_num: z.string().nullish(),
	// 	address_alt: z.string().nullish(),
	// 	neighborhood: z.string().nullish(),
	// 	city: z.string(),
	// 	state: z.string().nullish(),
	// 	zip_code: z.string().nullish(),
	// 	country: z.string().nullish(),
	// 	lon: z.number().nullish(),
	// 	lat: z.number().nullish(),
	// }),
	// host: z.object({
	// 	name: z.string(),
	// 	description: z.string(),
	// }),
	// category_prim: z.object({
	// 	name: z.string(),
	// }),
	// category_sec: z.object({
	// 	name: z.string().nullish(),
	// }),
});

export default eventSchema;

export type Event = z.infer<typeof eventSchema>;
