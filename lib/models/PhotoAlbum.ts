import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

// ======================================================
// PHOTO ALBUM ITEM
// ======================================================

export interface IPhotoAlbumItem {
  _id?: mongoose.Types.ObjectId;
  title: string;
  subtitle: string;
  image: string;
  order: number;
  isActive: boolean;
}

// ======================================================
// PHOTO ALBUM DOCUMENT
// ======================================================

export interface IPhotoAlbum extends Document {
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  secondTitle: string;
  items: IPhotoAlbumItem[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ======================================================
// PHOTO ALBUM ITEM SCHEMA
// ======================================================

const PhotoAlbumItemSchema =
  new Schema<IPhotoAlbumItem>(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      subtitle: {
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
        default: 1,
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

// ======================================================
// PHOTO ALBUM SCHEMA
// ======================================================

const PhotoAlbumSchema =
  new Schema<IPhotoAlbum>(
    {
      eyebrow: {
        type: String,
        required: true,
        trim: true,
        default: "02 // PHOTO ALBUMS",
      },

      title: {
        type: String,
        required: true,
        trim: true,
        default: "Collection of photos",
      },

      highlightedTitle: {
        type: String,
        required: true,
        trim: true,
        default: "All of Our",
      },

      secondTitle: {
        type: String,
        required: true,
        trim: true,
        default: "Best Works",
      },

      items: {
        type: [PhotoAlbumItemSchema],
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

// ======================================================
// MODEL EXPORT
// ======================================================

const PhotoAlbum: Model<IPhotoAlbum> =
  mongoose.models.PhotoAlbum ||
  mongoose.model<IPhotoAlbum>(
    "PhotoAlbum",
    PhotoAlbumSchema
  );

export default PhotoAlbum;