import "react-roulette-pro/dist/index.css";

import type { Participant } from "@/schema/participants";
import { type FC, useEffect, useState } from "react";
import RoulettePro, { type PrizeType } from "react-roulette-pro";

interface Props {
	participants: Participant[];
	start: boolean;
	callbackEnd: (name: string) => void;
}

const DEDUPLICATION_VALUE = 5;
const DEDUPLICATION_DIFF = 2;

function shuffleAndDeduplique(arg: PrizeType[]): PrizeType[] {
	const shuffledArr = arg.sort(() => Math.random() - 0.5);

	const dedupliquedArr: PrizeType[] = [];

	for (let i = 0; i < DEDUPLICATION_VALUE; i++)
		dedupliquedArr.push(
			...shuffledArr.map((a) => ({ ...a, id: `${i}-${a.id}` })),
		);

	return dedupliquedArr;
}

export const RouletteComponent: FC<Props> = ({
	participants,
	start,
	callbackEnd,
}) => {
	const [participantsClone, setParticipantsClone] = useState<Participant[]>([]);
	const [end, setEnd] = useState(false);

	const [prizeIndex, setPrizeIndex] = useState(-1);
	const [prize, setPrize] = useState<PrizeType[]>([]);

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		if (end) {
			const participant = participants.find(
				({ id }) => String(id) === prize[prizeIndex].text,
			);

			if (participant) {
				const name = `${participant.first_name} ${participant.last_name}`;
				callbackEnd(name);
			}
		}
	}, [end]);

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		setPrizeIndex(
			start
				? Math.floor(Math.random() * participantsClone.length) +
						participantsClone.length *
							(DEDUPLICATION_VALUE - DEDUPLICATION_DIFF)
				: -1,
		);

		if (!start && prizeIndex !== -1) {
			setEnd(false);

			setParticipantsClone((state) =>
				state.filter(({ id }) => String(id) !== prize[prizeIndex].text),
			);
		}
	}, [start]);

	useEffect(() => {
		setParticipantsClone(participants);
	}, [participants]);

	useEffect(() => {
		setPrize(
			shuffleAndDeduplique(
				participantsClone.map((participant) => {
					const fullName =
						`${participant.first_name} ${participant.last_name}`.replace(
							" ",
							"\n",
						);

					const canvas = document.createElement("canvas");
					const ctx = canvas.getContext("2d");

					canvas.width = 404;
					canvas.height = 340;

					let image = "???";

					if (ctx !== null) {
						ctx.fillStyle = "#f0f0f0";
						ctx.fillRect(0, 0, canvas.width, canvas.height);

						ctx.font = "32px Arial";
						ctx.fillStyle = "#333";
						ctx.textBaseline = "middle";
						ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
						ctx.shadowBlur = 4;
						ctx.shadowOffsetX = 2;
						ctx.shadowOffsetY = 2;

						const lines = fullName
							.replace("\n", " ")
							.split(" ")
							.map((line) => line.trim())
							.filter((line) => line !== "");

						const lineHeight = 40;
						let startY =
							(canvas.height - lines.length * lineHeight) / 2 + lineHeight / 2;

						for (const line of lines) {
							const textWidth = ctx.measureText(line).width;
							const startX = (canvas.width - textWidth) / 2;

							ctx.fillText(line, startX, startY);

							startY += lineHeight;
						}

						image = canvas.toDataURL();
					}

					return {
						id: participant.id,
						image,
						text: String(participant.id),
					};
				}),
			),
		);
	}, [participantsClone]);

	return (
		<RoulettePro
			prizes={prize}
			prizeIndex={prizeIndex}
			start={start}
			defaultDesignOptions={{ prizesWithText: true }}
			options={{ stopInCenter: true }}
			onPrizeDefined={() => {
				setEnd(true);
			}}
			spinningTime={5}
		/>
	);
};
