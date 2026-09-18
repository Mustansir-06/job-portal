const express = require("express")
const multer = require("multer")

const {
    userRegisterController,
    userLoginController,
    getMeController,
    refreshController,
    logoutController,
    uploadResumeController
} = require("../controllers/auth.controller")

const authUser = require("../middleware/auth.middleware")
const refreshUser = require("../middleware/refresh.middleware")
const authorizeRoles = require("../middleware/role.middleware")

const router = express.Router()

const upload = multer({
    storage: multer.memoryStorage()
})


router.post("/register", userRegisterController)

router.post("/login", userLoginController)

router.get("/get-me", authUser, getMeController)

router.post("/refresh", refreshUser, refreshController)

router.post("/logout", refreshUser, logoutController)


router.patch(
    "/resume",
    authUser,
    authorizeRoles("candidate"),
    upload.single("resume"),
    uploadResumeController
)


module.exports = router