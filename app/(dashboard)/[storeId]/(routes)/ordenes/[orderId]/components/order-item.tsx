"use client";

import { useParams, useRouter } from "next/navigation";

import { formatter } from "@/lib/utils";
import { Color, Product, Size } from "@prisma/client";


interface OrderProductProps {
    data: Product & {
        size: Size,
        color: Color,
    };
};

const OrderProduct: React.FC<OrderProductProps> = ({
    data
}) => {

    const router = useRouter();
    const params = useParams();

    return (
        <li className="flex justify-between">
            {/* Product */}
            <div className="flex flex-col justify-between">
                <p className="text-sm font-semibold text-black">
                    <span className="cursor-pointer" onClick={() => router.push(`/${params.storeId}/productos/${data.id}`)}> {data.name}</span>
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