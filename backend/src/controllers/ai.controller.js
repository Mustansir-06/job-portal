const Groq = require("groq-sdk")

const {
    searchJobs,
    getJobDetails,

    getMyApplications,
    getMyProfile,

    getMyJobs,
    getApplicantsForJob,
    getRecruiterStats,

    getPlatformStats,
    getUsers,
    getAllJobs,
    getAllApplications
} = require("../utils/aiTools")


const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})


/*
========================================
COMMON JOB TOOLS
========================================
*/


const searchJobsTool = {
    type: "function",

    function: {

        name: "searchJobs",

        description:
            "Search jobs on the Job Portal. Use for finding, searching, listing, or filtering multiple jobs by keyword, company, location, employment type, skills, experience, salary, sorting, or status.",

        parameters: {

            type: "object",

            properties: {

                search: {
                    type: "string",
                    description:
                        "Keyword such as React, Node.js, frontend."
                },

                company: {
                    type: "string",
                    description:
                        "Specific company name."
                },

                location: {
                    type: "string",
                    description:
                        "Job location such as Pune or Mumbai."
                },

                employmentType: {
                    type: "string",
                    enum: [
                        "full-time",
                        "part-time",
                        "internship",
                        "contract"
                    ]
                },

                skills: {
                    type: "array",
                    items: {
                        type: "string"
                    }
                },

                minExperience: {
                    type: "number"
                },

                maxExperience: {
                    type: "number"
                },

                minSalary: {
                    type: "number"
                },

                maxSalary: {
                    type: "number"
                },

                status: {
                    type: "string",
                    enum: [
                        "active",
                        "closed",
                        "draft"
                    ]
                },

                sortBy: {
                    type: "string",
                    enum: [
                        "salaryHigh",
                        "salaryLow",
                        "newest",
                        "oldest"
                    ]
                },

                page: {
                    type: "number"
                },

                limit: {
                    type: "number"
                }
            }
        }
    }
}


const getJobDetailsTool = {

    type: "function",

    function: {

        name: "getJobDetails",

        description:
            "Get details about one specific active job using its MongoDB job ID. Use this only when the user refers to one particular job.",

        parameters: {

            type: "object",

            properties: {

                jobId: {
                    type: "string",
                    description:
                        "MongoDB job ID."
                }
            },

            required: [
                "jobId"
            ]
        }
    }
}


/*
========================================
CANDIDATE TOOLS
========================================
*/


const getMyApplicationsTool = {

    type: "function",

    function: {

        name: "getMyApplications",

        description:
            "Get applications belonging to the currently logged-in candidate. Use for application status, submitted applications, shortlisted applications, interview status, selected applications, rejected applications, or application history.",

        parameters: {

            type: "object",

            properties: {

                status: {
                    type: "string",
                    enum: [
                        "applied",
                        "shortlisted",
                        "interview",
                        "selected",
                        "rejected",
                        "withdrawn"
                    ]
                },

                page: {
                    type: "number"
                },

                limit: {
                    type: "number"
                }
            }
        }
    }
}


const getMyProfileTool = {

    type: "function",

    function: {

        name: "getMyProfile",

        description:
            "Get information about the currently logged-in candidate profile, including name, email, role, and whether a resume is available.",

        parameters: {

            type: "object",

            properties: {}
        }
    }
}


/*
========================================
RECRUITER TOOLS
========================================
*/


const getMyJobsTool = {

    type: "function",

    function: {

        name: "getMyJobs",

        description:
            "Get jobs created by the currently logged-in recruiter. Can filter by active, closed, or draft status.",

        parameters: {

            type: "object",

            properties: {

                status: {
                    type: "string",
                    enum: [
                        "active",
                        "closed",
                        "draft"
                    ]
                },

                page: {
                    type: "number"
                },

                limit: {
                    type: "number"
                }
            }
        }
    }
}


