
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, Home, Brain, Trophy, LogOut, Moon, Sun, Grip, BookA, User } from 'lucide-react';
import { storageService } from '../services/storageService';
import { UserState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<UserState | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const u = storageService.getUser();
    setUser(u);
    if (u?.settings.darkMode) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    // Smooth transition logic
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference
    if (user) {
        storageService.updateProfile(user.id, { settings: { ...user.settings, darkMode: newMode }});
    }
  };

  const handleLogout = () => {
    storageService.logout();
    navigate('/login');
  };

  // Nav Order: Kana -> Kanji -> Home -> Vocab -> Quiz
  // (Progress is in sidebar, or accessed via Home)
  const navItems = [
    { icon: <Grip size={24} />, label: "Kana", path: "/kana" },
    { icon: <BookOpen size={24} />, label: "Kanji", path: "/sets" },
    { icon: <Home size={28} />, label: "Home", path: "/", isHome: true },
    { icon: <BookA size={24} />, label: "Vocab", path: "/vocabulary" },
    { icon: <Brain size={24} />, label: "Quiz", path: "/quiz" },
  ];

  const sidebarItems = [
    { icon: <Home size={20} />, label: "Dashboard", path: "/" },
    { icon: <Grip size={20} />, label: "Kana Chart", path: "/kana" },
    { icon: <BookOpen size={20} />, label: "Kanji Sets", path: "/sets" },
    { icon: <BookA size={20} />, label: "Vocabulary", path: "/vocabulary" },
    { icon: <Brain size={20} />, label: "SRS Quiz", path: "/quiz" },
    { icon: <Trophy size={20} />, label: "Progress", path: "/progress" },
  ];

  const isActive = (path: string) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col md:flex-row font-sans transition-colors duration-300 pb-20 md:pb-0">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen sticky top-0 transition-colors duration-300">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-red-200/50 dark:shadow-red-900/50 font-jp">
                日
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">NihongoQuest</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Master Japanese</p>
              </div>
            </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
           <NavLink to="/profile" className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors">
               <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs">
                 {user?.avatar || '👤'}
               </div>
               <span className="truncate">{user?.username}</span>
           </NavLink>
        </div>
      </aside>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
         {/* HEADER (Mobile & Desktop) */}
         <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center transition-colors duration-300">
            {/* Mobile Branding */}
            <div className="md:hidden flex items-center gap-2">
               <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold font-jp">日</div>
               <h1 className="font-bold text-gray-900 dark:text-white">NihongoQuest</h1>
            </div>
            
            {/* Desktop spacer */}
            <div className="hidden md:block"></div>

            <div className="flex items-center gap-3">
               {/* Dark Mode Toggle */}
               <button 
                 onClick={toggleDarkMode}
                 className="group p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 active:scale-90"
                 aria-label="Toggle Dark Mode"
               >
                 <div className="relative w-6 h-6 transition-transform duration-500 transform rotate-0 group-hover:rotate-180">
                    {isDarkMode ? (
                        <Moon size={24} className="animate-in zoom-in spin-in-180 duration-300" />
                    ) : (
                        <Sun size={24} className="text-orange-500 animate-in zoom-in spin-in duration-300" />
                    )}
                 </div>
               </button>
               
               {/* Profile Icon (Mobile Only) */}
               <NavLink to="/profile" className="md:hidden w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-lg border border-red-200 dark:border-red-800">
                  {user?.avatar || '👤'}
               </NavLink>
            </div>
         </header>

         {/* PAGE CONTENT */}
         <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
           {children}
         </main>
      </div>

      {/* --- MOBILE BOTTOM NAVIGATION (Instagram Style) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pb-safe z-50 transition-colors duration-300">
        <div className="flex justify-around items-end h-16 pb-2">
           {navItems.map((item) => (
             <NavLink
               key={item.path}
               to={item.path}
               className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                 isActive(item.path)
                   ? 'text-red-600 dark:text-red-500' 
                   : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
               }`}
             >
                <div className={`${item.isHome ? 'mb-2 p-3 bg-red-600 text-white rounded-full shadow-lg shadow-red-500/30 transform -translate-y-2' : ''}`}>
                   {React.cloneElement(item.icon as React.ReactElement, { 
                     size: item.isHome ? 24 : 24,
                     className: item.isHome ? 'text-white' : ''
                   })}
                </div>
                {!item.isHome && <span className="text-[10px] font-medium mt-1">{item.label}</span>}
             </NavLink>
           ))}
        </div>
      </nav>

    </div>
  );
};

export default Layout;
