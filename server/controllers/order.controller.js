import Stripe from "../config/stripe.js";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";

// 🟢 Helper: Calculate discounted price
const priceWithDiscount = (price, discount = 1) => {
  const discountAmount = Math.ceil((Number(price) * Number(discount)) / 100);
  return Number(price) - discountAmount;
};

// 🟢 Cash on Delivery Order Controller
export async function CashOnDeliveryOrderController(req, res) {
  try {
    const userId = req.userId;
    const { list_items, totalAmt, addressId, subTotalAmt } = req.body;

    // Use totalAmt and subTotalAmt in each order item:
    const orderPayload = list_items.map((item) => ({
      userId,
      orderId: `ORD-${new mongoose.Types.ObjectId()}`,
      productId: item.productId._id,
      product_details: {
        name: item.productId.name,
        image: item.productId.image,
      },
      paymentId: "",
      payment_status: "CASH ON DELIVERY",
      delivery_address: addressId,
      subTotalAmt, // pass subTotalAmt from request body
      totalAmt,    // pass totalAmt from request body
    }));

    const createdOrders = await OrderModel.insertMany(orderPayload);

    // Clear user cart
    await CartProductModel.deleteMany({ userId });
    await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });

    res.json({
      message: "Order placed successfully via Cash on Delivery",
      success: true,
      error: false,
      data: createdOrders,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
      error: true,
    });
  }
}

// 🟢 Stripe Payment Controller
export async function paymentController(req, res) {
  try {
    const userId = req.userId;
    const { list_items, totalAmt, addressId, subTotalAmt } = req.body;
    const user = await UserModel.findById(userId);

    // We don't need to use totalAmt or subTotalAmt here because this controller just creates Stripe session.

    const line_items = list_items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.productId.name,
          images: item.productId.image,
          metadata: {
            productId: item.productId._id.toString(),
          },
        },
        unit_amount:
          priceWithDiscount(item.productId.price, item.productId.discount) * 100,
      },
      adjustable_quantity: {
        enabled: true,
        minimum: 1,
      },
      quantity: item.quantity,
    }));

    const session = await Stripe.checkout.sessions.create({
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      metadata: {
        userId: userId,
        addressId: addressId,
        subTotalAmt: subTotalAmt?.toString(), // optionally add to metadata as string
        totalAmt: totalAmt?.toString(),
      },
      line_items,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Payment failed",
      error: true,
      success: false,
    });
  }
}

// 🟢 Helper: Generate Order from Stripe Line Items
const getOrderProductItems = async ({
  lineItems,
  userId,
  addressId,
  paymentId,
  payment_status,
}) => {
  const orderItems = [];

  for (const item of lineItems.data) {
    const product = await Stripe.products.retrieve(item.price.product);

    const order = {
      userId,
      orderId: `ORD-${new mongoose.Types.ObjectId()}`,
      productId: product.metadata.productId,
      product_details: {
        name: product.name,
        image: product.images,
      },
      paymentId,
      payment_status,
      delivery_address: addressId,
      subTotalAmt: Number(item.amount_subtotal / 100), // use amount_subtotal if available
      totalAmt: Number(item.amount_total / 100),
    };

    orderItems.push(order);
  }

  return orderItems;
};

// 🟢 Stripe Webhook for Payment Success
export async function webhookStripe(req, res) {
  try {
    const event = req.body;

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata.userId;

      const lineItems = await Stripe.checkout.sessions.listLineItems(
        session.id
      );

      const orders = await getOrderProductItems({
        lineItems,
        userId,
        addressId: session.metadata.addressId,
        paymentId: session.payment_intent,
        payment_status: session.payment_status,
      });

      if (orders.length > 0) {
        await OrderModel.insertMany(orders);
        await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });
        await CartProductModel.deleteMany({ userId });
      }
    }

    res.json({ received: true });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Webhook error",
      error: true,
      success: false,
    });
  }
}

// 🟢 Get User Orders
export async function getOrderDetailsController(req, res) {
  try {
    const userId = req.userId;

    const orders = await OrderModel.find({ userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address");

    res.json({
      message: "Fetched order list",
      success: true,
      error: false,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);  // <== this logs details on backend console

    res.status(500).json({
      message: error.message || "Failed to fetch orders",
      error: true,
      success: false,
    });
  }
}

