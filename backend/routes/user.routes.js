import { Router } from "express";
import {
  uploadProfilePicture,
  updateUserPicture,
  getUserAndProfile,
  login,
  register,
  getAllUserProfile,
  downloadProfile,
  sendConnectionRequest,
  whatAreMyConnections,
  acceptConnectionRequest,
  getMyConnectionRequests,
} from "../controllers/user.controller.js";
import multer from "multer";
const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

{
  ("p");
}
const upload = multer({ storage: storage });

router
  .route("/update_profile_picture")
  .post(upload.single("profile-picture"), uploadProfilePicture);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user_update").post(updateUserPicture);
router.route("/get_user_and_profile").get(getUserAndProfile);
router.route("/update_profile_picture").post(updateProfilePicture);
router.route("/user/get_all_users").get(getAllUserProfile);
router.route("/user/download_profile").get(downloadProfile);
router.route("/user/send_connection_request").post(sendConnectionRequest);  
router.route("/user/getConnectionRequests").get(getMyConnectionRequests);
router.route("/user/user_connection_request").get(whatAreMyConnections); 
router.route("/user/accept_connection_request").post(acceptConnectionRequest);
export default router;
