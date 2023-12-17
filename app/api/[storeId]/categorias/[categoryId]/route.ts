import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";


export async function GET(
    _req: Request, // we won't use it, but the params must be in second argument of the function, we still need to add req even if we wont use it.
    { params }: { params: { categoryId: string } }
) {

    try {

        if (!params.categoryId) {
            return new NextResponse("Category ID is required", { status: 400 });
        }

        const category = await prismadb.category.findUnique({
            where: {
                id: params.categoryId,
            },
            include: {
                billboard: true,
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.log('[CATEGORY_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }

}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, categoryId: string } } // comes from [storeId]
) {

    try {

        const { userId } = auth();
        const body = await req.json();

        const { name, billboardId } = body;


        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!billboardId) {
            return new NextResponse("Billboard ID is required", { status: 400 });
        }

        if (!params.categoryId) {
            return new NextResponse("Category ID is required", { status: 400 });
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

        const category = await prismadb.category.updateMany({
            where: {
                id: params.categoryId,
            },
            data: {
                name,
                billboardId
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.log('[CATEGORY_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }

}

export async function DELETE(
    _req: Request, // we won't use it, but the params must be in second argument of the function, we still need to add req even if we wont use it.
    { params }: { params: { storeId: string, categoryId: string } }
) {

    try {

        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!params.categoryId) {
            return new NextResponse("Category ID is required", { status: 400 });
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

        const category = await prismadb.category.deleteMany({
            where: {
                id: params.categoryId,
            }
        });

        return NextResponse.json(category);
    } catch (error) {
        console.log('[CATEGORY_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }

}