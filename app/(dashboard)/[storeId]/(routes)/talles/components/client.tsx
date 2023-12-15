"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { Apilist } from "@/components/ui/api-list";

import { SizeColumn, columns } from "./columns";

interface SizesClientProps {
    data: SizeColumn[]
}

export const SizesClient: React.FC<SizesClientProps> = ({
    data
}) => {

    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Talles (${data.length})`}
                    description="Administra los talles de tu tienda"
                />
                <Button onClick={() => { router.push(`/${params.storeId}/talles/nuevo`) }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo talle
                </Button>
            </div>
            <Separator />
            <DataTable filterKey="name" columns={columns} data={data} />

            <Heading title="API" description="Llamadas de API para los talles" />
            <Separator />
            <Apilist entityName="talles" entityIdName="sizeId" />
        </>
    )
}