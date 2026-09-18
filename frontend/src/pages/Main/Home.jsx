import { Link, useNavigate } from "react-router"
import { Search, MapPin, ArrowUpRight, Building2, Users, BriefcaseBusiness, CheckCircle2 } from "lucide-react"
import JobCard from "../../components/JobCard"
import { useEffect, useState } from "react"
import { useApi } from "../../api/axios"

const stats = [
  { n: "12,000+", l: "Open positions", I: BriefcaseBusiness },
  { n: "2,400+", l: "Companies hiring", I: Building2 },
  { n: "18,000+", l: "Candidates placed", I: Users },
  { n: "94%", l: "Successful matches", I: CheckCircle2 },
]

const serif = { fontFamily: "'Fraunces', Georgia, serif" }

const Home = () => {
  const [jobs, setJobs] = useState([])
  const [search, setSearch] = useState("")
  const [location, setLocation] = useState("")

  const api = useApi()
  const navigate = useNavigate()

  const getJobs = async () => {
    try {
      const res = await api.get("/jobs?status=active&sortBy=newest&limit=3")

      setJobs(res.data.alljobs)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearch = () => {
    const params = new URLSearchParams()

    if (search) {
      params.set("search", search)
    }

    if (location) {
      params.set("location", location)
    }

    navigate(`/jobs?${params.toString()}`)
  }

  useEffect(() => {
    getJobs()
  }, [])

  return (
    <div className="bg-[#f7f8fa]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&display=swap');`}</style>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-16 lg:px-10 lg:pb-24 lg:pt-24">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">

          <div className="flex flex-col justify-center">
            <h1
              style={serif}
              className="max-w-lg text-[2.75rem] font-medium leading-[1.08] text-[#173b57] sm:text-6xl lg:text-5xl xl:text-6xl"
            >
              Find a job that moves you forward
            </h1>

            <p className="mt-6 max-w-md text-lg leading-7 text-[#687386]">
              Search open roles from companies that are hiring right now, and apply in a few minutes.
            </p>

            <div className="mt-10 max-w-xl">
              <div className="flex flex-col divide-y divide-[#dfe4e9] border-b-2 border-[#173b57] sm:flex-row sm:divide-x sm:divide-y-0">

                <label className="flex flex-1 items-center gap-3 py-3 sm:pr-4">
                  <Search size={18} className="shrink-0 text-[#c97b4b]" />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch()
                      }
                    }}
                    className="w-full min-w-0 bg-transparent text-[#173b57] outline-none placeholder:text-[#9aa3b2]"
                    placeholder="Job title, skill or company"
                  />
                </label>

                <label className="flex flex-1 items-center gap-3 py-3 sm:px-4">
                  <MapPin size={17} className="shrink-0 text-[#c97b4b]" />

                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch()
                      }
                    }}
                    className="w-full min-w-0 bg-transparent text-[#173b57] outline-none placeholder:text-[#9aa3b2]"
                    placeholder="Location"
                  />
                </label>

                <button
                  onClick={handleSearch}
                  className="flex items-center justify-center gap-2 bg-[#173b57] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0f2c42] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c97b4b]"
                >
                  Search jobs
                </button>

              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[#687386]">
              <span>Popular searches</span>
              <span className="text-[#c9cfd8]">·</span>

              {["React Developer", "Software Engineer", "Internship", "Remote"].map((x, i) => (
                <span key={x} className="flex items-center gap-3">
                  <Link
                    to={`/jobs?search=${encodeURIComponent(x)}`}
                    className="text-[#173b57] underline decoration-[#d7dce2] underline-offset-4 hover:text-[#c97b4b] hover:decoration-[#c97b4b]"
                  >
                    {x}
                  </Link>

                  {i < 3 && (
                    <span className="text-[#c9cfd8]">·</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Latest openings */}
          <div className="border border-[#dfe4e9] bg-white">

            <div className="flex items-baseline justify-between border-b border-[#dfe4e9] px-6 py-4">
              <h2 style={serif} className="text-lg text-[#173b57]">
                This week's openings
              </h2>

              <Link
                to="/jobs"
                className="text-sm font-medium text-[#c97b4b] hover:text-[#173b57]"
              >
                View all
              </Link>
            </div>

            <div className="divide-y divide-[#dfe4e9]">

              {jobs.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-[#687386]">
                    No openings available right now.
                  </p>
                </div>
              ) : (
                jobs.map((job, i) => (
                  <Link
                    key={job._id}
                    to={`/jobs/${job._id}`}
                    className="group flex items-center gap-4 px-6 py-5 transition-colors hover:bg-[#f7f8fa]"
                  >
                    <span
                      style={serif}
                      className="text-2xl text-[#dcc0aa]"
                    >
                      0{i + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-[#173b57]">
                        {job.title}
                      </p>

                      <p className="mt-1 text-sm text-[#687386]">
                        {job.company} · {job.location}
                      </p>
                    </div>

                    <div className="hidden text-right sm:block">
                      <p className="text-sm font-medium text-[#173b57]">
                        ₹{job.salary.toLocaleString("en-IN")}
                      </p>

                      <p className="mt-1 text-xs text-[#9aa3b2]">
                        {job.employmentType}
                      </p>
                    </div>

                    <ArrowUpRight
                      size={18}
                      className="shrink-0 text-[#c9cfd8] transition-colors group-hover:text-[#c97b4b]"
                    />
                  </Link>
                ))
              )}

            </div>
          </div>

        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#173b57]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-8 px-6 py-14 lg:grid-cols-4 lg:px-10">

          {stats.map(({ n, l, I }) => (
            <div key={l}>
              <I size={18} className="text-[#c97b4b]" />

              <p
                style={serif}
                className="mt-4 text-3xl text-white lg:text-4xl"
              >
                {n}
              </p>

              <p className="mt-1 text-sm text-[#a9bacb]">
                {l}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* Latest opportunities */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">

        <div className="flex items-end justify-between border-b border-[#dfe4e9] pb-6">
          <h2
            style={serif}
            className="text-3xl text-[#173b57]"
          >
            Latest opportunities
          </h2>

          <Link
            to="/jobs"
            className="hidden text-sm font-semibold text-[#173b57] hover:text-[#c97b4b] sm:block"
          >
            View all jobs
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

          {jobs.length === 0 ? (
            <p className="text-sm text-[#687386]">
              No opportunities available right now.
            </p>
          ) : (
            jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
              />
            ))
          )}

        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-y border-[#e2e6eb] bg-white"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">

          <h2
            style={serif}
            className="text-3xl text-[#173b57]"
          >
            From search to offer
          </h2>

          <div className="relative mt-14 grid gap-10 md:grid-cols-3">

            <div className="absolute left-0 right-0 top-[7px] hidden h-px bg-[#dfe4e9] md:block" />

            {[
              ["Discover", "Search roles using the skills, location and experience that matter to you."],
              ["Apply", "Send your application and resume directly through the platform."],
              ["Move forward", "Track your application as it progresses from review to interview and beyond."],
            ].map(([t, d]) => (
              <div key={t} className="relative">

                <div className="h-3.5 w-3.5 rounded-full bg-[#c97b4b]" />

                <h3
                  style={serif}
                  className="mt-5 text-xl text-[#173b57]"
                >
                  {t}
                </h3>

                <p className="mt-3 max-w-xs leading-7 text-[#687386]">
                  {d}
                </p>

              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Employers CTA */}
      <section
        id="employers"
        className="relative overflow-hidden bg-[#ede9e4]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(23,59,87,0.05) 0px, rgba(23,59,87,0.05) 1px, transparent 1px, transparent 26px)",
        }}
      >
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 py-16 sm:flex-row sm:items-center lg:px-10">

          <div>
            <h2
              style={serif}
              className="max-w-md text-3xl text-[#173b57]"
            >
              Looking for your next great hire?
            </h2>

            <p className="mt-3 max-w-xl text-[#687386]">
              Post an opening and connect with candidates who are ready to make an impact.
            </p>
          </div>

          <Link
            to="/register"
            className="inline-flex w-fit shrink-0 items-center gap-2 bg-[#173b57] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0f2c42]"
          >
            Post a job
            <ArrowUpRight size={16} />
          </Link>

        </div>
      </section>

    </div>
  )
}

export default Home