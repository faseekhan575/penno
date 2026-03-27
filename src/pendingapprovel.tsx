// src/pages/PendingApprovals.jsx
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
  X,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

const initialClubs = [
  {
    id: 'club-1',
    name: 'Greenfield United FC',
    logo: 'shield',
    category: 'Soccer',
    email: 'admin@greenfieldfc.com',
    time: '1h ago',
    owner: 'John Murphy (Club Owner)',
    location: 'Dublin (if provided)',
    submittedAt: '2026-02-02, 10:21 AM',
  },
  {
    id: 'club-2',
    name: 'River City Warriors',
    logo: 'circle',
    category: 'Community',
    email: 'info@rivercitywarriors.com',
    time: '2h ago',
    owner: 'Sarah Lee (Club Owner)',
    location: 'Not provided',
    submittedAt: '2026-02-02, 09:45 AM',
  },
  {
    id: 'club-3',
    name: 'Maple Leaf Athletic',
    logo: 'star',
    category: 'School',
    email: 'admin@mapleleafathletic.ca',
    time: '3h ago',
    owner: 'David Kim (Club Owner)',
    location: 'Toronto',
    submittedAt: '2026-02-02, 08:30 AM',
  },
  {
    id: 'club-4',
    name: 'Blue Horizon FC',
    logo: 'shield',
    category: 'GAA',
    email: 'contact@bluehorizonfc.ie',
    time: '4h ago',
    owner: 'Emma Walsh (Club Owner)',
    location: 'Not provided',
    submittedAt: '2026-02-02, 07:15 AM',
  },
  {
    id: 'club-5',
    name: 'Summit Spartans',
    logo: 'circle',
    category: 'Soccer',
    email: 'team@summitspartans.org',
    time: '5h ago',
    owner: 'Robert Brown (Club Owner)',
    location: 'Colorado',
    submittedAt: '2026-02-01, 16:00 PM',
  },
  {
    id: 'club-6',
    name: 'Desert Foxes FC',
    logo: 'shield',
    category: 'Community',
    email: 'contact@desertfoxesfc.com',
    time: '1h ago',
    owner: 'Alex Rivera (Club Owner)',
    location: 'Arizona',
    submittedAt: '2026-02-02, 11:00 AM',
  },
  {
    id: 'club-7',
    name: 'Coastal Breeze Club',
    logo: 'star',
    category: 'School',
    email: 'team@coastalbreezeclub.org',
    time: '2d ago',
    owner: 'Lisa Chen (Club Owner)',
    location: 'California',
    submittedAt: '2026-02-01, 10:00 AM',
  },
  {
    id: 'club-8',
    name: 'Urban Legends FC',
    logo: 'circle',
    category: 'GAA',
    email: 'support@urbanlegendsfc.com',
    time: '6h ago',
    owner: "Paul O'Connor (Club Owner)",
    location: 'Not provided',
    submittedAt: '2026-02-02, 12:30 PM',
  },
  {
    id: 'club-9',
    name: 'Silver Lake Strikers',
    logo: 'shield',
    category: 'GAA',
    email: 'contact@silverlakestrikers.com',
    time: '8h ago',
    owner: 'Mike Connor (Club Owner)',
    location: 'Not provided',
    submittedAt: '2026-02-01, 14:30 PM',
  },
  {
    id: 'club-10',
    name: 'Grand Spartans Club',
    logo: 'star',
    category: 'Soccer',
    email: 'info@grandspartans.com',
    time: '9h ago',
    owner: 'Anna Patel (Club Owner)',
    location: 'New York',
    submittedAt: '2026-02-02, 05:00 AM',
  },
  {
    id: 'club-11',
    name: 'Phoenix Rangers',
    logo: 'shield',
    category: 'GAA',
    email: 'admin@phoenixrangers.ie',
    time: '11h ago',
    owner: 'Liam Doyle (Club Owner)',
    location: 'Dublin',
    submittedAt: '2026-02-01, 19:20 PM',
  },
];

function getInitials(name) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function getBgColor(logo) {
  const colors = {
    shield: 'bg-blue-100 text-blue-700',
    star: 'bg-amber-100 text-amber-700',
    circle: 'bg-emerald-100 text-emerald-700',
  };
  return colors[logo] || 'bg-gray-100 text-gray-600';
}

