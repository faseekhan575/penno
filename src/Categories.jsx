// src/pages/Categories.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, ShieldCheck, AlertTriangle, MessageSquare,
  UserCog, Settings, Shield, Bell, LogOut, ChevronDown, X,
  CheckCircle2, ArrowLeft, Layers, Pencil, Trash2,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { pushNotification, NotifBell } from './Notifications';

// ── Default categories (match all other pages) ─────────────────────────────
const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'GAA',       status: true },
  { id: 'cat-2', name: 'Soccer',    status: true },
  { id: 'cat-3', name: 'School',    status: true },
  { id: 'cat-4', name: 'Community', status: true },
];

function loadCategories() {
  try {
    const saved = localStorage.getItem('penno_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  } catch { return DEFAULT_CATEGORIES; }
}

function saveCategories(cats) {
  localStorage.setItem('penno_categories', JSON.stringify(cats));
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
            <div className="flex items-center px-3 py-2 text-sm rounded-lg bg-blue-500 text-white font-medium">
              <Layers className="w-5 h-5 mr-3 text-white" />Categories
            </div>
            <NavLink to="/safety" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100">
              <Shield className="w-5 h-5 mr-3" />Safety rules
            </NavLink>
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
    const t = setTimeout(onClose, 4000);
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

// ── Delete Confirm Modal ───────────────────────────────────────────────────────
function DeleteModal({ categoryName, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-[400px] mx-4 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-2">Delete "{categoryName}"?</h3>
        <p className="text-sm text-gray-500 mb-6">This category will be removed from Penno. Existing clubs using this category will be unaffected.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium">Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── Edit Modal ─────────────────────────────────────────────────────────────────
function EditCategoryModal({ category, onCancel, onSave }) {
  const [name, setName] = useState(category.name);
  const [status, setStatus] = useState(category.status);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-[500px] mx-4 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Edit category</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g., GAA"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Status</p>
              <p className="text-xs text-gray-400 mt-0.5">If enable the toggle then show to everyone.</p>
            </div>
            <button onClick={() => setStatus(!status)} className={`relative h-6 w-11 flex items-center rounded-full transition-all ${status ? 'bg-blue-500' : 'bg-gray-300'}`}>
              <div className={`h-5 w-5 bg-white rounded-full shadow transition-all ${status ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onCancel} className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onClick={() => { if (name.trim()) onSave({ ...category, name: name.trim(), status }); }}
            disabled={!name.trim()}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Categories() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState(loadCategories);
  const [view, setView] = useState('list'); // 'list' | 'add'
  const [catName, setCatName] = useState('');
  const [catStatus, setCatStatus] = useState(true);
  const [notification, setNotification] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);   // ← New
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editTarget, setEditTarget] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  // Persist to localStorage
  useEffect(() => { saveCategories(categories); }, [categories]);

  const handleSaveCategory = () => {
    if (!catName.trim()) return;
    const newCat = {
      id: `cat-${Date.now()}`,
      name: catName.trim(),
      status: catStatus,
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    setCatName('');
    setCatStatus(true);
    setNotification({ title: 'Category added', message: 'Clubs can now select it.' });
  };

  const handleDeleteConfirm = () => {
    const updated = categories.filter(c => c.id !== deleteTarget.id);
    setCategories(updated);
    setDeleteTarget(null);
    setNotification({ title: 'Category deleted', message: 'The category has been removed.' });
  };

  const handleEditSave = (updated) => {
    setCategories(prev => prev.map(c => c.id === updated.id ? updated : c));
    setEditTarget(null);
    setNotification({ title: 'Category updated', message: 'Changes saved successfully.' });
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    alert('Logged out successfully! (demo)');
    navigate('/login');
  };

  // ── ADD VIEW ────────────────────────────────────────────────────────────────
  if (view === 'add') {
    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar onLogout={() => setShowLogoutModal(true)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Categories" onProfileClick={() => setShowProfileModal(true)} />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => { setView('list'); setCatName(''); setCatStatus(true); }}
                className="text-gray-600 hover:text-gray-900 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-2xl font-semibold text-gray-900">Add category</h2>
            </div>

            <div className="max-w-[520px] mx-auto">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category name</label>
                  <input
                    value={catName}
                    onChange={e => setCatName(e.target.value)}
                    placeholder="e.g., GAA"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white placeholder-gray-400"
                    onKeyDown={e => { if (e.key === 'Enter' && catName.trim()) handleSaveCategory(); }}
                  />
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Status</p>
                    <p className="text-xs text-gray-400 mt-0.5">If enable the toggle then show to everyone.</p>
                  </div>
                  <button
                    onClick={() => setCatStatus(!catStatus)}
                    className={`relative h-7 w-12 flex items-center rounded-full transition-all flex-shrink-0 mt-0.5 ${catStatus ? 'bg-blue-500' : 'bg-gray-300'}`}
                  >
                    <div className={`h-5 w-5 bg-white rounded-full shadow-md transition-all ${catStatus ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => { setView('list'); setCatName(''); setCatStatus(true); }}
                    className="flex-1 py-3 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveCategory}
                    disabled={!catName.trim()}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save category
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>

        {notification && (
          <SuccessNotification title={notification.title} message={notification.message} onClose={() => setNotification(null)} />
        )}
        {showLogoutModal && <LogoutModal onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogoutConfirm} />}
        {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} onLogout={() => { setShowProfileModal(false); setShowLogoutModal(true); }} />}
      </div>
    );
  }

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar onLogout={() => setShowLogoutModal(true)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Categories" onProfileClick={() => setShowProfileModal(true)} />
        <main className="flex-1 overflow-y-auto bg-gray-50 flex items-center justify-center p-8">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 w-full max-w-[520px]">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Categories</h2>

            {categories.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">No categories yet. Add one below.</div>
            ) : (
              <div className="grid grid-cols-2 gap-3 mb-6">
                {categories.map(cat => (
                  <div
                    key={cat.id}
                    onMouseEnter={() => setHoveredId(cat.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="relative border border-gray-200 rounded-xl py-6 px-4 flex items-center justify-center group cursor-default bg-white hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                  >
                    {!cat.status && (
                      <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-gray-300" title="Inactive" />
                    )}
                    {cat.status && hoveredId === cat.id && (
                      <span className="absolute top-2 left-2 w-2 h-2 rounded-full bg-green-400" title="Active" />
                    )}

                    <span className="text-base font-medium text-gray-800">{cat.name}</span>

                    {hoveredId === cat.id && (
                      <div className="absolute top-1.5 right-1.5 flex gap-1">
                        <button
                          onClick={() => setEditTarget(cat)}
                          className="w-6 h-6 bg-white border border-gray-200 rounded-md flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-colors shadow-sm"
                          title="Edit"
                        >
                          <Pencil size={11} className="text-gray-500" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cat)}
                          className="w-6 h-6 bg-white border border-gray-200 rounded-md flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-colors shadow-sm"
                          title="Delete"
                        >
                          <Trash2 size={11} className="text-red-400" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setView('add')}
              className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
            >
              Add category
            </button>
          </div>
        </main>
      </div>

      {notification && (
        <SuccessNotification title={notification.title} message={notification.message} onClose={() => setNotification(null)} />
      )}
      {deleteTarget && (
        <DeleteModal categoryName={deleteTarget.name} onCancel={() => setDeleteTarget(null)} onConfirm={handleDeleteConfirm} />
      )}
      {editTarget && (
        <EditCategoryModal category={editTarget} onCancel={() => setEditTarget(null)} onSave={handleEditSave} />
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

      {showLogoutModal && <LogoutModal onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogoutConfirm} />}
    </div>
  );
}