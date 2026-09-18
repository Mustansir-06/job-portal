import { Outlet } from "react-router"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import AIAssistant from "../components/AIAssistant/AIAssistant"

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1">
                <Outlet />
            </main>

            <Footer />

            <AIAssistant />
        </div>
    )
}

export default MainLayout