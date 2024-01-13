import {
    Body,
    Button,
    Column,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Tailwind,
    Text,
} from "@react-email/components";

import { Color, Order, OrderItem, Product, Size } from "@prisma/client";

interface EmailTemplateProps {
    order: Order & {
        orderItems: OrderItem[]
    };
    items: (Product & { size: Size, color: Color })[];
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    order,
    items,
}) => (

    <Html>
        <Head />
        <Preview>Gracias por elegirnos, {order.firstName}!</Preview>
        <Tailwind>
            <Body className="bg-white my-auto mx-auto font-sans">
                <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                    <Section className="mt-[32px]">
                        {/* <Img
                            src={`localhost:3001/sportpolis.png`}
                            width={100}
                            alt="SportPolis"
                            className="my-0 mx-auto"
                        /> */}
                        <h1 className="text-center">SportPolis</h1>
                    </Section>
                    <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                        Gracias por elegirnos, <strong>{order.firstName}!</strong>
                    </Heading>
                    <Text className="text-black text-[14px] leading-[24px]">
                        Hola {order.firstName},
                    </Text>
                    <Text className="text-black text-[14px] leading-[24px]">
                        Nos llena de alegría saber que has elegido SportPolis y esperamos que disfrutes al máximo de tu compra.
                    </Text>

                    <Section>
                        <Row>
                            <Column align="right">
                                <Text className="text-left text-black text-[14px] leading-[24px]">
                                    <strong>Dirección de facturación</strong>
                                    <br />
                                    {order.firstName} {order.lastName}
                                    <br />
                                    {order.address1}, {order.address2}
                                    <br />
                                    {order.postalcode} {order.city}, {order.departamento}
                                    <br />
                                    {order.phone}
                                </Text>
                            </Column>
                            <Column align="center">
                                <span className="px-6"></span>
                            </Column>
                            {/* Direccion de envio */}
                            <Column align="left">
                                {order.deliveryMethod === 1 ?
                                    order.differentAddress ?
                                        <Text className="text-black text-[14px] leading-[24px]">
                                            {/* different address */}
                                            <strong>Dirección de envío</strong>
                                            <br />
                                            {order.deliveryName} {order.deliveryLastname}
                                            <br />
                                            {order.deliveryAddress1}, {order.deliveryAddress2}
                                            <br />
                                            {order.deliveryPostalcode} {order.deliveryCity}, {order.deliveryDepartamento}
                                            <br />
                                            {order.deliveryPhone}
                                        </Text>
                                        :
                                        <Text className="text-black text-[14px] leading-[24px]">
                                            {/* same address */}
                                            <strong>Dirección de envío</strong>
                                            <br />
                                            {order.firstName} {order.lastName}
                                            <br />
                                            {order.address1}, {order.address2}
                                            <br />
                                            {order.postalcode} {order.city}, {order.departamento}
                                            <br />
                                            {order.phone}
                                        </Text>
                                    :
                                    <Text className="text-black text-[14px] leading-[24px]">
                                        <strong>Retiro en el local</strong>
                                        <br />
                                        {order.pickupFullName}
                                        <br />
                                        Cédula: {order.pickupCedula}
                                    </Text>
                                }

                            </Column>
                        </Row>
                    </Section>

                    {/* ORDER ITEMS */}
                    <Section className="mt-[32px] mb-[32px]">
                        <Text className="text-black text-[18px] leading-[24px]">
                            <strong>Tu orden:</strong>
                            <br />
                            {order.notes && `Notas: ${order.notes}`}
                        </Text>

                        <Row className="border-b border-t border-solid border-black space-x-4">
                            <Column align="left" className="w-1/5">
                                <Text className="text-center">
                                    <strong>Producto</strong>
                                </Text>
                            </Column>
                            <Column align="center" className="w-1/5">
                                <Text className="text-center">
                                    <strong>Cantidad</strong>
                                </Text>
                            </Column>
                            <Column align="right" className="w-1/5">
                                <Text className="text-center">
                                    <strong>Precio</strong>
                                </Text>
                            </Column>
                        </Row>

                        {items.map((item, idX) => (
                            <Row key={idX}>
                                <Column align="left" className="w-1/5">
                                    <Text className="text-left">{item.name} | {item.color.name} | {item.size.name}</Text>
                                </Column>
                                <Column align="right" className="w-1/5">
                                    <Text className="text-center">1</Text>
                                </Column>
                                <Column align="right" className="w-1/5">
                                    <Text className="text-right">${Number(item.price)}</Text>
                                </Column>
                            </Row>
                        ))}

                    </Section>

                    <Text className="text-black text-[14px] leading-[24px]">
                        <strong>Subtotal:</strong> ${Number(order.subtotalPrice)}
                        <br />

                        <strong>{order.deliveryMethod === 1 ? "Envío: " : "Retiro: "}</strong>${Number(order.deliveryMethodCost)}
                        <br />
                        <strong>Total: </strong>${Number(order.totalPrice)}
                    </Text>
                    <Text className="text-black text-[14px] leading-[24px]">
                        {order.deliveryMethodName} {order.deliveryMethodShopAddress}
                    </Text>

                    <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                </Container>
            </Body>
        </Tailwind>
    </Html>
);

