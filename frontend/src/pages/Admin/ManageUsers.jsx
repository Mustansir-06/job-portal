import { useEffect, useState } from "react"
import { useApi } from "../../api/axios"

const ManageUsers = () => {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [role, setRole] = useState("")

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0
  })

  const api = useApi()

  const getUsers = async () => {
    try {
      const res = await api.get(
        `/admin/users?search=${debouncedSearch}&role=${role}&page=${pagination.currentPage}&limit=10`
      )

      setUsers(res.data.users)
      setPagination(res.data.pagination)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)

      setPagination((prev) => ({
        ...prev,
        currentPage: 1
      }))
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    getUsers()
  }, [debouncedSearch, role, pagination.currentPage])

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm text-[#687386]">
        Administration
      </p>

      <h1 className="mt-1 text-3xl font-semibold text-[#173b57]">
        Manage users
      </h1>

      <div className="mt-8 flex gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-[#dfe4e9] bg-white px-4 py-3 outline-none"
          placeholder="Search users..."
        />

        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value)

            setPagination((prev) => ({
              ...prev,
              currentPage: 1
            }))
          }}
          className="border border-[#dfe4e9] bg-white px-4"
        >
          <option value="">All roles</option>
          <option value="candidate">Candidate</option>
          <option value="recruiter">Recruiter</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="mt-5 overflow-hidden border border-[#e2e6eb] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f7f8fa] text-[#687386]">
            <tr>
              <th className="px-5 py-4 font-medium">
                Name
              </th>

              <th className="px-5 py-4 font-medium">
                Email
              </th>

              <th className="px-5 py-4 font-medium">
                Role
              </th>

              <th className="px-5 py-4 font-medium">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="px-5 py-8 text-center text-sm text-[#687386]"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-[#e2e6eb]"
                >
                  <td className="px-5 py-4 font-medium text-[#173b57]">
                    {user.name}
                  </td>

                  <td className="px-5 py-4 text-[#687386]">
                    {user.email}
                  </td>

                  <td className="px-5 py-4 capitalize text-[#687386]">
                    {user.role}
                  </td>

                  <td className="px-5 py-4">
                    <button className="text-[#c97b4b]">
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm text-[#687386]">
          {pagination.totalUsers} users
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={pagination.currentPage === 1}
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                currentPage: prev.currentPage - 1
              }))
            }
            className="border border-[#dfe4e9] px-4 py-2 text-sm disabled:opacity-40"
          >
            Previous
          </button>

          <span className="px-3 py-2 text-sm text-[#687386]">
            {pagination.currentPage} / {pagination.totalPages}
          </span>

          <button
            disabled={
              pagination.currentPage === pagination.totalPages
            }
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                currentPage: prev.currentPage + 1
              }))
            }
            className="border border-[#dfe4e9] px-4 py-2 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default ManageUsers