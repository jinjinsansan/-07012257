import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Menu, X, Home, BookOpen, Search, TrendingUp, HelpCircle, Heart, Shield } from 'lucide-react';
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
  { path: '/', label: 'ホーム', icon: <Home className="w-5 h-5" /> },
  { path: '/diary', label: '日記を書く', icon: <BookOpen className="w-5 h-5" /> },
  { path: '/search', label: '日記を探す', icon: <Search className="w-5 h-5" /> },
  { path: '/chart', label: '無価値感推移', icon: <TrendingUp className="w-5 h-5" /> },
  { path: '/first-steps', label: '最初にやること', icon: <HelpCircle className="w-5 h-5" /> },
  { path: '/next-steps', label: '次にやること', icon: <HelpCircle className="w-5 h-5" /> },
  { path: '/emotion-types', label: '感情の種類', icon: <HelpCircle className="w-5 h-5" /> },
  { path: '/how-to', label: '使い方', icon: <HelpCircle className="w-5 h-5" /> },
  { path: '/support', label: 'サポート', icon: <Heart className="w-5 h-5" /> },
  { path: '/privacy', label: 'プライバシー', icon: <Shield className="w-5 h-5" /> },
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
          className="fixed top-4 right-4 z-50 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          aria-label="メニュー"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* サイドメニュー */}
        <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6">
            <h2 className="text-xl font-jp-bold text-gray-900 mb-6 text-center">かんじょうにっき</h2>
            <nav>
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <a 
                      href={link.path} 
                      className="flex items-center py-2 px-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-jp-medium transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="mr-3 text-gray-500">{link.icon}</span>
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