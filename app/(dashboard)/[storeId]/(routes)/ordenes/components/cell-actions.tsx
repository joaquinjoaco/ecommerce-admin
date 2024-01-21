"use client";

import { Eye } from "lucide-react";
// import { useState } from "react";


import { OrderColumn } from "./columns";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// import { OrderModal } from "./order-modal";

interface CellActionProps {
    data: OrderColumn;
}

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {

    // const [open, setOpen] = useState(false);


    const router = useRouter();
    const params = useParams();

    return (
        <>
            {/* <OrderModal isOpen={open} onClose={() => setOpen(false)} data={data} /> */}
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Link
                            className="h-8 w-8 p-0"
                            href={`/${params.storeId}/ordenes/${data.id}`}
                            target="_blank"
                        >
                            {/* accesibility fature, screenreaders only 'Ver detales' */}
                            <span className="sr-only">Ver detalles</span>
                            <Eye className="h-9 w-9 p-2 hover:bg-accent rounded-md transition-all" />
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Ver detalles</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </>
    );
};