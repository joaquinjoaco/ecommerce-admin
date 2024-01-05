// import Stripe from "stripe";
import { NextResponse } from "next/server";

// import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";


// MP WILL USE CORS LATER.
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization,",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    const { productIds, orderData } = await req.json();

    if (!productIds || productIds.length === 0) {
        return new NextResponse("Product ids are required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
        where: {
            id: {
                in: productIds
            }
        }
    })

    // create an order in the database.
    const order = await prismadb.order.create({
        data: {
            storeId: params.storeId,
            orderItems: {
                create: productIds.map((productId: string) => ({
                    product: {
                        connect: {
                            id: productId
                        }
                    }
                }))
            },
            isPaid: false,
            firstName: orderData.firstName,


        },
    });

    console.log(orderData);

    return NextResponse.json(
        { url: `${process.env.FRONTEND_STORE_URL}/carrito?success=1` },
        { headers: corsHeaders }
    );
}