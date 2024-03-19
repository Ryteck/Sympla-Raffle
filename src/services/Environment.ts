import type { EnvironmentData } from "@/schema/environmentData";
import environmentDataSchema from "@/schema/environmentData";

export default class EnvironmentService {
	private readonly data: EnvironmentData;

	constructor() {
		this.data = environmentDataSchema.parse({
			TOKEN_SECRET: process.env.TOKEN_SECRET,
		});
	}

	getData(): EnvironmentData {
		return this.data;
	}
}
