import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { validateCapacity } from '../utils/capacityGuard.js';
import { sendOrderReceipt } from '../utils/emailService.js';
import { createBostaTicket, isBostaMethod } from '../utils/bostaService.js';

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
    const storageDataMapping = body.storageDataMapping || [];
    const deliveryMethod = body.deliveryMethod === 'pickup' ? 'pickup' : 'delivery';
    const selectedShippingMethod = body.selectedShippingMethod || '';
    
    // Determine order status based on shipping method
    let orderStatus = 'Pending';
    let pickupLocationData = null;
    
    if (deliveryMethod === 'pickup') {
      orderStatus = 'AwaitingPickup';
      // Include pickup location data for store pickup orders
      pickupLocationData = {
        storeName: 'أبوكرتونةaming Store',
        address: '9 شارع جمال، تقسيم فريد ذكي، حدائق المعصرة، القاهرة',
        coordinates: { lat: 30.0444, lng: 31.2357 },
        workingHours: 'يومياً من 12:00 ظهراً إلى 12:00 منتصف الليل',
        phone: '01234567890'
      };
    } else if (selectedShippingMethod) {
      if (isBostaMethod(selectedShippingMethod)) {
        orderStatus = 'جاري شحن الطلب'; // Shipping in progress for Bosta
      } else {
        orderStatus = 'جاري شحن الطلب'; // Shipping in progress for other methods
      }
    }
    const customerDetails = body.customerDetails && Object.keys(body.customerDetails).length > 0
      ? body.customerDetails
      : {
          name: body.customerName || '',
          phone: body.phone || '',
          email: body.customerEmail || '',
          address: body.address || '',
        };
    const order = await Order.create({
      orderID,
      customerDetails,
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
      storageDataMapping,
      deliveryMethod,
      pickupLocation: pickupLocationData,
      status: orderStatus,
    });
    res.status(201).json({ order });

    // Handle Bosta integration if applicable
    if (deliveryMethod === 'delivery' && isBostaMethod(selectedShippingMethod)) {
      try {
        const customerDetails = body.customerDetails && Object.keys(body.customerDetails).length > 0
          ? body.customerDetails
          : {
              name: body.customerName || '',
              phone: body.phone || '',
              email: body.customerEmail || '',
              address: body.address || '',
            };

        const bostaResult = await createBostaTicket({
          customerName: customerDetails.name,
          phone: customerDetails.phone,
          address: customerDetails.address,
          email: customerDetails.email,
          orderId: orderID
        });

        if (bostaResult.success) {
          // Update order with Bosta tracking information
          await Order.findByIdAndUpdate(order._id, {
            trackingNumber: bostaResult.trackingNumber,
            deliveryId: bostaResult.deliveryId,
            shippingProvider: 'Bosta'
          });
          
          console.log(`[Bosta] Ticket created successfully for order ${orderID}: ${bostaResult.trackingNumber}`);
        } else {
          console.error(`[Bosta] Failed to create ticket for order ${orderID}: ${bostaResult.error}`);
          // You might want to notify admin about this failure
        }
      } catch (bostaError) {
        console.error(`[Bosta] Error processing order ${orderID}:`, bostaError.message);
        // Continue with order processing even if Bosta fails
      }
    }

    // Decrement stock for each ordered product
    const stockOps = items
      .filter((item) => item.product)
      .map((item) => ({
        updateOne: {
          filter: { _id: item.product },
          update: [{ $set: { stockCount: { $max: [0, { $subtract: ['$stockCount', item.quantity] }] } } }],
        },
      }));
    if (stockOps.length > 0) {
      Product.bulkWrite(stockOps).catch((err) =>
        console.error('[Stock] Failed to update stock counts:', err.message)
      );
    }

    const customerEmail = body.customerEmail || customerDetails.email || '';
    if (customerEmail) {
      sendOrderReceipt({
        customerEmail,
        customerName: customerDetails.name || body.customerName || '',
        orderID,
        items: rawItems.map((item) => ({
          name: item.name,
          price: Number(item.price || 0),
          quantity: Number(item.quantity || 1),
          type: item.type || '',
        })),
        totalPrice: Number(body.totalPrice || 0),
        deliveryMethod,
        pickupLocation: pickupLocationData
      }).catch((err) => console.error('[Email] Failed to send receipt:', err.message));
    }
  } catch (err) {
    next(err);
  }
}

function normalizeOrder(order) {
  const o = order.toObject ? order.toObject() : order;
  const cd = o.customerDetails || {};
  return {
    ...o,
    id: String(o._id),
    customerName: cd.name || o.customerName || '',
    phone: cd.phone || o.phone || '',
    address: cd.address || o.address || '',
    email: cd.email || o.email || '',
    trackingNumber: o.trackingNumber || null,
    deliveryMethod: o.deliveryMethod || 'delivery',
    shippingProvider: o.shippingProvider || null,
    storageDataMapping: o.storageDataMapping || [],
  };
}

export async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
    const order = await Order.findOne(
      isMongoId ? { $or: [{ _id: id }, { orderID: id }] } : { orderID: id }
    );
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order: normalizeOrder(order) });
  } catch (err) {
    next(err);
  }
}

export async function listOrders(req, res, next) {
  try {
    const { search, status } = req.query;
    const filter = {};
    if (search && search.trim()) {
      filter['customerDetails.name'] = { $regex: search.trim(), $options: 'i' };
    }
    if (status && status !== 'all') {
      filter.status = status;
    }
    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json({ orders: orders.map(normalizeOrder) });
  } catch (err) {
    next(err);
  }
}

export async function deleteOrder(req, res, next) {
  try {
    const { id } = req.params;
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
    const order = await Order.findOneAndDelete(
      isMongoId ? { $or: [{ _id: id }, { orderID: id }] } : { orderID: id }
    );
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
    const { status, shippingProvider } = req.body;
    const validStatuses = ['Pending', 'AwaitingPickup', 'Shipping', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id);
    const order = await Order.findOneAndUpdate(
      isMongoId ? { $or: [{ _id: id }, { orderID: id }] } : { orderID: id },
      { status, ...(shippingProvider ? { shippingProvider } : {}) },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order });
  } catch (err) {
    next(err);
  }
}
