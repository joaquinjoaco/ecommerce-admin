import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";


export async function GET(
    _req: Request, // we won't use it, but the params must be in second argument of the function, we still need to add req even if we wont use it.
    { params }: { params: { billboardId: string } }
) {

    try {

        if (!params.billboardId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
        }

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId,
            }
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.log('[BILLBOARD_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }

}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, billboardId: string } } // comes from [storeId]
) {

    try {

        const { userId } = auth();
        const body = await req.json();

        const { label, imageUrl, isNameHidden } = body;


        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!label) {
            return new NextResponse("Label is required", { status: 400 });
        }

        if (!imageUrl) {
            return new NextResponse("Image URL is required", { status: 400 });
        }

        if (!params.billboardId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
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

        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl,
                isNameHidden
            }
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.log('[BILLBOARD_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }

}

export async function DELETE(
    _req: Request, // we won't use it, but the params must be in second argument of the function, we still need to add req even if we wont use it.
    { params }: { params: { storeId: string, billboardId: string } }
) {

    try {

        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!params.billboardId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
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

        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: params.billboardId,
            }
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.log('[BILLBOARD_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }

}