import { Color, Product, Size } from "@prisma/client";

interface EmailTemplateProps {
    firstName: string;
    items: (Product & { size: Size, color: Color })[];
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
    firstName,
    items
}) => (
    <div>
        <h1>Gracias por elegirnos, {firstName}!</h1>
        <p className="text-md font-bold">Pedido</p>
        {items.map((item) => (
            item.name
        ))}
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officia cum id unde beatae, ipsum autem explicabo eligendi at aperiam, cumque itaque ad expedita facilis consequuntur impedit nobis amet, quo commodi?</p>
    </div>
);
