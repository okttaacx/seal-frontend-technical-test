import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchNews, formatDate, formatDateShort } from '../api/beritaApi';

const DUMMY_COMMENTS = [
  {
    name: 'Ujang Yusmeidi S.P., M.Agr.',
    date: '28 Mar 2024 11:13',
    text: 'Mohon maaf, apakah sertifikatnya sudah tidak dapat diunduh ? Karena saya mau download ada konfirmasi bahwa TOTP aktivasi salah Bagaimana ya solusinya ?',
    replies: [
      {
        name: 'Dina Rikha Biyanawati, S.Pd',
        date: '28 Mar 2024 11:15',
        text: 'saya mengunduh sertifikatnya kok juga belumbisa',
      }
    ]
  }
];

export default function NewsDetail() {
  // ── Tambahan Hooks untuk Routing ──
  const location = useLocation();
  const navigate = useNavigate();
  const article = location.state?.article; // Nangkep data dari halaman Home

  const [popular, setPopular] = useState([]);
  const [related, setRelated] = useState([]);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(DUMMY_COMMENTS);
  const [commentPage, setCommentPage] = useState(1);
  const COMMENTS_PER_PAGE = 5;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (article) {
      loadSidebar();
    }
  }, [article]);

  async function loadSidebar() {
    try {
      const data = await fetchNews('cnn-news/nasional');
      setPopular(data.slice(0, 3));
      setRelated(data.slice(3, 6));
    } catch (error) {
      console.error(error);
    }
  }

  // Fungsi untuk kembali ke halaman sebelumnya
  const onBack = () => navigate(-1);

  // Fungsi kalau user klik berita di sidebar/terkait
  const onArticleClick = (art) => {
    navigate('/detail', { state: { article: art } });
  };

  function handleComment(e) {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments(prev => [{
      name: 'Anda',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' }),
      text: comment,
      replies: []
    }, ...prev]);
    setComment('');
  }

  // ── Guard Clause jika user langsung ngetik /detail di URL ──
  if (!article) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-lg text-gray-600">Pilih artikel dari beranda terlebih dahulu.</p>
        <button onClick={() => navigate('/')} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const totalCommentPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);
  const visibleComments = comments.slice((commentPage - 1) * COMMENTS_PER_PAGE, commentPage * COMMENTS_PER_PAGE);

  const cat = article.category || 'Nasional';

  return (
    <div className="min-h-screen bg-white pb-12 pt-6">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* ── Breadcrumb ── */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <button onClick={onBack} className="hover:text-blue-500">Beranda</button>
          <span>›</span>
          <span className="text-gray-700">{cat}</span>
          <span>›</span>
          <span className="text-gray-700">Detail</span>
        </nav>

        {/* ── Layout 2 Kolom (Desktop) ── */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          
          {/* ── Main Content (Kiri - 8 Kolom) ── */}
          <main className="lg:col-span-8">
            <h1 className="mb-4 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
              {article.title}
            </h1>
            
            <div className="mb-6 flex items-center gap-2 text-sm">
              <span className="font-semibold text-[#007BFF]">{cat}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">{formatDate(article.isoDate)}</span>
            </div>

            {article.image && (
              <div className="mb-8">
                <img 
                  src={article.image.large || article.image} 
                  alt={article.title}
                  className="w-full rounded-xl object-cover"
                  onError={e => e.target.style.display = 'none'} 
                />
                <p className="mt-2 text-xs text-gray-500">
                  Gambar: {article.title} (Sumber terlampir)
                </p>
              </div>
            )}

            <div className="prose max-w-none text-gray-700 leading-relaxed mb-10">
              <p>{article.contentSnippet || article.content || 'Konten tidak tersedia.'}</p>
              {article.link && (
                <p className="mt-6">
                  <a 
                    href={article.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-[#007BFF] hover:underline"
                  >
                    Baca artikel lengkap di sumber <span>→</span>
                  </a>
                </p>
              )}
            </div>

            {/* ── Komentar ── */}
            <section className="mb-12 border-t pt-8">
              <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-gray-900">
                <span className="block h-6 w-1.5 bg-[#007BFF] rounded-full" />
                Komentar
              </h2>
              
              <form className="mb-8" onSubmit={handleComment}>
                <div className="flex gap-4">
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                    <svg viewBox="0 0 24 24" fill="#9CA3AF" className="h-full w-full mt-2">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <textarea
                      placeholder="Apa yang ingin anda tanyakan?"
                      className="w-full rounded-lg border border-gray-300 p-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      rows="3"
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      maxLength={500}
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-400">{comment.length}/500</span>
                      <button 
                        type="submit" 
                        className="rounded bg-[#007BFF] px-6 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
                      >
                        Kirim
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Comment List */}
              <div className="flex flex-col gap-6">
                {visibleComments.map((c, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200" />
                    <div className="flex-grow">
                      <div className="mb-1 flex items-center gap-3">
                        <strong className="text-sm text-gray-900">{c.name}</strong>
                        <span className="text-xs text-gray-500">{c.date}</span>
                      </div>
                      <p className="text-sm text-gray-700">{c.text}</p>
                      <button className="mt-1 text-xs font-semibold text-[#007BFF] hover:underline">Balas</button>

                      {/* Replies */}
                      {c.replies?.map((r, j) => (
                        <div key={j} className="mt-4 flex gap-4 border-l-2 pl-4">
                          <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-200" />
                          <div className="flex-grow">
                            <div className="mb-1 flex items-center gap-3">
                              <strong className="text-sm text-gray-900">{r.name}</strong>
                              <span className="text-xs text-gray-500">{r.date}</span>
                            </div>
                            <p className="text-sm text-gray-700">{r.text}</p>
                            <button className="mt-1 text-xs font-semibold text-[#007BFF] hover:underline">Balas</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Comment Pagination */}
              <div className="mt-8 flex items-center justify-between border-t pt-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>Item per page</span>
                  <select className="rounded border px-2 py-1" value="5" readOnly><option>5</option></select>
                  <span>of {comments.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    className="px-2 hover:text-[#007BFF] disabled:opacity-50"
                    onClick={() => setCommentPage(p => Math.max(1, p-1))} 
                    disabled={commentPage === 1}
                  >‹</button>
                  <button className="rounded px-2 text-[#007BFF] font-bold">{commentPage}</button>
                  <button 
                    className="px-2 hover:text-[#007BFF] disabled:opacity-50"
                    onClick={() => setCommentPage(p => Math.min(totalCommentPages, p+1))}
                    disabled={commentPage === totalCommentPages}
                  >›</button>
                </div>
              </div>
            </section>

            {/* ── Berita Terkait ── */}
            <section className="mb-8 border-t pt-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900">
                  <span className="block h-6 w-1.5 bg-[#007BFF] rounded-full" />
                  Berita Terkait
                </h2>
                <button className="rounded border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-[#007BFF] hover:bg-blue-100 transition-colors">
                  Lihat Semua
                </button>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {related.map((art, i) => (
                  <div key={i} className="group cursor-pointer overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow" onClick={() => onArticleClick(art)}>
                    <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                      {art.image ? (
                        <img src={art.image.small || art.image} alt={art.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                      ) : <div className="h-full w-full bg-gray-200" />}
                    </div>
                    <div className="p-4">
                      <h3 className="mb-2 line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-blue-600">{art.title}</h3>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-medium text-[#007BFF]">{art.category || 'Nasional'}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">{formatDateShort(art.isoDate)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>

          {/* ── Sidebar (Kanan - 4 Kolom) ── */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-gray-900">
                <span className="block h-6 w-1.5 bg-[#007BFF] rounded-full" />
                Berita Terpopuler
              </h2>
              <div className="flex flex-col gap-6">
                {popular.map((art, i) => (
                  <div key={i} className="group flex cursor-pointer gap-4" onClick={() => onArticleClick(art)}>
                    <div className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <div className="absolute -left-2 -top-2 z-10 flex h-7 w-7 items-end justify-end rounded-full bg-[#2B3542] pr-1.5 pb-1 text-xs font-bold text-white">
                        {i + 1}
                      </div>
                      {art.image ? (
                        <img src={art.image.small || art.image} alt={art.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                      ) : <div className="h-full w-full bg-gray-200" />}
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="mb-2 line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-[#007BFF]">{art.title}</h4>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-medium text-[#007BFF]">{art.category || 'Nasional'}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500">{formatDateShort(art.isoDate)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}