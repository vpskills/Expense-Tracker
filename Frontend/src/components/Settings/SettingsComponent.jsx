import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom"
import ThemeToggle from "../Themes/ThemeToggle";

const SettingsComponent = () => {
    const navigate = useNavigate();

    return (
        <div className="dark:text-slate-200 p-4">
            <nav className="flex items-center">
                <div onClick={() => navigate('/')}><IoChevronBack /></div>
                <div className="flex-1 flex justify-center items-center font-semibold">Settings</div>
            </nav>
            <main className="mt-10 space-y-7 rounded-lg p-2 bg-blue-50 dark:bg-neutral-700">
                <div className="flex justify-between items-center">
                    <span>Toggle Theme</span>
                    <ThemeToggle />
                </div>
            </main>
        </div>
    )
}

export default SettingsComponent