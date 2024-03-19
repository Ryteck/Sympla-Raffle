import { NextuiProviderComponent } from "@/components/providers/nextui";
import "@/styles/tailwind.css";

import type { Metadata } from "next";
import type { FC, PropsWithChildren } from "react";

export const metadata: Metadata = {
	title: "Sympla Raffle",
	description: "Generated by Next.js",
};

const Layout: FC<PropsWithChildren> = ({ children }) => (
	<html lang="en" className="dark">
		<body>
			<NextuiProviderComponent>{children}</NextuiProviderComponent>
		</body>
	</html>
);

export default Layout;
