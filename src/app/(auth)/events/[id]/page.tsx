"use client";

import { RouletteComponent } from "@/components/roulette";
import type { Event } from "@/schema/event";
import type { Participant } from "@/schema/participants";
import { useAuthStore } from "@/stores/auth";
import { useConfettiStore } from "@/stores/confetti";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { type FC, useEffect, useState } from "react";

interface Params {
	params: { id: string };
}

const Page: FC<Params> = ({ params }) => {
	const authStore = useAuthStore();
	const [ticket, setTicket] = useState<null | string>(null);

	const confettiStore = useConfettiStore();

	const event = useQuery<Event>({
		queryKey: ["event"],
		queryFn: async () => {
			const token = authStore.getToken();

			const response = await fetch(`/api/events/${params.id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			return response.json();
		},
	});

	const participants = useQuery<Participant[]>({
		queryKey: ["participants"],
		queryFn: async () => {
			const token = authStore.getToken();

			const response = await fetch(`/api/events/${params.id}/participants`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			return response.json();
		},
	});

	const [filteredParticipants, setFilteredParticipants] = useState<
		Participant[]
	>([]);

	useEffect(() => {
		setFilteredParticipants(
			participants.status === "success"
				? participants.data.filter(
						(participant) => participant.ticket_name === ticket,
				  )
				: [],
		);
	}, [participants.status, participants.data, ticket]);

	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [startRaffle, setStartRaffle] = useState(false);
	const [raffleLoading, setRaffleLoading] = useState(false);

	return (
		<main className="p-8">
			{event.status === "success" && (
				<Card className="w-96 mx-auto p-4">
					<CardHeader className="flex flex-col gap-2">
						<h4 className="text-center mx-auto text-white font-medium text-large">
							{event.data.name}
						</h4>

						{participants.status === "success" && (
							<div className="w-full flex flex-col gap-1">
								<Dropdown>
									<DropdownTrigger>
										<Button color="primary">Raffle!</Button>
									</DropdownTrigger>
									<DropdownMenu>
										{participants.data
											.map((participant) => participant.ticket_name)
											.filter((v, i, a) => a.indexOf(v) === i)
											.map((ticket) => (
												<DropdownItem
													onClick={() => {
														setTicket(ticket);
														onOpen();
													}}
													key={ticket}
												>
													{ticket}
												</DropdownItem>
											))}
									</DropdownMenu>
								</Dropdown>
							</div>
						)}
					</CardHeader>
					<CardBody
						className="overflow-auto"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
						dangerouslySetInnerHTML={{ __html: event.data.detail }}
					/>
				</Card>
			)}

			<Modal
				size="5xl"
				isOpen={isOpen}
				onOpenChange={(e) => {
					if (e === false) setTicket(null);
					onOpenChange();
				}}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								<h2>{ticket}</h2>
								<p className="text-sm">
									Total participants: {filteredParticipants.length}
								</p>
							</ModalHeader>
							<ModalBody>
								<RouletteComponent
									start={startRaffle}
									participants={filteredParticipants}
									callbackEnd={(name) => {
										console.log(name);
										setRaffleLoading(false);
										confettiStore.setView(true);
									}}
								/>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Close
								</Button>
								<Button
									color={startRaffle ? "secondary" : "primary"}
									isLoading={raffleLoading}
									onClick={() => {
										if (!startRaffle) setRaffleLoading(true);
										setStartRaffle((s) => !s);
									}}
								>
									{startRaffle ? "Reset" : "Raffle Now!"}!
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</main>
	);
};

export default Page;
