import mongoose from "mongoose";
import Notification from "./notification.model.js";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstname: String,
    lastname: String,
    profilePicture: String,
    role: {
      type: String,
      enum: ["waiter", "chef", "admin"],
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
      unique: true,
      sparse: true,
      trim: true,
      match: [
        /^\+?[1-9]\d{1,14}$/,
        "Please enter a valid phone number with country code (e.g., +1234567890)",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
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

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  if (this.isNew) {
    await Notification.create({
      user: this._id,
      title: "Welcome!",
      message: "Your account has been created.",
      type: "system",
    });
  }

  next();
});

userSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    await Notification.create({
      user: doc._id,
      title: "Profile update",
      message: "Profile data updated successfully",
    });
  }
});

userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
