
import { Link } from "react-router"
import { Mail, Lock } from "lucide-react"
import { useForm } from "react-hook-form"
import { useContext } from "react"
import { store } from "../../context/AuthContext"
import api from "../../api/axios"

const Login = () => {
  const {setUser,setAccesstoken}=useContext(store)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const onSubmit = async(data) => {
    try {
      const res=await api.post("/auth/login",data)
      setUser(res.data.user)
      setAccesstoken(res.data.accesstoken)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="w-full max-w-md">
      <p className="text-sm font-semibold uppercase tracking-wider text-[#c97b4b]">
        Welcome back
      </p>

      <h1 className="mt-3 text-3xl font-semibold text-[#173b57]">
        Sign in to your account
      </h1>

      <p className="mt-3 text-sm leading-6 text-[#687386]">
        Login to continue managing your jobs and applications.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#173b57]">
            Email
          </span>

          <div className="flex items-center border border-[#dfe4e9] bg-white px-3">
            <Mail size={17} className="text-[#8a94a3]" />

            <input
              type="email"
              className="w-full px-3 py-3 outline-none"
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email"
                }
              })}
            />
          </div>

          {errors.email && (
            <p className="mt-1 text-xs text-red-500">
              {errors.email.message}
            </p>
          )}
        </label>

        <label className="block">
          <div className="mb-2 flex justify-between">
            <span className="text-sm font-medium text-[#173b57]">
              Password
            </span>

            <button
              type="button"
              className="text-xs text-[#c97b4b]"
            >
              Forgot password?
            </button>
          </div>

          <div className="flex items-center border border-[#dfe4e9] bg-white px-3">
            <Lock size={17} className="text-[#8a94a3]" />

            <input
              type="password"
              className="w-full px-3 py-3 outline-none"
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
              })}
            />
          </div>

          {errors.password && (
            <p className="mt-1 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </label>

        <button
          type="submit"
          className="w-full bg-[#173b57] py-3 text-sm font-semibold text-white hover:bg-[#102c43]"
        >
          Sign in
        </button>

      </form>

      <p className="mt-7 text-center text-sm text-[#687386]">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-[#c97b4b]"
        >
          Create one
        </Link>
      </p>
    </div>
  )
}

export default Login