const getApplicantsForJobTool = {

    type: "function",

    function: {

        name: "getApplicantsForJob",

        description:
            "Get applicants for a job owned by the currently logged-in recruiter. Use when the recruiter asks about applicants, candidates, or application statuses for one of their jobs.",

        parameters: {

            type: "object",

            properties: {

                jobId: {
                    type: "string",
                    description:
                        "MongoDB job ID."
                },

                status: {
                    type: "string",
                    enum: [
                        "applied",
                        "shortlisted",
                        "interview",
                        "selected",
                        "rejected",
                        "withdrawn"
                    ]
                },

                page: {
                    type: "number"
                },

                limit: {
                    type: "number"
                }
            },

            required: [
                "jobId"
            ]
        }
    }
}


const getRecruiterStatsTool = {

    type: "function",

    function: {

        name: "getRecruiterStats",

        description:
            "Get statistics for the currently logged-in recruiter, including total jobs, active jobs, closed jobs, drafts, total applications, and application status counts.",

        parameters: {

            type: "object",

            properties: {}
        }
    }
}


/*
========================================
ADMIN TOOLS
========================================
*/


const getPlatformStatsTool = {

    type: "function",

    function: {

        name: "getPlatformStats",

        description:
            "Get Job Portal platform statistics for the administrator, including users, candidates, recruiters, jobs, applications, and status counts.",

        parameters: {

            type: "object",

            properties: {}
        }
    }
}


const getUsersTool = {

    type: "function",

    function: {

        name: "getUsers",

        description:
            "Get users on the Job Portal. Supports searching by name or email and filtering by role. Use only for administrator requests.",

        parameters: {

            type: "object",

            properties: {

                search: {
                    type: "string"
                },

                role: {
                    type: "string",
                    enum: [
                        "candidate",
                        "recruiter",
                        "admin"
                    ]
                },

                page: {
                    type: "number"
                },

                limit: {
                    type: "number"
                }
            }
        }
    }
}


const getAllJobsTool = {

    type: "function",

    function: {

        name: "getAllJobs",

        description:
            "Get all jobs on the Job Portal for administrator monitoring. Supports search and status filtering.",

        parameters: {

            type: "object",

            properties: {

                search: {
                    type: "string"
                },

                status: {
                    type: "string",
                    enum: [
                        "active",
                        "closed",
                        "draft"
                    ]
                },

                page: {
                    type: "number"
                },

                limit: {
                    type: "number"
                }
            }
        }
    }
}


const getAllApplicationsTool = {

    type: "function",

    function: {

        name: "getAllApplications",

        description:
            "Get all applications on the Job Portal for administrator monitoring. Supports application status filtering.",

        parameters: {

            type: "object",

            properties: {

                status: {
                    type: "string",
                    enum: [
                        "applied",
                        "shortlisted",
                        "interview",
                        "selected",
                        "rejected",
                        "withdrawn"
                    ]
                },

                page: {
                    type: "number"
                },

                limit: {
                    type: "number"
                }
            }
        }
    }
}


/*
========================================
ROLE BASED TOOLS
========================================
*/


const getToolsForRole = (role) => {

    const commonTools = [
        searchJobsTool,
        getJobDetailsTool
    ]


    if (role === "candidate") {

        return [
            ...commonTools,
            getMyApplicationsTool,
            getMyProfileTool
        ]
    }


    if (role === "recruiter") {

        return [
            ...commonTools,
            getMyJobsTool,
            getApplicantsForJobTool,
            getRecruiterStatsTool
        ]
    }


    if (role === "admin") {

        return [
            ...commonTools,
            getPlatformStatsTool,
            getUsersTool,
            getAllJobsTool,
            getAllApplicationsTool
        ]
    }


    return commonTools
}


/*
========================================
CHAT CONTROLLER
========================================
*/


