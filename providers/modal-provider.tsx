"use client";
import { StoreModal } from "@/components/modals/store-modal";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    // This will run only in the client.
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // If we are in server side rendering, we return NULL
    // so that there is no hydration error possible of happening.
    if (!isMounted) {
        return null;
    }

    // But if we are on the client we return the Modal.
    return (
        <>
            <StoreModal />
        </>
    )
}