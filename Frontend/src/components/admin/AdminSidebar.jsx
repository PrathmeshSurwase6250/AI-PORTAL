import { NavLink, useLocation } from 'react-router-dom';
import { 
  IoGridOutline, 
  IoPeopleOutline, 
  IoBriefcaseOutline, 
  IoDocumentTextOutline, 
  IoChatbubbleEllipsesOutline,
  IoLogOutOutline,
  IoLockClosedOutline
} from 'react-icons/io5';
import { BsRobot } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserData } from '../../redux/userSlice';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setUserData(null));
    navigate("/auth");
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <IoGridOutline />, exact: true },
    { name: 'Users', path: '/admin/users', icon: <IoPeopleOutline /> },
    { name: 'Jobs', path: '/admin/jobs', icon: <IoBriefcaseOutline /> },
    { name: 'Applications', path: '/admin/applications', icon: <IoDocumentTextOutline /> },
    { name: 'Reset Requests', path: '/admin/reset-requests', icon: <IoLockClosedOutline />, badge: true },
    { name: 'Feedback', path: '/admin/feedback', icon: <IoChatbubbleEllipsesOutline /> },
  ];

  return (
    <aside className="h-full w-64 bg-white border-r border-gray-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col z-20">
      {/* Logo */}
      <div className="flex items-center gap-3 h-16 px-6 border-b border-gray-100">
        <div className="bg-brand-600 text-white p-2 rounded-lg relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
          <BsRobot size={20} className="relative z-10" />
        </div>
        <span className="font-heading font-bold text-xl tracking-tight text-brand-900">
          AdminPanel
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto w-[calc(100%-8px)] hover:w-[calc(100%)] scrollbar-hide">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Menu</p>
        
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.exact}
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 group ${
                isActive 
                  ? 'bg-brand-50 text-brand-600 shadow-[inset_4px_0_0_#2563eb]' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </div>
                <span className="tracking-wide text-sm">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-100">
        <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-all duration-200 group mt-1"
          >
            <IoLogOutOutline className="text-xl group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="tracking-wide text-sm font-bold">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
