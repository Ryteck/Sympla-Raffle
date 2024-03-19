"use client";

import { NextUIProvider } from "@nextui-org/react";
import type { FC, PropsWithChildren } from "react";

export const NextuiProviderComponent: FC<PropsWithChildren> = ({
	children,
}) => <NextUIProvider>{children}</NextUIProvider>;
