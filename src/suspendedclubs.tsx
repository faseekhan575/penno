// src/pages/SuspendingClubs.jsx
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
  ArrowLeft,
} from 'lucide-react';
import { useState, useEffect } from 'react';

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
  useEffect(() => {
    const timer = setTimeout(onClose, 3800);
    return () => clearTimeout(timer);
  }, [onClose]);

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

export default function SuspendingClubs() {
  const [suspendedClubs, setSuspendedClubs] = useState(() => {
    try {
      const saved = localStorage.getItem('penno_suspended');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sorting, setSorting] = useState('All');
  const [timeFilter, setTimeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [note, setNote] = useState('');
  const [notification, setNotification] = useState(true);

  // View mode state
  const [selectedClubForReview, setSelectedClubForReview] = useState(null);

  // Logout Modal State
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();

  // Logout handlers (same as all other pages)
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

  // Keep localStorage in sync
  useEffect(() => {
    localStorage.setItem('penno_suspended', JSON.stringify(suspendedClubs));
  }, [suspendedClubs]);

  // Re-read from localStorage when page gains focus
  useEffect(() => {
    const onFocus = () => {
      try {
        const saved = localStorage.getItem('penno_suspended');
        if (saved) setSuspendedClubs(JSON.parse(saved));
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  let filteredClubs = suspendedClubs.filter((club) => {
    const matchesSearch =
      club.name.toLowerCase().includes(search.toLowerCase()) ||
      club.email.toLowerCase().includes(search.toLowerCase()) ||
      club.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || club.category === categoryFilter;

    let daysAgo = 0;
    if (club.time && club.time.includes('h ago')) daysAgo = 0;
    else if (club.time && club.time.includes('d ago')) daysAgo = parseInt(club.time) || 2;
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
    filteredClubs = [...filteredClubs].sort((a, b) => b.name.localeCompare(b.name));
  }

  const openReview = (club) => {
    setSelectedClubForReview(club);
  };

  const closeReview = () => {
    setSelectedClubForReview(null);
  };

  const openReactivateModal = (id) => {
    setSelectedId(id);
    setNote('');
    setNotification(true);
    setShowReactivateModal(true);
  };

  const closeModals = () => {
    setShowReactivateModal(false);
    setSelectedId(null);
  };

  const handleReactivateConfirm = () => {
    if (!selectedId) return;

    const club = suspendedClubs.find((c) => c.id === selectedId);
    if (!club) return;

    setSuspendedClubs((prev) => prev.filter((c) => c.id !== selectedId));

    try {
      const saved = localStorage.getItem('penno_active');
      const active = saved ? JSON.parse(saved) : [];
      if (!active.find((c) => c.id === club.id)) {
        active.push({ ...club, status: 'active' });
      } else {
        const idx = active.findIndex((c) => c.id === club.id);
        active[idx] = { ...club, status: 'active' };
      }
      localStorage.setItem('penno_active', JSON.stringify(active));
    } catch {
      /* ignore */
    }

    setToast({
      type: 'success',
      title: 'Club re-activated',
      message: 'The club is now visible again on Penno.',
    });
    closeModals();
    closeReview();
  };

  const selectedClub = suspendedClubs.find((c) => c.id === selectedId);

  // ==================== REVIEW MODE ====================
  if (selectedClubForReview) {
    const club = selectedClubForReview;

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
                <NavLink
                  to="/pending"
                  className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <AlertTriangle className="w-5 h-5 mr-3" />
                  Pending approval
                </NavLink>
                <NavLink
                  to="/active-clubs"
                  className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ShieldCheck className="w-5 h-5 mr-3 text-green-500" />
                  Active clubs
                </NavLink>
                <div className="flex items-center px-3 py-2 text-sm rounded-lg bg-blue-500 text-white font-medium">
                  <Shield className="w-5 h-5 mr-3 text-white" />
                  Suspending clubs
                </div>
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

          {/* Logout Button in Review Mode */}
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

        {/* REVIEW PAGE CONTENT */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
            <button
              onClick={closeReview}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Suspended club review</h1>
          </header>

          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-semibold shadow-sm ${getBgColor(
                      club.logo
                    )}`}
                  >
                    {getInitials(club.name)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Club Name</p>
                    <p className="text-xl font-semibold text-gray-900">{club.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-y-6 gap-x-8 mt-8 text-sm">
                  <div>
                    <p className="text-gray-500">Official Email</p>
                    <p className="font-medium mt-1">{club.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Category</p>
                    <p className="font-medium mt-1">{club.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Created by</p>
                    <p className="font-medium mt-1">John Murphy</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Club Location</p>
                    <p className="font-medium mt-1">Dublin (if provided)</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Current Status</p>
                    <span className="inline-flex mt-1 px-4 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                      Suspended
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Suspension Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-gray-500">Suspended on</p>
                    <p className="text-sm font-medium mt-1">
                      {club.suspendedAt || club.time || '2026-02-02, 10:21 AM'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Suspended by</p>
                    <p className="text-sm font-medium mt-1">James O&apos;Neil (Super Admin)</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Note</p>
                    <p className="text-sm font-medium mt-1 text-gray-700">
                      Multiple reports on urgent training posts + repeated edits
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-5">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Recent Reports</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 text-xs font-medium text-gray-500">Reported Pen Title</th>
                        <th className="text-left py-3 text-xs font-medium text-gray-500">Type</th>
                        <th className="text-left py-3 text-xs font-medium text-gray-500">Last reported</th>
                        <th className="text-left py-3 text-xs font-medium text-gray-500">Reports count</th>
                        <th className="text-right py-3 text-xs font-medium text-gray-500">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="py-4 text-sm">Training Schedule Update</td>
                        <td className="py-4 text-sm">Update</td>
                        <td className="py-4 text-sm text-gray-500">2h ago</td>
                        <td className="py-4 text-sm">10</td>
                        <td className="py-4 text-right">
                          <button className="px-4 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded">View</button>
                          <button className="ml-2 px-4 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded">Remove</button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4 text-sm">Senior Team Training</td>
                        <td className="py-4 text-sm">Event</td>
                        <td className="py-4 text-sm text-gray-500">10 Sep 2026, 5:00 PM</td>
                        <td className="py-4 text-sm">3</td>
                        <td className="py-4 text-right">
                          <button className="px-4 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded">View</button>
                          <button className="ml-2 px-4 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded">Remove</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="px-6 py-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={closeReview}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => openReactivateModal(club.id)}
                  className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center gap-2"
                >
                  Re-activate
                </button>
              </div>
            </div>
          </main>
        </div>

        {/* REACTIVATE MODAL in Review Mode */}
        {showReactivateModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-2xl w-[400px]">
              <div className="p-5">
                <div className="mt-1">
                  <label className="block text-sm font-medium text-gray-700">Optional note</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm h-20 resize-y"
                    placeholder="Why are we reactivating?"
                  />
                </div>

                <div className="mt-5">
                  <div className="text-sm font-medium text-gray-700 mb-2">Notification</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center">👤</div>
                      <div>
                        <p className="text-sm font-medium">{club.name}</p>
                        <p className="text-xs text-gray-500">Club owner</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Send owner a reactivation notice</span>
                      <button
                        onClick={() => setNotification(!notification)}
                        className={`relative h-6 w-11 flex items-center rounded-full transition-all ${notification ? 'bg-blue-600' : 'bg-gray-300'}`}
                      >
                        <div className={`h-5 w-5 bg-white rounded-full shadow transition-all ${notification ? 'translate-x-6' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={closeModals}
                    className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReactivateConfirm}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium"
                  >
                    Re-activate club
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==================== ORIGINAL LIST VIEW ====================
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
              <NavLink
                to="/pending"
                className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <AlertTriangle className="w-5 h-5 mr-3" />
                Pending approval
              </NavLink>
              <NavLink
                to="/active-clubs"
                className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ShieldCheck className="w-5 h-5 mr-3 text-green-500" />
                Active clubs
              </NavLink>
              <div className="flex items-center px-3 py-2 text-sm rounded-lg bg-blue-500 text-white font-medium">
                <Shield className="w-5 h-5 mr-3 text-white" />
                Suspending clubs
              </div>
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

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Suspended Clubs</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">Suspended clubs</p>
                  <p className="text-3xl font-bold mt-1">{suspendedClubs.length}</p>
                  <p className="text-xs text-gray-500 mt-1">Active suspensions</p>
                </div>
                <AlertTriangle className="w-12 h-12 text-blue-500 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">New suspensions (7 days)</p>
                  <p className="text-3xl font-bold mt-1">
                    {suspendedClubs.filter((c) => {
                      if (!c.time) return false;
                      if (c.time.includes('h ago')) return true;
                      if (c.time.includes('d ago')) return parseInt(c.time) <= 7;
                      return false;
                    }).length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
                </div>
                <AlertTriangle className="w-12 h-12 text-blue-500 opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">Appeals pending</p>
                  <p className="text-3xl font-bold mt-1">3</p>
                  <p className="text-xs text-red-600 mt-1">▲ Needs review</p>
                </div>
                <AlertTriangle className="w-12 h-12 text-red-500 opacity-20" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Suspended Clubs</h2>
                <p className="text-sm text-gray-600">
                  Clubs that are currently suspended and not visible on Penno.
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
                  placeholder="Search club, owner, category, email"
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
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suspended on</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reports</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredClubs.map((club) => (
                    <tr key={club.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{club.suspendedAt || club.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{club.reports || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{club.suspendReason || '—'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          suspended
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        <button
                          onClick={() => openReview(club)}
                          className="px-3.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openReactivateModal(club.id)}
                          className="px-3.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded transition-colors"
                        >
                          Re-activate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredClubs.length === 0 && (
                <div className="py-16 text-center text-gray-500">No suspended clubs found</div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* FILTER MODAL */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end items-start pointer-events-none">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mt-16 mr-8 overflow-hidden pointer-events-auto">
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

      {/* REACTIVATE MODAL */}
      {showReactivateModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-[400px]">
            <div className="p-5">
              <div className="mt-1">
                <label className="block text-sm font-medium text-gray-700">Optional note</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm h-20 resize-y"
                  placeholder="Why are we reactivating?"
                />
              </div>

              <div className="mt-5">
                <div className="text-sm font-medium text-gray-700 mb-2">Notification</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center">👤</div>
                    <div>
                      <p className="text-sm font-medium">{selectedClub?.name || 'Club'}</p>
                      <p className="text-xs text-gray-500">Club owner</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Send owner a reactivation notice</span>
                    <button
                      onClick={() => setNotification(!notification)}
                      className={`relative h-6 w-11 flex items-center rounded-full transition-all ${notification ? 'bg-blue-600' : 'bg-gray-300'}`}
                    >
                      <div className={`h-5 w-5 bg-white rounded-full shadow transition-all ${notification ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={closeModals}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReactivateConfirm}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium"
                >
                  Re-activate club
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast(null)} />}

      {/* ──────────────── BEAUTIFUL LOGOUT MODAL (Same as Panel.jsx) ──────────────── */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8 text-center relative">
              <div className="relative mx-auto mb-6 w-24 h-24">
                <div className="absolute inset-0 rounded-full bg-red-500/10 animate-ping-slow"></div>
                <div className="absolute inset-2 rounded-full bg-red-500/20 animate-ping-slower"></div>
                <div className="w-full h-full rounded-full bg-red-500 flex items-center justify-center shadow-lg relative z-10">
                  <span className="text-white text-5xl font-bold">!</span>
                </div>
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