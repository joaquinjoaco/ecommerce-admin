import { Column, Row, Text } from "@react-email/components";

const EmailItem = () => {
    return (
        <Row>
            <Column align="left" className="w-1/5">
                <Text className="text-left">JAVA SUPREMA XS AZUL</Text>
            </Column>
            <Column align="right" className="w-1/5">
                <Text className="text-left">1</Text>
            </Column>
            <Column align="right" className="w-1/5">
                <Text className="text-right">$1999</Text>
            </Column>
        </Row>
    );
}

export default EmailItem;