import { ApiResponse } from "../utils/apiResponse.utils.mjs";
import { asyncFunction } from "../utils/asyncFunctionHandler.utils.mjs";

const calculatorController = asyncFunction(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, dataArray, "Calculation successful."));
}, 5000);

export { calculatorController };
