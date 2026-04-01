// src/pages/Notifications.jsx
// ─────────────────────────────────────────────────────────────────────────────
// SYNC HELPER — import this in any page to push a notification:
//   import { pushNotification } from './Notifications';
//   pushNotification({ title: 'Club approved', sub: 'Soccer • admin@fc.com', path: '/active-clubs' });
// ─────────────────────────────────────────────────────────────────────────────
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, ShieldCheck, AlertTriangle, MessageSquare,
  UserCog, Settings, Shield, Bell, LogOut, ChevronDown, X, Layers,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

// ── Public helper other pages can call ────────────────────────────────────────
export function pushNotification({ title, sub, path, type = 'info' }) {
  try {
    const saved = localStorage.getItem('penno_notifications');
    const list = saved ? JSON.parse(saved) : [];
    list.unshift({
      id: `notif-${Date.now()}-${Math.random()}`,
      title,
      sub,
      path: path || '/',
      type,
      read: false,
      createdAt: Date.now(),
    });
    // cap at 60 notifications
    if (list.length > 60) list.splice(60);
    localStorage.setItem('penno_notifications', JSON.stringify(list));
    // Increment badge counter in session
    try {
      const cur = parseInt(sessionStorage.getItem('penno_notif_badge') || '0');
      sessionStorage.setItem('penno_notif_badge', String(cur + 1));
    } catch { /* ignore */ }
  } catch { /* ignore */ }
}

// ── Seed notifications from existing localStorage data ─────────────────────────
function seedFromStoredData() {
  const items = [];

  const now = Date.now();
  const min = 60_000;

  // From penno_active
  try {
    const raw = localStorage.getItem('penno_active');
    if (raw) {
      JSON.parse(raw).forEach((c, i) => {
        items.push({
          id: `seed-active-${c.id}`,
          title: `${c.name} approved`,
          sub: `${c.category} • ${c.email}`,
          path: '/active-clubs',
          type: 'success',
          read: i > 1,
          createdAt: now - (i + 1) * 10 * min,
        });
      });
    }
  } catch { /* ignore */ }

  // From penno_suspended
  try {
    const raw = localStorage.getItem('penno_suspended');
    if (raw) {
      JSON.parse(raw).forEach((c, i) => {
        items.push({
          id: `seed-suspended-${c.id}`,
          title: `${c.name} suspended`,
          sub: `${c.category || 'Club'} • ${c.email}`,
          path: '/suspending-clubs',
          type: 'warning',
          read: true,
          createdAt: now - (i + 3) * 15 * min,
        });
      });
    }
  } catch { /* ignore */ }

  // From penno_pending
  try {
    const raw = localStorage.getItem('penno_pending');
    if (raw) {
      JSON.parse(raw).forEach((c, i) => {
        items.push({
          id: `seed-pending-${c.id}`,
          title: `${c.name} pending review`,
          sub: `${c.category} • ${c.email}`,
          path: '/pending',
          type: 'info',
          read: i > 0,
          createdAt: now - (i + 1) * 8 * min,
        });
      });
    }
  } catch { /* ignore */ }

  // From penno_reported_pens
  try {
    const raw = localStorage.getItem('penno_reported_pens');
    if (raw) {
      JSON.parse(raw).forEach((p, i) => {
        items.push({
          id: `seed-rpen-${p.id}`,
          title: `Pen reported: ${p.title}`,
          sub: `${p.category} • ${p.club}`,
          path: '/reported-pens',
          type: 'alert',
          read: i > 0,
          createdAt: now - (i + 2) * 12 * min,
        });
      });
    }
  } catch { /* ignore */ }

  // From penno_safety_rules
  try {
    const raw = localStorage.getItem('penno_safety_rules');
    if (raw) {
      JSON.parse(raw).forEach((r, i) => {
        items.push({
          id: `seed-rule-${r.id}`,
          title: `Safety rule added: ${r.title}`,
          sub: `Platform Settings • admin@penno.io`,
          path: '/safety-rules',
          type: 'info',
          read: true,
          createdAt: now - (i + 10) * 20 * min,
        });
      });
    }
  } catch { /* ignore */ }

  // From penno_categories
  try {
    const raw = localStorage.getItem('penno_categories');
    if (raw) {
      JSON.parse(raw).forEach((cat, i) => {
        items.push({
          id: `seed-cat-${cat.id}`,
          title: `Category "${cat.name}" added`,
          sub: `Platform Settings • admin@penno.io`,
          path: '/categories',
          type: 'info',
          read: true,
          createdAt: now - (i + 8) * 25 * min,
        });
      });
    }
  } catch { /* ignore */ }

  // From penno_club_owners
  try {
    const raw = localStorage.getItem('penno_club_owners');
    if (raw) {
      JSON.parse(raw).filter(o => o.status === 'Suspended').forEach((o, i) => {
        items.push({
          id: `seed-owner-${o.id}`,
          title: `Owner ${o.name} suspended`,
          sub: `${o.clubsList?.[0] || 'Club'} • ${o.email}`,
          path: '/club-owner',
          type: 'warning',
          read: true,
          createdAt: now - (i + 5) * 18 * min,
        });
      });
    }
  } catch { /* ignore */ }

  // Sort newest first
  items.sort((a, b) => b.createdAt - a.createdAt);
  return items;
}

