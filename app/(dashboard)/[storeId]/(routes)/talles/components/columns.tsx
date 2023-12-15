"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-actions"

export type SizeColumn = {
    id: string
    name: string
    value: string
    createdAt: string
}

export const columns: ColumnDef<SizeColumn>[] = [
    {
        accessorKey: "name",
        header: "Nombre",
    },
    {
        accessorKey: "value",
        header: "Valor",
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
