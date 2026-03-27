import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number, default: 1 },
  },
  { _id: false }
);

const driveItemSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'DataLibrary' },
    name: { type: String },
    sizeGB: { type: Number, required: true },
    category: { type: String },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderID: { type: String, required: true, unique: true },
    customerDetails: { type: mongoose.Schema.Types.Mixed, required: true },
    items: [orderItemSchema],
    driveItems: [driveItemSchema],
    totalPrice: { type: Number, required: true },
    totalGB: { type: Number, required: true },
    capacityGB: { type: Number, required: true },
    paymentScreenshotUrl: { type: String },
    uploadedPhotoUrl: { type: String }, // UploadThing URL
    cityCode: { type: String },
    trackingNumber: { type: String },
    deliveryId: { type: String },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
