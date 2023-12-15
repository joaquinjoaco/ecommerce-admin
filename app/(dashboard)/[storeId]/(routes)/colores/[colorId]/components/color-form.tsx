"use client";

import { Color } from "@prisma/client";
import * as z from "zod";
import { Trash } from "lucide-react";
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
    name: z.string().min(1, { message: 'El nombre del color debe tener al menos 1 caracter' }),
    value: z.string().min(4, { message: 'El nombre del color debe tener al menos 4 caracteres' }).regex(/^#/, { message: 'El valor debe expresarse en código hexadecimal (ej. #FFFFFF)' })
});

type ColorFormValues = z.infer<typeof formSchema>;

interface ColorFormProps {
    initialData: Color | null;
}



export const ColorForm: React.FC<ColorFormProps> = ({
    initialData
}) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Editar color" : "Crear color";
    const description = initialData ? "Editar un color" : "Crear un color";
    const toastMessage = initialData ? "Color actualizado." : "Color creado";
    const action = initialData ? "Guardar cambios" : "Crear";

    const form = useForm<ColorFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            value: ''
        }
    });

    const onSubmit = async (data: ColorFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                // Update the color.
                await axios.patch(`/api/${params.storeId}/colores/${params.colorId}`, data);
            } else {
                // Create the color.
                await axios.post(`/api/${params.storeId}/colores`, data);
            }
            router.push(`/${params.storeId}/colores`);
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
            await axios.delete(`/api/${params.storeId}/colores/${params.colorId}`);
            router.push(`/${params.storeId}/colores`);
            router.refresh(); // Refresh the component so it refetches the patched data.
            toast.success("Color eliminado.");

        } catch (error) {
            toast.error("Asegúrate de haber removido primero todos los productos que usen este color.")
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
                )

                }
            </div>
            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        {/* Color name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Nombre del color" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Color value */}
                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Valor</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-x-4">
                                            <Input disabled={loading} placeholder="Valor del color" {...field} />
                                            <div
                                                className=" border p-4 rounded-full"
                                                style={{ backgroundColor: field.value }}
                                            />
                                        </div>
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