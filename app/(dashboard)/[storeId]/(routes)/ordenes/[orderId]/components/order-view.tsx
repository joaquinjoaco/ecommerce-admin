"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Color, Order, OrderItem, Product, Size } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import OrderProduct from "./order-item";
import { formatter } from "@/lib/utils";

interface OrderViewProps {
    data: Order & {
        orderItems: OrderItem[]
    } | null;
    items: (Product & { size: Size, color: Color })[];
}

const OrderView: React.FC<OrderViewProps> = ({
    data,
    items,
}) => {

    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <div>
                    {data ?
                        <Heading
                            title={"Detalles de la orden"}
                            description={`ID: ${data?.id}`}
                            description2={`Email ID: ${data.sentEmail}`}
                        />
                        :
                        <Heading
                            title={"No se encontró la orden"}
                            description={"Presiona el botón de la derecha para volver"}
                        />
                    }

                    <div className="flex flex-wrap justify-start gap-x-2">

                        <div className={`inline-block max-w-min mt-2 rounded-full whitespace-nowrap overflow-hidden ${data?.isPaid ? " bg-green-200 " : " bg-red-200 "}`}>
                            <p className={`text-sm px-3 py-1 ${data?.isPaid ? "text-green-500" : "text-red-500"}`}>
                                {data?.isPaid ? "Paga" : "Impaga"}
                            </p>
                        </div>

                        <div className={"bg-primary inline-block max-w-min mt-2 rounded-full whitespace-nowrap overflow-hidden"}>
                            <p className={"text-sm px-3 py-1 text-white dark:text-[#020817]"}>
                                {data?.TandC ? "Términos y condiciones aceptados" : "Términos y condiciones no aceptados"}
                            </p>
                        </div>

                        <div className={"bg-primary inline-block max-w-min mt-2 rounded-full whitespace-nowrap overflow-hidden"}>
                            <p className={"text-sm px-3 py-1 text-white dark:text-[#020817]"}>
                                {data?.deliveryMethod === 0 ? "Retira en el local" : "Envío 24-48hs"}
                            </p>
                        </div>

                        {data?.deliveryMethod === 1 ?
                            <div className={"bg-primary inline-block max-w-min mt-2 rounded-full whitespace-nowrap overflow-hidden"}>
                                <p className={`text-sm px-3 py-1 text-white dark:text-[#020817]`}>{data?.differentAddress ? "Envío a otra dirección" : "Envío a dirección de facturación"}</p>
                            </div>
                            :
                            null
                        }
                    </div>

                </div>
                <Button
                    disabled={false}
                    variant="default"
                    size="sm"
                    onClick={() => router.push(`/${params.storeId}/ordenes/`)}
                    type="button"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </div>

            <Separator />

            <div className="flex flex-col space-y-12 lg:space-y-0 lg:flex-row lg:space-x-6">

                {/* Left side */}
                <div className="mt-4 flex-1 space-y-6">
                    <p className="text-md font-semibold">Datos de facturación</p>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex flex-1 flex-col gap-3">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Nombre
                            </label>
                            <Input disabled={true} value={data?.firstName} />
                        </div>
                        <div className="flex flex-1 flex-col gap-3">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Apellidos
                            </label>
                            <Input disabled={true} value={data?.lastName} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Documento de identidad
                        </label>
                        <Input disabled={true} value={data?.cedula} />
                    </div>

                    <div>
                        <p className="pt-4 text-sm font-medium">País / Región</p>
                        <p className="text-md font-bold">Uruguay</p>
                    </div>


                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Dirección de calle
                        </label>
                        <Input disabled={true} value={data?.address1} />
                        <Input disabled={true} value={data?.address2} />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Ciudad
                        </label>
                        <Input disabled={true} value={data?.city} />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Código postal
                        </label>
                        <Input disabled={true} value={data?.postalcode} />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Departamento
                        </label>
                        <Input disabled={true} value={data?.departamento} />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Teléfono
                        </label>
                        <Input disabled={true} value={data?.phone} />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Dirección de correo electrónico
                        </label>
                        <Input disabled={true} value={data?.email} />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Notas del pedido (opcional)
                        </label>
                        <textarea
                            className="flex h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={true}
                            value={data?.notes} />
                    </div>
                </div>

                {/* Right side */}
                <div className="flex-1 space-y-6">
                    <div className="space-y-6 rounded-lg border border-slate-200 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-4 lg:p-8">
                        <p className="text-md font-bold">Pedido</p>
                        {/* Order products */}
                        {items.map((item) => (
                            <OrderProduct key={item.id} data={item} orderItems={data?.orderItems} />
                        ))}

                        <div className="flex flex-row justify-between">
                            {data?.deliveryMethod === 0 ?
                                <>
                                    <p className="text-md font-semibold">Retira en el local ({data?.deliveryMethodShopAddress})</p>
                                    <p className="text-sm">{formatter.format(Number(data?.deliveryMethodCost))}</p>
                                </>
                                :
                                <>
                                    <p className="text-md font-semibold">Envío 24-48hs</p>
                                    <p className="text-sm">{formatter.format(Number(data?.deliveryMethodCost))}</p>
                                </>
                            }
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-center justify-between border-t py-4 border-gray-200 pt-4">
                                <div className="text-xl font-bold">
                                    Total
                                </div>
                                <div className="text-xl font-extrabold">
                                    {formatter.format(Number(data?.totalPrice))}
                                </div>
                            </div>
                        </div>
                        <div className="rounded-md space-y-6 bg-gray-50 dark:bg-[#050c1d] px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                            {
                                data?.deliveryMethod === 0 ?
                                    <>
                                        <p className="text-md font-semibold">Datos para el retiro</p>
                                        <div className="flex flex-col gap-3">
                                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Nombre completo de quien retira
                                            </label>
                                            <Input disabled={true} value={data?.pickupFullName} />
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                Cédula de quien retira
                                            </label>
                                            <Input disabled={true} value={data?.pickupCedula} />
                                        </div>
                                    </>
                                    :
                                    <>
                                        <p className="text-md font-semibold">Datos para el envío</p>
                                        {
                                            data?.differentAddress ?
                                                <>
                                                    <div className="flex flex-col gap-4 sm:flex-row">
                                                        <div className="flex flex-1 flex-col gap-3">
                                                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                Nombre
                                                            </label>
                                                            <Input disabled={true} value={data?.deliveryName} />
                                                        </div>
                                                        <div className="flex flex-1 flex-col gap-3">
                                                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                Apellidos
                                                            </label>
                                                            <Input disabled={true} value={data?.deliveryLastname} />
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-3">
                                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                            Documento de identidad
                                                        </label>
                                                        <Input disabled={true} value={data?.deliveryCedula} />
                                                    </div>

                                                    <div>
                                                        <p className="pt-4 text-sm font-medium">País / Región</p>
                                                        <p className="text-md font-bold">Uruguay</p>
                                                    </div>


                                                    <div className="flex flex-col gap-3">
                                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                            Dirección de calle
                                                        </label>
                                                        <Input disabled={true} value={data?.deliveryAddress1} />
                                                        <Input disabled={true} value={data?.deliveryAddress2} />
                                                    </div>

                                                    <div className="flex flex-col gap-3">
                                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                            Ciudad
                                                        </label>
                                                        <Input disabled={true} value={data?.deliveryCity} />
                                                    </div>

                                                    <div className="flex flex-col gap-3">
                                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                            Código postal
                                                        </label>
                                                        <Input disabled={true} value={data?.deliveryPostalcode} />
                                                    </div>

                                                    <div className="flex flex-col gap-3">
                                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                            Departamento
                                                        </label>
                                                        <Input disabled={true} value={data?.deliveryDepartamento} />
                                                    </div>

                                                    <div className="flex flex-col gap-3">
                                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                            Teléfono
                                                        </label>
                                                        <Input disabled={true} value={data?.deliveryPhone} />
                                                    </div>
                                                </>
                                                :
                                                <p>Enviar a la misma dirección de facturación</p>
                                        }
                                    </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrderView;