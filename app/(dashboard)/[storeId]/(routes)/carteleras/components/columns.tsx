"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-actions"

export type BillboardColumn = {
    id: string
    label: string
    isNameHidden: boolean
    createdAt: string
}

export const columns: ColumnDef<BillboardColumn>[] = [
    {
        accessorKey: "label",
        header: "Nombre",
    },
    {
        accessorKey: "createdAt",
        header: "Fecha",
    },
    {
        accessorKey: "isNameHidden",
        header: "Nombre oculto",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]
