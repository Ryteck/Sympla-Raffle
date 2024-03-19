import { z } from "zod";

const participantSchema = z.object({
	id: z.number(),
	// event_id: z.number(),
	// order_id: z.string(),
	// order_status: z.string(),
	// order_date: z.string(),
	// order_updated_date: z.string(),
	// order_approved_date: z.string(),
	// order_discount: z.null(),
	// ticket_number: z.string(),
	// ticket_num_qr_code: z.string(),
	ticket_name: z.string(),
	// ticket_sale_price: z.number(),
	first_name: z.string(),
	last_name: z.string(),
	email: z.string(),
	// custom_form: z.array(z.unknown()),
	// checkin: z.array(
	// 	z.object({
	// 		checkin_id: z.number(),
	// 		check_in: z.boolean(),
	// 		check_in_date: z.null(),
	// 	}),
	// ),
});

export default participantSchema;

export type Participant = z.infer<typeof participantSchema>;
