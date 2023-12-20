"use client";

import { Eye } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { OrderColumn } from "./columns";
import { OrderModal } from "./order-modal";

interface CellActionProps {
    data: OrderColumn;
}

export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {

    const [open, setOpen] = useState(false);

    return (
        <>
            <OrderModal isOpen={open} onClose={() => setOpen(false)} data={data} />

            <Button
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => setOpen(true)}
            >
                {/* accesibility fature, screenreaders only 'open order' */}
                <span className="sr-only">Abrir orden</span>
                <Eye className="h-4 w-4" />
            </Button>

        </>
    );
};