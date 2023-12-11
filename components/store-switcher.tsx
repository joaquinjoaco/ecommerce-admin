"use client";

import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react";
import { Store } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// local imports.
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useStoreModal } from "@/hooks/use-store-modal";
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandItem,
    CommandGroup,
    CommandSeparator
} from "@/components/ui/command";


type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
    items: Store[];
};

export default function StoreSwitcher({
    className,
    items = []
}: StoreSwitcherProps) {

    // zustand store to open the store creation modal from anywhere
    const storeModal = useStoreModal();

    const params = useParams();
    const router = useRouter();

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id
    }));

    // We will always have a store in our route (if we have one), so we  it.
    const currentStore = formattedItems.find((item) => item.value === params.storeId);

    const [open, setOpen] = useState(false);


    // When the user selects a store we close the combobox and push the '/[storeId]' route.
    const onStoreSelect = (store: { value: string, label: string }) => {
        setOpen(false);
        router.push(`/${store.value}`);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Selecciona una tienda"
                    className={cn("w-[200px] justify-between", className)}>
                    <StoreIcon className="flex-none mr-2 h-4 w-4" />
                    <p className="truncate">{currentStore?.label}</p>
                    <ChevronsUpDown />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Buscar una tienda..." />
                        <CommandEmpty>No se encontró ninguna tienda.</CommandEmpty>
                        <CommandGroup heading="Tiendas">
                            {formattedItems.map((store) => (
                                <CommandItem
                                    key={store.value}
                                    onSelect={() => onStoreSelect(store)}
                                    className="cursor-pointer"
                                >
                                    <StoreIcon className="flex-none mr-2 h-4 w-4" />
                                    <p className="truncate">{store.label}</p>
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            // UX: If the store is the current store we style it as 'active'.
                                            currentStore?.value === store.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>

                    <CommandSeparator />
                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                                onSelect={() => {
                                    setOpen(false);
                                    // Open the modal to create a store.
                                    storeModal.onOpen();
                                }}
                                className="cursor-pointer"
                            >
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Crear tienda
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};