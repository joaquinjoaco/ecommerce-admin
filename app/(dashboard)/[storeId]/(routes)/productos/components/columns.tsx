"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-actions"

export type ProductColumn = {
    id: string;
    name: string;
    price: string; // we formatted it into a string.
    size: string;
    category: string;
    color: string;
    isFeatured: boolean;
    isArchived: boolean;
    createdAt: string;
}

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "name",
        header: "Nombre",
    },
    {
        accessorKey: "isArchived",
        header: "Archivado",
    },
    {
        accessorKey: "isFeatured",
        header: "Destacado",
    },
    {
        accessorKey: "price",
        header: "Precio",
    },
    {
        accessorKey: "category",
        header: "Categoría",
    },
    {
        accessorKey: "size",
        header: "Talle",
    },
    {
        accessorKey: "color",
        header: "Color",
        cell: ({ row }) => (
            <div className="flex items-center gap-x-2">
                <div
                    className="h-6 w-6 rounded-full border"
                    style={{ backgroundColor: row.original.color }}
                />
            </div>
        )
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