function loadNotifications() {
  try {
    const saved = localStorage.getItem('penno_notifications');
    let stored = saved ? JSON.parse(saved) : [];

    // Seed from data if very few stored notifications
    if (stored.length < 3) {
      const seeded = seedFromStoredData();
      // Merge: stored first (most recent actions), then seeded (historical)
      const storedIds = new Set(stored.map(n => n.id));
      const merged = [
        ...stored,
        ...seeded.filter(s => !storedIds.has(s.id)),
      ];
      merged.sort((a, b) => b.createdAt - a.createdAt);
      localStorage.setItem('penno_notifications', JSON.stringify(merged));
      return merged;
    }

    return stored;
  } catch { return []; }
}

// ── Time formatter ─────────────────────────────────────────────────────────────
function timeAgo(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60_000);
  if (m < 1)  return 'Just now';
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return h === 1 ? '1 hour ago' : `${h} hours ago`;
  const d = Math.floor(h / 24);
  if (d < 7)  return d === 1 ? 'Yesterday' : `${d} days ago`;
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

// ── Sidebar ────────────────────────────────────────────────────────────────────
function Sidebar({ onLogout, unreadCount }) {
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
            <NavLink to="/pending"          className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100"><AlertTriangle className="w-5 h-5 mr-3" />Pending approval</NavLink>
            <NavLink to="/active-clubs"     className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100"><ShieldCheck className="w-5 h-5 mr-3 text-green-500" />Active clubs</NavLink>
            <NavLink to="/suspending-clubs" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100"><Shield className="w-5 h-5 mr-3 text-red-500" />Suspending clubs</NavLink>
          </nav>
        </div>
        <div className="mb-8">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">PENS & MODERATION</p>
          <nav className="space-y-1">
            <NavLink to="/all-pens"      className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100"><MessageSquare className="w-5 h-5 mr-3" />All Pens</NavLink>
            <NavLink to="/reported-pens" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100"><AlertTriangle className="w-5 h-5 mr-3 text-red-500" />Reports pens</NavLink>
          </nav>
        </div>
        <div className="mb-8">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">USERS</p>
          <nav className="space-y-1">
            <NavLink to="/club-owner"      className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100"><Users className="w-5 h-5 mr-3" />Club owner</NavLink>
            <NavLink to="/verified-poster" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100"><UserCog className="w-5 h-5 mr-3" />Verified poster</NavLink>
          </nav>
        </div>
        <div className="mb-4">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">PLATFORM SETTINGS</p>
          <nav className="space-y-1">
            <NavLink to="/categories"   className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100"><Layers className="w-5 h-5 mr-3" />Categories</NavLink>
            <NavLink to="/safety-rules" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100"><Shield className="w-5 h-5 mr-3" />Safety rules</NavLink>
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

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(loadNotifications);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Persist on change
  useEffect(() => {
    localStorage.setItem('penno_notifications', JSON.stringify(notifications));
    sessionStorage.setItem('penno_notif_badge', '0');
  }, [notifications]);

  // Re-seed on mount if localStorage changed in another tab
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key && e.key !== 'penno_notifications') {
        const fresh = loadNotifications();
        setNotifications(fresh);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markOneRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteOne = (e, id) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClick = (notif) => {
    markOneRead(notif.id);
    navigate(notif.path);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    alert('Logged out successfully! (demo)');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar onLogout={() => setShowLogoutModal(true)} unreadCount={unreadCount} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar — same as all other pages */}
        <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between flex-shrink-0">
          <h1 className="text-xl font-semibold text-gray-900">Notifications</h1>
          <div className="flex items-center gap-5">
            <NavLink to="/notifications" className="relative p-2 text-blue-600 bg-blue-50 rounded-full">
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
              )}
            </NavLink>
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

        {/* Main — notification panel centered */}
        <main className="flex-1 overflow-hidden bg-gray-100 flex items-start justify-center p-6">
          {/* Panel — matches screenshot exactly */}
          <div
            className="bg-blue-50 rounded-2xl overflow-hidden shadow-sm"
            style={{ width: '100%', maxWidth: '600px', height: 'calc(100vh - 100px)' }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-4 bg-blue-50 border-b border-blue-100 flex-shrink-0 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-gray-900">Notifications</span>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded-full">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
                  >
                    Mark as all read
                  </button>
                )}
                <button
                  onClick={() => navigate(-1)}
                  className="text-gray-500 hover:text-gray-800 transition-colors p-0.5 hover:bg-blue-100 rounded"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Notification list */}
            <div className="overflow-y-auto h-full pb-16">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <Bell size={40} className="mb-3 opacity-30" />
                  <p className="text-sm font-medium">No notifications yet</p>
                  <p className="text-xs mt-1 opacity-70">Actions across the dashboard will appear here</p>
                </div>
              ) : (
                <div>
                  {notifications.map((notif, idx) => {
                    const isUnread = !notif.read;
                    const isAltRow = idx % 2 === 1;

                    return (
                      <div
                        key={notif.id}
                        onClick={() => handleClick(notif)}
                        className={`relative flex items-start justify-between px-5 py-4 cursor-pointer group border-b transition-colors
                          ${isUnread
                            ? 'bg-blue-100/60 border-blue-200/60 hover:bg-blue-200/50'
                            : isAltRow
                              ? 'bg-blue-50/80 border-blue-100/50 hover:bg-blue-100/40'
                              : 'bg-white/60 border-blue-100/30 hover:bg-blue-50/60'
                          }`}
                      >
                        {/* Unread indicator dot */}
                        {isUnread && (
                          <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0 pr-4">
                          <p className={`text-sm leading-snug ${isUnread ? 'font-semibold text-gray-900' : 'font-normal text-gray-800'}`}>
                            {notif.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{notif.sub}</p>
                        </div>

                        {/* Time + delete on hover */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-gray-400 whitespace-nowrap">{timeAgo(notif.createdAt)}</span>
                          <button
                            onClick={(e) => deleteOne(e, notif.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-gray-500 p-0.5 rounded"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {showLogoutModal && <LogoutModal onCancel={() => setShowLogoutModal(false)} onConfirm={handleLogoutConfirm} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BELL BUTTON COMPONENT — drop this into any page's header to replace the
// existing bell icon. It reads the unread count and navigates to /notifications.
//
// Usage:
//   import { NotifBell } from './Notifications';
//   <NotifBell />
// ─────────────────────────────────────────────────────────────────────────────
export function NotifBell() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const read = () => {
      try {
        const saved = localStorage.getItem('penno_notifications');
        const list = saved ? JSON.parse(saved) : [];
        setCount(list.filter(n => !n.read).length);
      } catch { setCount(0); }
    };
    read();
    // Poll every 5 s for cross-page updates
    const interval = setInterval(read, 5000);
    window.addEventListener('storage', read);
    return () => { clearInterval(interval); window.removeEventListener('storage', read); };
  }, []);

  return (
    <button
      onClick={() => navigate('/notifications')}
      className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
    >
      <Bell className="w-6 h-6" />
      {count > 0 && (
        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
      )}
    </button>
  );
}