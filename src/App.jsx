// src/App.tsx
import { use, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function App() {
  const [email, setEmail] = useState('admin@penno.io')
  const navigate=useNavigate()

  const handleSubmit=()=>{
    // Here you would typically send the email to your backend to generate and send the OTP
    // For this example, we'll just navigate to the validate page
    navigate('/validate')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header / Logo area */}
        <div className="pt-10 pb-6 px-8 flex flex-col items-center bg-gradient-to-b from-blue-50 to-white">
          {/* Logo - using a simple blue square with P (replace with real logo if you have it) */}
          <div className="w-20 h-20 bg-blue-600 rounded-xl flex items-center justify-center shadow-md mb-4">
            <span className="text-white text-5xl font-bold">P</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Penno Admin Login
          </h1>
          <p className="mt-2 text-gray-600 text-center">
            Enter your credentials to access the dashboard
          </p>
        </div>

        {/* Form */}
        <div className="px-8 pb-10 pt-6">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Admin Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder-gray-400"
                placeholder="admin@penno.io"
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-3.5 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 group"
            >
              Send OTP →
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App