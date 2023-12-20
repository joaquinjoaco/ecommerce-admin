"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-actions";

export type OrderColumn = {
    id: string;
    phone: string;
    address: string;
    isPaid: boolean;
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
        accessorKey: "address",
        header: "Dirección",
    },
    {
        accessorKey: "totalPrice",
        header: "Total (USD)",
    },
    {
        accessorKey: "isPaid",
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
