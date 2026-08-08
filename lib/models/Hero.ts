import mongoose, { Document, Model, Schema } from "mongoose";

/* =========================
   BUTTON TYPE
========================= */

interface IHeroButton {
  text: string;
  link: string;
  enabled: boolean;
}

/* =========================
   SOCIAL LINK TYPE
========================= */

interface IHeroSocialLink {
  platform: "facebook" | "instagram" | "linkedin";
  url: string;
  enabled: boolean;
}

/* =========================
   HERO SLIDE TYPE
========================= */

export interface IHeroSlide {
  eyebrow: string;
  title: string;
  description: string;

  backgroundImage: string;

  primaryButton: IHeroButton;
  secondaryButton: IHeroButton;

  socialLinks: IHeroSocialLink[];

  order: number;
  isActive: boolean;
}

/* =========================
   HERO DOCUMENT TYPE
========================= */

export interface IHero extends Document {
  slides: IHeroSlide[];
  isPublished: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/* =========================
   BUTTON SCHEMA
========================= */

const HeroButtonSchema = new Schema<IHeroButton>(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },

    link: {
      type: String,
      required: true,
      trim: true,
    },

    enabled: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

/* =========================
   SOCIAL LINK SCHEMA
========================= */

const HeroSocialLinkSchema = new Schema<IHeroSocialLink>(
  {
    platform: {
      type: String,
      enum: ["facebook", "instagram", "linkedin"],
      required: true,
    },

    url: {
      type: String,
      default: "",
      trim: true,
    },

    enabled: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

/* =========================
   HERO SLIDE SCHEMA
========================= */

const HeroSlideSchema = new Schema<IHeroSlide>(
  {
    eyebrow: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    backgroundImage: {
      type: String,
      required: true,
      trim: true,
    },

    primaryButton: {
      type: HeroButtonSchema,
      required: true,
    },

    secondaryButton: {
      type: HeroButtonSchema,
      required: true,
    },

    socialLinks: {
      type: [HeroSocialLinkSchema],
      default: [],
    },

    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true }
);

/* =========================
   HERO SCHEMA
========================= */

const HeroSchema = new Schema<IHero>(
  {
    slides: {
      type: [HeroSlideSchema],
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

/* =========================
   HERO MODEL
========================= */

const Hero: Model<IHero> =
  mongoose.models.Hero ||
  mongoose.model<IHero>("Hero", HeroSchema);

export default Hero;