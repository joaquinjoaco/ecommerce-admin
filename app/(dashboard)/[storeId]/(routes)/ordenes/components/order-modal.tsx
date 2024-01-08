"use client";

import { useEffect, useState } from "react";

// local imports.
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { OrderColumn } from "./columns";

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: OrderColumn;
}

export const OrderModal: React.FC<OrderModalProps> = ({
    isOpen,
    onClose,
    data,
}) => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])


    if (!isMounted) {
        return null;
    }

    return (
        <Modal
            title="Orden"
            description={`ID: ${data.id}`}
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className={`inline-block mb-4 rounded-full ${data.isPaid ? " bg-green-200 " : " bg-red-200 "}`}>
                <p className={`text-sm px-2 py-1 ${data.isPaid ? "text-green-500" : "text-red-500"}`}>{data.isPaid ? "Paga" : "Impaga"}</p>
            </div>
            <div className="flex flex-col mb-4">
                <p className="text-sm font-semibold">Fecha</p>
                <p>{data.createdAt}</p>
            </div>
            <div className="flex flex-col mb-4">
                <p className="text-sm font-semibold">Teléfono</p>
                <p>{data.phone}</p>
            </div>
            <div className="flex flex-col mb-4">
                <p className="text-sm font-semibold">Dirección</p>
                <p>{data.address1}</p>
                <p>{data.address2}</p>
            </div>
            <div className="flex flex-col mb-4">
                <p className="text-sm font-semibold">Producto(s)</p>
                {data.products.split(",").map((product, idx) => (
                    <p key={idx} className="text-sm px-2 py-1">{product}</p>
                ))}


            </div>
            <div className="flex flex-col mb-4">
                <p className="text-sm font-semibold">Total</p>
                <p className="text-lg font-bold">{data.totalPrice}</p>
            </div>
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button variant="outline" onClick={onClose}>
                    Cerrar
                </Button>
            </div>
        </Modal>
    );
};