function Toast({ type, title, message, onClose }) {
  setTimeout(onClose, 3800);
  const isSuccess = type === 'success';
  const bg = isSuccess ? 'bg-green-600' : 'bg-red-600';
  const Icon = isSuccess ? CheckCircle2 : XCircle;
  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-white ${bg} animate-in slide-in-from-top-5 fade-in duration-300`}
    >
      <Icon size={20} />
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm opacity-90">{message}</p>
      </div>
      <button onClick={onClose} className="ml-3 text-white/80 hover:text-white">
        <X size={18} />
      </button>
    </div>
  );
}

// ── helpers for localStorage ──────────────────────────────────────────────────
function getStoredPending() {
  try {
    const saved = localStorage.getItem('penno_pending');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function savePending(clubs) {
  localStorage.setItem('penno_pending', JSON.stringify(clubs));
}

function addToActive(club) {
  try {
    const saved = localStorage.getItem('penno_active');
    const active = saved ? JSON.parse(saved) : [];
    if (!active.find((c) => c.id === club.id)) {
      active.push({ ...club, status: 'active', reports: 0 });
      localStorage.setItem('penno_active', JSON.stringify(active));
    }
  } catch {
    /* ignore */
  }
}
// ─────────────────────────────────────────────────────────────────────────────

export default function PendingApprovals() {
  const [clubs, setClubs] = useState(() => getStoredPending() ?? initialClubs);

  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [selectedClub, setSelectedClub] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectNote, setRejectNote] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [sorting, setSorting] = useState('All');
  const [timeFilter, setTimeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Logout Modal State
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();

  // Logout handlers (same as Panel.jsx)
  const logout = () => {
    navigate('/login');
  };

  const handleLogoutConfirm = () => {
    // ────────────────────────────────────────────────
    //       REAL LOGOUT LOGIC SHOULD GO HERE
    // ────────────────────────────────────────────────
    // localStorage.removeItem('token');
    // localStorage.removeItem('user');
    // await fetch('/api/logout', { method: 'POST', credentials: 'include' });

    setShowLogoutModal(false);
    alert('Logged out successfully! (demo)');
    navigate('/login');
  };

  // ==================== REAL WORKING FILTER ====================
  let filteredClubs = clubs.filter((club) => {
    const matchesSearch =
      club.name.toLowerCase().includes(search.toLowerCase()) ||
      club.email.toLowerCase().includes(search.toLowerCase()) ||
      club.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || club.category === categoryFilter;

    let daysAgo = 0;
    if (club.time.includes('h ago')) daysAgo = 0;
    else if (club.time.includes('d ago')) daysAgo = parseInt(club.time) || 2;
    else daysAgo = 10;

    let matchesTime = true;
    if (timeFilter === 'Today') matchesTime = daysAgo <= 1;
    else if (timeFilter === 'Last 7 days') matchesTime = daysAgo <= 7;
    else if (timeFilter === 'Last 30 days') matchesTime = daysAgo <= 30;
    else if (timeFilter === 'Older than 30 days') matchesTime = daysAgo > 30;

    return matchesSearch && matchesCategory && matchesTime;
  });

  if (sorting === 'Ascending') {
    filteredClubs = [...filteredClubs].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sorting === 'Descending') {
    filteredClubs = [...filteredClubs].sort((a, b) => b.name.localeCompare(a.name));
  }

  const openClubDetails = (club) => {
    setSelectedClub(club);
  };

  const handleApproveFromRow = (club) => {
    setSelectedClub(club);
  };

  const handleApproveFromModal = () => {
    if (!selectedClub) return;

    addToActive(selectedClub);

    const updated = clubs.filter((c) => c.id !== selectedClub.id);
    setClubs(updated);
    savePending(updated);

    setToast({
      type: 'success',
      title: 'Club approved successfully',
      message: 'Club now appears in Active Clubs',
    });
    setSelectedClub(null);
  };

  const handleReject = (club) => {
    setSelectedClub(club);
    setRejectNote('');
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (!selectedClub) return;

    const updated = clubs.filter((c) => c.id !== selectedClub.id);
    setClubs(updated);
    savePending(updated);

    setToast({
      type: 'error',
      title: 'Reject club verification request',
      message: 'This club will not appear on Penno.',
    });
    setShowRejectModal(false);
    setSelectedClub(null);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-gray-200">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white text-2xl font-bold">P</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">Penno</span>
        </div>

        <div className="flex-1 overflow-y-auto py-5 px-3">
          <div className="mb-8">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              OVERVIEW
            </p>
            <nav className="space-y-1">
              <NavLink
                to="/panel"
                className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors text-gray-700 hover:bg-gray-100"
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
              <div className="flex items-center px-3 py-2 text-sm rounded-lg bg-blue-500 text-white font-medium">
                <AlertTriangle className="w-5 h-5 mr-3 text-white" />
                Pending approval
              </div>
              <NavLink
                to="/active-clubs"
                className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ShieldCheck className="w-5 h-5 mr-3 text-green-500" />
                Active clubs
              </NavLink>
              <NavLink
                to="/suspending-clubs"
                className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Shield className="w-5 h-5 mr-3 text-red-500" />
                Suspending clubs
              </NavLink>
            </nav>
          </div>

          <div className="mb-8">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              PENS & MODERATION
            </p>
            <nav className="space-y-1">
              <a href="/allpens" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <MessageSquare className="w-5 h-5 mr-3" />
                All Pens
              </a>
              <a href="/report" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
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
              <a href="/club-own" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <Users className="w-5 h-5 mr-3" />
                Club owner
              </a>
              <a href="/verify" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
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

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Pending Approvals</h1>
          <div className="flex items-center gap-5">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
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

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
                <p className="text-sm text-gray-600">
                  Clubs awaiting verification before they appear on Penno.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search club, email, category..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilterModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                Filter
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Official Email</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted time</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredClubs.map((club, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => openClubDetails(club)}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold shadow-sm ${getBgColor(
                              club.logo
                            )}`}
                          >
                            {getInitials(club.name)}
                          </div>
                          <span className="font-medium text-gray-900">{club.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{club.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{club.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{club.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                        <button
                          className="text-red-600 hover:text-red-800 transition-colors"
                          onClick={() => handleReject(club)}
                        >
                          Reject
                        </button>
                        <button
                          className="inline-flex items-center px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm"
                          onClick={() => handleApproveFromRow(club)}
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredClubs.length === 0 && (
                <div className="py-16 text-center text-gray-500">No matching clubs found</div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Club Details Modal */}
      {selectedClub && !showRejectModal && !showFilterModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Club details</h3>
              <button
                onClick={() => setSelectedClub(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center text-6xl shadow-sm">
                  🛡️
                </div>
                <p className="text-xs text-gray-400 mt-2">Club Logo</p>
              </div>
              <div className="flex gap-6">
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Club Name</p>
                  <p className="font-medium text-gray-900">{selectedClub.name}</p>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Official Email</p>
                  <p className="font-medium text-gray-900 break-all">{selectedClub.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="font-medium">{selectedClub.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Created by</p>
                  <p className="font-medium">{selectedClub.owner}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Club Location</p>
                  <p className="font-medium">{selectedClub.location}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Submitted at</p>
                <p className="font-medium">{selectedClub.submittedAt}</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setSelectedClub(null)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveFromModal}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
              >
                Approve club
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end items-start pointer-events-none">
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-md mt-16 mr-8 overflow-hidden pointer-events-auto"
          >
            <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Request Filter</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-3">Sorting</p>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Ascending', 'Descending'].map((opt) => (
                    <button
                      key={opt}
                      className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
                        sorting === opt
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setSorting(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-3">Time filter</p>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Today', 'Last 7 days', 'Last 30 days', 'Older than 30 days'].map((opt) => (
                    <button
                      key={opt}
                      className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
                        timeFilter === opt
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setTimeFilter(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-3">Category filter</p>
                <div className="flex flex-wrap gap-2">
                  {['All', 'GAA', 'Soccer', 'School', 'Community'].map((cat) => (
                    <button
                      key={cat}
                      className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${
                        categoryFilter === cat
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setCategoryFilter(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowFilterModal(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setSorting('All');
                  setTimeFilter('All');
                  setCategoryFilter('All');
                }}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Reset Filter
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedClub && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Reject club request</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3 text-red-700">
                <XCircle size={24} className="mt-0.5" />
                <div>
                  <p className="font-medium">Reject club verification request</p>
                  <p className="text-sm mt-1">This club will not appear on Penno.</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Optional note</label>
                <textarea
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  placeholder="Your club verification request was rejected because the email used is not an official club email..."
                  className="w-full h-28 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Reject club
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────── BEAUTIFUL LOGOUT MODAL (Same as Panel.jsx) ──────────────── */}
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
                  onClick={handleLogoutConfirm}
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