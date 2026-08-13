document.addEventListener('DOMContentLoaded', () => {

  // 🎬 200+ Film & 🎮 200+ Oyun Veri Tabanı Havuz Örneği (Dinamik Kaydırmalı)
  const database = {
    movies: [
      {
        id: "m1",
        title: "Interstellar",
        year: "2014",
        rating: "⭐ 8.7 IMDb",
        genre: "Sci-Fi / Dram",
        poster: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
        desc: "İnsanlığın sonu yaklaşırken bir grup astronot, yaşanabilir yeni bir gezegen bulmak için solucan deliğinden geçerek uzayın derinliklerine tehlikeli bir yolculuğa çıkar."
      },
      {
        id: "m2",
        title: "Inception",
        year: "2010",
        rating: "⭐ 8.8 IMDb",
        genre: "Aksiyon / Sci-Fi",
        poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
        desc: "İnsanların rüyalarına girerek en gizli sırlarını çalan profesyonel bir hırsız, bu kez bir zihne fikir yerleştirmek (başlangıç) için imkansız bir göreve soyunur."
      },
      {
        id: "m3",
        title: "The Dark Knight",
        year: "2008",
        rating: "⭐ 9.0 IMDb",
        genre: "Aksiyon / Suç",
        poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
        desc: "Gotham Şehri'ni kaosa sürükleyen psikopat dahi Joker ile Batman arasında adaletin sınırlarını zorlayan amansız bir psikolojik savaş başlar."
      },
      {
        id: "m4",
        title: "Whiplash",
        year: "2014",
        rating: "⭐ 8.5 IMDb",
        genre: "Dram / Müzik",
        poster: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
        desc: "Ülkenin en prestijli müzik okuluna giren genç bir davulcu, acımasız ve mükemmeliyetçi öğretmeninin sınırlarını aşan baskısı altında mükemmelliğe ulaşmaya çalışır."
      },
      {
        id: "m5",
        title: "Fight Club",
        year: "1999",
        rating: "⭐ 8.8 IMDb",
        genre: "Dram / Psikolojik",
        poster: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
        desc: "Uykusuzluk çeken sıradan bir büro çalışanı, karizmatik bir sabun satıcısıyla tanışır ve birlikte erkeklerin içsel öfkelerini boşalttığı gizli bir dövüş kulübü kurarlar."
      }
    ],
    games: [
      {
        id: "g1",
        title: "The Witcher 3: Wild Hunt",
        year: "2015",
        rating: "⭐ 93 Metacritic",
        genre: "RPG / Açık Dünya",
        poster: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80",
        desc: "Efsanevi canavar avcısı Rivia'lı Geralt olarak, kehanetteki çocuğu bulmak için devasa bir fantezi dünyasında tehlikeli yaratıklar ve siyasi entrikalarla savaşıyorsun."
      },
      {
        id: "g2",
        title: "Red Dead Redemption 2",
        year: "2018",
        rating: "⭐ 97 Metacritic",
        genre: "Açık Dünya / Vahşi Batı",
        poster: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
        desc: "Vahşi Batı döneminin sonlarında kanun kaçakları çetesinin üyesi Arthur Morgan olarak, hayatta kalmak ve çetene sadık kalmak arasında derin bir hikayeye tanık oluyorsun."
      },
      {
        id: "g3",
        title: "Elden Ring",
        year: "2022",
        rating: "⭐ 96 Metacritic",
        genre: "Souls-like / RPG",
        poster: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
        desc: "Geniş ve gizemli Aradaki Topraklar'da efsanevi Elden Yüzüğü'nün gücünü ele geçirmek için ölümcül boss'larla yüzleştiğin atmosferik bir açık dünya macerası."
      },
      {
        id: "g4",
        title: "God of War Ragnarök",
        year: "2022",
        rating: "⭐ 94 Metacritic",
        genre: "Aksiyon / Macera",
        poster: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=800&q=80",
        desc: "Kratos ve oğlu Atreus, İskandinav tanrılarının kıyameti olan Ragnarök yaklaşırken Dokuz Diyar'da kaderlerini aramak ve tanrılarla savaşmak zorundadır."
      }
    ]
  };

  let currentMode = 'movies'; // 'movies' veya 'games'
  let currentIndex = 0;
  let watchlist = JSON.parse(localStorage.getItem('king_swipe_watchlist') || '[]');

  const cardStack = document.getElementById('card-stack');
  const btnMovies = document.getElementById('btn-movies');
  const btnGames = document.getElementById('btn-games');
  const btnSkip = document.getElementById('btn-skip');
  const btnStar = document.getElementById('btn-star');
  const btnOpenWatchlist = document.getElementById('btn-open-watchlist');
  const btnCloseWatchlist = document.getElementById('btn-close-watchlist');
  const watchlistModal = document.getElementById('watchlist-modal');
  const watchlistItems = document.getElementById('watchlist-items');
  const watchlistCount = document.getElementById('watchlist-count');

  // Mod Değiştirme (Film <-> Oyun)
  btnMovies.onclick = () => {
    currentMode = 'movies';
    btnMovies.classList.add('active');
    btnGames.classList.remove('active');
    currentIndex = 0;
    renderCard();
  };

  btnGames.onclick = () => {
    currentMode = 'games';
    btnGames.classList.add('active');
    btnMovies.classList.remove('active');
    currentIndex = 0;
    renderCard();
  };

  // Kartı Ekrana Çizme
  function renderCard() {
    const list = database[currentMode];
    cardStack.innerHTML = '';

    if (currentIndex >= list.length) {
      cardStack.innerHTML = `
        <div class="reels-card" style="background:#111827; justify-content:center; text-align:center;">
          <h2 style="font-size:1.5rem; margin-bottom:10px;">🎉 Tüm Liste Bitti!</h2>
          <p style="color:#9ca3af;">Tüm ${currentMode === 'movies' ? 'filmleri' : 'oyunları'} inceledin. Baştan başlamak için tıkla.</p>
          <button onclick="currentIndex=0; renderCard();" style="margin-top:20px;" class="mode-btn active">Baştan Başla 🔄</button>
        </div>
      `;
      return;
    }

    const item = list[currentIndex];
    const card = document.createElement('div');
    card.className = 'reels-card';
    card.style.backgroundImage = `url('${item.poster}')`;

    card.innerHTML = `
      <span class="card-badge">${item.rating}</span>
      <h2 class="card-title">${item.title}</h2>
      <div class="card-meta">📅 ${item.year} • 🏷️ ${item.genre}</div>
      <div class="card-desc">
        <strong>Spoilersız Konusu:</strong><br>
        ${item.desc}
      </div>
    `;

    cardStack.appendChild(card);
    updateWatchlistCount();
  }

  // Pas Geç (Sola Kaydır Animasyonu)
  btnSkip.onclick = () => {
    const card = cardStack.querySelector('.reels-card');
    if (!card) return;
    card.classList.add('swipe-left');
    setTimeout(() => {
      currentIndex++;
      renderCard();
    }, 250);
  };

  // Yıldızla / İzleneceklere Ekle (Sağa Kaydır Animasyonu)
  btnStar.onclick = () => {
    const card = cardStack.querySelector('.reels-card');
    if (!card) return;

    const item = database[currentMode][currentIndex];
    if (!watchlist.some(w => w.id === item.id)) {
      watchlist.push({ ...item, type: currentMode });
      localStorage.setItem('king_swipe_watchlist', JSON.stringify(watchlist));
    }

    card.classList.add('swipe-right');
    setTimeout(() => {
      currentIndex++;
      renderCard();
    }, 250);
  };

  // İzlenecekler Modalı Yönetimi
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
      watchlistItems.innerHTML = `<p style="text-align:center; color:#9ca3af; padding:20px;">Henüz hiçbir film veya oyuna yıldız vermedin. Reels akışında yıldız ikonuna tıkla!</p>`;
      return;
    }

    watchlist.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'watchlist-item';
      div.innerHTML = `
        <img src="${item.poster}" alt="${item.title}">
        <div style="flex:1;">
          <div class="watchlist-item-title">${item.title}</div>
          <div class="watchlist-item-meta">${item.type === 'movies' ? '🎬 Film' : '🎮 Oyun'} • ${item.year} • ${item.rating}</div>
        </div>
        <button onclick="removeFromWatchlist(${index})" style="background:none; border:none; color:#ef4444; font-size:1.2rem; cursor:pointer;">✕</button>
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

  // Dokunmatik Kaydırma (Swipe Gesture) Desteği
  let startX = 0;
  cardStack.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  });

  cardStack.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - startX;

    if (diffX > 70) {
      btnStar.click(); // Sağa kaydırdı -> Yıldızla
    } else if (diffX < -70) {
      btnSkip.click(); // Sola kaydırdı -> Pas geç
    }
  });

  renderCard();
});
