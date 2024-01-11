import { NextResponse } from "next/server"
import { Resend } from 'resend';
import { EmailTemplate } from "@/components/email/email-template";

import prismadb from "@/lib/prismadb"

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization,",
};

const resend = new Resend('re_ZdaxF8DY_LufiJq6Ki6f4YNn6zBVTkszD');

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

        const fetchedOrder = await prismadb.order.findUnique({
            where: {
                id: params.orderId
            },
            include: {
                orderItems: {
                    include: {
                        product: {
                            include: {
                                color: true,
                                size: true,
                            }
                        }
                    }
                }
            }
        })

        const products = fetchedOrder?.orderItems ? fetchedOrder.orderItems.map((orderItem) => orderItem.product) : [];

        const sentEmail = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: [order.email],
            subject: "Hello from eventyr",
            react: EmailTemplate({ firstName: order.firstName, items: products }),
            text: ''
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