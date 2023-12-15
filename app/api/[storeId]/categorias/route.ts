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

        const { name, billboardId } = body;

        // Check for the userId.
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        // Check for the label.
        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        // Check for the imageUrl.
        if (!billboardId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
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
        const category = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId: params.storeId,
            }
        });

        return NextResponse.json(category);

    } catch (error) {
        console.log('[CATEGORIES_POST]', error);
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

        const categories = await prismadb.category.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(categories);

    } catch (error) {
        console.log('[CATEGORIES_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}