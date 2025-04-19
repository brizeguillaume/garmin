import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { 
  BarChart, 
  Activity, 
  Home, 
  Calendar, 
  Award, 
  Settings, 
  Zap,
  LifeBuoy
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useUser();

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-blue-700 text-white">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <Zap size={28} className="text-white" />
          <h1 className="text-xl font-bold">RunMetrics</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="px-4 mt-5">
          <div className="space-y-1">
            <NavLink 
              to="/dashboard" 
              className={({isActive}) => 
                `flex items-center px-4 py-3 text-white rounded-lg ${
                  isActive ? 'bg-blue-800' : 'hover:bg-blue-600'
                }`
              }
            >
              <Home className="h-5 w-5 mr-3" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink 
              to="/activities" 
              className={({isActive}) => 
                `flex items-center px-4 py-3 text-white rounded-lg ${
                  isActive ? 'bg-blue-800' : 'hover:bg-blue-600'
                }`
              }
            >
              <Activity className="h-5 w-5 mr-3" />
              <span>Activities</span>
            </NavLink>

            <NavLink 
              to="/stats" 
              className={({isActive}) => 
                `flex items-center px-4 py-3 text-white rounded-lg ${
                  isActive ? 'bg-blue-800' : 'hover:bg-blue-600'
                }`
              }
            >
              <BarChart className="h-5 w-5 mr-3" />
              <span>Statistics</span>
            </NavLink>

            <NavLink 
              to="/calendar" 
              className={({isActive}) => 
                `flex items-center px-4 py-3 text-white rounded-lg ${
                  isActive ? 'bg-blue-800' : 'hover:bg-blue-600'
                }`
              }
            >
              <Calendar className="h-5 w-5 mr-3" />
              <span>Calendar</span>
            </NavLink>

            <NavLink 
              to="/achievements" 
              className={({isActive}) => 
                `flex items-center px-4 py-3 text-white rounded-lg ${
                  isActive ? 'bg-blue-800' : 'hover:bg-blue-600'
                }`
              }
            >
              <Award className="h-5 w-5 mr-3" />
              <span>Achievements</span>
            </NavLink>
          </div>

          <div className="mt-8">
            <h3 className="px-4 text-xs font-semibold text-blue-300 uppercase tracking-wider">
              Settings
            </h3>
            <div className="mt-2 space-y-1">
              <NavLink 
                to="/connect-garmin" 
                className={({isActive}) => 
                  `flex items-center px-4 py-3 text-white rounded-lg ${
                    isActive ? 'bg-blue-800' : 'hover:bg-blue-600'
                  }`
                }
              >
                <Zap className="h-5 w-5 mr-3" />
                <span>{user?.isGarminConnected ? 'Garmin Connected' : 'Connect Garmin'}</span>
                {user?.isGarminConnected && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-green-400"></span>
                )}
              </NavLink>

              <NavLink 
                to="/settings" 
                className={({isActive}) => 
                  `flex items-center px-4 py-3 text-white rounded-lg ${
                    isActive ? 'bg-blue-800' : 'hover:bg-blue-600'
                  }`
                }
              >
                <Settings className="h-5 w-5 mr-3" />
                <span>Settings</span>
              </NavLink>
            </div>
          </div>
        </nav>
      </div>

      <div className="p-4 border-t border-blue-800">
        <a
          href="#help"
          className="flex items-center px-4 py-3 text-blue-100 hover:bg-blue-600 rounded-lg"
        >
          <LifeBuoy className="h-5 w-5 mr-3" />
          <span>Help & Support</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;