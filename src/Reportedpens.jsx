// src/pages/ReportedPens.jsx
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
} from 'lucide-react';
import { useState, useEffect } from 'react';

// ── Initial data ──────────────────────────────────────────────────────────────
const initialReportedPens = [
  {
    id: 'rpen-1',
    title: 'Emergency Team Meeting',
    category: 'Soccer',
    reason: 'Incorrect info',
    club: 'Riverside FC',
    postedBy: "Mike O'Donnell (Club Admin)",
    reports: 3,
    status: 'Active',
    penType: 'Event',
    urgent: 'Yes',
    primaryReason: 'Misuse of urgent',
    dateTime: '2026-02-02, 10:21 AM',
    clubName: 'Greenfield United FC',
    clubLogo: 'shield',
    reportsList: [
      { reason: 'Misuse of urgent', message: 'Not an emergency, just normal training', time: '18 min ago' },
      { reason: 'Spam / misleading', message: 'Repeated posts today', time: '15 min ago' },
      { reason: 'Incorrect info', message: "Time doesn't match schedule", time: '8 min ago' },
    ],
  },
  {
    id: 'rpen-2',
    title: 'Senior Training Cancelled',
    category: 'GAA',
    reason: 'Spam / misleading',
    club: 'Blue Horizon FC',
    postedBy: 'Emma Walsh (Club Admin)',
    reports: 5,
    status: 'Active',
    penType: 'Update',
    urgent: 'No',
    primaryReason: 'Spam / misleading',
    dateTime: '2026-02-02, 09:10 AM',
    clubName: 'Blue Horizon FC',
    clubLogo: 'star',
    reportsList: [
      { reason: 'Spam / misleading', message: 'Third cancellation post this week', time: '1h ago' },
      { reason: 'Spam / misleading', message: 'Duplicate post', time: '55 min ago' },
      { reason: 'Incorrect info', message: 'Training was not cancelled', time: '40 min ago' },
      { reason: 'Harassment / hate', message: 'Insulting tone in post', time: '30 min ago' },
      { reason: 'Other', message: 'Not relevant to our club', time: '20 min ago' },
    ],
  },
  {
    id: 'rpen-3',
    title: 'Match Results Update',
    category: 'Community',
    reason: 'Inappropriate image',
    club: 'River City Warriors',
    postedBy: 'Sarah Lee (Club Admin)',
    reports: 2,
    status: 'Active',
    penType: 'Result',
    urgent: 'No',
    primaryReason: 'Inappropriate image',
    dateTime: '2026-02-01, 16:45 PM',
    clubName: 'River City Warriors',
    clubLogo: 'circle',
    reportsList: [
      { reason: 'Inappropriate image', message: 'Image contains offensive content', time: '2h ago' },
      { reason: 'Other', message: 'Photo is from wrong match', time: '1h ago' },
    ],
  },
  {
    id: 'rpen-4',
    title: 'Fundraiser Event This Saturday',
    category: 'School',
    reason: 'Misuse of urgent',
    club: 'Maple Leaf Athletic',
    postedBy: 'David Kim (Club Admin)',
    reports: 7,
    status: 'Active',
    penType: 'Event',
    urgent: 'Yes',
    primaryReason: 'Misuse of urgent',
    dateTime: '2026-02-01, 14:00 PM',
    clubName: 'Maple Leaf Athletic',
    clubLogo: 'star',
    reportsList: [
      { reason: 'Misuse of urgent', message: 'Fundraiser is not an urgent matter', time: '3h ago' },
      { reason: 'Spam / misleading', message: 'Same post shared 3 times', time: '2h ago' },
      { reason: 'Misuse of urgent', message: 'Stop marking everything urgent', time: '90 min ago' },
      { reason: 'Incorrect info', message: 'Wrong address listed for venue', time: '1h ago' },
      { reason: 'Other', message: 'Outside our club category', time: '45 min ago' },
      { reason: 'Misuse of urgent', message: 'Flagged for urgent abuse again', time: '30 min ago' },
      { reason: 'Spam / misleading', message: 'Misleading headline', time: '10 min ago' },
    ],
  },
  {
    id: 'rpen-5',
    title: 'Under-16 Squad Selection',
    category: 'Soccer',
    reason: 'Harassment / hate',
    club: 'Summit Spartans',
    postedBy: 'Robert Brown (Club Admin)',
    reports: 4,
    status: 'Active',
    penType: 'Announcement',
    urgent: 'No',
    primaryReason: 'Harassment / hate',
    dateTime: '2026-02-02, 07:30 AM',
    clubName: 'Summit Spartans',
    clubLogo: 'circle',
    reportsList: [
      { reason: 'Harassment / hate', message: 'Post singles out players by name in a negative way', time: '5h ago' },
      { reason: 'Harassment / hate', message: 'Discriminatory language used', time: '4h ago' },
      { reason: 'Incorrect info', message: 'Player list is wrong', time: '2h ago' },
      { reason: 'Other', message: 'Inappropriate for public post', time: '1h ago' },
    ],
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
  const bg = isSuccess ? 'bg-green-600' : 'bg-red-600';
  const Icon = isSuccess ? CheckCircle2 : XCircle;

  return (
    <div className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-white ${bg}`}
      style={{ border: isSuccess ? '' : '1px solid #fca5a5', background: isSuccess ? '' : 'white', color: isSuccess ? 'white' : '#374151' }}>
      <XCircle size={20} className={isSuccess ? 'text-white' : 'text-red-500'} />
      <div>
        <p className={`font-medium ${!isSuccess ? 'text-gray-900' : ''}`}>{title}</p>
        <p className={`text-sm ${!isSuccess ? 'text-gray-500' : 'opacity-90'}`}>{message}</p>
      </div>
      <button onClick={onClose} className="ml-3 text-gray-400 hover:text-gray-600">
        <X size={18} />
      </button>
    </div>
  );
}

// ── Sidebar (shared structure) ─────────────────────────────────────────────────
function Sidebar({ onLogout, activeItem }) {
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
            <NavLink to="/allpens" className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${isActive || activeItem === 'allpens' ? 'bg-blue-500 text-white font-medium' : 'text-gray-700 hover:bg-gray-100'}`
            }>
              <MessageSquare className="w-5 h-5 mr-3" /> All Pens
            </NavLink>
            <NavLink to="/report" className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${isActive || activeItem === 'reported' ? 'bg-blue-500 text-white font-medium' : 'text-gray-700 hover:bg-gray-100'}`
            }>
              <AlertTriangle className="w-5 h-5 mr-3" /> Reported pens
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

// ── Main Component ────────────────────────────────────────────────────────────
export default function ReportedPens() {
  const navigate = useNavigate();

  const [pens, setPens] = useState(() => {
    try {
      const saved = localStorage.getItem('penno_reported_pens');
      return saved ? JSON.parse(saved) : initialReportedPens;
    } catch { return initialReportedPens; }
  });

  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [selectedPen, setSelectedPen] = useState(null); // for detail view
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Filter states
  const [sortFilter, setSortFilter] = useState('All');
  const [reportsFilter, setReportsFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [reasonFilter, setReasonFilter] = useState('All');

  // Remove / Suspend modal fields
  const [removeReason, setRemoveReason] = useState('Fraud / fake club');
  const [removeNote, setRemoveNote] = useState('');
  const [removeNotification, setRemoveNotification] = useState(true);
  const [suspendReason, setSuspendReason] = useState('Fraud / fake club');
  const [suspendNote, setSuspendNote] = useState('');
  const [suspendNotification, setSuspendNotification] = useState(true);

  // Persist pens to localStorage
  useEffect(() => {
    localStorage.setItem('penno_reported_pens', JSON.stringify(pens));
  }, [pens]);

  // ── Filtering ──────────────────────────────────────────────────────────────
  let filteredPens = pens.filter((pen) => {
    const matchSearch =
      pen.title.toLowerCase().includes(search.toLowerCase()) ||
      pen.club.toLowerCase().includes(search.toLowerCase()) ||
      pen.postedBy.toLowerCase().includes(search.toLowerCase()) ||
      pen.category.toLowerCase().includes(search.toLowerCase());

    const matchReports =
      reportsFilter === 'All' ||
      (reportsFilter === 'No reports' && pen.reports === 0) ||
      (reportsFilter === '1–2 reports' && pen.reports >= 1 && pen.reports <= 2) ||
      (reportsFilter === '3+ reports' && pen.reports >= 3);

    const matchReason =
      reasonFilter === 'All' ||
      pen.reason.toLowerCase().includes(reasonFilter.toLowerCase()) ||
      pen.primaryReason.toLowerCase().includes(reasonFilter.toLowerCase());

    return matchSearch && matchReports && matchReason;
  });

  if (sortFilter === 'Newest first') {
    filteredPens = [...filteredPens].sort((a, b) => b.id.localeCompare(a.id));
  } else if (sortFilter === 'Highest severity') {
    filteredPens = [...filteredPens].sort((a, b) => {
      const urgentScore = (p) => (p.urgent === 'Yes' ? 1000 : 0) + p.reports;
      return urgentScore(b) - urgentScore(a);
    });
  } else if (sortFilter === 'Most reported') {
    filteredPens = [...filteredPens].sort((a, b) => b.reports - a.reports);
  }

  // ── Stats ──────────────────────────────────────────────────────────────────
  const openReports = pens.length;
  const highSeverity = pens.filter((p) => p.urgent === 'Yes' || p.reports >= 5).length;
  const repeatClubs = pens.filter((p) => p.reports >= 3).length;

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleRemovePen = () => {
    if (!selectedPen) return;
    const updated = pens.filter((p) => p.id !== selectedPen.id);
    setPens(updated);
    setToast({ type: 'error', title: 'Pen removed', message: 'Followers will no longer see it.' });
    setShowRemoveModal(false);
    // keep detail view open momentarily then close
  };

  const handleSuspendClub = () => {
    if (!selectedPen) return;
    // Move club to suspended list
    try {
      const saved = localStorage.getItem('penno_suspended');
      const suspended = saved ? JSON.parse(saved) : [];
      const clubEntry = {
        id: `suspended-from-pen-${selectedPen.id}`,
        name: selectedPen.clubName,
        logo: selectedPen.clubLogo || 'shield',
        category: selectedPen.category,
        email: `contact@${selectedPen.club.toLowerCase().replace(/\s/g, '')}.com`,
        time: '1h ago',
        status: 'suspended',
        suspendReason: suspendReason,
        suspendedAt: new Date().toLocaleString(),
        reports: selectedPen.reports,
      };
      if (!suspended.find((c) => c.name === selectedPen.clubName)) {
        suspended.push(clubEntry);
      }
      localStorage.setItem('penno_suspended', JSON.stringify(suspended));
    } catch { /* ignore */ }

    setToast({ type: 'success', title: 'Club suspended', message: `${selectedPen.clubName} is no longer visible on Penno.` });
    setShowSuspendModal(false);
    setSelectedPen(null);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    alert('Logged out successfully! (demo)');
    navigate('/login');
  };

  const resetFilters = () => {
    setSortFilter('All');
    setReportsFilter('All');
    setDateFilter('All');
    setReasonFilter('All');
  };

  // ── DETAIL VIEW ────────────────────────────────────────────────────────────
  if (selectedPen) {
    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar onLogout={() => setShowLogoutModal(true)} activeItem="reported" />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Reported Pens" />

          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setSelectedPen(null)} className="text-gray-600 hover:text-gray-900 transition-colors p-1 rounded-lg hover:bg-gray-100">
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-2xl font-semibold text-gray-900">Report Detail</h2>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden max-w-4xl mx-auto">
              {/* Report Summary */}
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-base font-semibold text-gray-900 mb-4 bg-blue-50 px-4 py-2 rounded-lg">Report Summary</h3>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getBgColor(selectedPen.clubLogo)}`}>
                    <Shield size={22} />
                  </div>
                  <div className="flex-1">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-y-5 gap-x-6 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Club Name</p>
                        <p className="font-medium text-gray-900">{selectedPen.clubName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Posted by</p>
                        <p className="font-medium text-gray-900">{selectedPen.postedBy.split(' (')[0]}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Reported Pen</p>
                        <p className="font-medium text-gray-900">{selectedPen.title}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Pen Type</p>
                        <p className="font-medium text-gray-900">{selectedPen.penType}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Urgent</p>
                        <p className="font-medium text-gray-900">{selectedPen.urgent}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 mt-5 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Reports</p>
                        <p className="font-medium text-gray-900">{selectedPen.reports}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Primary Reason</p>
                        <p className="font-medium text-gray-900">{selectedPen.primaryReason}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Date/Time</p>
                        <p className="font-medium text-gray-900">{selectedPen.dateTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reports List */}
              <div className="p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-4 bg-blue-50 px-4 py-2 rounded-lg">Reports List</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 text-xs font-medium text-gray-500 w-1/4">Reason</th>
                      <th className="text-left py-3 text-xs font-medium text-gray-500 w-1/2">Message</th>
                      <th className="text-left py-3 text-xs font-medium text-gray-500 w-1/4">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {selectedPen.reportsList.map((r, i) => (
                      <tr key={i}>
                        <td className="py-4">
                          <div className="mb-0.5 text-xs text-gray-400">Reason</div>
                          <p className="text-gray-700">{r.reason}</p>
                        </td>
                        <td className="py-4">
                          <div className="mb-0.5 text-xs text-gray-400">Message</div>
                          <p className="text-gray-700">{r.message}</p>
                        </td>
                        <td className="py-4">
                          <div className="mb-0.5 text-xs text-gray-400">Time</div>
                          <p className="text-gray-500">{r.time}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Actions */}
              <div className="px-6 py-5 border-t border-gray-200 flex justify-end gap-3">
                <button onClick={() => setSelectedPen(null)} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors">
                  Close
                </button>
                <button onClick={() => { setSuspendReason('Fraud / fake club'); setSuspendNote(''); setSuspendNotification(true); setShowSuspendModal(true); }}
                  className="px-6 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors">
                  Suspend Club
                </button>
                <button onClick={() => { setRemoveReason('Fraud / fake club'); setRemoveNote(''); setRemoveNotification(true); setShowRemoveModal(true); }}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-sm">
                  Remove Pen
                </button>
              </div>
            </div>
          </main>
        </div>

        {/* Remove Pen Modal */}
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
                    className="w-full border border-gray-300 bg-blue-50 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
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
                    <div>
                      <p className="text-sm text-gray-700">Send owner a reactivation notice</p>
                    </div>
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
                  <button onClick={handleRemovePen} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                    Remove pen
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suspend Club Modal */}
        {showSuspendModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-[440px] mx-4 overflow-hidden">
              <div className="p-5">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Suspend Club</h3>
                <select value={suspendReason} onChange={(e) => setSuspendReason(e.target.value)}
                  className="w-full border border-gray-300 bg-blue-50 text-sm rounded-lg px-3 py-2.5 focus:outline-none">
                  <option>Fraud / fake club</option>
                  <option>Spam / abuse</option>
                  <option>Inappropriate content</option>
                  <option>Other violation</option>
                </select>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Optional note</label>
                  <textarea value={suspendNote} onChange={(e) => setSuspendNote(e.target.value)}
                    placeholder="Why are we suspending this club?"
                    className="w-full h-20 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none resize-none" />
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Notification</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Send owner a suspension notice</p>
                    <button onClick={() => setSuspendNotification(!suspendNotification)}
                      className={`relative h-6 w-11 flex items-center rounded-full transition-all ${suspendNotification ? 'bg-blue-600' : 'bg-gray-300'}`}>
                      <div className={`h-5 w-5 bg-white rounded-full shadow transition-all ${suspendNotification ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button onClick={() => setShowSuspendModal(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button onClick={handleSuspendClub} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium">
                    Suspend club
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logout Modal */}
        {showLogoutModal && <LogoutModal onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogoutConfirm} />}

        {toast && <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast(null)} />}
      </div>
    );
  }

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      <Sidebar onLogout={() => setShowLogoutModal(true)} activeItem="reported" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Reported Pens" />

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Open Reports</p>
                <p className="text-4xl font-bold text-gray-900 mt-1">{String(openReports).padStart(2, '0')}</p>
                <p className="text-xs text-gray-400 mt-1">Require attention</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">High</p>
                <p className="text-4xl font-bold text-gray-900 mt-1">{String(highSeverity).padStart(2, '0')}</p>
                <p className="text-xs text-gray-400 mt-1">Possible urgent abuse / harmful content</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Repeat clubs</p>
                <p className="text-4xl font-bold text-gray-900 mt-1">{String(repeatClubs).padStart(2, '0')}</p>
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertTriangle size={12} /> 3+ reports in 7 days
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Reported Pens</h2>
                <p className="text-sm text-gray-500 mt-0.5">Review user reports and take moderation actions.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by pen title, club, poster, email"
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-72" />
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
                  <tr className="bg-blue-50">
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Title</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Category</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Reason</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Club</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Posted by</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Reports</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredPens.map((pen) => (
                    <tr key={pen.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{pen.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{pen.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{pen.reason}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{pen.club}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{pen.postedBy}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap font-medium">{pen.reports}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                          {pen.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button onClick={() => setSelectedPen(pen)}
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors shadow-sm">
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredPens.length === 0 && (
                <div className="py-16 text-center text-gray-500">No reported pens found</div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-end pointer-events-none">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mt-4 mr-4 overflow-hidden pointer-events-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Reported Pens Filter</h3>
              <button onClick={() => setShowFilterModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={22} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Sort */}
              <FilterSection label="Sort">
                {['All', 'Newest first', 'Highest severity', 'Most reported'].map((opt) => (
                  <FilterChip key={opt} label={opt} active={sortFilter === opt} onClick={() => setSortFilter(opt)} />
                ))}
              </FilterSection>

              {/* Reports */}
              <FilterSection label="Reports">
                {['All', 'No reports', '1–2 reports', '3+ reports'].map((opt) => (
                  <FilterChip key={opt} label={opt} active={reportsFilter === opt} onClick={() => setReportsFilter(opt)} />
                ))}
              </FilterSection>

              {/* Date */}
              <FilterSection label="Date">
                {['All', 'Today', 'Last 7 days'].map((opt) => (
                  <FilterChip key={opt} label={opt} active={dateFilter === opt} onClick={() => setDateFilter(opt)} />
                ))}
              </FilterSection>

              {/* Reason */}
              <FilterSection label="Reason">
                {['All', 'Spam / misleading', 'Inappropriate image', 'Other', 'Harassment / hate', 'Misuse of urgent', 'Incorrect info'].map((opt) => (
                  <FilterChip key={opt} label={opt} active={reasonFilter === opt} onClick={() => setReasonFilter(opt)} />
                ))}
              </FilterSection>
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

      {/* Logout Modal */}
      {showLogoutModal && <LogoutModal onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogoutConfirm} />}

      {toast && <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  );
}

// ── Filter helpers ─────────────────────────────────────────────────────────────
function FilterSection({ label, children }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <ChevronDown size={16} className="text-gray-400" />
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({ label, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${active ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
      {label}
    </button>
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