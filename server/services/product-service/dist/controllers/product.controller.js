import { getAllProducts, getProductById } from "../services/product.service";
export const getProductsController = async (req, res) => {
    const data = await getAllProducts();
    res.status(200).json({ success: true, data });
};
export const getProductByIdController = async (req, res) => {
    const { id } = req.params;
    const product = await getProductById(id);
    if (!product) {
        return res
            .status(404)
            .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
};
