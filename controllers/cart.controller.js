import Cart from "../models/cart.model.js";

export const getUserCartProducts = async (req, res, next) => {
  try {
    const userCart = await Cart.find({ user: req.params.id }).populate(
      "products.productId"
    );

    if (!userCart) {
      const error = new Error("Cart based on this user not found!");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: userCart,
    });
  } catch (error) {
    next(error);
  }
};

export const addToUserCart = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { productId } = req.body;
    const userCart = await Cart.find({
      user: userId,
      products: { $elemMatch: { productId: productId } },
    });

    if (userCart) {
      await Cart.updateOne(
        {
          user: userId,
          "products.productId": productId,
        },
        { $inc: { "products.$.count": 1 } }
      );
    } else {
      await Cart.updateOne(
        {
          user: req.params.id,
          "products.productId": { $ne: productId },
        },
        {
          $push: {
            products: {
              productId: new mongoose.Types.ObjectId(productId),
              count: 1,
            },
          },
        }
      );
    }
  } catch (error) {
    next(error);
  }
};

export const removeFromUserCart = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { productId } = req.body;

    const cart = await Cart.findOne({
      user: userId,
      "products.productId": productId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart or product not found!",
      });
    }

    const product = cart.products.find(
      (item) => item.productId.toString() === productId
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart!",
      });
    }

    if (product.count > 1) {
      await Cart.updateOne(
        {
          user: userId,
          "products.productId": productId,
        },
        { $inc: { "products.$.count": -1 } }
      );
    } else {
      await Cart.updateOne(
        { user: userId },
        { $pull: { products: { productId } } }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Product updated/removed from cart successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const clearUserCart = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    cart.products = [];
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const removeProductCompletelyFromCart = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart!",
      });
    }

    cart.products.splice(productIndex, 1);
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from cart successfully.",
    });
  } catch (error) {
    next(error);
  }
};
