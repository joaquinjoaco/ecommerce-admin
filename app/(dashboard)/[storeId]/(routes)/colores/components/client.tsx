"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { Apilist } from "@/components/ui/api-list";

import { ColorColumn, columns } from "./columns";

interface ColorsClientProps {
    data: ColorColumn[]
}

export const ColorsClient: React.FC<ColorsClientProps> = ({
    data
}) => {

    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Colores (${data.length})`}
                    description="Administra los colores de tu tienda"
                />
                <Button onClick={() => { router.push(`/${params.storeId}/colores/nuevo`) }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo color
                </Button>
            </div>
            <Separator />
            <DataTable filterKey="name" columns={columns} data={data} />

            <Heading title="API" description="Llamadas de API para los colores" />
            <Separator />
            <Apilist entityName="colores" entityIdName="colorId" />
        </>
    )
}