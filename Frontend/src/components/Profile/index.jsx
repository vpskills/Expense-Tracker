import { IoChevronBack } from "react-icons/io5";
import { RiAccountCircleFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import {useSelector} from "react-redux"
import { useNavigate } from "react-router-dom"

const ProfileComponent = () => {
  const userData = useSelector((state) => state.auth?.userData);
  const navigate = useNavigate();
    
  return (
    <div className="dark:text-slate-200 p-4">
        <nav className="flex items-center">
          <div onClick={() => navigate('/')}><IoChevronBack/></div>
          <div className="flex-1 flex justify-center items-center">Profile</div>
        </nav>
        <main className="mt-10 space-y-7">
          <div className="flex gap-3 rounded-lg hover:bg-neutral-700/50 transition-colors cursor-pointer group">
            <RiAccountCircleFill className="w-8 h-8 text-blue-300" />
            <div>
              <div className="font-medium text-neutral-200 group-hover:text-white transition-colors">
                {userData?.name}
              </div>
              <span className="text-xs font-medium text-neutral-400 group-hover:text-white transition-colors">
                Name
              </span>
            </div>
          </div>

          <div className="flex gap-3 rounded-lg hover:bg-neutral-700/50 transition-colors cursor-pointer group">
          <MdEmail className="w-7 h-7 text-blue-300" />
            <div>
              <div className="font-medium text-neutral-200 group-hover:text-white transition-colors">
                {userData?.email}
              </div>
              <span className="text-xs font-medium text-neutral-400 group-hover:text-white transition-colors">
                Email
              </span>
            </div>
          </div>
        </main>
    </div>
  )
}

export default ProfileComponent