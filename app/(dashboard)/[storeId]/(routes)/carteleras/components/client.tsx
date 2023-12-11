"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { Apilist } from "@/components/ui/api-list";

import { BillboardColumn, columns } from "./columns";

interface BillboardClientProps {
    data: BillboardColumn[]
}

export const BillboardClient: React.FC<BillboardClientProps> = ({
    data
}) => {

    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Carteleras (${data.length})`}
                    description="Administra las carteleras de tu tienda"
                />
                <Button onClick={() => { router.push(`/${params.storeId}/carteleras/nueva`) }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva cartelera
                </Button>
            </div>
            <Separator />
            <DataTable filterKey="label" columns={columns} data={data} />

            <Heading title="API" description="API calls for Billboards" />
            <Separator />
            <Apilist entityName="carteleras" entityIdName="billboardId" />
        </>
    )
}