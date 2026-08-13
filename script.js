document.addEventListener('DOMContentLoaded', () => {

  // TMDB & RAWG Ücretsiz Public/Demo Key'leri
  const TMDB_KEY = '8476a7ab80fc77f0a71f074d7f23e308'; // TMDB Film API
  const RAWG_KEY = 'c542e67aec3a4340908f9d9e0d116dd7'; // RAWG Oyun API

  let currentMode = 'movies'; // 'movies' veya 'games'
  let moviePage = 1;
  let gamePage = 1;
  let itemsList = [];
  let currentIndex = 0;

  let watchlist = JSON.parse(localStorage.getItem('king_swipe_watchlist') || '[]');

  const cardContainer = document.getElementById('card-container');
  const btnMovies = document.getElementById('btn-movies');
  const btnGames = document.getElementById('btn-games');
  const btnSkip = document.getElementById('btn-skip');
  const btnStar = document.getElementById('btn-star');
  const btnTrailer = document.getElementById('btn-trailer');
  const btnOpenWatchlist = document.getElementById('btn-open-watchlist');
  const btnCloseWatchlist = document.getElementById('btn-close-watchlist');
  const watchlistModal = document.getElementById('watchlist-modal');
  const watchlistItems = document.getElementById('watchlist-items');
  const watchlistCount = document.getElementById('watchlist-count');

  // Sayfa Yüklendiğinde Başlat
  fetchContent();

  // Mod Değiştirme
  btnMovies.onclick = () => {
    if (currentMode === 'movies') return;
    currentMode = 'movies';
    btnMovies.classList.add('active');
    btnGames.classList.remove('active');
    resetAndFetch();
  };

  btnGames.onclick = () => {
    if (currentMode === 'games') return;
    currentMode = 'games';
    btnGames.classList.add('active');
    btnMovies.classList.remove('active');
    resetAndFetch();
  };

  function resetAndFetch() {
    itemsList = [];
    currentIndex = 0;
    moviePage = 1;
    gamePage = 1;
    fetchContent();
  }

  // API'den İçerik Çekme (Filmler & Oyunlar)
  async function fetchContent() {
    showLoading();
    try {
      if (currentMode === 'movies') {
        const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&language=tr-TR&page=${moviePage}`);
        const data = await res.json();
        const formattedMovies = data.results.map(m => ({
          id: 'm_' + m.id,
          title: m.title || m.original_title,
          year: m.release_date ? m.release_date.split('-')[0] : 'Bilinmiyor',
          rating: `⭐ ${m.vote_average ? m.vote_average.toFixed(1) : 'N/A'}`,
          genre: 'Film',
          poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : 'https://via.placeholder.com/500x750',
          desc: m.overview || 'Bu film için henüz Türkçe özet eklenmemiş.'
        }));
        itemsList = itemsList.concat(formattedMovies);
        moviePage++;
      } else {
        const res = await fetch(`https://api.rawg.io/api/games?key=${RAWG_KEY}&page=${gamePage}&page_size=20`);
        const data = await res.json();
        const formattedGames = data.results.map(g => ({
          id: 'g_' + g.id,
          title: g.name,
          year: g.released ? g.released.split('-')[0] : 'Bilinmiyor',
          rating: `⭐ ${g.rating ? g.rating : 'N/A'} / 5`,
          genre: g.genres.map(x => x.name).slice(0, 2).join(' / ') || 'Oyun',
          poster: g.background_image || 'https://via.placeholder.com/500x750',
          desc: `Tür: ${g.genres.map(x => x.name).join(', ')} | Platformlar: ${g.platforms ? g.platforms.map(p => p.platform.name).slice(0,3).join(', ') : 'PC/Konsol'}`
        }));
        itemsList = itemsList.concat(formattedGames);
        gamePage++;
      }
      renderCard();
    } catch (err) {
      console.error(err);
      cardContainer.innerHTML = `<div class="reels-card" style="justify-content:center; text-align:center;"><h2>⚠️ Bağlantı Hatası</h2><p>İçerik yüklenirken bir sorun oluştu.</p></div>`;
    }
  }

  function showLoading() {
    cardContainer.innerHTML = `
      <div class="reels-card" style="justify-content:center; text-align:center; background:#111827;">
        <h2 style="font-size:1.2rem; color:#6366f1;">⏳ Yükleniyor...</h2>
      </div>
    `;
  }

  // Kart Ekrana Basma
  function renderCard() {
    if (currentIndex >= itemsList.length - 2) {
      // Liste bitmeye yakın arka planda yeni sayfa verisi çek
      fetchContent();
    }

    const item = itemsList[currentIndex];
    cardContainer.innerHTML = '';

    if (!item) return;

    const card = document.createElement('div');
    card.className = 'reels-card';
    card.style.backgroundImage = `url('${item.poster}')`;

    card.innerHTML = `
      <span class="card-badge">${item.rating}</span>
      <h2 class="card-title">${item.title}</h2>
      <div class="card-meta">📅 ${item.year} • 🏷️ ${item.genre}</div>
      <div class="card-desc">
        ${item.desc}
      </div>
    `;

    cardContainer.appendChild(card);
    updateWatchlistCount();
  }

  // Pas Geç
  btnSkip.onclick = () => {
    const card = cardContainer.querySelector('.reels-card');
    if (!card) return;
    card.classList.add('swipe-left');
    setTimeout(() => {
      currentIndex++;
      renderCard();
    }, 200);
  };

  // Favorilere Ekle
  btnStar.onclick = () => {
    const card = cardContainer.querySelector('.reels-card');
    if (!card) return;

    const item = itemsList[currentIndex];
    if (item && !watchlist.some(w => w.id === item.id)) {
      watchlist.push(item);
      localStorage.setItem('king_swipe_watchlist', JSON.stringify(watchlist));
    }

    card.classList.add('swipe-right');
    setTimeout(() => {
      currentIndex++;
      renderCard();
    }, 200);
  };

  // YouTube Fragman Arama
  btnTrailer.onclick = () => {
    const item = itemsList[currentIndex];
    if (item) {
      const query = encodeURIComponent(`${item.title} ${currentMode === 'movies' ? 'fragman' : 'gameplay'}`);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }
  };

  // Watchlist Modalı
  btnOpenWatchlist.onclick = () => {
    renderWatchlistModal();
    watchlistModal.classList.remove('hidden');
  };

  btnCloseWatchlist.onclick = () => {
    watchlistModal.classList.add('hidden');
  };

  function updateWatchlistCount() {
    watchlistCount.innerText = watchlist.length;
  }

  function renderWatchlistModal() {
    watchlistItems.innerHTML = '';
    if (watchlist.length === 0) {
      watchlistItems.innerHTML = `<p style="text-align:center; color:#9ca3af; padding:15px; font-size:0.85rem;">Listen henüz boş. Yıldız butonuna tıkla!</p>`;
      return;
    }

    watchlist.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'watchlist-item';
      div.innerHTML = `
        <img src="${item.poster}" alt="${item.title}">
        <div style="flex:1;">
          <div style="font-weight:700; font-size:0.9rem;">${item.title}</div>
          <div style="font-size:0.75rem; color:#cbd5e1;">${item.rating} • ${item.year}</div>
        </div>
        <button onclick="removeFromWatchlist(${index})" style="background:none; border:none; color:#ef4444; font-size:1.1rem; cursor:pointer;">✕</button>
      `;
      watchlistItems.appendChild(div);
    });
  }

  window.removeFromWatchlist = (index) => {
    watchlist.splice(index, 1);
    localStorage.setItem('king_swipe_watchlist', JSON.stringify(watchlist));
    renderWatchlistModal();
    updateWatchlistCount();
  };

});
