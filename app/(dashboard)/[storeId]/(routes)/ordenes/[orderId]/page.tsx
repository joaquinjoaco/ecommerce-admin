import prismadb from "@/lib/prismadb";

const OrderViewPage = async ({
    params
}: {
    params: { orderId: string }
}) => {

    const order = await prismadb.order.findUnique({
        where: {
            id: params.orderId
        }
    })

    return (
        <div>
            {order?.id}
            {order?.address1}
        </div>
    );
};

export default OrderViewPage;