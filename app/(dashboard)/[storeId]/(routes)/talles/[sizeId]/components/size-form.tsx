"use client";

import { Size } from "@prisma/client";
import * as z from "zod";
import { ArrowLeft, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";

const formSchema = z.object({
    name: z.string().min(1, { message: 'El nombre del talle debe tener al menos 1 caracter' }),
    value: z.string().min(1, { message: 'El valor del talle debe tener al menos 1 caracter' })
});

type SizeFormValues = z.infer<typeof formSchema>;

interface SizeFormProps {
    initialData: Size | null;
}



export const SizeForm: React.FC<SizeFormProps> = ({
    initialData
}) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Editar talle" : "Crear talle";
    const description = initialData ? "Editar nombre y valor" : "Crear un talle";
    const toastMessage = initialData ? "Talle actualizado." : "Talle creado";
    const action = initialData ? "Guardar cambios" : "Crear";

    const form = useForm<SizeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: ''
        }
    });

    const onSubmit = async (data: SizeFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                // Update the size.
                await axios.patch(`/api/${params.storeId}/talles/${params.sizeId}`, data);
            } else {
                // Create the size.
                await axios.post(`/api/${params.storeId}/talles`, data);
            }
            router.push(`/${params.storeId}/talles`);
            router.refresh(); // Refresh the component so it refetches the patched data.
            toast.success(toastMessage);
        } catch (error) {
            toast.error("Ocurrió un error inesperado.");
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/talles/${params.sizeId}`);
            router.push(`/${params.storeId}/talles`);
            router.refresh(); // Refresh the component so it refetches the patched data.
            toast.success("Talle eliminado.");

        } catch (error) {
            toast.error("Asegúrate de haber removido primero todos los productos que usen este talle.")
        } finally {
            setLoading(false);
            setOpen(false);
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={description}
                />

                <div className="flex gap-x-2">
                    {/* Back button */}
                    <Button
                        disabled={false}
                        variant="default"
                        size="sm"
                        onClick={() => router.push(`/${params.storeId}/talles/`)}
                        type="button"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    {initialData && (
                        <Button
                            disabled={loading}
                            variant="destructive"
                            size="sm"
                            onClick={() => setOpen(true)}
                            type="button"
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    )}
                </div>

            </div>
            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        {/* Size name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Nombre del talle" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Size value */}
                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Valor</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Valor del talle" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>

                </form>
            </Form>
        </>
    )
}