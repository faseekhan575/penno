import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PendingApprovals from './pendingapprovel.tsx'
import SuspendingClubs from './suspendedclubs.tsx'
import LogoutHandler from './logouthandler.jsx'

import './index.css'

import App from './App.jsx'
import Validate from './validate.tsx'
import Panel from './panel.jsx'
import ActiveClubs from './activeclubs.tsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/validate" element={<Validate />} />
        <Route path="/panel" element={<Panel />} />
        <Route path="/pending" element={<PendingApprovals />} />
          <Route path="/active-clubs" element={<ActiveClubs />} />
          <Route path="/suspending-clubs" element={<SuspendingClubs />} />
          <Route path="/logout" element={<LogoutHandler />} />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)