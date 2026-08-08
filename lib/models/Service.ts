import mongoose, { Document, Model, Schema } from "mongoose";

export interface IServiceItem {
  number: string;
  title: string;
  image: string;
  order: number;
  isActive: boolean;
}

export interface IService extends Document {
  eyebrow: string;
  title: string;
  description: string;
  items: IServiceItem[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceItemSchema = new Schema<IServiceItem>(
  {
    number: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    order: {
      type: Number,
      required: true,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
  }
);

const ServiceSchema = new Schema<IService>(
  {
    eyebrow: {
      type: String,
      required: true,
      trim: true,
      default: "01 // SERVICES",
    },

    title: {
      type: String,
      required: true,
      trim: true,
      default: "Our Core Services",
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    items: {
      type: [ServiceItemSchema],
      default: [],
    },

    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Service: Model<IService> =
  mongoose.models.Service ||
  mongoose.model<IService>("Service", ServiceSchema);

export default Service;