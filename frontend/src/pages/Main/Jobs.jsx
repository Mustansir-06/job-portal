import { Search, SlidersHorizontal } from "lucide-react"
import JobCard from "../../components/JobCard"
import { useEffect, useState } from "react"
import { useApi } from "../../api/axios"

const Jobs = () => {

  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [search, setSearch] = useState("")

  const [locations, setLocations] = useState([])

  const [employmentTypes, setEmploymentTypes] = useState([])

  const [experienceRange, setExperienceRange] = useState("")

  const [sortBy, setSortBy] = useState("newest")

  const [page, setPage] = useState(1)

  const [totalPages, setTotalPages] = useState(1)

  const [totalJobs, setTotalJobs] = useState(0)

  const api = useApi()


  const getjobs = async (
    searchValue = "",
    locationValue = locations,
    employmentValue = employmentTypes,
    experienceValue = experienceRange,
    sortValue = sortBy,
    pageValue = page
  ) => {

    try {

      setIsLoading(true)

      let minExperience = ""
      let maxExperience = ""


      if (experienceValue === "0-1") {

        minExperience = 0
        maxExperience = 1

      }

      if (experienceValue === "1-3") {

        minExperience = 1
        maxExperience = 3

      }

      if (experienceValue === "3-5") {

        minExperience = 3
        maxExperience = 5

      }

      if (experienceValue === "5+") {

        minExperience = 5

      }


      const res = await api.get("/jobs", {
        params: {

          search: searchValue,

          location: locationValue.join(","),

          employmentType: employmentValue.join(","),

          minExperience,

          maxExperience,

          sortBy: sortValue,

          page: pageValue,

          limit: 6

        }
      })


      setJobs(res.data.alljobs)

      setTotalPages(
        res.data.pagination.totalPages
      )

      setTotalJobs(
        res.data.pagination.totalJobs
      )

    } catch (error) {

      console.log(error)

    } finally {

      setIsLoading(false)

    }

  }


  const handleSearch = () => {

    setPage(1)

    getjobs(
      search,
      locations,
      employmentTypes,
      experienceRange,
      sortBy,
      1
    )

  }


  const handleSort = (e) => {

    const value = e.target.value

    setSortBy(value)

    setPage(1)

    getjobs(
      search,
      locations,
      employmentTypes,
      experienceRange,
      value,
      1
    )

  }


  const handlePageChange = (pageNumber) => {

    setPage(pageNumber)

    getjobs(
      search,
      locations,
      employmentTypes,
      experienceRange,
      sortBy,
      pageNumber
    )

  }


  useEffect(() => {

    getjobs()

  }, [])


  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10">

      <div className="border-b border-[#e2e6eb] pb-8">

        <p className="text-sm font-semibold uppercase tracking-wider text-[#c97b4b]">
          Opportunities
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#173b57] sm:text-4xl">
          Find your next role.
        </h1>

        <p className="mt-3 text-[#687386]">
          Browse openings from companies hiring now.
        </p>

      </div>


      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-8">


        {/* Filters */}

        <aside className="hidden border border-[#e2e6eb] bg-white p-5 lg:block">

          <div className="flex items-center justify-between">

            <h2 className="font-semibold text-[#173b57]">
              Filters
            </h2>

            <SlidersHorizontal
              size={17}
              className="text-[#687386]"
            />

          </div>


          {/* Location */}

          <div className="mt-7">

            <p className="text-sm font-semibold text-[#173b57]">
              Location
            </p>

            <div className="mt-3 space-y-3">

              {[
                "Pune",
                "Mumbai",
                "Bengaluru",
                "Remote"
              ].map(x => (

                <label
                  key={x}
                  className="flex items-center gap-3 text-sm text-[#687386]"
                >

                  <input
                    type="checkbox"
                    className="accent-[#173b57]"
                    value={x}
                    checked={locations.includes(x)}
                    onChange={(e) => {

                      if (e.target.checked) {

                        setLocations([
                          ...locations,
                          x
                        ])

                      } else {

                        setLocations(
                          locations.filter(
                            location => location !== x
                          )
                        )

                      }

                    }}
                  />

                  {x}

                </label>

              ))}

            </div>

          </div>


          {/* Employment */}

          <div className="mt-7">

            <p className="text-sm font-semibold text-[#173b57]">
              Employment
            </p>

            <div className="mt-3 space-y-3">

              {[
                ["Full-time", "full-time"],
                ["Part-time", "part-time"],
                ["Internship", "internship"],
                ["Contract", "contract"]
              ].map(([label, value]) => (

                <label
                  key={value}
                  className="flex items-center gap-3 text-sm text-[#687386]"
                >

                  <input
                    type="checkbox"
                    className="accent-[#173b57]"
                    value={value}
                    checked={employmentTypes.includes(value)}
                    onChange={(e) => {

                      if (e.target.checked) {

                        setEmploymentTypes([
                          ...employmentTypes,
                          value
                        ])

                      } else {

                        setEmploymentTypes(
                          employmentTypes.filter(
                            type => type !== value
                          )
                        )

                      }

                    }}
                  />

                  {label}

                </label>

              ))}

            </div>

          </div>


          {/* Experience */}

          <div className="mt-7">

            <p className="text-sm font-semibold text-[#173b57]">
              Experience
            </p>

            <div className="mt-3 space-y-3">

              {[
                ["0–1 years", "0-1"],
                ["1–3 years", "1-3"],
                ["3–5 years", "3-5"],
                ["5+ years", "5+"]
              ].map(([label, value]) => (

                <label
                  key={value}
                  className="flex items-center gap-3 text-sm text-[#687386]"
                >

                  <input
                    type="checkbox"
                    className="accent-[#173b57]"
                    checked={experienceRange === value}
                    onChange={() => {

                      if (experienceRange === value) {

                        setExperienceRange("")

                      } else {

                        setExperienceRange(value)

                      }

                    }}
                  />

                  {label}

                </label>

              ))}

            </div>

          </div>

        </aside>


        {/* Jobs */}

        <div>


          {/* Search + Sort */}

          <div className="flex flex-col gap-3 sm:flex-row">


            <div className="flex flex-1 items-center gap-3 border border-[#dfe4e9] bg-white px-4">

              <Search
                size={17}
                className="text-[#687386]"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-3 outline-none"
                placeholder="Search jobs, skills or companies"
              />

            </div>


            <button
              onClick={handleSearch}
              className="bg-[#173b57] px-6 py-3 text-sm font-semibold text-white hover:bg-[#123149]"
            >
              Search
            </button>


            <select
              value={sortBy}
              onChange={handleSort}
              className="border border-[#dfe4e9] bg-white px-4 py-3 text-sm outline-none"
            >

              <option value="newest">
                Newest
              </option>

              <option value="salaryHigh">
                Salary: high to low
              </option>

              <option value="salaryLow">
                Salary: low to high
              </option>

            </select>

          </div>


          {/* Job count */}

          <div className="mt-6 flex items-center justify-between">

            <p className="text-sm text-[#687386]">

              Showing{" "}

              <strong className="text-[#173b57]">
                {totalJobs}
              </strong>{" "}

              opportunities

            </p>


            <button className="text-sm text-[#173b57] lg:hidden">
              Filters
            </button>

          </div>


          {/* Job cards */}

          <div className="mt-4 grid min-w-0 gap-4 sm:grid-cols-2">

            {isLoading ? (

              <p className="text-sm text-[#687386]">
                Loading jobs...
              </p>

            ) : jobs.length === 0 ? (

              <p className="text-sm text-[#687386]">
                No jobs found.
              </p>

            ) : (

              jobs.map(job => (

                <JobCard
                  key={job._id}
                  job={job}
                />

              ))

            )}

          </div>


          {/* Pagination */}

          {totalPages > 1 && (

            <div className="mt-10 flex justify-center gap-2">

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map(pageNumber => (

                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={
                    page === pageNumber
                      ? "border border-[#dfe4e9] bg-[#173b57] px-4 py-2 text-sm text-white"
                      : "border border-[#dfe4e9] bg-white px-4 py-2 text-sm text-[#687386]"
                  }
                >
                  {pageNumber}
                </button>

              ))}

            </div>

          )}


        </div>

      </div>

    </div>
  )
}

export default Jobs