const express = require("express")

const {
    createApplicationController,
    getAllApplicationController,
    getbyIdApplicationController,
    withdrawApplicationController,
    seeApplicantsController,
    updateApplicationStatusController,
    isJobAppliedController
} = require("../controllers/application.controller")

const authUser = require("../middleware/auth.middleware")
const authorizeRoles = require("../middleware/role.middleware")

const router = express.Router()


router.post(
    "/:jobId",
    authUser,
    authorizeRoles("candidate"),
    createApplicationController
)


router.get(
    "/my",
    authUser,
    authorizeRoles("candidate"),
    getAllApplicationController
)


router.get(
    "/:id",
    authUser,
    authorizeRoles("candidate"),
    getbyIdApplicationController
)


router.get(
    "/check/:jobId",
    authUser,
    authorizeRoles("candidate"),
    isJobAppliedController
)


router.patch(
    "/:id/withdraw",
    authUser,
    authorizeRoles("candidate"),
    withdrawApplicationController
)


router.get(
    "/job/:jobId",
    authUser,
    authorizeRoles("recruiter"),
    seeApplicantsController
)


router.patch(
    "/:id/status",
    authUser,
    authorizeRoles("recruiter"),
    updateApplicationStatusController
)



module.exports = router