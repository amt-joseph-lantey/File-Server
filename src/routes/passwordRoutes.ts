import express from "express";
import { resetPassword, forgotPassword, resetPasswordPage, resetNewPassword} from "../controllers/passwordControllers";



const router = express.Router();


router.get("/forgotPassword", forgotPassword);
router.post("/forgotPassword", resetPassword);
router.get("/reset-password", resetPasswordPage);
router.post("/reset-password", resetNewPassword);


export default router;