import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { format } from "date-fns";

import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";

const OrdersPage = async ({
    params
}: {
    params: { storeId: string }
}) => {
    // fetch all orders from the store
    const orders = await prismadb.order.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedOrders: OrderColumn[] = orders.map((order) => ({
        id: order.id,
        firstName: order.firstName,
        lastName: order.lastName,
        cedula: order.cedula,
        address1: order.address1,
        address2: order.address2,
        postalcode: order.postalcode,
        departamento: order.departamento,
        city: order.city,
        phone: order.phone,
        email: order.email,
        notes: order.notes,

        deliveryMethod: order.deliveryMethod,
        deliveryMethodName: order.deliveryMethodName,
        deliveryMethodShopAddress: order.deliveryMethodShopAddress,
        deliveryMethodCost: formatter.format(Number(order.deliveryMethodCost)),

        deliveryAddress1: order.deliveryAddress1,
        deliveryAddress2: order.deliveryAddress2,
        deliveryCedula: order.deliveryCedula,
        deliveryCity: order.deliveryCity,
        deliveryDepartamento: order.deliveryDepartamento,
        deliveryLastname: order.deliveryLastname,
        deliveryName: order.deliveryName,
        deliveryPhone: order.deliveryPhone,
        deliveryPostalcode: order.deliveryPostalcode,

        pickupCedula: order.pickupCedula,
        pickupFullName: order.pickupFullName,

        products: order.orderItems.map((orderItem) => orderItem.product.name).join(', '),

        totalPrice: formatter.format(Number(order.totalPrice)),
        isPaid: order.isPaid,
        pago: order.isPaid ? "Pago" : "Impago",
        TandC: order.TandC,
        createdAt: format(order.createdAt, "MMMM do, yyyy"),
        // totalPrice: formatter.format(order.orderItems.reduce((total, item) => {
        //     return total + Number(item.product.price)
        // }, 0)),
        // concatenatedAddress: order.differentAddress ?
        //     order.deliveryAddress1 + " " + order.deliveryAddress2 + ", " + order.deliveryCity + ", " + order.deliveryDepartamento
        //     :
        //     order.address1 + " " + order.address2 + ", " + order.city + ", " + order.departamento,
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6t">
                <OrderClient data={formattedOrders} />
            </div>
        </div>
    );
}

export default OrdersPage;