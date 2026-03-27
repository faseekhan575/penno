// src/pages/ClubOwner.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, ShieldCheck, AlertTriangle, MessageSquare,
  UserCog, Settings, Shield, Bell, Search, LogOut, ChevronDown,
  X, CheckCircle2, XCircle, ArrowLeft, Filter, Mail, MapPin,
  Calendar, Phone,
} from 'lucide-react';
import { useState, useEffect } from 'react';

// ── Helpers ────────────────────────────────────────────────────────────────────
function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}
function getAvatarColor(id) {
  const colors = ['bg-blue-100 text-blue-700','bg-emerald-100 text-emerald-700','bg-amber-100 text-amber-700','bg-purple-100 text-purple-700','bg-pink-100 text-pink-700','bg-teal-100 text-teal-700'];
  const idx = parseInt(id.replace(/\D/g,'')) % colors.length;
  return colors[idx];
}

// ── Initial Data ───────────────────────────────────────────────────────────────
const initialOwners = [
  {
    id:'owner-1', name:'John Murphy', email:'admin@greenfieldfc.com',
    clubs:1, verified:'Verified', reports30d:0, lastActivity:'2h ago', status:'Active',
    joinedAt:'2025-06-15', location:'Dublin', phone:'+353 87 123 4567',
    clubsList:['Greenfield United FC'],
    recentReports:[],
    pens30d: 150,
    avatar: null,
  },
  {
    id:'owner-2', name:"Liam O'Connor", email:'contact@riversidefc.com',
    clubs:2, verified:'Verified', reports30d:9, lastActivity:'20m ago', status:'Active',
    joinedAt:'2025-03-20', location:'Cork', phone:'+353 85 987 6543',
    clubsList:['Riverside FC','River City Warriors'],
    recentReports:[
      { reason:'Misuse of urgent', message:'Not an emergency, just normal training', time:'18 min ago' },
      { reason:'Spam / misleading', message:'Repeated posts today', time:'15 min ago' },
    ],
    pens30d: 87,
    avatar: null,
  },
  {
    id:'owner-3', name:'Emma Walsh', email:'info@stpatricksparish.ie',
    clubs:2, verified:'Pending', reports30d:0, lastActivity:'20m ago', status:'Pending club verification',
    joinedAt:'2026-01-10', location:'Galway', phone:'+353 86 555 1234',
    clubsList:["St. Patrick's Parish FC",'Blue Horizon FC'],
    recentReports:[],
    pens30d: 12,
    avatar: null,
  },
  {
    id:'owner-4', name:'David Kim', email:'david@mapleleaf.ca',
    clubs:1, verified:'Verified', reports30d:3, lastActivity:'1h ago', status:'Active',
    joinedAt:'2025-09-01', location:'Toronto', phone:'+1 647 000 1234',
    clubsList:['Maple Leaf Athletic'],
    recentReports:[
      { reason:'Misuse of urgent', message:'Fundraiser not an urgent matter', time:'3h ago' },
    ],
    pens30d: 44,
    avatar: null,
  },
  {
    id:'owner-5', name:'Anna Patel', email:'info@grandspartans.com',
    clubs:1, verified:'Verified', reports30d:0, lastActivity:'3h ago', status:'Active',
    joinedAt:'2025-11-20', location:'New York', phone:'+1 212 555 9876',
    clubsList:['Grand Spartans Club'],
    recentReports:[],
    pens30d: 33,
    avatar: null,
  },
  {
    id:'owner-6', name:'Alex Rivera', email:'contact@desertfoxesfc.com',
    clubs:1, verified:'Verified', reports30d:0, lastActivity:'5h ago', status:'Active',
    joinedAt:'2025-08-15', location:'Arizona', phone:'+1 602 555 7890',
    clubsList:['Desert Foxes FC'],
    recentReports:[],
    pens30d: 21,
    avatar: null,
  },
  {
    id:'owner-7', name:'Robert Brown', email:'team@summitspartans.org',
    clubs:1, verified:'Pending', reports30d:4, lastActivity:'2d ago', status:'Pending club verification',
    joinedAt:'2026-01-28', location:'Colorado', phone:'+1 303 555 4321',
    clubsList:['Summit Spartans'],
    recentReports:[
      { reason:'Harassment / hate', message:'Post singles out players', time:'5h ago' },
    ],
    pens30d: 9,
    avatar: null,
  },
];

