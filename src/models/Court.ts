import mongoose from 'mongoose';

const courtSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    sport: {
      type: String,
      enum: ['Fútbol', 'Tenis', 'Baloncesto', 'Vóleibol', 'Pádel'],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    capacity: {
      type: Number,
      default: 2,
    },
    amenities: [
      {
        type: String,
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

export const Court = mongoose.model('Court', courtSchema);
