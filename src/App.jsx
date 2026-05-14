import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import NewsDetail from './pages/NewsDetail';

function App() {
  const [activeCategory, setActiveCategory] = useState('beranda');

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    // Kalau kamu mau, di sini bisa ditambah logika untuk filter API
    // Tapi karena ini mockup UI, mengubah state activeCategory sudah cukup bagus
  };

  return (
    <Router>
      <div className="flex min-h-screen flex-col font-sans">
        {/* Navbar selalu tampil di atas */}
        <Navbar 
          activeCategory={activeCategory} 
          onCategoryChange={handleCategoryChange} 
        />
        
        {/* Area utama yang berganti-ganti antar halaman */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detail" element={<NewsDetail onBack={() => window.history.back()} />} />
          </Routes>
        </main>

        {/* Footer selalu tampil di bawah */}
        <Footer onCategoryChange={handleCategoryChange} />
      </div>
    </Router>
  );
}

export default App;