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
        return total + Number(order.totalPrice)
    }, 0);

    return totalRevenue;
}