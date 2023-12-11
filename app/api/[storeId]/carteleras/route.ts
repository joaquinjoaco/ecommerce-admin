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

        const { label, imageUrl } = body;

        // Check for the userId.
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        // Check for the label.
        if (!label) {
            return new NextResponse("Label is required", { status: 400 });
        }

        // Check for the imageUrl.
        if (!imageUrl) {
            return new NextResponse("Image URL is required", { status: 400 });
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
        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        });

        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[BILLBOARDS_POST]', error);
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

        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(billboards);

    } catch (error) {
        console.log('[BILLBOARDS_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}