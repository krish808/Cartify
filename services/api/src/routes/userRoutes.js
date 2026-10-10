import express from "express"
import { updateMyProfile } from "../controllers/user.controller.js"
import {protect} from "../middlewares/auth.middleware.js"

const router = express.Router()

router.patch("/me",protect,updateMyProfile)

export default router