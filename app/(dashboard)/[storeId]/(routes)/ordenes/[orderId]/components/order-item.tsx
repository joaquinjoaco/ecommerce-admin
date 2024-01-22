"use client";

import { useParams, useRouter } from "next/navigation";

import { formatter } from "@/lib/utils";
import { Color, OrderItem, Product, Size } from "@prisma/client";


interface OrderProductProps {
    data: Product & {
        size: Size,
        color: Color,
    };
    orderItems: OrderItem[] | undefined;
};

const OrderProduct: React.FC<OrderProductProps> = ({
    data,
    orderItems
}) => {

    const router = useRouter();
    const params = useParams();

    const quantity = orderItems?.find((orderItem: { id: string, orderId: string, productId: string, quantity: number }) => orderItem.productId === data.id)?.quantity || 1;

    return (
        <li className="flex justify-between">
            {/* Product */}
            <div className="flex flex-col justify-between">
                <p className="text-sm font-semibold">
                    <span className="cursor-pointer underlin" onClick={() => router.push(`/${params.storeId}/productos/${data.id}`)}>
                        {quantity} x {data.name}
                    </span>
                </p>
                <p className="text-sm text-gray-500">
                    {data.color.name}
                    {data.size.name && `, Talle ${data.size.name}`}
                </p>
            </div>

            {/* Price */}
            <div className="flex mt-1 text-sm">
                {formatter.format(Number(data.price))}
            </div>
        </li >
    );
}

export default OrderProduct;