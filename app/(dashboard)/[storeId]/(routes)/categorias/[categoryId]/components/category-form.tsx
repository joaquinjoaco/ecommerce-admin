"use client";

import { Billboard, Category } from "@prisma/client";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";



const formSchema = z.object({
    name: z.string().min(1, { message: 'El nombre de la categoría debe tener al menos 1 carácter' }),
    billboardId: z.string().min(1)
});

type CategoryFormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
    initialData: Category | null;
    billboards: Billboard[];
}



export const CategoryForm: React.FC<CategoryFormProps> = ({
    initialData,
    billboards
}) => {

    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Editar categoría" : "Crear categoría";
    const description = initialData ? "Editar descripción y cartelera" : "Crear descripción";
    const toastMessage = initialData ? "Categoría actualizada." : "Categoría creada";
    const action = initialData ? "Guardar cambios" : "Crear";

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: '',
            billboardId: ''
        }
    });

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setLoading(true);
            if (initialData) {
                // Update the billboard.
                await axios.patch(`/api/${params.storeId}/categorias/${params.categoryId}`, data);
            } else {
                // Create the billboard.
                await axios.post(`/api/${params.storeId}/categorias`, data);
            }
            router.push(`/${params.storeId}/categorias`);
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
            await axios.delete(`/api/${params.storeId}/categorias/${params.categoryId}`);
            router.push(`/${params.storeId}/categorias`);
            router.refresh(); // Refresh the component so it refetches the patched data.
            toast.success("Categoría eliminada.");

        } catch (error) {
            toast.error("Asegúrate de haber removido primero todos los productos que usen esta categoría.")
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
                        {/* Billboard name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Nombre de la categoría" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="billboardId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cartelera</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field.value}
                                                    placeholder="Selecciona una cartelera"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {billboards.map((billboard) => (
                                                <SelectItem
                                                    key={billboard.id}
                                                    value={billboard.id}
                                                >
                                                    {billboard.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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