import { Router } from "express";
import { calculatorController } from "../controller/calculator.controller.mjs";

const router = Router();
router.route("/taskOne").post(calculatorController);

export default router;
