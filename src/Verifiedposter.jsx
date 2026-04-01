// src/pages/VerifiedPoster.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, ShieldCheck, AlertTriangle, MessageSquare,
  UserCog, Settings, Shield, Search, LogOut, ChevronDown,
  X, CheckCircle2, XCircle, ArrowLeft, Filter,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { pushNotification, NotifBell } from './Notifications';

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
const initialPosters = [
  {
    id:'poster-1',
    name:'Charlie Byrne', email:'charlie@greenfieldfc.com',
    clubs:'Greenfield United FC', clubLogo:'shield',
    role:'Poster', pens30d:10, lastActivity:'2h ago',
    status:'Active', verification:'Verified',
    clubName:'Greenfield United FC',
    officialEmail:'admin@greenfieldfc.com',
    category:'Soccer',
    createdBy:'John Murphy',
    clubLocation:'Dublin (if provided)',
    submittedAt:'2026-02-02, 10:21 AM',
    teams:4, verifiedPosters:4, totalPens:150, reports30days:1,
    recentPens:[
      { id:'rp-1', title:'Training Schedule Update', type:'Update', date:'12 Sep 2026, 6:30 PM', reports:0 },
      { id:'rp-2', title:'Senior Team Training', type:'Event', date:'10 Sep 2026, 5:00 PM', reports:1 },
    ],
    reportsList:[
      { reason:'Misuse of urgent', message:'Not an emergency, just normal training', time:'18 min ago' },
    ],
  },
  {
    id:'poster-2',
    name:'Sarah O\'Brien', email:'sarah@rivercitywarriors.com',
    clubs:'River City Warriors', clubLogo:'circle',
    role:'Poster', pens30d:5, lastActivity:'1h ago',
    status:'Active', verification:'Verified',
    clubName:'River City Warriors',
    officialEmail:'info@rivercitywarriors.com',
    category:'Community',
    createdBy:'Sarah Lee',
    clubLocation:'Not provided',
    submittedAt:'2026-02-01, 09:45 AM',
    teams:2, verifiedPosters:2, totalPens:55, reports30days:2,
    recentPens:[
      { id:'rp-3', title:'Match Results Update', type:'Result', date:'10 Sep 2026, 6:00 PM', reports:2 },
      { id:'rp-4', title:'Community Walk Event', type:'Event', date:'05 Sep 2026, 10:00 AM', reports:0 },
    ],
    reportsList:[
      { reason:'Inappropriate image', message:'Image contains offensive content', time:'2h ago' },
      { reason:'Other', message:'Photo is from wrong match', time:'1h ago' },
    ],
  },
  {
    id:'poster-3',
    name:'Kevin Park', email:'kevin@mapleleafathletic.ca',
    clubs:'Maple Leaf Athletic', clubLogo:'star',
    role:'Poster', pens30d:18, lastActivity:'30m ago',
    status:'Pending', verification:'Pending verification',
    clubName:'Maple Leaf Athletic',
    officialEmail:'admin@mapleleafathletic.ca',
    category:'School',
    createdBy:'David Kim',
    clubLocation:'Toronto',
    submittedAt:'2026-02-02, 08:30 AM',
    teams:3, verifiedPosters:1, totalPens:72, reports30days:7,
    recentPens:[
      { id:'rp-5', title:'Fundraiser Event This Saturday', type:'Event', date:'12 Sep 2026, 2:00 PM', reports:7 },
    ],
    reportsList:[
      { reason:'Misuse of urgent', message:'Fundraiser is not an urgent matter', time:'3h ago' },
      { reason:'Spam / misleading', message:'Same post shared 3 times', time:'2h ago' },
      { reason:'Misuse of urgent', message:'Stop marking everything urgent', time:'90 min ago' },
    ],
  },
  {
    id:'poster-4',
    name:'Aoife Murphy', email:'aoife@bluehorizonfc.ie',
    clubs:'Blue Horizon FC', clubLogo:'shield',
    role:'Poster', pens30d:8, lastActivity:'4h ago',
    status:'Active', verification:'Verified',
    clubName:'Blue Horizon FC',
    officialEmail:'contact@bluehorizonfc.ie',
    category:'GAA',
    createdBy:'Emma Walsh',
    clubLocation:'Not provided',
    submittedAt:'2026-02-02, 07:15 AM',
    teams:5, verifiedPosters:3, totalPens:210, reports30days:0,
    recentPens:[
      { id:'rp-6', title:'Senior Training Cancelled', type:'Update', date:'10 Sep 2026, 9:00 AM', reports:0 },
      { id:'rp-7', title:'County Championship Draw', type:'Announcement', date:'08 Sep 2026, 3:00 PM', reports:0 },
    ],
    reportsList:[],
  },
  {
    id:'poster-5',
    name:'Patrick Doyle', email:'pat@phoenixrangers.ie',
    clubs:'Phoenix Rangers', clubLogo:'shield',
    role:'Poster', pens30d:3, lastActivity:'6h ago',
    status:'Active', verification:'Verified',
    clubName:'Phoenix Rangers',
    officialEmail:'admin@phoenixrangers.ie',
    category:'GAA',
    createdBy:'Liam Doyle',
    clubLocation:'Dublin',
    submittedAt:'2026-02-01, 19:20 PM',
    teams:4, verifiedPosters:2, totalPens:88, reports30days:0,
    recentPens:[
      { id:'rp-8', title:'New Training Kit Available', type:'Update', date:'09 Sep 2026, 8:00 AM', reports:0 },
    ],
    reportsList:[],
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

// ── Profile Modal (Exact match to your image) ────────────────────────────────
function ProfileModal({ onClose, onLogout }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Blue Banner */}
        <div className="bg-blue-600 h-28 relative">
          <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-full border-4 border-white overflow-hidden">
            <img 
              src="https://i.pravatar.cc/80?u=jamesoneil" 
              alt="James O'Neil" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="pt-14 pb-6 px-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">James O'Neil</h2>
              <p className="text-gray-500 mt-0.5">Dianne.russell@mail.com</p>
            </div>
            <div className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded">Super Admin</div>
          </div>

          <div className="mt-8 flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button 
              onClick={onLogout}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              Logout
              <span className="text-lg leading-none">↗</span>
            </button>
          </div>
        </div>
      </div>
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
            <NavLink to="/club-own" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
              <Users className="w-5 h-5 mr-3"/>Club owner
            </NavLink>
            <div className="flex items-center px-3 py-2 text-sm rounded-lg bg-blue-500 text-white font-medium">
              <UserCog className="w-5 h-5 mr-3 text-white"/>Verified poster
            </div>
          </nav>
        </div>
        <div className="mb-4">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">PLATFORM SETTINGS</p>
          <nav className="space-y-1">
            <a href="/cat" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100"><Settings className="w-5 h-5 mr-3"/>Categories</a>
            <a href="/safety" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100"><Shield className="w-5 h-5 mr-3"/>Safety rules</a>
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
function Header({ title, onProfileClick }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between flex-shrink-0">
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-5">
        <NotifBell />
        <div 
          onClick={onProfileClick}
          className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-1.5 -m-1.5 rounded-xl transition-colors"
        >
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
export default function VerifiedPoster() {
  const navigate = useNavigate();

  const [posters, setPosters] = useState(() => {
    try {
      const saved = localStorage.getItem('penno_verified_posters');
      return saved ? JSON.parse(saved) : initialPosters;
    } catch { return initialPosters; }
  });

  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showRemovePenModal, setShowRemovePenModal] = useState(false);
  const [penToRemove, setPenToRemove] = useState(null);
  const [removePenReason, setRemovePenReason] = useState('Fraud / fake club');
  const [removePenNote, setRemovePenNote] = useState('');
  const [removePenNotif, setRemovePenNotif] = useState(true);
  const [showRevokePosterModal, setShowRevokePosterModal] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [revokeNote, setRevokeNote] = useState('');
  const [revokeNotif, setRevokeNotif] = useState(true);

  // Profile Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('All');
  const [verificationFilter, setVerificationFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    localStorage.setItem('penno_verified_posters', JSON.stringify(posters));
  }, [posters]);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalVerified = posters.filter(p => p.verification === 'Verified').length;
  const pendingPosters = posters.filter(p => p.status === 'Pending' || p.verification === 'Pending verification').length;
  const rejectedPosters = posters.filter(p => p.status === 'Rejected' || p.reports30days >= 5).length;

  // ── Filtering ──────────────────────────────────────────────────────────────
  let filtered = posters.filter(p => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.clubs.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchVerification = verificationFilter === 'All' || (verificationFilter === 'Verified only' && p.verification === 'Verified') || (verificationFilter === 'Pending verification' && p.verification === 'Pending verification');
    const matchCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchSearch && matchStatus && matchVerification && matchCategory;
  });

  // ── Remove Pen (syncs with penno_all_pens) ─────────────────────────────────
  const handleRemovePenConfirm = () => {
    if (!penToRemove || !selectedPoster) return;
    const updatedPoster = {
      ...selectedPoster,
      recentPens: selectedPoster.recentPens.filter(rp => rp.id !== penToRemove.id),
    };
    setPosters(prev => prev.map(p => p.id === selectedPoster.id ? updatedPoster : p));
    setSelectedPoster(updatedPoster);
    try {
      const saved = localStorage.getItem('penno_all_pens');
      if (saved) {
        const allPens = JSON.parse(saved);
        const updated = allPens.filter(ap => ap.title !== penToRemove.title);
        localStorage.setItem('penno_all_pens', JSON.stringify(updated));
      }
    } catch { /* ignore */ }
    setToast({ type:'error', title:'Pen removed', message:'Followers will no longer see it.' });
    setShowRemovePenModal(false);
    setPenToRemove(null);
  };

  // ── Revoke Poster Access ───────────────────────────────────────────────────
  const handleRevokeConfirm = () => {
    if (!revokeTarget) return;
    setPosters(prev => prev.map(p => p.id === revokeTarget.id ? {...p, status:'Revoked', verification:'Revoked'} : p));
    if (selectedPoster?.id === revokeTarget.id) setSelectedPoster(prev => ({...prev, status:'Revoked', verification:'Revoked'}));
    setToast({ type:'error', title:'Poster access revoked', message:`${revokeTarget.name} can no longer post on Penno.` });
    setShowRevokePosterModal(false);
    setRevokeTarget(null);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    alert('Logged out successfully! (demo)');
    navigate('/login');
  };

  const resetFilters = () => { setStatusFilter('All'); setVerificationFilter('All'); setCategoryFilter('All'); };

  // ── DETAIL VIEW (Image 3 — Club Detail) ────────────────────────────────────
  if (selectedPoster) {
    const p = selectedPoster;
    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar onLogout={() => setShowLogoutModal(true)}/>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Verified Poster" onProfileClick={() => setShowProfileModal(true)} />
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setSelectedPoster(null)} className="text-gray-600 hover:text-gray-900 p-1 rounded-lg hover:bg-gray-100">
                <ArrowLeft size={24}/>
              </button>
              <h2 className="text-2xl font-semibold text-gray-900">Club Detail</h2>
            </div>

            <div className="max-w-5xl mx-auto space-y-4">
              {/* Club Details — exactly as Image 3 */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900">Club details</h3>
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                      <Shield size={22} className="text-blue-400"/>
                    </div>
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-y-5 gap-x-6 text-sm">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Club Name</p>
                        <p className="font-medium text-gray-900">{p.clubName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Official Email</p>
                        <p className="font-medium text-gray-900 break-all">{p.officialEmail}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Category</p>
                        <p className="font-medium text-gray-900">{p.category}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Created by</p>
                        <p className="font-medium text-gray-900">{p.createdBy}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Club Location</p>
                        <p className="font-medium text-gray-900">{p.clubLocation}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs text-gray-400 mb-1">Submitted at</p>
                        <p className="font-medium text-gray-900">{p.submittedAt}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Club Activity — exactly as Image 3 */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900">Club Activity</h3>
                </div>
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
                  <div>
                    <p className="text-gray-500 text-sm mb-2">Teams</p>
                    <p className="text-2xl font-semibold text-gray-900">{p.teams}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-2">Verified posters</p>
                    <p className="text-2xl font-semibold text-gray-900">{p.verifiedPosters}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-2">Total pens</p>
                    <p className="text-2xl font-semibold text-gray-900">{p.totalPens}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-2">Reports (30 days)</p>
                    <p className={`text-2xl font-semibold ${p.reports30days > 0 ? 'text-red-600' : 'text-gray-900'}`}>{p.reports30days}</p>
                  </div>
                </div>
              </div>

              {/* Recent Pens — exactly as Image 3 */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900">Recent Pens</h3>
                </div>
                <div className="p-6">
                  {p.recentPens.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No recent pens</p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-3 text-xs font-medium text-gray-400">Title</th>
                          <th className="text-left py-3 text-xs font-medium text-gray-400">Type</th>
                          <th className="text-left py-3 text-xs font-medium text-gray-400">Date</th>
                          <th className="text-left py-3 text-xs font-medium text-gray-400">Reports</th>
                          <th className="text-right py-3 text-xs font-medium text-gray-400">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {p.recentPens.map((pen, i) => (
                          <tr key={pen.id || i}>
                            <td className="py-4">
                              <p className="text-xs text-gray-400 mb-0.5">Title</p>
                              <p className="text-gray-900">{pen.title}</p>
                            </td>
                            <td className="py-4">
                              <p className="text-xs text-gray-400 mb-0.5">Type</p>
                              <p className="text-gray-700">{pen.type}</p>
                            </td>
                            <td className="py-4">
                              <p className="text-xs text-gray-400 mb-0.5">Date</p>
                              <p className="text-gray-500">{pen.date}</p>
                            </td>
                            <td className="py-4">
                              <p className="text-xs text-gray-400 mb-0.5">Reports</p>
                              <p className={pen.reports > 0 ? 'text-red-600 font-semibold' : 'text-gray-700'}>{pen.reports}</p>
                            </td>
                            <td className="py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">View</button>
                                <button onClick={() => { setPenToRemove(pen); setRemovePenReason('Fraud / fake club'); setRemovePenNote(''); setRemovePenNotif(true); setShowRemovePenModal(true); }}
                                  className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors">Remove</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Reports List — exactly as Image 3 */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900">Reports List</h3>
                </div>
                <div className="p-6">
                  {p.reportsList.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No reports on this poster</p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-3 text-xs font-medium text-gray-400 w-1/4">Reason</th>
                          <th className="text-left py-3 text-xs font-medium text-gray-400 w-1/2">Message</th>
                          <th className="text-left py-3 text-xs font-medium text-gray-400 w-1/4">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {p.reportsList.map((r,i) => (
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
                  )}
                </div>
              </div>

              {/* Poster Info Row */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
                  <h3 className="text-base font-semibold text-gray-900">Poster Info</h3>
                </div>
                <div className="p-6 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${getAvatarColor(p.id)}`}>
                    {getInitials(p.name)}
                  </div>
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Poster Name</p>
                      <p className="font-medium text-gray-900">{p.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Email</p>
                      <p className="font-medium text-gray-900 break-all">{p.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Role</p>
                      <p className="font-medium text-gray-900">{p.role}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Verification</p>
                      <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${p.verification === 'Verified' ? 'bg-green-100 text-green-700' : p.verification === 'Revoked' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {p.verification}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-5 flex justify-end gap-3">
                <button onClick={() => setSelectedPoster(null)} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Close</button>
                {p.status !== 'Revoked' && p.verification !== 'Revoked' && (
                  <button onClick={() => { setRevokeTarget(p); setRevokeNote(''); setRevokeNotif(true); setShowRevokePosterModal(true); }}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-sm">
                    Revoke Access
                  </button>
                )}
                {(p.status === 'Revoked' || p.verification === 'Revoked') && (
                  <button onClick={() => { setPosters(prev => prev.map(x => x.id === p.id ? {...x, status:'Active', verification:'Verified'} : x)); setSelectedPoster(prev => ({...prev, status:'Active', verification:'Verified'})); setToast({type:'success', title:'Access restored', message:`${p.name} can now post again.`}); }}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow-sm">
                    Restore Access
                  </button>
                )}
              </div>
            </div>
          </main>
        </div>

        {/* Remove Pen Modal */}
        {showRemovePenModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-[500px] mx-4">
              <div className="p-6">
                <div className="flex justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">Remove this pen from Penno?</h3>
                    <p className="text-sm text-gray-500 mt-1">This pen will be hidden from feeds and discovery. The club will be notified.</p>
                  </div>
                  <button onClick={() => setShowRemovePenModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                </div>
                <select value={removePenReason} onChange={e => setRemovePenReason(e.target.value)} className="w-full border border-gray-300 bg-blue-50 text-sm rounded-lg px-3 py-2.5 focus:outline-none mb-4">
                  <option>Fraud / fake club</option>
                  <option>Spam / abuse</option>
                  <option>Inappropriate content</option>
                  <option>Misuse of urgent</option>
                  <option>Other violation</option>
                </select>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Optional note</label>
                <textarea value={removePenNote} onChange={e => setRemovePenNote(e.target.value)} placeholder="Why are we removing this pen?" className="w-full h-24 px-3 py-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none mb-4"/>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-gray-600">Send owner a reactivation notice</p>
                  <button onClick={() => setRemovePenNotif(!removePenNotif)} className={`relative h-6 w-11 flex items-center rounded-full transition-all ${removePenNotif ? 'bg-blue-600':'bg-gray-300'}`}>
                    <div className={`h-5 w-5 bg-white rounded-full shadow transition-all ${removePenNotif ? 'translate-x-6':'translate-x-0.5'}`}/>
                  </button>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowRemovePenModal(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button onClick={handleRemovePenConfirm} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium">Remove pen</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Revoke Poster Access Modal */}
        {showRevokePosterModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-[460px] mx-4">
              <div className="p-6">
                <div className="flex justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">Revoke poster access?</h3>
                    <p className="text-sm text-gray-500 mt-1">This poster will no longer be able to publish pens on Penno.</p>
                  </div>
                  <button onClick={() => setShowRevokePosterModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Optional note</label>
                <textarea value={revokeNote} onChange={e => setRevokeNote(e.target.value)} placeholder="Why are we revoking this poster's access?" className="w-full h-24 px-3 py-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none mb-4"/>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-gray-600">Send poster a revocation notice</p>
                  <button onClick={() => setRevokeNotif(!revokeNotif)} className={`relative h-6 w-11 flex items-center rounded-full transition-all ${revokeNotif ? 'bg-blue-600':'bg-gray-300'}`}>
                    <div className={`h-5 w-5 bg-white rounded-full shadow transition-all ${revokeNotif ? 'translate-x-6':'translate-x-0.5'}`}/>
                  </button>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowRevokePosterModal(false)} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button onClick={handleRevokeConfirm} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium">Revoke access</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Modal */}
        {showProfileModal && (
          <ProfileModal 
            onClose={() => setShowProfileModal(false)} 
            onLogout={() => { 
              setShowProfileModal(false); 
              setShowLogoutModal(true); 
            }} 
          />
        )}

        {showLogoutModal && <LogoutModal onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogoutConfirm}/>}
        {toast && <Toast type={toast.type} title={toast.title} message={toast.message} onClose={() => setToast(null)}/>}
      </div>
    );
  }

  // ── LIST VIEW (Image 2) ────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar onLogout={() => setShowLogoutModal(true)}/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Verified Poster" onProfileClick={() => setShowProfileModal(true)} />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">

          {/* Stats — Image 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-500 font-medium">Total Verified Posters</p>
                <p className="text-4xl font-bold text-gray-900 mt-1">120</p>
                <p className="text-xs text-gray-400 mt-1">Across all clubs</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500"/>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-500 font-medium">Posters with Pending</p>
                <p className="text-4xl font-bold text-gray-900 mt-1">{String(pendingPosters + 9).padStart(2,'0')}</p>
                <p className="text-xs text-gray-400 mt-1">Awaiting club owner approval</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-blue-500"/>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-500 font-medium">Rejected poster</p>
                <p className="text-4xl font-bold text-gray-900 mt-1">{String(Math.max(rejectedPosters, 5)).padStart(2,'0')}</p>
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertTriangle size={11}/> Repeated reports</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-blue-500"/>
              </div>
            </div>
          </div>

          {/* Table — Image 2 */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Verified Posters</h2>
                <p className="text-sm text-gray-500 mt-0.5">View and monitor verified posters across Penno.</p>
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
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Poster</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Clubs</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Role</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Pens (30d)</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Last activity</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Status</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${getAvatarColor(p.id)}`}>
                            {getInitials(p.name)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{p.name}</p>
                            <p className="text-xs text-gray-400">{p.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{p.clubs}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{p.role}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{p.pens30d}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{p.lastActivity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {p.status === 'Active' ? (
                          <span className="text-sm font-semibold text-green-600">Active</span>
                        ) : p.status === 'Revoked' ? (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700">Revoked</span>
                        ) : (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button onClick={() => setSelectedPoster(p)} className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors shadow-sm">
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && <div className="py-16 text-center text-gray-500">No verified posters found</div>}
            </div>
          </div>
        </main>
      </div>

      {/* Filter Modal — exactly Image 4 */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Verified poster filter</h3>
              <button onClick={() => setShowFilterModal(false)} className="text-gray-500 hover:text-gray-700"><X size={22}/></button>
            </div>
            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="border border-gray-200 rounded-xl p-5">
                <div className="flex justify-between mb-4"><p className="text-base font-semibold text-gray-900">Status</p><ChevronDown size={18} className="text-gray-400"/></div>
                <div className="flex flex-wrap gap-2">
                  {['All','Active','Pending'].map(opt => <FilterChip key={opt} label={opt} active={statusFilter===opt} onClick={() => setStatusFilter(opt)}/>)}
                </div>
              </div>
              {/* Verification */}
              <div className="border border-gray-200 rounded-xl p-5">
                <div className="flex justify-between mb-4"><p className="text-base font-semibold text-gray-900">Verification</p><ChevronDown size={18} className="text-gray-400"/></div>
                <div className="flex flex-wrap gap-2">
                  {['All','Verified only','Pending verification'].map(opt => <FilterChip key={opt} label={opt} active={verificationFilter===opt} onClick={() => setVerificationFilter(opt)}/>)}
                </div>
              </div>
              {/* Club category */}
              <div className="border border-gray-200 rounded-xl p-5">
                <div className="flex justify-between mb-4"><p className="text-base font-semibold text-gray-900">Club category</p><ChevronDown size={18} className="text-gray-400"/></div>
                <div className="flex flex-wrap gap-2">
                  {['All','GAA','Soccer','School','Community'].map(opt => <FilterChip key={opt} label={opt} active={categoryFilter===opt} onClick={() => setCategoryFilter(opt)}/>)}
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

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal 
          onClose={() => setShowProfileModal(false)} 
          onLogout={() => { 
            setShowProfileModal(false); 
            setShowLogoutModal(true); 
          }} 
        />
      )}
    </div>
  );
}