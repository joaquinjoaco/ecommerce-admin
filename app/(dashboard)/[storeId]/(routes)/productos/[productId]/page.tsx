import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/product-form";

const ProductPage = async ({
    params
}: {
    params: { storeId: string, productId: string }
}) => {

    const product = await prismadb.product.findUnique({
        where: {
            id: params.productId
        },
        include: {
            images: true
        }
    })

    // fetch the categories
    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeId,
        }
    })
    // fetch the sizes
    const sizes = await prismadb.size.findMany({
        where: {
            storeId: params.storeId,
        }
    })
    // fetch the colors
    const colors = await prismadb.color.findMany({
        where: {
            storeId: params.storeId,
        }
    })

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductForm
                    categories={categories}
                    colors={colors}
                    sizes={sizes}
                    initialData={product}
                />
            </div>
        </div>
    );
}

export default ProductPage;