import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";


export default async function SetupLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    // Get the current user from Clerk.
    const { userId } = auth();

    // If there is no userId (the user is not authenticated) they will be redirected to the sign-in page.
    if (!userId) {
        redirect('/sign-in');
    }

    // From the current user we get the first store they have.
    const store = await prismadb.store.findFirst({
        where: {
            userId: userId
        }
    });

    // If they have a store they are going to be redirected to the corresponding store panel.
    if (store) {
        redirect(`/${store.id}`);
    }

    return (
        <>
            {children}
        </>
    );
}