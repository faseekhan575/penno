// src/pages/SafetyRules.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, ShieldCheck, AlertTriangle, MessageSquare,
  UserCog, Settings, Shield, Bell, LogOut, ChevronDown, X,
  CheckCircle2, ArrowLeft, Layers, Pencil, Trash2,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { pushNotification, NotifBell } from './Notifications';

// ── Default rules (match suspension reasons across all pages) ──────────────
const DEFAULT_RULES = [
  {
    id: 'rule-1',
    title: 'Fraud / fake club',
    appliesTo: ['Text pens', 'Event pens', 'Entire club'],
    description: 'Clubs or users creating fraudulent or fake club profiles to deceive others.',
    status: true,
  },
  {
    id: 'rule-2',
    title: 'Spam / misleading posts',
    appliesTo: ['Text pens', 'Event pens'],
    description: 'Repeated posting of misleading, duplicated, or spam content.',
    status: true,
  },
  {
    id: 'rule-3',
    title: 'Inappropriate content',
    appliesTo: ['Images', 'Text pens'],
    description: 'Content that is offensive, hateful, or violates community standards.',
    status: true,
  },
  {
    id: 'rule-4',
    title: 'Too many unresolved reports',
    appliesTo: ['Text pens', 'Event pens'],
    description: 'Repeated misuse may result in penalties and account suspension.',
    status: true,
  },
];

const APPLIES_TO_OPTIONS = ['Text pens', 'Event pens', 'Images', 'Entire club'];

function loadRules() {
  try {
    const saved = localStorage.getItem('penno_safety_rules');
    return saved ? JSON.parse(saved) : DEFAULT_RULES;
  } catch { return DEFAULT_RULES; }
}

function saveRules(rules) {
  localStorage.setItem('penno_safety_rules', JSON.stringify(rules));
}

// ── Chip colors ────────────────────────────────────────────────────────────────
function getChipStyle(label) {
  if (label === 'Active')      return 'bg-blue-50 text-blue-600 border border-blue-100';
  if (label === 'Pens')        return 'bg-red-50 text-red-400 border border-red-100';
  if (label === 'Events')      return 'bg-green-50 text-green-600 border border-green-100';
  if (label === 'Text pens')   return 'bg-red-50 text-red-400 border border-red-100';
  if (label === 'Event pens')  return 'bg-green-50 text-green-600 border border-green-100';
  if (label === 'Images')      return 'bg-purple-50 text-purple-500 border border-purple-100';
  if (label === 'Entire club') return 'bg-orange-50 text-orange-500 border border-orange-100';
  return 'bg-gray-50 text-gray-500 border border-gray-200';
}

