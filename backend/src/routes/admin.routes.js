const express = require("express")

const authUser = require("../middleware/auth.middleware")
const authorizeRoles = require("../middleware/role.middleware")
const { getAllJobsController } = require("../controllers/admin.controller")
const { getAllUsersController } = require("../controllers/admin.controller")
const { getAllApplicationsController } = require("../controllers/admin.controller")

const router = express.Router()

router.get(
    "/users",
    authUser,
    authorizeRoles("admin"),
    getAllUsersController
)
router.get(
    "/jobs",
    authUser,
    authorizeRoles("admin"),
    getAllJobsController
)
router.get(
    "/applications",
    authUser,
    authorizeRoles("admin"),
    getAllApplicationsController
)

module.exports = router