"use client";

import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

// local imports.
import { cn } from "@/lib/utils";

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {

    const pathname = usePathname();
    const params = useParams();

    const routes = [
        {
            href: `/${params.storeId}`,
            label: 'Panel',
            active: pathname === `/${params.storeId}`,
        },
        {
            href: `/${params.storeId}/carteleras`,
            label: 'Carteleras',
            active: pathname === `/${params.storeId}/carteleras`,
        },
        {
            href: `/${params.storeId}/categorias`,
            label: 'Categorías',
            active: pathname === `/${params.storeId}/categorias`,
        },
        {
            href: `/${params.storeId}/talles`,
            label: 'Talles',
            active: pathname === `/${params.storeId}/talles`,
        },
        {
            href: `/${params.storeId}/colores`,
            label: 'Colores',
            active: pathname === `/${params.storeId}/colores`,
        },
        {
            href: `/${params.storeId}/productos`,
            label: 'Productos',
            active: pathname === `/${params.storeId}/productos`,
        },
        {
            href: `/${params.storeId}/ordenes`,
            label: 'Ordenes',
            active: pathname === `/${params.storeId}/ordenes`,
        },
        {
            href: `/${params.storeId}/configuraciones`,
            label: 'Configuraciones',
            active: pathname === `/${params.storeId}/configuraciones`,
        }
    ];
    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
        >
            {routes.map((route) => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        route.active ? "text-black dark:text-white" : "text-muted-foreground"
                    )}
                >
                    {route.label}
                </Link>
            ))}
        </nav>
    );
};