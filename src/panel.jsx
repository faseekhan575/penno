// src/pages/Panel.jsx
// Full merged version with beautiful animated logout confirmation modal
// Everything else remains exactly the same

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  AlertTriangle,
  MessageSquare,
  UserCog,
  Settings,
  Shield,
  Bell,
  Search,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const mockActivityData = [
  { month: 'Jan', value: 120 },
  { month: 'Feb', value: 180 },
  { month: 'Mar', value: 140 },
  { month: 'Apr', value: 200 },
  { month: 'May', value: 160 },
  { month: 'Jun', value: 240 },
  { month: 'Jul', value: 210 },
  { month: 'Aug', value: 190 },
  { month: 'Sep', value: 260 },
  { month: 'Oct', value: 300 },
  { month: 'Nov', value: 220 },
  { month: 'Dec', value: 180 },
];

const pendingApprovals = [
  {
    club: 'Greenfield United FC',
    category: 'GAA',
    email: 'contact@stpatricksparish.ie',
    time: '3h ago',
    status: 'Pending',
  },
  {
    club: 'Greenfield United FC',
    category: 'GAA',
    email: 'contact@stpatricksparish.ie',
    time: '3h ago',
    status: 'Pending',
  },
  // you can add more rows here later
];

export default function Panel() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const logout=()=>{
    navigate('/login')
  }

  const handleLogoutConfirm = () => {
    // ────────────────────────────────────────────────
    //       REAL LOGOUT LOGIC SHOULD GO HERE
    // ────────────────────────────────────────────────
    // Examples (choose one or combine):
    //
    // 1. React Router (if using react-router-dom v6+)
    //    navigate('/login');
    //
    // 2. Window redirect
    //    window.location.href = '/login';
    //
    // 3. Clear localStorage / sessionStorage + redirect
    //    localStorage.removeItem('token');
    //    localStorage.removeItem('user');
    //    window.location.href = '/';
    //
    // 4. Call logout API then redirect
    //    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    //    window.location.href = '/login';
    //
    // For demo right now:
    setShowLogoutModal(false);
    alert('Logged out successfully! (demo)');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      {/* ──────────────── SIDEBAR ──────────────── */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-gray-200">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white text-2xl font-bold">P</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">Penno</span>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-5 px-3">
          <div className="mb-8">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              OVERVIEW
            </p>
            <nav className="space-y-1">
            <NavLink
  to="/panel"
  end
  className={({ isActive }) =>
    `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
     ${isActive ? "bg-blue-200 text-blue-700" : "text-gray-700 hover:bg-gray-100"}`
  }
>
  <LayoutDashboard className="w-5 h-5 mr-3" />
  Dashboard
</NavLink>
            </nav>
          </div>

          <div className="mb-8">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              CLUB MANAGEMENT
            </p>
            <nav className="space-y-1">
             <NavLink
  to="/pending"
  className={({ isActive }) =>
    `flex items-center px-3 py-2 text-sm rounded-lg transition-colors
     ${isActive ? "bg-blue-700 text-gray-900" : "text-gray-700 hover:bg-gray-100"}`
  }
>
  <AlertTriangle className="w-5 h-5 mr-3 text-orange-500" />
  Pending approval
</NavLink>
              <a href="/active-clubs" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <ShieldCheck className="w-5 h-5 mr-3 text-green-500" />
                Active clubs
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <Shield className="w-5 h-5 mr-3 text-red-500" />
                Suspending clubs
              </a>
            </nav>
          </div>

          <div className="mb-8">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              PENS & MODERATION
            </p>
            <nav className="space-y-1">
              <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <MessageSquare className="w-5 h-5 mr-3" />
                All Pens
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <AlertTriangle className="w-5 h-5 mr-3 text-red-500" />
                Reported pens
              </a>
            </nav>
          </div>

          <div className="mb-8">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              USERS
            </p>
            <nav className="space-y-1">
              <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <Users className="w-5 h-5 mr-3" />
                Club owner
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <UserCog className="w-5 h-5 mr-3" />
                Verified poster
              </a>
            </nav>
          </div>

          <div className="mb-4">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              PLATFORM SETTINGS
            </p>
            <nav className="space-y-1">
              <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <Settings className="w-5 h-5 mr-3" />
                Categories
              </a>
              <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <Shield className="w-5 h-5 mr-3" />
                Safety rules
              </a>
            </nav>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setShowLogoutModal(true)}
           
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* ──────────────── MAIN CONTENT AREA ──────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard Overview</h1>

          <div className="flex items-center gap-5">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search clubs, pens, owners, emails..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                <img
                  src="https://i.pravatar.cc/80?u=jamesoneil"
                  alt="James O'Neil"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <p className="font-medium text-sm text-gray-900">James O'Neil</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-600">Total Followers</p>
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">56,230</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-600">Total Clubs</p>
                <ShieldCheck className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">124</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-600">Pens Today</p>
                <MessageSquare className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">87</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-600">Open Reports</p>
                <AlertTriangle className="w-6 h-6 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-xs text-red-600 mt-1 font-medium">▲ Needs review</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-600">Pending approval</p>
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-xl font-bold text-gray-900">+3 pending</p>
              <p className="text-xs text-green-600 mt-1 font-medium">↑ +120 today</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Platform Activity (Last Year)</h3>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700">
                  Clubs approved
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockActivityData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="month" axisLine={false} tick={{ fill: '#6b7280' }} />
                    <YAxis axisLine={false} tick={{ fill: '#6b7280' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="#3b82f6"
                      radius={[6, 6, 0, 0]}
                      barSize={28}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Notifications */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-5">Recent Notification</h3>
              <div className="space-y-5 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Greenfield United FC approved</p>
                  <p className="text-gray-600 mt-0.5">Soccer • admin@greenfieldfc.com</p>
                  <p className="text-gray-400 text-xs mt-1">10 min ago</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Pen reported in Senior Team</p>
                  <p className="text-gray-600 mt-0.5">Parish • contact@stpatricks.ie</p>
                  <p className="text-gray-400 text-xs mt-1">20 min ago</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Club suspended: Riverside FC</p>
                  <p className="text-gray-600 mt-0.5">GAA • sec@ballymoregaa.com</p>
                  <p className="text-gray-400 text-xs mt-1">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Approvals Table */}
          <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
                <p className="text-sm text-gray-600 mt-1">Clubs awaiting verification</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Club
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Official Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingApprovals.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full mr-3" />
                          <span className="font-medium text-gray-900">{item.club}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-red-600 hover:text-red-800 mr-4">Reject</button>
                        <button className="text-green-600 hover:text-green-800">Approve</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* ──────────────── LOGOUT MODAL ──────────────── */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8 text-center relative">
              {/* Animated warning icon */}
              <div className="relative mx-auto mb-6 w-24 h-24">
                <div className="absolute inset-0 rounded-full bg-red-500/10 animate-ping-slow"></div>
                <div className="absolute inset-2 rounded-full bg-red-500/20 animate-ping-slower"></div>
                <div className="w-full h-full rounded-full bg-red-500 flex items-center justify-center shadow-lg relative z-10">
                  <span className="text-white text-5xl font-bold">!</span>
                </div>

                {/* Floating particles */}
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-400 rounded-full animate-float"></span>
                <span className="absolute bottom-2 right-4 w-2 h-2 bg-red-300 rounded-full animate-float delay-150"></span>
                <span className="absolute top-6 right-0 w-1.5 h-1.5 bg-red-400 rounded-full animate-float delay-300"></span>
                <span className="absolute bottom-8 left-2 w-1.5 h-1.5 bg-red-300 rounded-full animate-float delay-450"></span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Log out of Penno Admin?
              </h2>

              <p className="text-gray-600 mb-8 leading-relaxed">
                You can log back in anytime using your admin credentials.
              </p>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors min-w-[120px]"
                >
                  Cancel
                </button>

                <button
                   onClick={logout}
                  className="px-8 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors shadow-md flex items-center gap-2 min-w-[140px] justify-center"
                >
                  Logout
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}