const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const MAX_DESCRIPTION_LENGTH = 500;
const DEFAULT_CAPACITY = 50;

const eventSchema = new mongoose.Schema(
  {
    event_id: {
      type: String,
      unique: true,
      immutable: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: MAX_DESCRIPTION_LENGTH,
      default: "",
    },

    startDateTime: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value >= new Date();
        },
        message: "Event start time cannot be in the past",
      },
    },

    endDateTime: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.startDateTime;
        },
        message: "Event end time must be after start time",
      },
    },

    capacity: {
      type: Number,
      default: DEFAULT_CAPACITY,
      min: 1,
      max: 1000,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);


/**
 * Generate unique event_id before saving
 */
eventSchema.pre("save", function () {
  if (!this.event_id) {
    this.event_id = nanoid(10);
  }
});

/**
 * Check if user already registered
 */
eventSchema.methods.isUserRegistered = function (userId) {
  return this.participants.some(
    (id) => id.toString() === userId.toString()
  );
};

/**
 * Check if event is full
 */
eventSchema.methods.isFull = function () {
  return this.participants.length >= this.capacity;
};

/**
 * Get event duration in HH:MM format
 */
eventSchema.methods.getDurationHHMM = function () {
  const diffMs = this.endDateTime - this.startDateTime;

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

module.exports = mongoose.model("Event", eventSchema);
