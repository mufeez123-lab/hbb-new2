import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  X, 
  LayoutDashboard, 
  Building2, 
  MessageSquare, 
  Settings, 
  Users, 
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminSidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
  currentPath: string;
}

const AdminSidebar = ({ isOpen, closeSidebar, currentPath }: AdminSidebarProps) => {
  const { logout } = useAuth();
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    closeSidebar();
  }, [location.pathname]);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Projects', href: '/admin/projects', icon: Building2 },
    { name: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    
    if (path !== '/admin' && location.pathname.startsWith(path)) {
      return true;
    }
    
    return false;
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-30 h-full w-64 bg-primary-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-primary-700">
          <Link to="/admin" className="flex items-center">
            <span className="font-serif text-xl font-bold">
              <span className="text-white">Hindustan</span>
              <span className="text-secondary-500">Bawa</span>
            </span>
          </Link>
          <button 
            className="lg:hidden text-white hover:text-neutral-300 focus:outline-none"
            onClick={closeSidebar}
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar content */}
        <div className="overflow-y-auto h-full py-4">
          <nav className="px-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-2 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary-700 text-white'
                    : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                }`}
              >
                <item.icon 
                  className={`mr-3 flex-shrink-0 h-6 w-6 ${
                    isActive(item.href) ? 'text-white' : 'text-primary-300 group-hover:text-white'
                  }`} 
                />
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Sidebar footer */}
          <div className="px-2 space-y-1 mt-8">
            <button
              onClick={logout}
              className="group flex items-center px-2 py-3 text-sm font-medium rounded-md text-primary-100 hover:bg-primary-700 hover:text-white w-full transition-colors"
            >
              <LogOut className="mr-3 flex-shrink-0 h-6 w-6 text-primary-300 group-hover:text-white" />
              Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;