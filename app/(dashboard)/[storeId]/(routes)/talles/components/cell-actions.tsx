"use client";

import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { SizeColumn } from "./columns";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface CellActionProps {
    data: SizeColumn;
}

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {

    const params = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("ID de talle copiado al portapapeles.")
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/talles/${data.id}`);
            router.refresh(); // Refresh the component so it refetches the patched data.
            toast.success("Talle eliminado.");
            router.refresh();
        } catch (error) {
            toast.error("Asegúrate de haber removido primero todos los productos que usen este talle.")
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    {/* accesibility fature, screenreaders only 'open menu' */}
                                    <span className="sr-only">Abrir menú de acciones</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                    Acciones
                                </DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => onCopy(data.id)}>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copiar ID
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/talles/${data.id}`)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setOpen(true)}>
                                    <Trash className="mr-2 h-4 w-4" />
                                    Eliminar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Acciones</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </>
    );
};