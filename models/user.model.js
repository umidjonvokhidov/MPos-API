import mongoose from "mongoose";
import Notification from "./notification.model";

const userSchema = new mongoose.Schema(
  {
    firstname: String,
    lastname: String,
    profilePicture: String,
    role: {
      type: String,
      enum: ["waiter", "chef", "customer", "admin"],
      default: "customer",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email adress",
      ],
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      match: [
        /^\+?[1-9]\d{1,14}$/,
        "Please enter a valid phone number with country code (e.g., +1234567890)",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      maxlength: [32, "Password must be less than 32 characters long"],
      select: false,
    },
    settings: {
      language: {
        type: String,
        enum: ["en", "ru", "uz"],
        default: "en",
      },
      region: {
        type: String,
        enum: [
          "Samarkand",
          "Bukhara",
          "Khiva",
          "Nukus",
          "Fergana",
          "Andijan",
          "Bukhara",
          "Fergana",
          "Khiva",
          "Nukus",
          "Samarkand",
          "Tashkent",
          "Termiz",
        ],
        default: "Tashkent",
      },
      timeFormat: {
        type: String,
        enum: ["12h", "24h"],
        default: "24h",
      },
      dateFormat: {
        type: String,
        enum: ["DD-MM-YYYY", "MM-DD-YYYY", "YYYY-MM-DD"],
        default: "DD-MM-YYYY",
      },
      notifications: {
        productUpdated: {
          type: Boolean,
          default: true,
        },
        statusOrder: {
          type: Boolean,
          default: true,
        },
      },
      email: {
        dailyDigest: {
          type: Boolean,
          default: true,
        },
      },
    },
  },
  {
    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

userSchema.pre("save", async (next) => {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.pre("save", async (next) => {
  if (this.isNew) {
    Notification.create({
      user: this._id,
      title: "",
      message: "",
      type: "system",
    });
  }

  next();
});

const User = mongoose.model("User", userSchema);

export default User;
