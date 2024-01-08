"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-actions";

export type OrderColumn = {
    id: string;
    firstName: string;
    lastName: string;
    cedula: string;
    address1: string;
    address2: string;
    // concatenatedAddress: string;
    postalcode: string;
    departamento: string;
    city: string;
    phone: string;
    email: string;
    notes: string;

    deliveryMethod: number;
    deliveryMethodName: string;
    deliveryMethodShopAddress: string;
    deliveryMethodCost: string;

    deliveryAddress1: string;
    deliveryAddress2: string;
    deliveryCedula: string;
    deliveryCity: string;
    deliveryDepartamento: string;
    deliveryLastname: string;
    deliveryName: string;
    deliveryPhone: string;
    deliveryPostalcode: string;

    pickupCedula: string;
    pickupFullName: string;

    TandC: boolean;

    isPaid: boolean;
    pago: string;

    totalPrice: string; // we used the formatter
    products: string; // turned into a string using '.join' on the array.
    createdAt: string;
}

export const columns: ColumnDef<OrderColumn>[] = [
    {
        accessorKey: "products",
        header: "Productos",
    },
    {
        accessorKey: "phone",
        header: "Telefono",
    },
    {
        accessorKey: "deliveryMethodName",
        header: "Envío",
    },
    {
        accessorKey: "totalPrice",
        header: "Total (USD)",
    },
    {
        accessorKey: "pago",
        header: "Pago",
    },
    {
        accessorKey: "createdAt",
        header: "Fecha",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]
