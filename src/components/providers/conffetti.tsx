"use client";

import { useConfettiStore } from "@/stores/confetti";
import { type FC, type PropsWithChildren, useEffect } from "react";
import Confetti from "react-confetti";
import { useIsClient, useWindowSize } from "usehooks-ts";

export const ConfettiProviderComponent: FC<PropsWithChildren> = ({
	children,
}) => {
	const isClient = useIsClient();
	const { width, height } = useWindowSize();

	const confettiStore = useConfettiStore();

	useEffect(() => {
		console.log(width, height);
	}, [width, height]);

	useEffect(() => {
		if (confettiStore.view)
			setTimeout(() => confettiStore.setView(false), 3000);
	}, [confettiStore.view, confettiStore.setView]);

	return (
		<>
			{children}
			{isClient && confettiStore.view && width && height && (
				<Confetti
					width={width}
					height={height}
					className="w-screen h-screen absolute pointer-events-none z-50"
				/>
			)}
		</>
	);
};
