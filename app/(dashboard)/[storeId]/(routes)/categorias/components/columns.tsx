"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-actions"

export type CategoryColumn = {
    id: string
    name: string
    billboardLabel: string
    createdAt: string
}

export const columns: ColumnDef<CategoryColumn>[] = [
    {
        accessorKey: "name",
        header: "Nombre",
    },
    {
        accessorKey: "cartelera",
        header: "Cartelera",
        cell: ({ row }) => row.original.billboardLabel,
    },
    {
        accessorKey: "createdAt",
        header: "Fecha",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    },
]