// Compact chip labels for the list view cards
function getDisplayChips(rule) {
  const chips = [];
  if (rule.status) chips.push('Active');
  if (rule.appliesTo.some(a => a.includes('pens') || a === 'Text pens')) chips.push('Pens');
  if (rule.appliesTo.some(a => a.includes('Event') || a === 'Event pens')) chips.push('Events');
  return chips;
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
              <LayoutDashboard className="w-5 h-5 mr-3" />Dashboard
            </NavLink>
          </nav>
        </div>
        <div className="mb-8">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">CLUB MANAGEMENT</p>
          <nav className="space-y-1">
            <NavLink to="/pending" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
              <AlertTriangle className="w-5 h-5 mr-3" />Pending approval
            </NavLink>
            <NavLink to="/active-clubs" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
              <ShieldCheck className="w-5 h-5 mr-3 text-green-500" />Active clubs
            </NavLink>
            <NavLink to="/suspending-clubs" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
              <Shield className="w-5 h-5 mr-3 text-red-500" />Suspending clubs
            </NavLink>
          </nav>
        </div>
        <div className="mb-8">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">PENS & MODERATION</p>
          <nav className="space-y-1">
            <NavLink to="/allpens" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
              <MessageSquare className="w-5 h-5 mr-3" />All Pens
            </NavLink>
            <NavLink to="/report" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
              <AlertTriangle className="w-5 h-5 mr-3 text-red-500" />Reports pens
            </NavLink>
          </nav>
        </div>
        <div className="mb-8">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">USERS</p>
          <nav className="space-y-1">
            <NavLink to="/club-own" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
              <Users className="w-5 h-5 mr-3" />Club owner
            </NavLink>
            <NavLink to="/verify" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
              <UserCog className="w-5 h-5 mr-3" />Verified poster
            </NavLink>
          </nav>
        </div>
        <div className="mb-4">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">PLATFORM SETTINGS</p>
          <nav className="space-y-1">
            <NavLink to="/cat" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
              <Layers className="w-5 h-5 mr-3" />Categories
            </NavLink>
            <div className="flex items-center px-3 py-2 text-sm rounded-lg bg-blue-500 text-white font-medium">
              <Shield className="w-5 h-5 mr-3 text-white" />Safety rules
            </div>
          </nav>
        </div>
      </div>
      <div className="p-4 border-t border-gray-200">
        <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium transition-colors">
          <LogOut className="w-4 h-4" />Logout
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

// ── Logout Modal ───────────────────────────────────────────────────────────────
function LogoutModal({ onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
        <div className="p-8 text-center">
          <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
            <span className="text-white text-5xl font-bold">!</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Log out of Penno Admin?</h2>
          <p className="text-gray-600 mb-8">You can log back in anytime using your admin credentials.</p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={onCancel} className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 min-w-[120px]">Cancel</button>
            <button onClick={onConfirm} className="px-8 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 shadow-md flex items-center gap-2 min-w-[140px] justify-center">
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

// ── Success Notification ───────────────────────────────────────────────────────
function SuccessNotification({ title, message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4200);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 z-[100] flex items-start gap-3 px-5 py-4 rounded-xl shadow-lg bg-white border border-green-200 min-w-[300px] max-w-sm">
      <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <CheckCircle2 size={16} className="text-green-600" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-gray-900 text-sm">{title}</p>
        <p className="text-sm text-gray-500 mt-0.5">{message}</p>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0">
        <X size={18} />
      </button>
    </div>
  );
}

// ── Delete Confirm ────────────────────────────────────────────────────────────
function DeleteModal({ ruleName, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-[400px] mx-4 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-2">Delete "{ruleName}"?</h3>
        <p className="text-sm text-gray-500 mb-6">This safety rule will be permanently removed from Penno.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium">Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Rule Form (shared for Add + Edit) ─────────────────────────────────────────
function RuleForm({ initialData, onCancel, onSave }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [appliesTo, setAppliesTo] = useState(initialData?.appliesTo || []);
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState(initialData?.status !== undefined ? initialData.status : true);
  const [notification, setNotification] = useState(null);

  const toggleApply = (option) => {
    setAppliesTo(prev =>
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const handleSave = () => {
    if (!title.trim()) return;
    const rule = {
      id: initialData?.id || `rule-${Date.now()}`,
      title: title.trim(),
      appliesTo,
      description: description.trim(),
      status,
    };
    onSave(rule);
    setNotification({
      title: initialData ? 'Rule updated' : 'Rule added',
      message: initialData ? 'Safety rule updated successfully.' : 'Safety rule added successfully.',
    });
    if (!initialData) {
      setTitle('');
      setAppliesTo([]);
      setDescription('');
      setStatus(true);
    }
  };

  return (
    <>
      <div className="max-w-[520px] mx-auto">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-8 space-y-6">
            {/* Rule Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rule Title</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g., Misuse of urgent pens"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400"
              />
            </div>

            {/* Applies To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Applies To <span className="font-normal text-gray-400">(multi-select)</span>
              </label>
              <div className="bg-gray-200 rounded-xl p-2 space-y-1.5">
                {APPLIES_TO_OPTIONS.map(option => {
                  const isSelected = appliesTo.includes(option);
                  return (
                    <button
                      key={option}
                      onClick={() => toggleApply(option)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-lg transition-all ${
                        isSelected ? 'bg-white shadow-sm' : 'bg-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                        {option}
                      </span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-400 bg-white'
                      }`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rule Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rule Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Repeated misuse may result in penalties"
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400 resize-none"
              />
            </div>

            {/* Status toggle */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-800">Status</p>
                <p className="text-xs text-gray-400 mt-0.5">If enable the toggle then apply this rule.</p>
              </div>
              <button
                onClick={() => setStatus(!status)}
                className={`relative h-7 w-12 flex items-center rounded-full transition-all flex-shrink-0 mt-0.5 ${status ? 'bg-blue-500' : 'bg-gray-300'}`}
              >
                <div className={`h-5 w-5 bg-white rounded-full shadow-md transition-all ${status ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="px-8 pb-8 flex gap-4">
            <button
              onClick={onCancel}
              className="flex-1 py-3 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {initialData ? 'Save changes' : 'Save rule'}
            </button>
          </div>
        </div>
      </div>

      {notification && (
        <SuccessNotification
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function SafetyRules() {
  const navigate = useNavigate();

  const [rules, setRules] = useState(loadRules);
  const [view, setView] = useState('list'); // 'list' | 'add' | 'edit'
  const [editTarget, setEditTarget] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [listNotification, setListNotification] = useState(null);

  const [showProfileModal, setShowProfileModal] = useState(false); // ← New

  useEffect(() => { saveRules(rules); }, [rules]);

  const handleSaveRule = (rule) => {
    if (editTarget) {
      setRules(prev => prev.map(r => r.id === rule.id ? rule : r));
    } else {
      setRules(prev => [...prev, rule]);
    }
  };

  const handleDeleteConfirm = () => {
    setRules(prev => prev.filter(r => r.id !== deleteTarget.id));
    setDeleteTarget(null);
    setListNotification({ title: 'Rule deleted', message: 'Safety rule has been removed.' });
  };

  const handleToggleStatus = (id) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, status: !r.status } : r));
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    alert('Logged out successfully! (demo)');
    navigate('/login');
  };

  // ── ADD VIEW ──────────────────────────────────────────────────────────────
  if (view === 'add') {
    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar onLogout={() => setShowLogoutModal(true)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Safety Rules" onProfileClick={() => setShowProfileModal(true)} />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setView('list')} className="text-gray-600 hover:text-gray-900 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-2xl font-semibold text-gray-900">Add rules</h2>
            </div>

            <RuleForm
              onCancel={() => setView('list')}
              onSave={(rule) => {
                handleSaveRule(rule);
                setView('list');
              }}
            />
          </main>
        </div>
        {showLogoutModal && <LogoutModal onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogoutConfirm} />}
        {showProfileModal && (
          <ProfileModal 
            onClose={() => setShowProfileModal(false)} 
            onLogout={() => { setShowProfileModal(false); setShowLogoutModal(true); }} 
          />
        )}
      </div>
    );
  }

  // ── EDIT VIEW ─────────────────────────────────────────────────────────────
  if (view === 'edit' && editTarget) {
    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar onLogout={() => setShowLogoutModal(true)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Safety Rules" onProfileClick={() => setShowProfileModal(true)} />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => { setView('list'); setEditTarget(null); }} className="text-gray-600 hover:text-gray-900 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-2xl font-semibold text-gray-900">Edit rule</h2>
            </div>

            <RuleForm
              initialData={editTarget}
              onCancel={() => { setView('list'); setEditTarget(null); }}
              onSave={(rule) => {
                handleSaveRule(rule);
                setView('list');
                setEditTarget(null);
                setListNotification({ title: 'Rule updated', message: 'Safety rule updated successfully.' });
              }}
            />
          </main>
        </div>
        {showLogoutModal && <LogoutModal onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogoutConfirm} />}
        {showProfileModal && (
          <ProfileModal 
            onClose={() => setShowProfileModal(false)} 
            onLogout={() => { setShowProfileModal(false); setShowLogoutModal(true); }} 
          />
        )}
      </div>
    );
  }

  // ── LIST VIEW (Main View) ─────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar onLogout={() => setShowLogoutModal(true)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Safety Rules" onProfileClick={() => setShowProfileModal(true)} />
        <main className="flex-1 overflow-y-auto bg-gray-50 flex items-start justify-center p-8 pt-12">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 w-full max-w-[620px]">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Safety rules</h2>

            {rules.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">No safety rules yet. Add one below.</div>
            ) : (
              <div className="grid grid-cols-2 gap-3 mb-6">
                {rules.map(rule => {
                  const chips = getDisplayChips(rule);
                  return (
                    <div
                      key={rule.id}
                      onMouseEnter={() => setHoveredId(rule.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className="relative border border-gray-200 rounded-xl p-4 bg-white hover:border-blue-200 hover:bg-blue-50/20 transition-all group"
                    >
                      <p className="text-sm font-semibold text-gray-900 mb-3 pr-10 leading-snug">
                        {rule.title}
                      </p>

                      {rule.description && (
                        <p className="text-xs text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                          {rule.description}
                        </p>
                      )}
                      {!rule.description && <div className="mb-4 h-3" />}

                      <div className="flex flex-wrap gap-1.5">
                        {chips.map(chip => (
                          <span
                            key={chip}
                            className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getChipStyle(chip)}`}
                          >
                            {chip}
                          </span>
                        ))}
                        {rule.appliesTo.filter(a => !['Text pens','Event pens'].includes(a)).map(at => (
                          <span key={at} className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getChipStyle(at)}`}>
                            {at}
                          </span>
                        ))}
                      </div>

                      {hoveredId === rule.id && (
                        <div className="absolute top-2 right-2 flex gap-1">
                          <button
                            onClick={() => handleToggleStatus(rule.id)}
                            title={rule.status ? 'Deactivate' : 'Activate'}
                            className={`w-6 h-6 rounded-md flex items-center justify-center border shadow-sm transition-colors text-xs font-bold ${rule.status ? 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50' : 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100'}`}
                          >
                            {rule.status ? '–' : '✓'}
                          </button>
                          <button
                            onClick={() => { setEditTarget(rule); setView('edit'); }}
                            className="w-6 h-6 bg-white border border-gray-200 rounded-md flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-colors shadow-sm"
                            title="Edit"
                          >
                            <Pencil size={11} className="text-gray-500" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(rule)}
                            className="w-6 h-6 bg-white border border-gray-200 rounded-md flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm"
                            title="Delete"
                          >
                            <Trash2 size={11} className="text-red-400" />
                          </button>
                        </div>
                      )}

                      {!rule.status && (
                        <div className="absolute inset-0 rounded-xl bg-white/60 flex items-end justify-start p-3 pointer-events-none">
                          <span className="text-xs text-gray-400 font-medium">Inactive</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <button
              onClick={() => setView('add')}
              className="mx-auto block px-10 py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
            >
              Add rule
            </button>
          </div>
        </main>
      </div>

      {listNotification && (
        <SuccessNotification title={listNotification.title} message={listNotification.message} onClose={() => setListNotification(null)} />
      )}
      {deleteTarget && (
        <DeleteModal ruleName={deleteTarget.title} onCancel={() => setDeleteTarget(null)} onConfirm={handleDeleteConfirm} />
      )}
      {showLogoutModal && <LogoutModal onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogoutConfirm} />}

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