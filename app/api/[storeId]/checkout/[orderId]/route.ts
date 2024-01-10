import { NextResponse } from "next/server"

import prismadb from "@/lib/prismadb"

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
    { params }: { params: { orderId: string } }
) {
    try {
        const order = await prismadb.order.update({
            where: {
                // Mark the order as paid
                id: params.orderId,
            },
            data: {
                isPaid: true,
            },
            include: {
                orderItems: true,
            }
        });

        return new NextResponse(null, {
            status: 200,
            headers: corsHeaders,
        });

    } catch (error) {
        return new NextResponse("order_id not found", {
            status: 400,
            headers: corsHeaders
        });
    }
};