const chatController = async (req, res) => {

    try {

        const {
            messages,
            jobContext = []
        } = req.body


        if (
            !messages ||
            !Array.isArray(messages) ||
            messages.length === 0
        ) {

            return res.status(400).json({
                message:
                    "messages are required"
            })
        }


        const cleanMessages =
            messages
                .filter(
                    (item) =>
                        item &&
                        (
                            item.role === "user" ||
                            item.role === "assistant"
                        ) &&
                        typeof item.content === "string"
                )
                .map(
                    (item) => ({
                        role: item.role,
                        content: item.content
                    })
                )


        /*
        ========================================
        AUTHENTICATED USER
        ========================================
        */

        const userId =
            req.user.id

        const userRole =
            req.user.role


        /*
        ========================================
        PREVIOUS JOB CONTEXT
        ========================================
        */

        let previousJobContext = ""


        if (
            Array.isArray(jobContext) &&
            jobContext.length > 0
        ) {

            previousJobContext = `
Previous job search results:

${JSON.stringify(
    jobContext,
    null,
    2
)}

Use these job IDs when the user refers to:

- the first job
- the second job
- the third job
- that job
- this job
- the previous job
- tell me more about it
- its requirements
- its salary
- its location

Do not invent a job ID.
`
        }


        /*
        ========================================
        ROLE INSTRUCTIONS
        ========================================
        */

        let roleInstructions = ""


        if (userRole === "candidate") {

            roleInstructions = `
The current user is a CANDIDATE.

You may help the candidate with:

- finding jobs
- job details
- their applications
- their application status
- their profile

You may NOT access:

- other candidates' applications
- recruiter information beyond job information
- admin information
- platform-wide statistics
`
        }


        if (userRole === "recruiter") {

            roleInstructions = `
The current user is a RECRUITER.

You may help the recruiter with:

- finding active jobs
- job details
- their own jobs
- applicants for their own jobs
- their recruitment statistics

You may NOT access:

- another recruiter's jobs or applicants
- candidate private information unrelated to applications for their jobs
- admin platform information
`
        }


        if (userRole === "admin") {

            roleInstructions = `
The current user is an ADMIN.

You may help the administrator with:

- finding jobs
- job details
- platform statistics
- users
- all jobs
- all applications

Never expose passwords or refresh tokens.
`
        }


        /*
        ========================================
        SYSTEM MESSAGE
        ========================================
        */

        const systemMessage = {

            role: "system",

            content: `

You are the AI Assistant for this Job Portal.

Your job is to help the authenticated user
with this Job Portal only.

${roleInstructions}


========================================
GENERAL RULES
========================================

Use tools whenever the answer requires
actual information from the Job Portal.

Never invent:

- jobs
- companies
- salaries
- skills
- locations
- applications
- application statuses
- users
- statistics
- job IDs
- candidate information


========================================
JOB SEARCH
========================================

Use searchJobs when the user wants:

- jobs
- job search
- jobs by company
- jobs by location
- jobs by skills
- internships
- jobs by salary
- jobs by experience
- filtered jobs


If the user asks:

"Are there any jobs from Google?"

use:

company: "Google"

Do NOT use:

search: "Google"


========================================
JOB DETAILS
========================================

Use getJobDetails only for ONE specific job.

If the user says:

"Tell me more about the first one"

"Tell me more about it"

"What are the requirements?"

"What is the salary?"

Use the job ID from previous job context.

Never invent job IDs.


========================================
CANDIDATE APPLICATIONS
========================================

If the candidate asks:

"What is my application status?"

"Show my applications"

"Which jobs have I applied to?"

"How many applications do I have?"

"Which applications are shortlisted?"

use getMyApplications.


========================================
CANDIDATE PROFILE
========================================

If the candidate asks:

"What is my profile?"

"Do I have a resume?"

"What email is on my account?"

use getMyProfile.


========================================
RECRUITER JOBS
========================================

If the recruiter asks:

"Show my jobs"

"What jobs have I posted?"

"Which of my jobs are active?"

use getMyJobs.


========================================
RECRUITER APPLICANTS
========================================

If the recruiter asks about applicants
for one of their jobs:

- applicants
- candidates
- applications
- shortlisted candidates
- rejected candidates

use getApplicantsForJob.

Only use a job ID that is available
from previous context or the user's request.

Never invent a job ID.


========================================
RECRUITER STATISTICS
========================================

If the recruiter asks:

"How many applications do I have?"

"How are my jobs performing?"

"Give me my hiring statistics"

use getRecruiterStats.


========================================
ADMIN
========================================

If the admin asks about platform statistics,
use getPlatformStats.

If the admin asks about users,
use getUsers.

If the admin asks about all jobs,
use getAllJobs.

If the admin asks about applications across
the platform,
use getAllApplications.


========================================
MULTIPLE JOB RESPONSE
========================================

When displaying multiple jobs:

| # | Title | Company | Location | Salary | Experience |
|---|---|---|---|---|---|

Keep it concise.


========================================
SINGLE JOB RESPONSE
========================================

For one job, include useful details:

- Title
- Company
- Location
- Salary
- Employment type
- Experience
- Skills
- Description


========================================
APPLICATION RESPONSE
========================================

When showing applications, keep information
clear and concise.

Mention:

- Job
- Company
- Application status
- Applied date when available


========================================
SCOPE
========================================

Only answer questions related to this
Job Portal.

If the user asks something unrelated,
politely say that you can only help with
the Job Portal.


========================================
PREVIOUS JOB CONTEXT
========================================

${previousJobContext}

`
        }


        /*
        ========================================
        CONVERSATION
        ========================================
        */

        const conversation = [
            systemMessage,
            ...cleanMessages
        ]


        /*
        ========================================
        ROLE BASED TOOL LIST
        ========================================
        */

        const tools =
            getToolsForRole(
                userRole
            )


        /*
        ========================================
        FIRST AI REQUEST
        ========================================
        */

        let completion =
            await groq.chat.completions.create({

                model:
                    "openai/gpt-oss-20b",

                messages:
                    conversation,

                tools,

                tool_choice:
                    "auto"
            })


        /*
        ========================================
        TOOL LOOP
        ========================================
        */

        let iterations = 0

        const MAX_ITERATIONS = 5


        while (
            completion.choices[0]?.message?.tool_calls &&
            iterations < MAX_ITERATIONS
        ) {

            iterations++


            const assistantMessage =
                completion.choices[0].message


            conversation.push(
                assistantMessage
            )


            for (
                const toolCall
                of assistantMessage.tool_calls
            ) {

                const toolName =
                    toolCall.function.name


                let argumentsData


                try {

                    argumentsData =
                        JSON.parse(
                            toolCall.function.arguments
                        )

                } catch (error) {

                    conversation.push({

                        role: "tool",

                        tool_call_id:
                            toolCall.id,

                        name:
                            toolName,

                        content:
                            JSON.stringify({
                                error:
                                    "Invalid tool arguments"
                            })
                    })

                    continue
                }


                console.log(
                    "AI TOOL:",
                    toolName
                )

                console.log(
                    "AI TOOL ARGUMENTS:",
                    argumentsData
                )


                let toolResult


                /*
                ========================================
                JOB TOOLS
                ========================================
                */

                if (
                    toolName === "searchJobs"
                ) {

                    toolResult =
                        await searchJobs(
                            argumentsData
                        )
                }


                else if (
                    toolName === "getJobDetails"
                ) {

                    toolResult =
                        await getJobDetails(
                            argumentsData.jobId
                        )
                }


                /*
                ========================================
                CANDIDATE
                ========================================
                */

                else if (
                    toolName === "getMyApplications"
                ) {

                    toolResult =
                        await getMyApplications({

                            userId,

                            status:
                                argumentsData.status,

                            page:
                                argumentsData.page,

                            limit:
                                argumentsData.limit
                        })
                }


                else if (
                    toolName === "getMyProfile"
                ) {

                    toolResult =
                        await getMyProfile(
                            userId
                        )
                }


                /*
                ========================================
                RECRUITER
                ========================================
                */

                else if (
                    toolName === "getMyJobs"
                ) {

                    toolResult =
                        await getMyJobs({

                            userId,

                            status:
                                argumentsData.status,

                            page:
                                argumentsData.page,

                            limit:
                                argumentsData.limit
                        })
                }


                else if (
                    toolName ===
                    "getApplicantsForJob"
                ) {

                    toolResult =
                        await getApplicantsForJob({

                            userId,

                            jobId:
                                argumentsData.jobId,

                            status:
                                argumentsData.status,

                            page:
                                argumentsData.page,

                            limit:
                                argumentsData.limit
                        })
                }


                else if (
                    toolName ===
                    "getRecruiterStats"
                ) {

                    toolResult =
                        await getRecruiterStats(
                            userId
                        )
                }


                /*
                ========================================
                ADMIN
                ========================================
                */

                else if (
                    toolName ===
                    "getPlatformStats"
                ) {

                    toolResult =
                        await getPlatformStats()
                }


                else if (
                    toolName === "getUsers"
                ) {

                    toolResult =
                        await getUsers(
                            argumentsData
                        )
                }


                else if (
                    toolName === "getAllJobs"
                ) {

                    toolResult =
                        await getAllJobs(
                            argumentsData
                        )
                }


                else if (
                    toolName ===
                    "getAllApplications"
                ) {

                    toolResult =
                        await getAllApplications(
                            argumentsData
                        )
                }


                else {

                    toolResult = {
                        error:
                            "Unknown tool"
                    }
                }


                conversation.push({

                    role: "tool",

                    tool_call_id:
                        toolCall.id,

                    name:
                        toolName,

                    content:
                        JSON.stringify(
                            toolResult
                        )
                })
            }


            /*
            ========================================
            NEXT AI REQUEST
            ========================================
            */

            completion =
                await groq.chat.completions.create({

                    model:
                        "openai/gpt-oss-20b",

                    messages:
                        conversation,

                    tools,

                    tool_choice:
                        "auto"
                })
        }


        /*
        ========================================
        FINAL RESPONSE
        ========================================
        */

        const finalMessage =
            completion
                .choices[0]
                ?.message


        const reply =
            finalMessage?.content ||
            "Sorry, I could not generate a response."


        /*
        ========================================
        SAVE SEARCH CONTEXT
        ========================================
        */

        let newJobContext = null


        for (
            let i =
                conversation.length - 1;
            i >= 0;
            i--
        ) {

            const message =
                conversation[i]


            if (
                message.role === "tool" &&
                message.name === "searchJobs"
            ) {

                try {

                    const result =
                        JSON.parse(
                            message.content
                        )


                    if (
                        result.jobs &&
                        Array.isArray(
                            result.jobs
                        )
                    ) {

                        newJobContext =
                            result.jobs.map(
                                (job) => ({

                                    _id:
                                        job._id,

                                    title:
                                        job.title,

                                    company:
                                        job.company,

                                    location:
                                        job.location,

                                    salary:
                                        job.salary,

                                    employmentType:
                                        job.employmentType,

                                    skills:
                                        job.skills,

                                    experience:
                                        job.experience,

                                    status:
                                        job.status
                                })
                            )
                    }

                } catch (error) {

                    console.log(
                        "Could not parse job context:",
                        error
                    )
                }


                break
            }
        }


        return res.status(200).json({

            message:
                "Chat response generated successfully",

            reply,

            jobContext:
                newJobContext
        })

    } catch (error) {

        console.log(
            "AI controller error:",
            error
        )

        return res.status(500).json({

            message:
                "internal server error"
        })
    }
}


module.exports = {
    chatController
}