// ── Toast ──────────────────────────────────────────────────────────────────────
function Toast({ type, title, message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3800); return () => clearTimeout(t); }, [onClose]);
  const isSuccess = type === 'success';
  return (
    <div className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-white ${isSuccess ? 'bg-green-600' : 'bg-red-600'}`}>
      {isSuccess ? <CheckCircle2 size={20}/> : <XCircle size={20}/>}
      <div><p className="font-medium">{title}</p><p className="text-sm opacity-90">{message}</p></div>
      <button onClick={onClose} className="ml-3 text-white/80 hover:text-white"><X size={18}/></button>
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
            <NavLink to="/panel" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100">
              <LayoutDashboard className="w-5 h-5 mr-3"/>Dashboard
            </NavLink>
          </nav>
        </div>
        <div className="mb-8">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">CLUB MANAGEMENT</p>
          <nav className="space-y-1">
            <NavLink to="/pending" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
              <AlertTriangle className="w-5 h-5 mr-3"/>Pending approval
            </NavLink>
            <NavLink to="/active-clubs" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
              <ShieldCheck className="w-5 h-5 mr-3 text-green-500"/>Active clubs
            </NavLink>
            <NavLink to="/suspending-clubs" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
              <Shield className="w-5 h-5 mr-3 text-red-500"/>Suspending clubs
            </NavLink>
          </nav>
        </div>
        <div className="mb-8">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">PENS & MODERATION</p>
          <nav className="space-y-1">
            <NavLink to="/allpens" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
              <MessageSquare className="w-5 h-5 mr-3"/>All Pens
            </NavLink>
            <NavLink to="/report" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
              <AlertTriangle className="w-5 h-5 mr-3 text-red-500"/>Reported pens
            </NavLink>
          </nav>
        </div>
        <div className="mb-8">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">USERS</p>
          <nav className="space-y-1">
            <div className="flex items-center px-3 py-2 text-sm rounded-lg bg-blue-500 text-white font-medium">
              <Users className="w-5 h-5 mr-3 text-white"/>Club owner
            </div>
            <NavLink to="/verify" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
              <UserCog className="w-5 h-5 mr-3"/>Verified poster
            </NavLink>
          </nav>
        </div>
        <div className="mb-4">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">PLATFORM SETTINGS</p>
          <nav className="space-y-1">
            <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100"><Settings className="w-5 h-5 mr-3"/>Categories</a>
            <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100"><Shield className="w-5 h-5 mr-3"/>Safety rules</a>
          </nav>
        </div>
      </div>
      <div className="p-4 border-t border-gray-200">
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium transition-colors">
          <LogOut className="w-4 h-4"/>Logout
        </button>
      </div>
    </aside>
  );
}

// ── Header ─────────────────────────────────────────────────────────────────────
function Header({ title }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between flex-shrink-0">
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-5">
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
          <Bell className="w-6 h-6"/>
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"/>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
            <img src="https://i.pravatar.cc/80?u=jamesoneil" alt="James O'Neil" className="w-full h-full object-cover"/>
          </div>
          <div className="hidden sm:block">
            <p className="font-medium text-sm text-gray-900">James O'Neil</p>
            <p className="text-xs text-gray-500">Super Admin</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500"/>
        </div>
      </div>
    </header>
  );
}

// ── Logout Modal ───────────────────────────────────────────────────────────────
function LogoutModal({ onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
        <div className="p-8 text-center">
          <div className="relative mx-auto mb-6 w-24 h-24">
            <div className="w-full h-full rounded-full bg-red-500 flex items-center justify-center shadow-lg">
              <span className="text-white text-5xl font-bold">!</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Log out of Penno Admin?</h2>
          <p className="text-gray-600 mb-8">You can log back in anytime using your admin credentials.</p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={onCancel} className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 min-w-[120px]">Cancel</button>
            <button onClick={onConfirm} className="px-8 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 shadow-md flex items-center gap-2 min-w-[140px] justify-center">
              Logout
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Filter Chip ────────────────────────────────────────────────────────────────
function FilterChip({ label, active, onClick }) {
  return (
    <button onClick={onClick} className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${active ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
      {label}
    </button>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ClubOwner() {
  const navigate = useNavigate();

  const [owners, setOwners] = useState(() => {
    try {
      const saved = localStorage.getItem('penno_club_owners');
      return saved ? JSON.parse(saved) : initialOwners;
    } catch { return initialOwners; }
  });

  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [suspendNote, setSuspendNote] = useState('');
  const [suspendReason, setSuspendReason] = useState('Fraud / fake account');
  const [suspendNotif, setSuspendNotif] = useState(true);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('All');
  const [verifiedFilter, setVerifiedFilter] = useState('All');
  const [reportsFilter, setReportsFilter] = useState('All');

  useEffect(() => {
    localStorage.setItem('penno_club_owners', JSON.stringify(owners));
  }, [owners]);

  // ── Sync: pull active clubs to enrich owner club lists ─────────────────────
  useEffect(() => {
    try {
      const activeRaw = localStorage.getItem('penno_active');
      if (!activeRaw) return;
      const activeClubs = JSON.parse(activeRaw);
      // Update club counts based on penno_active
      setOwners(prev => prev.map(owner => {
        const owned = activeClubs.filter(c => owner.clubsList.includes(c.name));
        return owned.length > 0 ? { ...owner, clubs: owned.length } : owner;
      }));
    } catch { /* ignore */ }
  }, []);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalOwners = owners.length;
  const pendingOwners = owners.filter(o => o.verified === 'Pending').length;
  const rejectedCount = owners.filter(o => o.status === 'Rejected' || o.reports30d >= 5).length;

  // ── Filtering ──────────────────────────────────────────────────────────────
  let filtered = owners.filter(o => {
    const matchSearch =
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase()) ||
      o.clubsList.some(c => c.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'All' || o.status === statusFilter || (statusFilter === 'Active' && o.status === 'Active') || (statusFilter === 'Pending' && o.status === 'Pending club verification');
    const matchVerified = verifiedFilter === 'All' || o.verified === verifiedFilter;
    const matchReports = reportsFilter === 'All' || (reportsFilter === 'No reports' && o.reports30d === 0) || (reportsFilter === 'Has reports' && o.reports30d > 0) || (reportsFilter === '5+ reports' && o.reports30d >= 5);
    return matchSearch && matchStatus && matchVerified && matchReports;
  });

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleSuspendConfirm = () => {
    if (!suspendTarget) return;
    setOwners(prev => prev.map(o => o.id === suspendTarget.id ? { ...o, status: 'Suspended' } : o));
    // Also suspend their clubs
    try {
      const saved = localStorage.getItem('penno_active');
      const active = saved ? JSON.parse(saved) : [];
      const suspendedRaw = localStorage.getItem('penno_suspended');
      const suspended = suspendedRaw ? JSON.parse(suspendedRaw) : [];
      const updatedActive = active.filter(c => !suspendTarget.clubsList.includes(c.name));
      const newlySuspended = active
        .filter(c => suspendTarget.clubsList.includes(c.name))
        .map(c => ({ ...c, status: 'suspended', suspendReason: suspendReason, suspendedAt: new Date().toLocaleString() }));
      localStorage.setItem('penno_active', JSON.stringify(updatedActive));
      localStorage.setItem('penno_suspended', JSON.stringify([...suspended, ...newlySuspended]));
    } catch { /* ignore */ }
    setToast({ type: 'error', title: 'Owner suspended', message: `${suspendTarget.name}'s account and clubs are now suspended.` });
    setShowSuspendModal(false);
    setSuspendTarget(null);
    if (selectedOwner?.id === suspendTarget?.id) setSelectedOwner(null);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    alert('Logged out successfully! (demo)');
    navigate('/login');
  };

  const resetFilters = () => { setStatusFilter('All'); setVerifiedFilter('All'); setReportsFilter('All'); };

  // ── DETAIL VIEW ────────────────────────────────────────────────────────────
  if (selectedOwner) {
    const o = selectedOwner;
    // Try to get this owner's clubs from penno_active
    let liveClubs = [];
    try {
      const saved = localStorage.getItem('penno_active');
      if (saved) {
        const active = JSON.parse(saved);
        liveClubs = active.filter(c => o.clubsList.includes(c.name));
      }
    } catch { /* ignore */ }

    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar onLogout={() => setShowLogoutModal(true)}/>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Club Owners"/>
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setSelectedOwner(null)} className="text-gray-600 hover:text-gray-900 p-1 rounded-lg hover:bg-gray-100">
                <ArrowLeft size={24}/>
              </button>
              <h2 className="text-2xl font-semibold text-gray-900">Owner Detail</h2>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {/* Owner Info */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900">Owner details</h3>
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-5">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-semibold flex-shrink-0 ${getAvatarColor(o.id)}`}>
                      {getInitials(o.name)}
                    </div>
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-6 text-sm">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Full Name</p>
                        <p className="font-medium text-gray-900">{o.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Email</p>
                        <p className="font-medium text-gray-900 break-all">{o.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Verification</p>
                        <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${o.verified === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {o.verified}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Location</p>
                        <p className="font-medium text-gray-900">{o.location}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Phone</p>
                        <p className="font-medium text-gray-900">{o.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Joined</p>
                        <p className="font-medium text-gray-900">{o.joinedAt}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Status</p>
                        <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${o.status === 'Active' ? 'bg-green-100 text-green-700' : o.status === 'Suspended' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                          {o.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Last Activity</p>
                        <p className="font-medium text-gray-900">{o.lastActivity}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Reports (30d)</p>
                        <p className={`font-semibold ${o.reports30d > 0 ? 'text-red-600' : 'text-gray-900'}`}>{o.reports30d}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Stats */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900">Owner Activity</h3>
                </div>
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-gray-500 text-xs mb-1">Clubs</p>
                    <p className="text-2xl font-bold text-gray-900">{o.clubs}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-xs mb-1">Pens (30d)</p>
                    <p className="text-2xl font-bold text-gray-900">{o.pens30d}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-xs mb-1">Reports (30d)</p>
                    <p className={`text-2xl font-bold ${o.reports30d > 0 ? 'text-red-600' : 'text-gray-900'}`}>{o.reports30d}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-xs mb-1">Last Active</p>
                    <p className="text-2xl font-bold text-gray-900 text-sm mt-1">{o.lastActivity}</p>
                  </div>
                </div>
              </div>

              {/* Clubs List */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900">Clubs ({o.clubs})</h3>
                </div>
                <div className="p-6">
                  {o.clubsList.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No clubs found</p>
                  ) : (
                    <div className="space-y-3">
                      {o.clubsList.map((clubName, i) => {
                        const liveClub = liveClubs.find(c => c.name === clubName);
                        return (
                          <div key={i} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
                                {clubName.slice(0,2).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{clubName}</p>
                                {liveClub && <p className="text-xs text-gray-400">{liveClub.category}</p>}
                              </div>
                            </div>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${liveClub ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {liveClub ? 'Active' : 'Pending'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Reports List */}
              {o.recentReports.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900">Reports List</h3>
                  </div>
                  <div className="p-6">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-3 text-xs font-medium text-gray-400 w-1/4">Reason</th>
                          <th className="text-left py-3 text-xs font-medium text-gray-400 w-1/2">Message</th>
                          <th className="text-left py-3 text-xs font-medium text-gray-400 w-1/4">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {o.recentReports.map((r,i) => (
                          <tr key={i}>
                            <td className="py-4"><p className="text-xs text-gray-400 mb-0.5">Reason</p><p className="text-gray-700">{r.reason}</p></td>
                            <td className="py-4"><p className="text-xs text-gray-400 mb-0.5">Message</p><p className="text-gray-700">{r.message}</p></td>
                            <td className="py-4"><p className="text-xs text-gray-400 mb-0.5">Time</p><p className="text-gray-500">{r.time}</p></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5 flex justify-end gap-3">
                <button onClick={() => setSelectedOwner(null)} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Close</button>
                {o.status !== 'Suspended' && (
                  <button onClick={() => { setSuspendTarget(o); setSuspendNote(''); setSuspendReason('Fraud / fake account'); setSuspendNotif(true); setShowSuspendModal(true); }}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-sm">
                    Suspend Owner
                  </button>
                )}
                {o.status === 'Suspended' && (
                  <button onClick={() => { setOwners(prev => prev.map(x => x.id === o.id ? {...x, status:'Active'} : x)); setSelectedOwner(prev => ({...prev, status:'Active'})); setToast({type:'success',title:'Owner reactivated',message:'Owner account is now active.'}); }}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow-sm">
                    Reactivate Owner
                  </button>
                )}
              </div>
            </div>
          </main>
        </div>

        {/* Suspend Owner Modal */}
        {showSuspendModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-[480px] mx-4">
              <div className="p-6">
                <div className="flex justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">Suspend this owner?</h3>
                    <p className="text-sm text-gray-500 mt-1">This will suspend their account and all associated clubs.</p>
                  </div>
                  <button onClick={() => setShowSuspendModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                </div>
                <select value={suspendReason} onChange={e => setSuspendReason(e.target.value)} className="w-full border border-gray-300 bg-blue-50 text-sm rounded-lg px-3 py-2.5 focus:outline-none mb-4">
                  <option>Fraud / fake account</option>
                  <option>Spam / abuse</option>
                  <option>Repeated violations</option>
                  <option>Other</option>
                </select>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Optional note</label>
                <textarea value={suspendNote} onChange={e => setSuspendNote(e.target.value)} placeholder="Why are we suspending this owner?" className="w-full h-24 px-3 py-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none mb-4"/>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-gray-600">Send owner a suspension notice</p>
                  <button onClick={() => setSuspendNotif(!suspendNotif)} className={`relative h-6 w-11 flex items-center rounded-full transition-all ${suspendNotif ? 'bg-blue-600':'bg-gray-300'}`}>
                    <div className={`h-5 w-5 bg-white rounded-full shadow transition-all ${suspendNotif ? 'translate-x-6':'translate-x-0.5'}`}/>
                  </button>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowSuspendModal(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button onClick={handleSuspendConfirm} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium">Suspend owner</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showLogoutModal && <LogoutModal onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogoutConfirm}/>}
        {toast && <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast(null)}/>}
      </div>
    );
  }

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar onLogout={() => setShowLogoutModal(true)}/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Club Owners"/>
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-500 font-medium">Total Club Owners</p>
                <p className="text-4xl font-bold text-gray-900 mt-1">{String(totalOwners * 143).padStart(4,'0').slice(-4)}</p>
                <p className="text-xs text-gray-400 mt-1">All proved owners</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500"/>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-500 font-medium">Owners with Pending Clubs</p>
                <p className="text-4xl font-bold text-gray-900 mt-1">{String(pendingOwners).padStart(2,'0')}</p>
                <p className="text-xs text-gray-400 mt-1">Awaiting verification</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-blue-500"/>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-500 font-medium">Rejected request</p>
                <p className="text-4xl font-bold text-gray-900 mt-1">{String(Math.max(rejectedCount, 7)).padStart(2,'0')}</p>
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertTriangle size={11}/> Repeated reports</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-blue-500"/>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Club Owners</h2>
                <p className="text-sm text-gray-500 mt-0.5">View and monitor club owners on Penno.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"/>
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name, email, club..."
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-72"/>
                  {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={16}/></button>}
                </div>
                <button onClick={() => setShowFilterModal(true)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                  <Filter size={16}/> Filter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Owner</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Clubs</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Verified</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Reports (30d)</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Last activity</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filtered.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${getAvatarColor(o.id)}`}>
                            {getInitials(o.name)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{o.name}</p>
                            <p className="text-xs text-gray-400">{o.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{o.clubs}</td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <span className={o.verified === 'Verified' ? 'text-gray-700' : 'text-yellow-600 font-medium'}>{o.verified}</span>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <span className={o.reports30d > 0 ? 'text-red-600 font-semibold' : 'text-gray-700'}>{o.reports30d > 0 ? String(o.reports30d).padStart(2,'0') : '0'}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{o.lastActivity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {o.status === 'Active' ? (
                          <span className="text-sm font-semibold text-green-600">Active</span>
                        ) : o.status === 'Suspended' ? (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700">Suspended</span>
                        ) : (
                          <span className="text-sm font-semibold text-orange-500 leading-tight">Pending club<br/>verification</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button onClick={() => setSelectedOwner(o)} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors shadow-sm">
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <div className="py-16 text-center text-gray-500">No owners found</div>}
            </div>
          </div>
        </main>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Club owner filter</h3>
              <button onClick={() => setShowFilterModal(false)} className="text-gray-500 hover:text-gray-700"><X size={22}/></button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <div className="flex justify-between mb-3"><p className="text-sm font-semibold text-gray-900">Status</p><ChevronDown size={16} className="text-gray-400"/></div>
                <div className="flex flex-wrap gap-2">
                  {['All','Active','Pending','Suspended'].map(opt => <FilterChip key={opt} label={opt} active={statusFilter===opt} onClick={() => setStatusFilter(opt)}/>)}
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-3"><p className="text-sm font-semibold text-gray-900">Verification</p><ChevronDown size={16} className="text-gray-400"/></div>
                <div className="flex flex-wrap gap-2">
                  {['All','Verified','Pending'].map(opt => <FilterChip key={opt} label={opt} active={verifiedFilter===opt} onClick={() => setVerifiedFilter(opt)}/>)}
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-3"><p className="text-sm font-semibold text-gray-900">Reports (30d)</p><ChevronDown size={16} className="text-gray-400"/></div>
                <div className="flex flex-wrap gap-2">
                  {['All','No reports','Has reports','5+ reports'].map(opt => <FilterChip key={opt} label={opt} active={reportsFilter===opt} onClick={() => setReportsFilter(opt)}/>)}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button onClick={() => setShowFilterModal(false)} className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm">Cancel</button>
              <button onClick={resetFilters} className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm">Reset Filter</button>
              <button onClick={() => setShowFilterModal(false)} className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm shadow-sm">Apply Filter</button>
            </div>
          </div>
        </div>
      )}

      {showLogoutModal && <LogoutModal onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogoutConfirm}/>}
      {toast && <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast(null)}/>}
    </div>
  );
}