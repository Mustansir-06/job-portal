const express = require("express")

const authUser = require("../middleware/auth.middleware")
const authorizeRoles = require("../middleware/role.middleware")

const {
    createJobController,
    getJobsController,
    getJobsbyIdController,
    updateJobController,
    deleteJobController,
    getMyJobsController
} = require("../controllers/job.controller")

const router = express.Router()

router.post(
    "/",
    authUser,
    authorizeRoles("recruiter"),
    createJobController
)

router.get(
    "/my",
    authUser,
    authorizeRoles("recruiter"),
    getMyJobsController
)

router.get("/", getJobsController)

router.get("/:id", getJobsbyIdController)

router.patch(
    "/:id",
    authUser,
    authorizeRoles("recruiter"),
    updateJobController
)

router.delete(
    "/:id",
    authUser,
    authorizeRoles("recruiter", "admin"),
    deleteJobController
)

module.exports = router