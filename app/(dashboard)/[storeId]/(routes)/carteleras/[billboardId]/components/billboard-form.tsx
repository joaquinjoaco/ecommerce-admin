"use client";

import { Billboard } from "@prisma/client";
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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
    label: z.string().min(1, { message: 'El nombre de la cartelera debe tener al menos 1 caracter' }),
    imageUrl: z.string().min(1, { message: 'La cartelera debe tener una imagen de fondo' }),
    isNameHidden: z.boolean().default(true).optional(),
});

type BillboardFormValues = z.infer<typeof formSchema>;

interface BillboardFormProps {
    initialData: Billboard | null;
}

export const BillboardForm: React.FC<BillboardFormProps> = ({
    initialData
}) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Editar cartelera" : "Crear cartelera";
    const description = initialData ? "Editar imagen y nombre de la cartelera" : "Crear una cartelera";
    const toastMessage = initialData ? "Cartelera actualizada." : "Cartelera creada";
    const action = initialData ? "Guardar cambios" : "Crear";

    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: '',
            isNameHidden: true,
        }
    });

    const onSubmit = async (data: BillboardFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                // Update the billboard.
                await axios.patch(`/api/${params.storeId}/carteleras/${params.billboardId}`, data);
            } else {
                // Create the billboard.
                await axios.post(`/api/${params.storeId}/carteleras`, data);

            }
            router.push(`/${params.storeId}/carteleras`);
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
            await axios.delete(`/api/${params.storeId}/carteleras/${params.billboardId}`);
            router.push(`/${params.storeId}/carteleras`);
            router.refresh(); // Refresh the component so it refetches the patched data.
            toast.success("Cartelera eliminada.");

        } catch (error) {
            toast.error("Asegúrate de haber removido primero todas las categorías que usen esta cartelera.")
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
                        onClick={() => router.push(`/${params.storeId}/carteleras/`)}
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

                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Imagen de fondo</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value ? [field.value] : []}
                                        disabled={loading}
                                        onChange={(url) => field.onChange(url)}
                                        onRemove={() => field.onChange("")}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        {/* Billboard name */}
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Nombre de la cartelera" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Billboard isNameDisplayed */}
                        <FormField
                            control={form.control}
                            name="isNameHidden"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Ocultar nombre
                                        </FormLabel>
                                        <FormDescription>
                                            Se ocultará el nombre dado a la cartelera cuando se muestre en la tienda.
                                        </FormDescription>
                                    </div>
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