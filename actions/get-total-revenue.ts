import prismadb from "@/lib/prismadb";

export const getTotalRevenue = async (storeId: string) => {

    const paidOrders = await prismadb.order.findMany({
        where: {
            storeId,
            isPaid: true, // only take into account paid orders.
        },
        include: {
            orderItems: {
                include: {
                    product: true,
                }
            }
        }
    });

    const totalRevenue = paidOrders.reduce((total, order) => {
        const orderTotal = order.orderItems.reduce((orderSum, item) => {
            return orderSum + item.product.price.toNumber();
        }, 0)
        return total + orderTotal;
    }, 0);

    // REPLACE ABOVE WITH THIS ONE WHEN MP INTEGRATION IS FINISHED.
    // const totalRevenue = paidOrders.reduce((total, order) => {
    //     return total + Number(order.totalPrice)
    // }, 0);

    return totalRevenue;
}