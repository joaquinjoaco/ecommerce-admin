import { NextRequest, NextResponse } from "next/server"
import { Resend } from 'resend';
import { EmailTemplate } from "@/components/email/email-template";

import prismadb from "@/lib/prismadb"
import axios from "axios";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization,",
};

const paymentHeaders = {
    "Content-type": "application/json",
    "Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}`,
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
    req: NextRequest, // NextRequest so we can use searchParams on it to get the payment_id
    { params }: { params: { orderId: string } }
) {

    try {

        // MercadoPago payment_id
        const payment_id = req.nextUrl.searchParams.get("payment_id")
        const payment = await axios.get(
            `https://api.mercadopago.com/v1/payments/${payment_id}`,
            { headers: paymentHeaders }
        );

        // If the payment status from MercadoPago is approved 
        // the order will be updated and an email will be sent to the user.
        if (payment.data.status === "approved") {
            const order = await prismadb.order.update({
                where: {
                    // Mark the order as paid
                    id: params.orderId,
                },
                data: {
                    isPaid: true,
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
            });

            // Sends an email to the user if we haven't sent them one already.
            // This prevents multiple emails if the user reloads the page.
            if (order.sentEmail == "") {
                const products = order?.orderItems ? order.orderItems.map((orderItem) => orderItem.product) : [];
                const sentEmail = await resend.emails.send({
                    from: 'onboarding@resend.dev',
                    to: [order.email],
                    subject: "Tu compra en SportPolis",
                    react: EmailTemplate({
                        order: order,
                        items: products,
                    }),
                    text: ''
                });

                // Update the order with the sent email id.
                await prismadb.order.update({
                    where: {
                        id: params.orderId,
                    },
                    data: {
                        sentEmail: sentEmail.data?.id,
                    }
                })

            }

            return new NextResponse(null, {
                status: 200,
                headers: corsHeaders,
            });
        } else {
            return new NextResponse("Payment status not approved", {
                status: 400,
                headers: corsHeaders
            });
        }
    } catch (error) {
        return new NextResponse("Payment validation error", {
            status: 400,
            headers: corsHeaders
        });
    }
};