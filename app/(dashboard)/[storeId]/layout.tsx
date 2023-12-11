import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import Navbar from "@/components/navbar";

export default async function DashboardLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: { storeId: string }
}) {

    // Get the current user from Clerk.
    const { userId } = auth();

    // If there is no userId (the user is not authenticated) they are going to be redirected to the sign-in page.
    if (!userId) {
        redirect('/sign-in');
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId: userId
        }
    });

    // If the user does not have any store, they are going to be redirected to '/' where the (root) layout will show them the store modal.

    if (!store) {
        redirect('/')
    }

    return (
        <>
            <Navbar />
            {children}
        </>

    )
}