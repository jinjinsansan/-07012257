import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
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

// ナビゲーションリンク
const navLinks = [
  { path: '/diary', label: '日記を書く' },
  { path: '/search', label: '日記を探す' },
  { path: '/chart', label: '無価値感推移' },
  { path: '/first-steps', label: '最初にやること' },
  { path: '/next-steps', label: '次にやること' },
  { path: '/emotion-types', label: '感情の種類' },
  { path: '/how-to', label: '使い方' },
  { path: '/support', label: 'サポート' },
  { path: '/privacy', label: 'プライバシー' },
];

function App() {
  const [menuOpen, setMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* ハンバーガーメニューボタン */}
        <button 
          onClick={toggleMenu}
          className="fixed top-4 right-4 z-50 bg-white p-2 rounded-full shadow-md"
          aria-label="メニュー"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* サイドメニュー */}
        <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6">
            <h2 className="text-xl font-jp-bold text-gray-900 mb-6">かんじょうにっき</h2>
            <nav>
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <a 
                      href={link.path} 
                      className="block py-2 text-gray-700 hover:text-blue-600 font-jp-medium transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* オーバーレイ */}
        {menuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setMenuOpen(false)}
          ></div>
        )}

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