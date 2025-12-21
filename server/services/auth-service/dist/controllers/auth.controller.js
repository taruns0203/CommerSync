import { getAllAuth, getAuthId } from "../services/auth.service";
export const getAuthController = async (req, res) => {
    const data = await getAllAuth();
    res.status(200).json({ success: true, data });
};
export const getAuthByIdController = async (req, res) => {
    const { id } = req.params;
    const product = await getAuthId(id);
    if (!product) {
        return res
            .status(404)
            .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: product });
};
