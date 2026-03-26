// src/pages/AllPens.jsx
import { NavLink, useNavigate } from 'react-router-dom';
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
  Filter,
  Eye,
  Trash2,
} from 'lucide-react';
import { useState, useEffect } from 'react';

// ── Initial Data ──────────────────────────────────────────────────────────────
const initialAllPens = [
  {
    id: 'pen-1',
    title: 'Emergency Team Meeting',
    category: 'Soccer',
    club: 'Riverside FC',
    clubName: 'Riverside FC',
    clubLogo: 'shield',
    postedBy: "Mike O'Donnell",
    postedByRole: 'Club Admin',
    penType: 'Event',
    urgent: true,
    reports: 3,
    status: 'Active',
    dateTime: '2026-02-02, 10:21 AM',
    content: 'URGENT: Emergency team meeting scheduled for tonight at 7PM at the club grounds. Attendance mandatory for all senior players.',
    primaryReason: 'Misuse of urgent',
    reportsList: [
      { reason: 'Misuse of urgent', message: 'Not an emergency, just normal training', time: '18 min ago' },
      { reason: 'Spam / misleading', message: 'Repeated posts today', time: '15 min ago' },
      { reason: 'Incorrect info', message: "Time doesn't match schedule", time: '8 min ago' },
    ],
  },
  {
    id: 'pen-2',
    title: 'Senior Training Cancelled',
    category: 'GAA',
    club: 'Blue Horizon FC',
    clubName: 'Blue Horizon FC',
    clubLogo: 'star',
    postedBy: 'Emma Walsh',
    postedByRole: 'Club Admin',
    penType: 'Update',
    urgent: false,
    reports: 5,
    status: 'Active',
    dateTime: '2026-02-02, 09:10 AM',
    content: 'Senior training for Thursday is cancelled due to pitch maintenance. Next training will be Sunday at 10AM.',
    primaryReason: 'Spam / misleading',
    reportsList: [
      { reason: 'Spam / misleading', message: 'Third cancellation post this week', time: '1h ago' },
      { reason: 'Spam / misleading', message: 'Duplicate post', time: '55 min ago' },
    ],
  },
  {
    id: 'pen-3',
    title: 'Match Results Update',
    category: 'Community',
    club: 'River City Warriors',
    clubName: 'River City Warriors',
    clubLogo: 'circle',
    postedBy: 'Sarah Lee',
    postedByRole: 'Club Admin',
    penType: 'Result',
    urgent: false,
    reports: 2,
    status: 'Active',
    dateTime: '2026-02-01, 16:45 PM',
    content: 'River City Warriors 3 - 1 Summit Spartans. Great performance from the whole squad! Full match report coming soon.',
    primaryReason: 'Inappropriate image',
    reportsList: [
      { reason: 'Inappropriate image', message: 'Image contains offensive content', time: '2h ago' },
    ],
  },
  {
    id: 'pen-4',
    title: 'Fundraiser Event This Saturday',
    category: 'School',
    club: 'Maple Leaf Athletic',
    clubName: 'Maple Leaf Athletic',
    clubLogo: 'star',
    postedBy: 'David Kim',
    postedByRole: 'Club Admin',
    penType: 'Event',
    urgent: true,
    reports: 7,
    status: 'Active',
    dateTime: '2026-02-01, 14:00 PM',
    content: 'URGENT: Annual fundraiser event this Saturday at 2PM. All members and families welcome. Tickets available at the gate.',
    primaryReason: 'Misuse of urgent',
    reportsList: [],
  },
  {
    id: 'pen-5',
    title: 'Under-16 Squad Selection',
    category: 'Soccer',
    club: 'Summit Spartans',
    clubName: 'Summit Spartans',
    clubLogo: 'circle',
    postedBy: 'Robert Brown',
    postedByRole: 'Club Admin',
    penType: 'Announcement',
    urgent: false,
    reports: 4,
    status: 'Active',
    dateTime: '2026-02-02, 07:30 AM',
    content: 'Under-16 squad selection for the county championship has been finalised. Selected players will receive an email by end of day.',
    primaryReason: 'Harassment / hate',
    reportsList: [],
  },
  {
    id: 'pen-6',
    title: 'New Training Kit Available',
    category: 'GAA',
    club: 'Phoenix Rangers',
    clubName: 'Phoenix Rangers',
    clubLogo: 'shield',
    postedBy: 'Liam Doyle',
    postedByRole: 'Club Admin',
    penType: 'Update',
    urgent: false,
    reports: 0,
    status: 'Active',
    dateTime: '2026-02-02, 08:00 AM',
    content: 'The new club training kits are now available to order via the club shop. Orders close Friday.',
    primaryReason: '',
    reportsList: [],
  },
  {
    id: 'pen-7',
    title: 'AGM Notice — All Members',
    category: 'Community',
    club: 'Desert Foxes FC',
    clubName: 'Desert Foxes FC',
    clubLogo: 'circle',
    postedBy: 'Alex Rivera',
    postedByRole: 'Club Admin',
    penType: 'Announcement',
    urgent: false,
    reports: 0,
    status: 'Active',
    dateTime: '2026-02-01, 11:00 AM',
    content: 'Annual General Meeting will be held on March 1st at 7:30PM in the clubhouse. All members are invited.',
    primaryReason: '',
    reportsList: [],
  },
  {
    id: 'pen-8',
    title: 'Pitch Closure — Waterlogged',
    category: 'Soccer',
    club: 'Grand Spartans Club',
    clubName: 'Grand Spartans Club',
    clubLogo: 'star',
    postedBy: 'Anna Patel',
    postedByRole: 'Club Admin',
    penType: 'Update',
    urgent: true,
    reports: 1,
    status: 'Active',
    dateTime: '2026-02-02, 06:50 AM',
    content: 'URGENT: Main pitch is closed today due to heavy rain. All morning sessions are moved to the indoor facility.',
    primaryReason: '',
    reportsList: [],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function getBgColor(logo) {
  const colors = {
    shield: 'bg-blue-100 text-blue-700',
    star: 'bg-amber-100 text-amber-700',
    circle: 'bg-emerald-100 text-emerald-700',
  };
  return colors[logo] || 'bg-gray-100 text-gray-600';
}

function getInitials(name) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ type, title, message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3800);
    return () => clearTimeout(t);
  }, [onClose]);

  const isSuccess = type === 'success';
  return (
    <div className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-white ${isSuccess ? 'bg-green-600' : 'bg-red-600'}`}>
      {isSuccess ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
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

// ── Sidebar ────────────────────────────────────────────────────────────────────
function Sidebar({ onLogout }) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
      <div className="p-6 flex items-center gap-3 border-b border-gray-200">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
          <span className="text-white text-2xl font-bold">P</span>
        </div>
        <span className="text-xl font-semibold text-gray-900">Penno</span>
      </div>

      <div className="flex-1 overflow-y-auto py-5 px-3">
        <div className="mb-8">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">OVERVIEW</p>
          <nav className="space-y-1">
            <NavLink to="/panel" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors text-gray-700 hover:bg-gray-100">
              <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
            </NavLink>
          </nav>
        </div>

        <div className="mb-8">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">CLUB MANAGEMENT</p>
          <nav className="space-y-1">
            <NavLink to="/pending" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <AlertTriangle className="w-5 h-5 mr-3" /> Pending approval
            </NavLink>
            <NavLink to="/active-clubs" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <ShieldCheck className="w-5 h-5 mr-3 text-green-500" /> Active clubs
            </NavLink>
            <NavLink to="/suspending-clubs" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <Shield className="w-5 h-5 mr-3 text-red-500" /> Suspending clubs
            </NavLink>
          </nav>
        </div>

        <div className="mb-8">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">PENS & MODERATION</p>
          <nav className="space-y-1">
            <div className="flex items-center px-3 py-2 text-sm rounded-lg bg-blue-500 text-white font-medium">
              <MessageSquare className="w-5 h-5 mr-3 text-white" /> All Pens
            </div>
            <NavLink to="/report" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <AlertTriangle className="w-5 h-5 mr-3 text-red-500" /> Reported pens
            </NavLink>
          </nav>
        </div>

        <div className="mb-8">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">USERS</p>
          <nav className="space-y-1">
            <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <Users className="w-5 h-5 mr-3" /> Club owner
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <UserCog className="w-5 h-5 mr-3" /> Verified poster
            </a>
          </nav>
        </div>

        <div className="mb-4">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">PLATFORM SETTINGS</p>
          <nav className="space-y-1">
            <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <Settings className="w-5 h-5 mr-3" /> Categories
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <Shield className="w-5 h-5 mr-3" /> Safety rules
            </a>
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium transition-colors">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────
function Header({ title }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between flex-shrink-0">
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-5">
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
            <img src="https://i.pravatar.cc/80?u=jamesoneil" alt="James O'Neil" className="w-full h-full object-cover" />
          </div>
          <div className="hidden sm:block">
            <p className="font-medium text-sm text-gray-900">James O'Neil</p>
            <p className="text-xs text-gray-500">Super Admin</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>
      </div>
    </header>
  );
}

// ── Logout Modal ──────────────────────────────────────────────────────────────
function LogoutModal({ onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        <div className="p-8 text-center">
          <div className="relative mx-auto mb-6 w-24 h-24">
            <div className="w-full h-full rounded-full bg-red-500 flex items-center justify-center shadow-lg">
              <span className="text-white text-5xl font-bold">!</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Log out of Penno Admin?</h2>
          <p className="text-gray-600 mb-8">You can log back in anytime using your admin credentials.</p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={onCancel} className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors min-w-[120px]">
              Cancel
            </button>
            <button onClick={onConfirm} className="px-8 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-md flex items-center gap-2 min-w-[140px] justify-center">
              Logout
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Filter helpers ─────────────────────────────────────────────────────────────
function FilterChip({ label, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${active ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
      {label}
    </button>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AllPens() {
  const navigate = useNavigate();

  const [pens, setPens] = useState(() => {
    try {
      const saved = localStorage.getItem('penno_all_pens');
      return saved ? JSON.parse(saved) : initialAllPens;
    } catch { return initialAllPens; }
  });

  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [selectedPen, setSelectedPen] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [penToRemove, setPenToRemove] = useState(null);

  // Filter states
  const [sortFilter, setSortFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [urgentFilter, setUrgentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Remove modal
  const [removeReason, setRemoveReason] = useState('Fraud / fake club');
  const [removeNote, setRemoveNote] = useState('');
  const [removeNotification, setRemoveNotification] = useState(true);

  useEffect(() => {
    localStorage.setItem('penno_all_pens', JSON.stringify(pens));
  }, [pens]);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalPens = pens.length;
  const urgentPens = pens.filter((p) => p.urgent).length;
  const reportedPens = pens.filter((p) => p.reports > 0).length;

  // ── Filtering ──────────────────────────────────────────────────────────────
  let filteredPens = pens.filter((pen) => {
    const matchSearch =
      pen.title.toLowerCase().includes(search.toLowerCase()) ||
      pen.club.toLowerCase().includes(search.toLowerCase()) ||
      pen.postedBy.toLowerCase().includes(search.toLowerCase()) ||
      pen.category.toLowerCase().includes(search.toLowerCase());

    const matchCategory = categoryFilter === 'All' || pen.category === categoryFilter;
    const matchType = typeFilter === 'All' || pen.penType === typeFilter;
    const matchUrgent =
      urgentFilter === 'All' ||
      (urgentFilter === 'Urgent' && pen.urgent) ||
      (urgentFilter === 'Not urgent' && !pen.urgent);
    const matchStatus = statusFilter === 'All' || pen.status === statusFilter;

    return matchSearch && matchCategory && matchType && matchUrgent && matchStatus;
  });

  if (sortFilter === 'Newest first') {
    filteredPens = [...filteredPens].sort((a, b) => b.id.localeCompare(a.id));
  } else if (sortFilter === 'Most reported') {
    filteredPens = [...filteredPens].sort((a, b) => b.reports - a.reports);
  } else if (sortFilter === 'Alphabetical') {
    filteredPens = [...filteredPens].sort((a, b) => a.title.localeCompare(b.title));
  }

  // ── Actions ───────────────────────────────────────────────────────────────
  const openRemoveModal = (pen) => {
    setPenToRemove(pen);
    setRemoveReason('Fraud / fake club');
    setRemoveNote('');
    setRemoveNotification(true);
    setShowRemoveModal(true);
  };

  const confirmRemove = () => {
    if (!penToRemove) return;
    setPens((prev) => prev.filter((p) => p.id !== penToRemove.id));
    if (selectedPen?.id === penToRemove.id) setSelectedPen(null);
    setToast({ type: 'error', title: 'Pen removed', message: 'Followers will no longer see it.' });
    setShowRemoveModal(false);
    setPenToRemove(null);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    alert('Logged out successfully! (demo)');
    navigate('/login');
  };

  const resetFilters = () => {
    setSortFilter('All');
    setCategoryFilter('All');
    setTypeFilter('All');
    setUrgentFilter('All');
    setStatusFilter('All');
  };

  // ── DETAIL VIEW ────────────────────────────────────────────────────────────
  if (selectedPen) {
    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar onLogout={() => setShowLogoutModal(true)} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="All Pens" />

          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setSelectedPen(null)} className="text-gray-600 hover:text-gray-900 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-2xl font-semibold text-gray-900">Pen Detail</h2>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {/* Pen Summary */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900 mb-4 bg-blue-50 px-4 py-2 rounded-lg">Pen Summary</h3>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold ${getBgColor(selectedPen.clubLogo)}`}>
                      {getInitials(selectedPen.clubName)}
                    </div>
                    <div className="flex-1">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-6 text-sm">
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Club Name</p>
                          <p className="font-medium text-gray-900">{selectedPen.clubName}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Posted by</p>
                          <p className="font-medium text-gray-900">{selectedPen.postedBy}</p>
                          <p className="text-xs text-gray-400">{selectedPen.postedByRole}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Pen Title</p>
                          <p className="font-medium text-gray-900">{selectedPen.title}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Pen Type</p>
                          <p className="font-medium text-gray-900">{selectedPen.penType}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-5 text-sm">
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Category</p>
                          <p className="font-medium text-gray-900">{selectedPen.category}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Urgent</p>
                          <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${selectedPen.urgent ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                            {selectedPen.urgent ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Reports</p>
                          <p className="font-medium text-gray-900">{selectedPen.reports}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Date/Time</p>
                          <p className="font-medium text-gray-900">{selectedPen.dateTime}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pen Content */}
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Pen Content</h3>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-4 leading-relaxed">{selectedPen.content}</p>
                </div>

                {/* Status */}
                <div className="px-6 py-4 flex items-center justify-between bg-gray-50">
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-gray-500">Status:</p>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">{selectedPen.status}</span>
                    {selectedPen.reports > 0 && (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">{selectedPen.reports} report{selectedPen.reports > 1 ? 's' : ''}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Reports List (if any) */}
              {selectedPen.reportsList && selectedPen.reportsList.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4 bg-blue-50 px-4 py-2 rounded-lg">Reports List</h3>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-3 text-xs font-medium text-gray-400 w-1/4">Reason</th>
                          <th className="text-left py-3 text-xs font-medium text-gray-400 w-1/2">Message</th>
                          <th className="text-left py-3 text-xs font-medium text-gray-400 w-1/4">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {selectedPen.reportsList.map((r, i) => (
                          <tr key={i}>
                            <td className="py-4">
                              <p className="text-xs text-gray-400 mb-0.5">Reason</p>
                              <p className="text-gray-700">{r.reason}</p>
                            </td>
                            <td className="py-4">
                              <p className="text-xs text-gray-400 mb-0.5">Message</p>
                              <p className="text-gray-700">{r.message}</p>
                            </td>
                            <td className="py-4">
                              <p className="text-xs text-gray-400 mb-0.5">Time</p>
                              <p className="text-gray-500">{r.time}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5 flex justify-end gap-3">
                <button onClick={() => setSelectedPen(null)} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                  Close
                </button>
                {selectedPen.reports > 0 && (
                  <NavLink to="/reported-pens"
                    className="px-6 py-2.5 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 font-medium transition-colors">
                    View Reports
                  </NavLink>
                )}
                <button onClick={() => openRemoveModal(selectedPen)}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2">
                  <Trash2 size={16} /> Remove Pen
                </button>
              </div>
            </div>
          </main>
        </div>

        {/* Remove Modal */}
        {showRemoveModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-[500px] mx-4 overflow-hidden">
              <div className="px-6 py-5">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">Remove this pen from Penno?</h3>
                    <p className="text-sm text-gray-500 mt-1">This pen will be hidden from feeds and discovery. The club will be notified.</p>
                  </div>
                  <button onClick={() => setShowRemoveModal(false)} className="text-gray-400 hover:text-gray-600 ml-3 flex-shrink-0">
                    <X size={20} />
                  </button>
                </div>

                <div className="mt-5">
                  <select value={removeReason} onChange={(e) => setRemoveReason(e.target.value)}
                    className="w-full border border-gray-300 bg-blue-50 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option>Fraud / fake club</option>
                    <option>Spam / abuse</option>
                    <option>Inappropriate content</option>
                    <option>Misuse of urgent</option>
                    <option>Other violation</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Optional note</label>
                  <textarea value={removeNote} onChange={(e) => setRemoveNote(e.target.value)}
                    placeholder="Why are we removing this pen?"
                    className="w-full h-28 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Notification</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Send owner a reactivation notice</p>
                    <button onClick={() => setRemoveNotification(!removeNotification)}
                      className={`relative h-6 w-11 flex items-center rounded-full transition-all flex-shrink-0 ${removeNotification ? 'bg-blue-600' : 'bg-gray-300'}`}>
                      <div className={`h-5 w-5 bg-white rounded-full shadow transition-all ${removeNotification ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button onClick={() => setShowRemoveModal(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button onClick={confirmRemove} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                    Remove pen
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showLogoutModal && <LogoutModal onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogoutConfirm} />}
        {toast && <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast(null)} />}
      </div>
    );
  }

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      <Sidebar onLogout={() => setShowLogoutModal(true)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="All Pens" />

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Pens</p>
                <p className="text-4xl font-bold text-gray-900 mt-1">{String(totalPens).padStart(2, '0')}</p>
                <p className="text-xs text-gray-400 mt-1">All published pens</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Urgent Pens</p>
                <p className="text-4xl font-bold text-gray-900 mt-1">{String(urgentPens).padStart(2, '0')}</p>
                <p className="text-xs text-orange-500 mt-1">Marked as urgent by clubs</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Reported Pens</p>
                <p className="text-4xl font-bold text-gray-900 mt-1">{String(reportedPens).padStart(2, '0')}</p>
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertTriangle size={12} /> Needs review
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">All Pens</h2>
                <p className="text-sm text-gray-500 mt-0.5">View and moderate all pens published on Penno.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by title, club, poster..."
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
                  {search && (
                    <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X size={16} />
                    </button>
                  )}
                </div>
                <button onClick={() => setShowFilterModal(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <Filter size={16} /> Filter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Club</th>
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted by</th>
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgent</th>
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reports</th>
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredPens.map((pen) => (
                    <tr key={pen.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-[180px]">
                        <p className="truncate">{pen.title}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{pen.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${getBgColor(pen.clubLogo)}`}>
                            {getInitials(pen.clubName)}
                          </div>
                          <span className="text-sm text-gray-700">{pen.club}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        <div>
                          <p>{pen.postedBy}</p>
                          <p className="text-xs text-gray-400">{pen.postedByRole}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-50 text-blue-700">{pen.penType}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {pen.urgent ? (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700">Urgent</span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        {pen.reports > 0 ? (
                          <span className="font-semibold text-red-600">{pen.reports}</span>
                        ) : (
                          <span className="text-gray-400">0</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">{pen.status}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setSelectedPen(pen)}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5">
                            <Eye size={13} /> View
                          </button>
                          <button onClick={() => openRemoveModal(pen)}
                            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5">
                            <Trash2 size={13} /> Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredPens.length === 0 && (
                <div className="py-16 text-center text-gray-500">No pens found</div>
              )}
            </div>

            {/* Pagination hint */}
            {filteredPens.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">Showing {filteredPens.length} of {pens.length} pens</p>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40" disabled>Previous</button>
                  <span className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg">1</span>
                  <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40" disabled>Next</button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-end pointer-events-none">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mt-4 mr-4 overflow-hidden pointer-events-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Pens Filter</h3>
              <button onClick={() => setShowFilterModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={22} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Sort */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-900">Sort</p>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Newest first', 'Most reported', 'Alphabetical'].map((opt) => (
                    <FilterChip key={opt} label={opt} active={sortFilter === opt} onClick={() => setSortFilter(opt)} />
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-900">Category</p>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Soccer', 'GAA', 'School', 'Community'].map((opt) => (
                    <FilterChip key={opt} label={opt} active={categoryFilter === opt} onClick={() => setCategoryFilter(opt)} />
                  ))}
                </div>
              </div>

              {/* Pen Type */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-900">Pen Type</p>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Event', 'Update', 'Result', 'Announcement'].map((opt) => (
                    <FilterChip key={opt} label={opt} active={typeFilter === opt} onClick={() => setTypeFilter(opt)} />
                  ))}
                </div>
              </div>

              {/* Urgent */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-900">Urgent</p>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Urgent', 'Not urgent'].map((opt) => (
                    <FilterChip key={opt} label={opt} active={urgentFilter === opt} onClick={() => setUrgentFilter(opt)} />
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-900">Status</p>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Active', 'Removed'].map((opt) => (
                    <FilterChip key={opt} label={opt} active={statusFilter === opt} onClick={() => setStatusFilter(opt)} />
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setShowFilterModal(false)} className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm">
                Cancel
              </button>
              <button onClick={resetFilters} className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm">
                Reset Filter
              </button>
              <button onClick={() => setShowFilterModal(false)} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm shadow-sm">
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Modal (list-level) */}
      {showRemoveModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-[500px] mx-4 overflow-hidden">
            <div className="px-6 py-5">
              <div className="flex items-start justify-between mb-1">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Remove this pen from Penno?</h3>
                  <p className="text-sm text-gray-500 mt-1">This pen will be hidden from feeds and discovery. The club will be notified.</p>
                </div>
                <button onClick={() => setShowRemoveModal(false)} className="text-gray-400 hover:text-gray-600 ml-3 flex-shrink-0">
                  <X size={20} />
                </button>
              </div>

              <div className="mt-5">
                <select value={removeReason} onChange={(e) => setRemoveReason(e.target.value)}
                  className="w-full border border-gray-300 bg-blue-50 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option>Fraud / fake club</option>
                  <option>Spam / abuse</option>
                  <option>Inappropriate content</option>
                  <option>Misuse of urgent</option>
                  <option>Other violation</option>
                </select>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Optional note</label>
                <textarea value={removeNote} onChange={(e) => setRemoveNote(e.target.value)}
                  placeholder="Why are we removing this pen?"
                  className="w-full h-28 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Notification</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Send owner a reactivation notice</p>
                  <button onClick={() => setRemoveNotification(!removeNotification)}
                    className={`relative h-6 w-11 flex items-center rounded-full transition-all flex-shrink-0 ${removeNotification ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <div className={`h-5 w-5 bg-white rounded-full shadow transition-all ${removeNotification ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button onClick={() => setShowRemoveModal(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancel
                </button>
                <button onClick={confirmRemove} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium shadow-sm">
                  Remove pen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLogoutModal && <LogoutModal onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogoutConfirm} />}
      {toast && <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
}