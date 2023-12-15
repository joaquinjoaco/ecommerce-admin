"use client";

import { useParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { Apilist } from "@/components/ui/api-list";

import { CategoryColumn, columns } from "./columns";

interface CategoryClientProps {
    data: CategoryColumn[]
}

export const CategoryClient: React.FC<CategoryClientProps> = ({
    data
}) => {

    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Categorías (${data.length})`}
                    description="Administra las categorías de tu tienda"
                />
                <Button onClick={() => { router.push(`/${params.storeId}/categorias/nueva`) }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva categoría
                </Button>
            </div>
            <Separator />
            <DataTable filterKey="name" columns={columns} data={data} />

            <Heading title="API" description="Llamadas de API para las categorías" />
            <Separator />
            <Apilist entityName="categorias" entityIdName="categoryId" />
        </>
    )
}