import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// local imports.
import prismadb from "@/lib/prismadb";

export async function POST(
    req: Request
) {
    try {
        // get the current user from Clerk.
        const { userId } = auth();
        const body = await req.json();

        const { name } = body;

        // Check for the userId.
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        // Check for the store name.
        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }


        // If userId and name was provided, we can create the store.
        const store = await prismadb.store.create({
            data: {
                name,
                userId
            }
        });

        return NextResponse.json(store);

    } catch (error) {
        console.log('[STORES_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}