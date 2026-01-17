const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;
const emailRegex = /^(?!.*\.\.)([a-zA-Z0-9._%+-]+)@([a-zA-Z-]+\.)+[a-zA-Z]{2,}$/;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => emailRegex.test(v),
        message: "Email not valid",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Unique index
userSchema.index({ email: 1 }, { unique: true });

// Hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
