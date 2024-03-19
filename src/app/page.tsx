"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	Card,
	CardFooter,
	CardHeader,
	Image,
	Input,
} from "@nextui-org/react";
import { PaperPlaneRight } from "@phosphor-icons/react/dist/ssr";
import NextImage from "next/image";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import { date, z } from "zod";

const formSchema = z.object({
	symplaApiKey: z.string().min(1),
});

const Page: FC = () => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			symplaApiKey: "",
		},
	});

	const onSubmit = form.handleSubmit(async (data) => {
		try {
			const response = await fetch("/api/login", {
				method: "POST",
				body: JSON.stringify(data),
			});

			if (response.status !== 200) throw new Error("Invalid Api Key");

			const { message } = await response.json();

			alert(message);
		} catch (err) {
			alert(String(err));
		}
	});

	return (
		<main className="grid place-items-center w-screen h-screen">
			<Card isFooterBlurred className="w-96 h-80 col-span-12 sm:col-span-7">
				<CardHeader className="absolute z-10 top-1 flex-col items-start">
					<p className="text-tiny text-white/60 uppercase font-bold">
						Your simple raffle with Sympla
					</p>
					<h4 className="text-white/90 font-medium text-xl">
						Type your Api Key below
					</h4>
				</CardHeader>
				<Image
					as={NextImage}
					removeWrapper
					fill
					alt="Relaxing app background"
					className="z-0 w-full h-full object-cover"
					src="/assets/login.jpg"
				/>
				<CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
					<form
						onSubmit={onSubmit}
						className="w-full h-full flex gap-2 items-center"
					>
						<Input
							color="primary"
							variant="underlined"
							label="Sympla Api Key"
							disabled={form.formState.isSubmitting}
							{...form.register("symplaApiKey")}
						/>

						<Button
							type="submit"
							isIconOnly
							variant="shadow"
							color="primary"
							isLoading={form.formState.isSubmitting}
						>
							<PaperPlaneRight size={24} />
						</Button>
					</form>
				</CardFooter>
			</Card>
		</main>
	);
};

export default Page;
