const BASE_URL = 'https://berita-indo-api-next.vercel.app/api';

export async function fetchNews(endpoint) {
  const url = `${BASE_URL}/${endpoint}`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('Gagal mengambil berita');
    
    const data = await res.json();
    // Return data.data atau data.posts tergantung struktur response dari API
    return data.data || data.posts || [];
  } catch (error) {
    console.error("Error fetching news:", error);
    // Kembalikan array kosong jika error agar .map() di komponen tidak error
    return []; 
  }
}

export const CATEGORY_ENDPOINTS = {
  beranda:        'cnn-news',
  terbaru:        'cnn-news',
  hiburan:        'cnn-news/hiburan',
  'gaya-hidup':   'cnn-news/gaya-hidup',
  olahraga:       'cnn-news/olahraga',
  nasional:       'cnn-news/nasional',
  internasional:  'cnn-news/internasional',
  kesehatan:      'cnn-news/kesehatan',
  otomotif:       'cnn-news/otomotif',
  politik:        'cnn-news/politik',
  teknologi:      'cnn-news/teknologi',
  ekonomi:        'cnbc-news/market', // Sumber ke-2 (Syarat 2 sumber terpenuhi)
};

// Disesuaikan persis dengan menu Navbar di desain Figma
export const NAV_CATEGORIES = [
  { id: 'beranda',       label: 'Beranda' },
  { id: 'kesehatan',     label: 'Kesehatan' },
  { id: 'otomotif',      label: 'Otomotif' },
  { id: 'politik',       label: 'Politik' },
  { id: 'olahraga',      label: 'Olahraga' },
  { id: 'nasional',      label: 'Nasional' },
  { id: 'internasional', label: 'Internasional' },
];

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const day = d.getDate();
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
}