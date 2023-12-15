import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";


export async function GET(
    _req: Request, // we won't use it, but the params must be in second argument of the function, we still need to add req even if we wont use it.
    { params }: { params: { colorId: string } }
) {

    try {

        if (!params.colorId) {
            return new NextResponse("COLOR ID is required", { status: 400 });
        }

        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId,
            }
        });

        return NextResponse.json(color);
    } catch (error) {
        console.log('[COLOR_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }

}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, colorId: string } } // comes from [storeId]
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

        if (!params.colorId) {
            return new NextResponse("Color ID is required", { status: 400 });
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

        const color = await prismadb.color.updateMany({
            where: {
                id: params.colorId,
            },
            data: {
                name: name,
                value: value
            }
        });

        return NextResponse.json(color);
    } catch (error) {
        console.log('[COLOR_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }

}

export async function DELETE(
    _req: Request, // we won't use it, but the params must be in second argument of the function, we still need to add req even if we wont use it.
    { params }: { params: { storeId: string, colorId: string } }
) {

    try {

        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!params.colorId) {
            return new NextResponse("Color ID is required", { status: 400 });
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

        const color = await prismadb.color.deleteMany({
            where: {
                id: params.colorId,
            }
        });

        return NextResponse.json(color);
    } catch (error) {
        console.log('[COLOR_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }

}