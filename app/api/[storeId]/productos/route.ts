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

        const {
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            images,
            isFeatured,
            isArchived,
        } = body;

        // Check for the userId.
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        // Check for the name.
        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        // Check for the images.
        if (!images || !images.length) {
            return new NextResponse("Images are required", { status: 400 });
        }

        // Check for the Price.
        if (!price) {
            return new NextResponse("Price is required", { status: 400 });
        }

        // Check for the categoryId.
        if (!categoryId) {
            return new NextResponse("Category ID is required", { status: 400 });
        }

        // Check for the colorId.
        if (!colorId) {
            return new NextResponse("Color ID is required", { status: 400 });
        }

        // Check for the sizeId.
        if (!sizeId) {
            return new NextResponse("Size ID is required", { status: 400 });
        }

        // // Check for isFeatured.
        // if (!isFeatured) {
        //     return new NextResponse("isFeatured is required", { status: 400 });
        // }

        // // Check for isArchived.
        // if (!isArchived) {
        //     return new NextResponse("isArchived is required", { status: 400 });
        // }

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
        const product = await prismadb.product.create({
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                colorId,
                sizeId,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                }
            }
        });

        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUCTS_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {

        // search params.
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const colorId = searchParams.get("colorId") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const isFeatured = searchParams.get("isFeatured");


        // Check for the storeId
        if (!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined, // undefined, not 'false' so that he filter is completely ignored
                isArchived: false // we never want to load products that are archived.
            },
            include: { // include everything else that comes with a product.
                images: true,
                category: true,
                color: true,
                size: true,
            },
            orderBy: { // we want to load the newest ones first.
                createdAt: 'desc',
            }
        });

        return NextResponse.json(products);

    } catch (error) {
        console.log('[PRODUCTS_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}