import React 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import BuildDetails from './pages/BuildDetails';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        <main>
          <Routes>
            {/* Corrected: element prop now takes the component directly without extra quotes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/build/:id" element={<BuildDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;