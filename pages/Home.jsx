import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNews, formatDate, formatDateShort } from '../api/beritaApi';

const ITEMS_PER_PAGE = 8;

export default function Home() {
  const navigate = useNavigate();

  // ── States ──
  const [heroArticles, setHeroArticles] = useState([]);
  const [heroPage, setHeroPage] = useState(1);
  const [heroTotal, setHeroTotal] = useState(0);

  const [popular, setPopular] = useState([]);
  
  const [allRecommended, setAllRecommended] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [recPage, setRecPage] = useState(1);
  const [recTotal, setRecTotal] = useState(0);
  
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loadingHero, setLoadingHero] = useState(true);
  const [loadingRec, setLoadingRec] = useState(true);

  // ── Initial Fetch ──
  useEffect(() => {
    loadHero();
    loadPopular();
    loadAllRecommended();
  }, []);

  // ── Frontend Search & Pagination Logic ──
  useEffect(() => {
    const filteredData = allRecommended.filter(article => 
      article.title.toLowerCase().includes(search.toLowerCase())
    );
    setRecTotal(filteredData.length);
    
    const start = (recPage - 1) * ITEMS_PER_PAGE;
    setRecommended(filteredData.slice(start, start + ITEMS_PER_PAGE));
  }, [search, recPage, allRecommended]);

  // ── Fetch Functions ──
  async function loadHero() {
    setLoadingHero(true);
    try {
      const data = await fetchNews('cnn-news/olahraga');
      setHeroArticles(data.slice(0, 5));
      setHeroTotal(Math.min(5, data.length));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingHero(false);
    }
  }

  async function loadPopular() {
    try {
      const data = await fetchNews('cnn-news/nasional');
      setPopular(data.slice(0, 3));
    } catch (error) {
      console.error(error);
    }
  }

  async function loadAllRecommended() {
    setLoadingRec(true);
    try {
      const data = await fetchNews('cnn-news/teknologi'); 
      setAllRecommended(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingRec(false);
    }
  }

  // ── Handlers ──
  function handleSearch(e) {
    e.preventDefault();
    setSearch(searchInput);
    setRecPage(1); 
  }

  const handleArticleClick = (article) => {
    navigate('/detail', { state: { article } });
  };

  const currentHero = heroArticles[heroPage - 1];
  const totalRecPages = Math.ceil(recTotal / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-white">
      
      {/* ── HERO SECTION ── */}
      <section className="bg-white py-10">
        <div className="container mx-auto px-4 md:px-8">
          {loadingHero ? (
            <div className="flex animate-pulse flex-col-reverse gap-8 md:flex-row md:items-center">
              <div className="w-full space-y-4 md:w-1/2">
                <div className="h-4 w-20 rounded bg-gray-200"></div>
                <div className="h-10 w-full rounded bg-gray-200"></div>
                <div className="h-24 w-full rounded bg-gray-200"></div>
              </div>
              <div className="h-[300px] w-full rounded-2xl bg-gray-200 md:w-1/2 md:h-[400px]"></div>
            </div>
          ) : currentHero ? (
            <div className="flex flex-col-reverse gap-8 md:flex-row md:items-center md:gap-12">
              {/* Teks Hero */}
              <div className="w-full md:w-1/2">
                <span className="mb-3 inline-block text-xs font-bold uppercase tracking-wider text-gray-500">Headline</span>
                <h1 
                  className="mb-4 cursor-pointer text-3xl font-extrabold leading-tight text-gray-900 transition-colors hover:text-[#007BFF] md:text-4xl lg:text-5xl"
                  onClick={() => handleArticleClick(currentHero)}
                >
                  {currentHero.title}
                </h1>
                <p className="mb-6 text-base text-gray-600 leading-relaxed md:text-lg">
                  {currentHero.contentSnippet?.slice(0, 180)}...
                </p>
                <div className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span>{formatDate(currentHero.isoDate)}</span>
                </div>
                <button 
                  className="group flex items-center gap-2 font-bold text-[#007BFF] transition-all hover:text-blue-700"
                  onClick={() => handleArticleClick(currentHero)}
                >
                  Baca Selengkapnya 
                  <span className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                </button>
              </div>
              {/* Gambar Hero */}
              <div className="w-full md:w-1/2 group cursor-pointer overflow-hidden rounded-2xl shadow-lg" onClick={() => handleArticleClick(currentHero)}>
                {currentHero.image ? (
                  <img 
                    src={currentHero.image.large || currentHero.image} 
                    alt={currentHero.title}
                    className="h-[300px] w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-[400px]"
                    onError={e => { e.target.style.display='none' }} 
                  />
                ) : (
                  <div className="h-[300px] w-full bg-gray-200 md:h-[400px]" />
                )}
              </div>
            </div>
          ) : null}

          {/* Hero Pagination (Angka) */}
          <div className="mt-10 flex items-center justify-center gap-6 text-sm font-semibold text-gray-500">
            <button 
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 hover:text-[#007BFF] disabled:opacity-30 disabled:hover:bg-transparent"
              onClick={() => setHeroPage(p => Math.max(1, p - 1))} 
              disabled={heroPage === 1}
            >‹</button>
            <div className="flex items-center gap-2">
              <span className="text-gray-900">{heroPage}</span>
              <span>dari</span>
              <span>{heroTotal}</span>
            </div>
            <button 
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 hover:text-[#007BFF] disabled:opacity-30 disabled:hover:bg-transparent"
              onClick={() => setHeroPage(p => Math.min(heroTotal, p + 1))} 
              disabled={heroPage === heroTotal}
            >›</button>
          </div>
        </div>
      </section>

      {/* ── BERITA TERPOPULER ── */}
      <section className="bg-gray-50 py-14">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="mb-8 flex items-center gap-3 text-2xl font-extrabold text-gray-900">
            <span className="block h-8 w-1.5 rounded-full bg-[#007BFF]" />
            Berita Terpopuler
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-10">
            {popular.length > 0 ? popular.map((article, i) => (
              <div key={i} className="group relative flex cursor-pointer gap-5 rounded-2xl bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md border border-gray-100" onClick={() => handleArticleClick(article)}>
                {/* Lingkaran Angka */}
                <div className="absolute -left-3 -top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#2B3542] text-sm font-bold text-white shadow-md ring-4 ring-gray-50">
                  {i + 1}
                </div>
                {/* Gambar Kecil */}
                <div className="h-20 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100 md:h-24 md:w-32">
                  {article.image ? (
                    <img src={article.image.small || article.image} alt={article.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                  ) : <div className="h-full w-full bg-gray-200" />}
                </div>
                {/* Teks */}
                <div className="flex flex-col justify-center">
                  <h3 className="mb-2 line-clamp-2 text-sm font-bold leading-snug text-gray-900 group-hover:text-[#007BFF] md:text-base">{article.title}</h3>
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <span className="text-[#007BFF]">{article.category || 'Nasional'}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500">{formatDateShort(article.isoDate)}</span>
                  </div>
                </div>
              </div>
            )) : [1,2,3].map(i => (
              <div key={i} className="flex animate-pulse gap-4 rounded-2xl bg-white p-4 border border-gray-100">
                <div className="h-24 w-32 rounded-xl bg-gray-200" />
                <div className="flex-1 space-y-3 py-2">
                  <div className="h-4 w-full rounded bg-gray-200" />
                  <div className="h-4 w-2/3 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REKOMENDASI UNTUK ANDA ── */}
      <section className="py-14">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <h2 className="flex items-center gap-3 text-2xl font-extrabold text-gray-900">
              <span className="block h-8 w-1.5 rounded-full bg-[#007BFF]" />
              Rekomendasi Untuk Anda
            </h2>
            
            {/* Search Box */}
            <form onSubmit={handleSearch} className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Cari berita disini..."
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-3 pl-6 pr-12 text-sm transition-all focus:border-[#007BFF] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-50"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
              />
              <button type="submit" className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 hover:bg-blue-50 hover:text-[#007BFF] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </form>
          </div>

          {loadingRec ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-gray-100 p-3">
                  <div className="mb-4 aspect-[4/3] w-full rounded-xl bg-gray-200" />
                  <div className="mb-2 h-4 w-full rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
                {recommended.length > 0 ? recommended.map((article, i) => (
                  <div key={i} className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg" onClick={() => handleArticleClick(article)}>
                    <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
                      {article.image ? (
                        <img src={article.image.small || article.image} alt={article.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                      ) : <div className="h-full w-full bg-gray-200" />}
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-5">
                      <h3 className="mb-3 line-clamp-3 text-base font-bold leading-snug text-gray-900 group-hover:text-[#007BFF]">{article.title}</h3>
                      <div className="flex items-center gap-2 text-xs font-medium mt-auto">
                        <span className="text-[#007BFF]">{article.category || 'Nasional'}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-500">{formatDateShort(article.isoDate)}</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-16 text-center">
                    <p className="text-lg font-medium text-gray-500">Berita tidak ditemukan.</p>
                    <button onClick={() => {setSearchInput(''); setSearch('');}} className="mt-4 text-[#007BFF] hover:underline">Reset Pencarian</button>
                  </div>
                )}
              </div>

              {/* Pagination Card Bawah */}
              {totalRecPages > 1 && (
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 md:flex-row">
                  <span className="text-sm font-medium text-gray-500">
                    Menampilkan <span className="text-gray-900">{(recPage - 1) * ITEMS_PER_PAGE + 1}</span> - <span className="text-gray-900">{Math.min(recPage * ITEMS_PER_PAGE, recTotal)}</span> dari <span className="text-gray-900">{recTotal}</span> hasil
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button 
                      className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent"
                      onClick={() => setRecPage(p => Math.max(1, p - 1))} 
                      disabled={recPage === 1}
                    >« Prev</button>
                    
                    {Array.from({length: Math.min(totalRecPages, 5)}, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold transition-all ${recPage === page ? 'bg-[#007BFF] text-white shadow-md shadow-blue-200' : 'text-gray-600 hover:bg-gray-100'}`}
                          onClick={() => setRecPage(page)}
                        >
                          {page}
                        </button>
                      );
                    })}
                    
                    <button 
                      className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent"
                      onClick={() => setRecPage(p => Math.min(totalRecPages, p + 1))} 
                      disabled={recPage === totalRecPages}
                    >Next »</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── BANNER MALANG MBOIS (Re-designed like Figma) ── */}
      <section className="py-8 pb-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="relative flex flex-col items-center justify-between overflow-hidden rounded-3xl bg-[#00D094] px-8 py-12 shadow-lg md:flex-row md:px-16 md:py-16">
            
            {/* Teks Kiri */}
            <div className="relative z-20 w-full text-center md:w-1/2 md:text-left">
              <h2 className="mb-4 text-3xl font-extrabold leading-tight text-white md:text-4xl lg:text-5xl drop-shadow-sm">
                Petualangan Edukatif bersama Malang Mbois City Tour!
              </h2>
              <p className="text-lg font-medium text-emerald-50 drop-shadow-sm">
                Jelajahi wisata edukatif seru di kota Malang.
              </p>
            </div>
            
            {/* Tumpukan Gambar Kanan (Aesthetic Stack) */}
            <div className="relative z-10 mt-12 flex h-56 w-full justify-center md:mt-0 md:w-1/2 md:justify-end lg:h-64">
              <div className="relative h-full w-full max-w-[350px]">
                
                {/* Gambar Belakang Kiri (Kebun Binatang) */}
                <div className="absolute left-0 top-6 z-10 flex h-36 w-44 -rotate-12 transform items-end overflow-hidden rounded-xl border-4 border-white bg-gray-300 shadow-lg transition-transform hover:z-40 hover:rotate-0 hover:scale-105 md:h-40 md:w-48">
                  <img src="https://picsum.photos/seed/zoo/400/300" alt="Kebun Binatang" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="relative z-20 w-full bg-gradient-to-t from-black/80 to-transparent p-3 text-xs font-bold text-white">Kebun Binatang</div>
                </div>
                
                {/* Gambar Belakang Kanan (Museum Brawijaya) */}
                <div className="absolute right-0 top-2 z-20 flex h-36 w-44 rotate-12 transform items-end overflow-hidden rounded-xl border-4 border-white bg-gray-300 shadow-lg transition-transform hover:z-40 hover:rotate-0 hover:scale-105 md:h-40 md:w-48">
                  <img src="https://picsum.photos/seed/museum/400/300" alt="Museum Brawijaya" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="relative z-20 w-full bg-gradient-to-t from-black/80 to-transparent p-3 text-xs font-bold text-white">Museum Brawijaya</div>
                </div>
                
                {/* Gambar Depan Tengah (Kayutangan) */}
                <div className="absolute left-1/2 top-10 z-30 flex h-44 w-52 -translate-x-1/2 transform items-end overflow-hidden rounded-2xl border-[5px] border-white bg-gray-300 shadow-2xl transition-transform hover:scale-105 md:h-48 md:w-56">
                  <img src="https://picsum.photos/seed/street/400/300" alt="Kayutangan" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="relative z-20 w-full bg-gradient-to-t from-black/80 to-transparent p-3 text-sm font-bold text-white">Kayutangan</div>
                </div>
              </div>
            </div>
            
            {/* Dots Navigasi (Hiasan) */}
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
              <span className="h-2 w-2 rounded-full bg-white"></span>
              <span className="h-2 w-2 rounded-full bg-white/40"></span>
              <span className="h-2 w-2 rounded-full bg-white/40"></span>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}