import { Order } from '../models/Order.js';
import { validateCapacity } from '../utils/capacityGuard.js';
import { sendOrderReceipt } from '../utils/emailService.js';

function buildOrderID() {
  const n = Math.floor(Math.random() * 90000) + 10000;
  return `AC-${n}`;
}

export async function createOrder(req, res, next) {
  try {
    const body = req.body || {};
    const rawItems = body.items || [];
    const rawDriveItems = body.driveItems || [];
    const capacityGB = Number(body.capacityGB || 0);
    const totalPrice = Number(body.totalPrice || 0);
    const driveItems = rawDriveItems.map((item) => ({
      name: item.name,
      sizeGB: Number(item.sizeGB || 0),
      category: item.category,
    }));
    const capacityResult = validateCapacity({ capacityGB, driveItems });
    if (!capacityResult.ok) {
      return res.status(400).json({
        error: 'Drive capacity exceeded',
        details: {
          totalGB: capacityResult.totalGB,
          capacityGB: capacityResult.capacityGB,
          reason: capacityResult.reason,
        },
      });
    }
    const items = rawItems.map((item) => ({
      product: item.productId || null,
      name: item.name,
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 1),
    }));
    const orderID = buildOrderID();
    // Support both legacy multer file upload and UploadThing URL
    const paymentScreenshotUrl = req.file
      ? `/uploads/${req.file.filename}`
      : body.paymentScreenshotUrl || null;
    const uploadedPhotoUrl = body.uploadedPhotoUrl || null;
    const order = await Order.create({
      orderID,
      customerDetails: body.customerDetails || {},
      items,
      driveItems,
      totalPrice,
      totalGB: capacityResult.totalGB,
      capacityGB: capacityResult.capacityGB,
      paymentScreenshotUrl,
      uploadedPhotoUrl,
      cityCode: body.cityCode,
      selectedShippingMethod: body.selectedShippingMethod || null,
      shippingCost: Number(body.shippingCost || 0),
      requiredDeposit: Number(body.requiredDeposit || 0),
      status: 'Pending',
    });
    res.status(201).json({ order });

    const customerEmail = body.customerEmail;
    if (customerEmail) {
      sendOrderReceipt({
        customerEmail,
        customerName: body.customerName || body.customerDetails?.name || '',
        orderID,
        items: rawItems.map((item) => ({
          name: item.name,
          price: Number(item.price || 0),
          quantity: Number(item.quantity || 1),
          type: item.type || '',
        })),
        totalPrice: Number(body.totalPrice || 0),
      }).catch((err) => console.error('[Email] Failed to send receipt:', err.message));
    }
  } catch (err) {
    next(err);
  }
}

export async function listOrders(req, res, next) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    next(err);
  }
}

export async function deleteOrder(req, res, next) {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['Pending', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order });
  } catch (err) {
    next(err);
  }
}
