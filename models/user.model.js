import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export const providerSchema = new mongoose.Schema(
  {
    provider: String,
    providerId: String,
    email: String,
    name: String,
    picture: String,
  },
  {
    _id: false,
  }
);

const userSchema = new mongoose.Schema(
  {
    firstname: String,
    lastname: String,
    profilePicture: String,
    role: {
      type: String,
      enum: ["waiter", "chef", "admin"],
      default: "waiter",
      required: true,
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
    linkedAccounts: [providerSchema],
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
    resetOTP: String,
    resetOTPExpires: String,
    isOTPVerified: { type: Boolean, default: false },
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

userSchema.virtual("fullname").get(function () {
  return `${this.firstname} ${this.lastname}`;
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  this._wasNew = this.isNew;
  next();
});

userSchema.post("save", async function () {
  console.log("run post-save hook for user model");
  try {
    const Cart = (await import("./cart.model.js")).default;
    const Notification = (await import("./notification.model.js")).default;

    console.log("Creating new user and cart if new user");

    if (this._wasNew) {
      if (this.role === "waiter") {
        await Cart.create({ user: this._id });
      }

      await Notification.create({
        user: this._id,
        title: "Welcome!",
        message: "Your account has been created.",
        type: "system",
      });
    }
  } catch (error) {
    console.error("Error in post-save hook:", error);
  }
});


userSchema.post("findOneAndDelete", async function (doc) {
  try {
    const Cart = (await import("./cart.model.js")).default;
    const Notification = (await import("./notification.model.js")).default;
    if (doc) {
      await Cart.deleteOne({ user: doc._id });
      await Notification.deleteMany({ user: doc._id });
    }
  } catch (error) {
    console.log("Error in post-findOneAndDelete hook:", error);
  }
});

userSchema.pre("validate", function (next) {
  if (
    !this.password &&
    (!this.linkedAccounts || this.linkedAccounts.length === 0)
  ) {
    this.invalidate("password", "Password is required");
  }
  next();
});

userSchema.post("findOneAndUpdate", async function (doc) {
  try {
    const Notification = (await import("./notification.model.js")).default;
    if (doc) {
      await Notification.create({
        user: doc._id,
        title: "Profile update",
        message: "Profile data updated successfully",
      });
    }
  } catch (error) {
    console.log("Error in post-findOneAndUpdate hook:", error);
  }
});

userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
