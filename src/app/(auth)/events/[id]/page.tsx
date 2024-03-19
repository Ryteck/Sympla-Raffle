"use client";

import type { Event } from "@/schema/event";
import type { Participant } from "@/schema/participants";
import { useAuthStore } from "@/stores/auth";
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
import { type FC, useState } from "react";

interface Params {
	params: { id: string };
}

const Page: FC<Params> = ({ params }) => {
	const authStore = useAuthStore();
	const [ticket, setTicket] = useState(new Set<string>([]));

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

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
								<Dropdown backdrop="blur">
									<DropdownTrigger>
										<Button color="primary">Raffle!</Button>
									</DropdownTrigger>
									<DropdownMenu>
										{participants.data
											.map((participant) => participant.ticket_name)
											.filter((v, i, a) => a.indexOf(v) === i)
											.map((ticket) => (
												<DropdownItem onClick={onOpen} key={ticket}>
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

			<Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Modal Title
							</ModalHeader>
							<ModalBody>
								<p>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Nullam pulvinar risus non risus hendrerit venenatis.
									Pellentesque sit amet hendrerit risus, sed porttitor quam.
								</p>
								<p>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Nullam pulvinar risus non risus hendrerit venenatis.
									Pellentesque sit amet hendrerit risus, sed porttitor quam.
								</p>
								<p>
									Magna exercitation reprehenderit magna aute tempor cupidatat
									consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
									incididunt cillum quis. Velit duis sit officia eiusmod Lorem
									aliqua enim laboris do dolor eiusmod. Et mollit incididunt
									nisi consectetur esse laborum eiusmod pariatur proident Lorem
									eiusmod et. Culpa deserunt nostrud ad veniam.
								</p>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Close
								</Button>
								<Button color="primary">Raffle!</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</main>
	);
};

export default Page;
