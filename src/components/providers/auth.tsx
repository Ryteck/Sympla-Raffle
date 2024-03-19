"use client";

import { useAuthStore } from "@/stores/auth";
import { useRouter } from "next/navigation";
import { type FC, type PropsWithChildren, useEffect, useState } from "react";

interface Props {
	loginPage?: true;
}

export const AuthProviderComponent: FC<PropsWithChildren<Props>> = ({
	children,
	loginPage,
}) => {
	const authStore = useAuthStore();
	const router = useRouter();

	const [isLoading, setIsLoading] = useState(true);

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		const token = authStore.getToken();
		if (loginPage && token !== null) router.push("/events");
		else if (!loginPage && token === null) router.push("/");
		else setIsLoading(false);
	}, [authStore.token]);

	return isLoading ? null : <>{children}</>;
};
