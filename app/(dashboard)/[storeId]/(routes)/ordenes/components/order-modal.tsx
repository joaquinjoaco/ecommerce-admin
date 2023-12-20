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
            <div className={`inline-block mb-4 rounded-full ${data.isPaid ? " bg-green-300 " : " bg-red-300 "}`}>
                <p className={`text-sm px-2 py-1 ${data.isPaid ? "text-green-600" : "text-red-600"}`}>{data.isPaid ? "Paga" : "No paga"}</p>
            </div>
            <div className="flex flex-col mb-4">
                <p className="text-sm">Fecha</p>
                <p>{data.createdAt}</p>
            </div>
            <div className="flex flex-col mb-4">
                <p className="text-sm">Teléfono</p>
                <p>{data.phone}</p>
            </div>
            <div className="flex flex-col mb-4">
                <p className="text-sm">Dirección</p>
                <p>{data.address}</p>
            </div>
            <div className="flex flex-col mb-4">
                <p className="text-sm">Producto(s)</p>
                <p>{data.products}</p>
            </div>
            <div className="flex flex-col mb-4">
                <p className="text-sm">Total</p>
                <p>{data.totalPrice}</p>
            </div>
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button variant="outline" onClick={onClose}>
                    Cerrar
                </Button>
            </div>
        </Modal>
    );
};