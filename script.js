document.addEventListener('DOMContentLoaded', () => {

  // API Anahtarları (Halka açık demo istemci keyleri)
  const TMDB_API_KEY = '3fd2be6f0c70a2a598f084dd27548780'; // TMDB API
  const RAWG_API_KEY = 'c53a71e590164d82a722e0547461249f'; // RAWG Games API

  let currentMode = 'movies'; // 'movies' veya 'games'
  let currentList = [];
  let currentIndex = 0;
  let watchlist = JSON.parse(localStorage.getItem('king_decide_watchlist') || '[]');

  // DOM Öğeleri
  const reelsView = document.getElementById('reels-view');
  const rouletteView = document.getElementById('roulette-view');
  const cardStack = document.getElementById('card-stack');
  const btnMovies = document.getElementById('btn-movies');
  const btnGames = document.getElementById('btn-games');
  const btnToggleView = document.getElementById('btn-toggle-view');
  const genreSelect = document.getElementById('genre-select');
  const sortSelect = document.getElementById('sort-select');
  const btnSkip = document.getElementById('btn-skip');
  const btnStar = document.getElementById('btn-star');
  const btnTrailer = document.getElementById('btn-trailer');
  const trailerModal = document.getElementById('trailer-modal');
  const trailerIframe = document.getElementById('trailer-iframe');
  const btnCloseTrailer = document.getElementById('btn-close-trailer');
  const watchlistModal = document.getElementById('watchlist-modal');
  const watchlistItems = document.getElementById('watchlist-items');
  const btnOpenWatchlist = document.getElementById('btn-open-watchlist');
  const btnCloseWatchlist = document.getElementById('btn-close-watchlist');
  const watchlistCount = document.getElementById('watchlist-count');
  const btnSpin = document.getElementById('btn-spin');
  const wheelDisplay = document.getElementById('wheel-display');

  // Sayfa İlk Yükleme
  init();

  async function init() {
    updateWatchlistCount();
    await loadGenres();
    await fetchContent();
  }

  // Mod Değişimi (Film / Oyun)
  btnMovies.onclick = () => switchMode('movies');
  btnGames.onclick = () => switchMode('games');

  async function switchMode(mode) {
    if (currentMode === mode) return;
    currentMode = mode;
    btnMovies.classList.toggle('active', mode === 'movies');
    btnGames.classList.toggle('active', mode === 'games');
    await loadGenres();
    await fetchContent();
  }

  // Görünüm Değişimi (Reels / Rulet)
  btnToggleView.onclick = () => {
    reelsView.classList.toggle('hidden-view');
    rouletteView.classList.toggle('hidden-view');
  };

  // Filtreler Değişince
  genreSelect.onchange = () => fetchContent();
  sortSelect.onchange = () => fetchContent();

  // Türleri API'den Çek
  async function loadGenres() {
    genreSelect.innerHTML = '<option value="">🎭 Tüm Türler</option>';
    if (currentMode === 'movies') {
      const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=tr-TR`);
      const data = await res.json();
      data.genres.forEach(g => {
        genreSelect.innerHTML += `<option value="${g.id}">${g.name}</option>`;
      });
    } else {
      const res = await fetch(`https://rawg.io/api/genres?key=${RAWG_API_KEY}`);
      const data = await res.json();
      data.results.forEach(g => {
        genreSelect.innerHTML += `<option value="${g.id}">${g.name}</option>`;
      });
    }
  }

  // Dev Veri Tabanından (API) İçerik Çekme
  async function fetchContent() {
    cardStack.innerHTML = `<div class="loading-spinner"><i class="fa-solid fa-circle-notch fa-spin"></i><p>Yüzlerce İçerik Yükleniyor...</p></div>`;
    currentIndex = 0;
    const genre = genreSelect.value;
    const sort = sortSelect.value;

    try {
      if (currentMode === 'movies') {
        let url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=tr-TR&sort_by=${sort}&page=1`;
        if (genre) url += `&with_genres=${genre}`;
        const res = await fetch(url);
        const data = await res.json();
        
        currentList = data.results.map(item => ({
          id: 'm_' + item.id,
          rawId: item.id,
          title: item.title,
          year: item.release_date ? item.release_date.split('-')[0] : 'N/A',
          rating: `⭐ ${item.vote_average.toFixed(1)} IMDb`,
          poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750',
          desc: item.overview || 'Bu film için henüz Türkçe spoilersız özet bulunmuyor.',
          type: 'movies'
        }));
      } else {
        let url = `https://rawg.io/api/games?key=${RAWG_API_KEY}&page_size=40`;
        if (genre) url += `&genres=${genre}`;
        const res = await fetch(url);
        const data = await res.json();

        currentList = data.results.map(item => ({
          id: 'g_' + item.id,
          rawId: item.id,
          title: item.name,
          year: item.released ? item.released.split('-')[0] : 'N/A',
          rating: `⭐ ${item.rating} / 5`,
          poster: item.background_image || 'https://via.placeholder.com/500x750',
          desc: `Toplum Puanı: ${item.rating_top}/5. Platformlar: ${item.platforms.map(p => p.platform.name).slice(0, 3).join(', ')}`,
          type: 'games'
        }));
      }

      renderCard();
    } catch (err) {
      cardStack.innerHTML = `<p style="text-align:center; padding:20px;">İçerikler yüklenirken hata oluştu. Lütfen bağlantını kontrol et.</p>`;
    }
  }

  // Kartı Ekrana Çizme
  function renderCard() {
    cardStack.innerHTML = '';
    if (currentIndex >= currentList.length) {
      cardStack.innerHTML = `
        <div class="reels-card" style="background:#111827; justify-content:center; text-align:center; bottom:20px;">
          <h2>🎉 Bu Listedeki Tüm İçerikleri Gezdin!</h2>
          <p style="margin-top:10px; color:#9ca3af;">Başka bir tür seçebilir veya listeyi yenileyebilirsin.</p>
          <button onclick="fetchContent()" class="spin-btn" style="margin-top:20px;">Yeniden Yükle 🔄</button>
        </div>
      `;
      return;
    }

    const item = currentList[currentIndex];
    const card = document.createElement('div');
    card.className = 'reels-card';
    card.style.backgroundImage = `url('${item.poster}')`;

    card.innerHTML = `
      <span class="card-badge">${item.rating}</span>
      <h2 class="card-title">${item.title}</h2>
      <div class="card-meta">📅 ${item.year}</div>
      <div class="card-desc">
        <strong>Spoilersız Konusu / Bilgi:</strong><br>${item.desc}
      </div>
    `;

    cardStack.appendChild(card);
  }

  // Etkileşimler
  btnSkip.onclick = () => {
    const card = cardStack.querySelector('.reels-card');
    if (!card) return;
    card.classList.add('swipe-left');
    setTimeout(() => { currentIndex++; renderCard(); }, 250);
  };

  btnStar.onclick = () => {
    const card = cardStack.querySelector('.reels-card');
    if (!card) return;
    const item = currentList[currentIndex];
    if (!watchlist.some(w => w.id === item.id)) {
      watchlist.push(item);
      localStorage.setItem('king_decide_watchlist', JSON.stringify(watchlist));
      updateWatchlistCount();
    }
    card.classList.add('swipe-right');
    setTimeout(() => { currentIndex++; renderCard(); }, 250);
  };

  // Fragman Modal Açma
  btnTrailer.onclick = async () => {
    const item = currentList[currentIndex];
    if (!item) return;

    if (item.type === 'movies') {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${item.rawId}/videos?api_key=${TMDB_API_KEY}`);
      const data = await res.json();
      const trailer = data.results.find(v => v.type === 'Trailer') || data.results[0];
      if (trailer) {
        trailerIframe.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
        trailerModal.classList.remove('hidden');
      } else {
        alert("Üzgünüm, bu film için fragman bulunamadı!");
      }
    } else {
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(item.title + ' gameplay trailer')}`, '_blank');
    }
  };

  btnCloseTrailer.onclick = () => {
    trailerIframe.src = '';
    trailerModal.classList.add('hidden');
  };

  // Rulet / Çark Çevirme
  btnSpin.onclick = () => {
    if (currentList.length === 0) return;
    let speed = 50;
    let counter = 0;
    btnSpin.disabled = true;

    const interval = setInterval(() => {
      const randomItem = currentList[Math.floor(Math.random() * currentList.length)];
      wheelDisplay.innerHTML = `
        <img src="${randomItem.poster}" style="width:60px; height:80px; object-fit:cover; border-radius:8px;">
        <span id="roulette-result-text">${randomItem.title}</span>
      `;
      counter++;
      if (counter > 20) {
        clearInterval(interval);
        btnSpin.disabled = false;
      }
    }, speed);
  };

  // Watchlist İşlemleri
  function updateWatchlistCount() { watchlistCount.innerText = watchlist.length; }

  btnOpenWatchlist.onclick = () => {
    watchlistItems.innerHTML = watchlist.length === 0 ? '<p style="text-align:center; padding:20px; color:#9ca3af;">Listen henüz boş.</p>' : '';
    watchlist.forEach((item, index) => {
      watchlistItems.innerHTML += `
        <div class="watchlist-item">
          <img src="${item.poster}">
          <div style="flex:1;">
            <div style="font-weight:700;">${item.title}</div>
            <div style="font-size:0.75rem; color:#cbd5e1;">${item.rating} • ${item.year}</div>
          </div>
          <button onclick="removeWatchlist(${index})" style="background:none; border:none; color:#f87171; cursor:pointer;">✕</button>
        </div>
      `;
    });
    watchlistModal.classList.remove('hidden');
  };

  window.removeWatchlist = (index) => {
    watchlist.splice(index, 1);
    localStorage.setItem('king_decide_watchlist', JSON.stringify(watchlist));
    updateWatchlistCount();
    btnOpenWatchlist.click();
  };

  btnCloseWatchlist.onclick = () => watchlistModal.classList.add('hidden');
});
