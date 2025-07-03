import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import DiaryPage from './pages/DiaryPage';
import DiarySearchPage from './pages/DiarySearchPage';
import WorthlessnessChart from './pages/WorthlessnessChart';
import FirstSteps from './pages/FirstSteps';
import NextSteps from './pages/NextSteps';
import EmotionTypes from './pages/EmotionTypes';
import HowTo from './pages/HowTo';
import Support from './pages/Support';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/diary" element={<DiaryPage />} />
          <Route path="/search" element={<DiarySearchPage />} />
          <Route path="/chart" element={<WorthlessnessChart />} />
          <Route path="/first-steps" element={<FirstSteps />} />
          <Route path="/next-steps" element={<NextSteps />} />
          <Route path="/emotion-types" element={<EmotionTypes />} />
          <Route path="/how-to" element={<HowTo />} />
          <Route path="/support" element={<Support />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;