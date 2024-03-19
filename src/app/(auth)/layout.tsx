import { AuthProviderComponent } from "@/components/providers/auth";
import type { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = ({ children }) => {
	return <AuthProviderComponent>{children}</AuthProviderComponent>;
};

export default Layout;
