import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";


export async function GET(
    _req: Request, // we won't use it, but the params must be in second argument of the function, we still need to add req even if we wont use it.
    { params }: { params: { productId: string } }
) {

    try {

        if (!params.productId) {
            return new NextResponse("Product ID is required", { status: 400 });
        }

        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true,
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log('[PRODUCT_GET]', error);
        return new NextResponse("Internal error", { status: 500 });
    }

}

export async function PATCH(
    req: Request,
    { params }: { params: { storeId: string, productId: string } } // comes from [storeId]
) {

    try {

        const { userId } = auth();
        const body = await req.json();

        const {
            name,
            description,
            price,
            categoryId,
            colorId,
            sizeId,
            images,
            isFeatured,
            isArchived,
        } = body;


        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        // Check for the name.
        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        // Check for the name.
        if (!description) {
            return new NextResponse("Description is required", { status: 400 });
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

        if (!params.productId) {
            return new NextResponse("Product ID is required", { status: 400 });
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

        // We update the whole product and delete its images.
        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                description,
                price,
                categoryId,
                colorId,
                sizeId,
                images: {
                    deleteMany: {}
                },
                isFeatured,
                isArchived,
            }
        });

        // we then update its images.
        const product = await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image),
                        ]
                    }
                }
            }
        })

        return NextResponse.json(product);
    } catch (error) {
        console.log('[PRODUCT_PATCH]', error);
        return new NextResponse("Internal error", { status: 500 });
    }

}

export async function DELETE(
    _req: Request, // we won't use it, but the params must be in second argument of the function, we still need to add req even if we wont use it.
    { params }: { params: { storeId: string, productId: string } }
) {

    try {

        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!params.productId) {
            return new NextResponse("Product ID is required", { status: 400 });
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

        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId,
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log('[PRODUCT_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 });
    }

}