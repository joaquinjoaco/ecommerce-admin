"use client";

import { useParams, useRouter } from "next/navigation";
import { FileSpreadsheet, Plus } from "lucide-react";
import * as XLSX from 'xlsx';

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { Apilist } from "@/components/ui/api-list";

import { ProductColumn, columns } from "./columns";

interface ProductClientProps {
    data: ProductColumn[];
}

export const ProductClient: React.FC<ProductClientProps> = ({
    data
}) => {

    const router = useRouter();
    const params = useParams();

    const generateSheet = () => {
        // Function to convert an array of objects to a worksheet.
        const sheetFromArrayOfObjects = (arrayOfObjects: any[]) => {
            // Re-format the already formatted data prop to readable values for a human in a worksheet.
            const formattedArray = arrayOfObjects.map((item) => ({
                ID: item.id,
                Nombre: item.name,
                Descripcion: item.description,
                Destacado: item.isFeaturedText,
                Archivado: item.isArchivedText,
                Precio: item.price,
                Categoría: item.category,
                Talle: item.size,
                Color: item.colorName,
                Fecha: item.createdAt,
            }));
            const worksheet = XLSX.utils.json_to_sheet(formattedArray);
            return worksheet;
        };

        // Create a workbook.
        const workbook = XLSX.utils.book_new();

        // Add a worksheet with product data.
        XLSX.utils.book_append_sheet(workbook, sheetFromArrayOfObjects(data), 'Products');

        // Save the workbook to a file (starts a download).
        XLSX.writeFile(workbook, 'productos.xlsx');
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Productos (${data.length})`}
                    description="Administra los productos de tu tienda"
                />
                <div className="flex gap-x-2">
                    <Button onClick={() => { router.push(`/${params.storeId}/productos/nuevo`) }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo producto
                    </Button>
                    <Button onClick={() => generateSheet()} className="bg-[#107C41] hover:bg-[#1d6e42] dark:text-foreground" >
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Generar archivo
                    </Button>
                </div>
            </div>
            <Separator />
            <DataTable filterKey="name" columns={columns} data={data} />

            <Heading title="API" description="Llamadas de API para los productos" />
            <Separator />
            <Apilist entityName="productos" entityIdName="productId" />
        </>
    )
}