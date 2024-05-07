import mongoose from "mongoose";

const fiveMinuteSchema = mongoose.Schema(
  {
    time: { type: Number, required: true },
    currentRate: { type: Number, required: [true, "current rate is required"] },
    highestRate: { type: Number, required: [true, "highest rate is required"] },
    lowestRate: { type: Number, required: [true, "lowest rate is required"] },
    startingNumber: {
      type: Number,
      required: [true, "starting rate is required"],
    },
  },
  { timestamps: true }
);

const FiveMinutesData = mongoose.model("CandleData", fiveMinuteSchema);

export default FiveMinutesData;
