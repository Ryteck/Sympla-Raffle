"use client";

import { EventsComponent } from "@/components/events";
import type { Event } from "@/schema/event";
import { useAuthStore } from "@/stores/auth";
import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";

const Page: FC = () => {
	const authStore = useAuthStore();

	const { data, status } = useQuery<Event[]>({
		queryKey: ["events"],
		queryFn: async () => {
			const token = authStore.getToken();

			const response = await fetch("/api/events", {
				headers: { Authorization: `Bearer ${token}` },
			});

			return response.json();
		},
	});

	return (
		<main className="p-8">
			{status === "success" && <EventsComponent events={data} />}
		</main>
	);
};

export default Page;
