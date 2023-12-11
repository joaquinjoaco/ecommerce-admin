import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { SettingsForm } from "./components/settings-form";

interface SettingsPageProps {
    params: {
        storeId: string;
    }
};

// This component fetches our store.
const SettingsPage: React.FC<SettingsPageProps> = async ({
    params
}) => {

    // Get the current user from Clerk.
    const { userId } = auth();

    // If there is no userId (the user is not authenticated) they will be redirected to the sign-in page.
    if (!userId) {
        redirect('/sign-in');
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId: userId
        }
    })

    // Protect the route by checking if the user has a store, otherwise they shouldn't be able to travel to the settings page.
    // If the user does not have any stores, they will be redirected to '/'.
    if (!store) {
        redirect("/");
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SettingsForm initialData={store} />
            </div>
        </div>
    );
}

export default SettingsPage;