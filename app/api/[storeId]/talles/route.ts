import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// local imports.
import prismadb from "@/lib/prismadb";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        // get the current user from Clerk.
        const { userId } = auth();
        const body = await req.json();

        const { name, value } = body;

        // Check for the userId.
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        // Check for the label.
        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        // Check for the imageUrl.
        if (!value) {
            return new NextResponse("Value URL is required", { status: 400 });
        }

        // Check for the storeId
        if (!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        // The storeId the user is trying to edit should be theirs. 
        const storeByUserID = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        // Check for the storeByUserID
        if (!storeByUserID) {
            return new NextResponse("Unauthorized", { status: 400 });
        }

        // If all the checks were passed, we can create the store.
        const size = await prismadb.size.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }
        });

        return NextResponse.json(size);

    } catch (error) {
        console.log('[SIZES_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(
    _req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        // Check for the storeId
        if (!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        const sizes = await prismadb.size.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(sizes);

    } catch (error) {
        console.log('[SIZES_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}