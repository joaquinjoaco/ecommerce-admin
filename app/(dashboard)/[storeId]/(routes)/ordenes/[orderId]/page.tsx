import prismadb from "@/lib/prismadb";
import OrderView from "./components/order-view";


const OrderViewPage = async ({
    params
}: {
    params: { orderId: string }
}) => {

    const order = await prismadb.order.findUnique({
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

    const products = order?.orderItems ? order.orderItems.map((orderItem) => orderItem.product) : [];

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <OrderView data={order} items={products} />
            </div>
        </div>
    );
};

export default OrderViewPage;