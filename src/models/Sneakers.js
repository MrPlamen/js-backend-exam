import { Schema, model, Types } from "mongoose";

const sneakersSchema = new Schema({
    brand: {
      type: String,
      required: [true, 'Brand is required!'],
      minLength: 3,
    },
    model: {
      type: String,
      required: [true, 'Model is required!'],
      minLength: 5,
    },
    price: {
      type: Number,
      required: [true, 'Price is required!'],
      min: 0,
    },
    condition: {
      type: String,
      required: [true, 'Condition is required!'],
      minLength: 3,
    },
    year: {
      type: Number,
      required: [true, 'Year is required!'],
      min: 1000,
      max: 9999,
    },
    size: {
      type: Number,
      required: [true, 'Size is required!'],
      min: 0,
    },
    description: {
      type: String,
      required: [true, 'Description is required!'],
      minLength: 10,
      maxLength: 150,
    },
    image: {
      type: String,
      required: [true, 'Image is required!'],
      match: /^https?:\/\//,
    },
    preferredList: [{
        type: Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const Sneakers = model('Sneakers', sneakersSchema);

export default Sneakers;