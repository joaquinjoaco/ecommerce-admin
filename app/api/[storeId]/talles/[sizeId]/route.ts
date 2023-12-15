import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";


export async function GET(
    _req: Request, // we won't use it, but the params must be in second argument of the function, we still need to add req even if we wont use it.
    { params }: { params: { sizeId: string } }
) {

    try {

        if (!params.sizeId) {
            return new NextResponse("Size ID is required", { status: 400 });
        }

        const size = await prismadb.size.findUnique({
            where: {
                id: params.sizeId,
            }
        });

        return NextResponse.json(size);
    } catch (error) {
        console.log('[SIZE_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }

}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, sizeId: string } } // comes from [storeId]
) {

    try {

        const { userId } = auth();
        const body = await req.json();

        const { name, value } = body;


        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!value) {
            return new NextResponse("Value is required", { status: 400 });
        }

        if (!params.sizeId) {
            return new NextResponse("Size ID is required", { status: 400 });
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

        const size = await prismadb.size.updateMany({
            where: {
                id: params.sizeId,
            },
            data: {
                name: name,
                value: value
            }
        });

        return NextResponse.json(size);
    } catch (error) {
        console.log('[SIZE_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }

}

export async function DELETE(
    _req: Request, // we won't use it, but the params must be in second argument of the function, we still need to add req even if we wont use it.
    { params }: { params: { storeId: string, sizeId: string } }
) {

    try {

        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!params.sizeId) {
            return new NextResponse("Size ID is required", { status: 400 });
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

        const size = await prismadb.size.deleteMany({
            where: {
                id: params.sizeId,
            }
        });

        return NextResponse.json(size);
    } catch (error) {
        console.log('[SIZE_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }

}