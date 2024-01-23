"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-actions"

export type ProductColumn = {
    id: string;
    name: string;
    description: string;
    price: string; // we formatted it into a string.
    size: string;
    category: string;
    color: string;
    colorName: string;
    isFeatured: boolean;
    isArchived: boolean;
    isFeaturedText: string;
    isArchivedText: string;
    createdAt: string;
}

export const columns: ColumnDef<ProductColumn>[] = [
    {
        accessorKey: "name",
        header: "Nombre",
    },
    {
        accessorKey: "isArchivedText",
        header: "Archivado",
    },
    {
        accessorKey: "isFeaturedText",
        header: "Destacado",
    },
    {
        accessorKey: "price",
        header: "Precio (UYU)",
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
