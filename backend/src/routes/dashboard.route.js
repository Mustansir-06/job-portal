const express = require("express")

const {
    candidateDashboardController,
    recruiterDashboardController,
    adminDashboardController
} = require("../controllers/dashboard.controller")

const authUser = require("../middleware/auth.middleware")
const authorizeRoles = require("../middleware/role.middleware")

const router = express.Router()

router.get(
    "/candidate",
    authUser,
    authorizeRoles("candidate"),
    candidateDashboardController
)

router.get(
    "/recruiter",
    authUser,
    authorizeRoles("recruiter"),
    recruiterDashboardController
)

router.get(
    "/admin",
    authUser,
    authorizeRoles("admin"),
    adminDashboardController
)

module.exports = router