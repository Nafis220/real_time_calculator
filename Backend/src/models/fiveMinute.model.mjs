import mongoose from "mongoose";

const fiveMinuteSchema = mongoose.Schema(
  {
    currentRate: { type: Number, required: [true, "current rate is required"] },
    highestRate: { type: Number, required: [true, "highest rate is required"] },
    lowestRate: { type: Number, required: [true, "lowest rate is required"] },
  },
  { timestamps: true }
);

const FiveMinutesData = mongoose.model("User", fiveMinuteSchema);

export default FiveMinutesData;
