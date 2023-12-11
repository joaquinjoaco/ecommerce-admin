"use client";

import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "react-hot-toast";

// local imports
import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    name: z.string().min(1), // minimum of 1 character for the store's name.
});

export const StoreModal = () => {

    const storeModal = useStoreModal(); // state management for the modal.

    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);

            const response = await axios.post('/api/stores', values);

            // "window.location.assign" Does a refresh unlike the next router.
            // Using next router would sometimes cause the store modal to remain even after creating a store.
            window.location.assign(`/${response.data.id}`);

        } catch (error) {
            toast.error("Ocurrió un problema.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            title="Crear nueva tienda"
            description="Añade una nueva tienda para administrar productos y categorías"
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
        >
            <div>
                <div className="space-y-4 py-4 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            {/* We spread 'field' to gain access to all its props */}
                                            <Input
                                                disabled={loading}
                                                placeholder="SbortBolis"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button
                                    disabled={loading}
                                    variant="outline"
                                    onClick={storeModal.onClose}
                                    type="button" // if not specified the cancel button will also submit.
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    disabled={loading}
                                    type="submit"
                                >
                                    Continuar
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>


    )
}