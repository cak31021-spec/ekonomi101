// Ülke Başlangıç Tanımları
const COUNTRIES = {
    turkiye: {
        id: 'turkiye',
        name: 'Türkiye (Yüksek Enflasyon Senaryosu)',
        flag: '🇹🇷',
        difficulty: 'Zor',
        diffClass: 'diff-hard',
        desc: 'Yüksek enflasyon ve oynak büyüme ile mücadele ediyor. Rezervleri kısıtlı ve halkın beklentileri yüksek.',
        initial: {
            inflation: 45.0,
            unemployment: 11.5,
            gdpGrowth: 3.5,
            satisfaction: 42.0,
            reserves: 25.0, // Milyar Dolar
            gdp: 900.0,      // Milyar Dolar
            interestRate: 35.0,
            taxRate: 25.0,
            spendingLevel: 'medium',
            minWageLevel: 'medium'
        }
    },
    almanya: {
        id: 'almanya',
        name: 'Germania (Kararlı/Dengeli Senaryo)',
        flag: '🇩🇪',
        difficulty: 'Kolay',
        diffClass: 'diff-easy',
        desc: 'Düşük enflasyon, yüksek rezervler ve dengeli bir büyüme oranına sahip. Ekonomik dengeler kararlı.',
        initial: {
            inflation: 2.2,
            unemployment: 4.5,
            gdpGrowth: 1.8,
            satisfaction: 70.0,
            reserves: 350.0,
            gdp: 4200.0,
            interestRate: 2.5,
            taxRate: 30.0,
            spendingLevel: 'medium',
            minWageLevel: 'medium'
        }
    },
    amerika: {
        id: 'amerika',
        name: 'Amerika (Rezerv Para Senaryosu)',
        flag: '🇺🇸',
        difficulty: 'Orta',
        diffClass: 'diff-medium',
        desc: 'Küresel ekonominin merkezi ve rezerv para birimi (Dolar) ihraççısı. Devasa GSYİH gücüne sahip fakat dengeleri korumak zor.',
        initial: {
            inflation: 3.5,
            unemployment: 4.1,
            gdpGrowth: 2.2,
            satisfaction: 55.0,
            reserves: 250.0,
            gdp: 25000.0, // 25 Trilyon Dolar
            interestRate: 5.25,
            taxRate: 21.0,
            spendingLevel: 'medium',
            minWageLevel: 'medium'
        }
    }
};

// Rastgele Olaylar Havuzu
const RANDOM_EVENTS = [
    {
        id: 'oil_crisis',
        title: 'Küresel Petrol Krizi',
        desc: 'Orta Doğu\'daki gerilimler nedeniyle küresel ham petrol fiyatları varil başına %50 artış gösterdi. Enerji maliyetleri hızla yükseliyor.',
        icon: '🛢️',
        choices: [
            {
                title: 'Enerjiyi Sübvanse Et',
                desc: 'Hazine bütçesinden akaryakıt desteği vererek enflasyonu ve halkı koru.',
                impactDesc: 'Rezervler -35B$, Enflasyon +1%, Memnuniyet +5%',
                effect: (state) => {
                    state.reserves -= 35;
                    state.inflation += 1.0;
                    state.satisfaction += 5.0;
                    return "Enerji sübvansiyonları bütçeyi zorladı ancak fiyat artışlarını frenledi.";
                }
            },
            {
                title: 'Serbest Piyasa Koşullarına Bırak',
                desc: 'Maliyet artışlarının pompa fiyatlarına doğrudan yansımasına izin ver.',
                impactDesc: 'Enflasyon +6%, Memnuniyet -12%, İşsizlik +1%',
                effect: (state) => {
                    state.inflation += 6.0;
                    state.satisfaction -= 12.0;
                    state.unemployment += 1.0;
                    return "Akaryakıt fiyatları halkı kızdırdı ve ulaştırma maliyetleri enflasyonu körükledi.";
                }
            }
        ]
    },
    {
        id: 'tech_breakthrough',
        title: 'Yerli Teknoloji Devrimi',
        desc: 'Yarı iletkenler ve yapay zeka alanında faaliyet gösteren yerli bir start-up dünya çapında bir başarı elde etti ve büyük bir patent aldı.',
        icon: '💻',
        choices: [
            {
                title: 'Devlet Destekli Yatırım Bölgesi Kur',
                desc: 'Bu girişimin etrafında bir Ar-Ge vadisi kurmak için hazineden büyük bütçe ayır.',
                impactDesc: 'Rezervler -40B$, Büyüme +3.5%, İşsizlik -1.5%, Memnuniyet +8%',
                effect: (state) => {
                    state.reserves -= 40;
                    state.gdpGrowth += 3.5;
                    state.unemployment -= 1.5;
                    state.satisfaction += 8.0;
                    return "Teknoloji vadisi yabancı yatırımcı çekti ve üretkenliği artırdı.";
                }
            },
            {
                title: 'Vergi Muafiyetleri Sağla',
                desc: 'Nakit harcama yapmadan sadece sektöre yönelik kurumlar vergisini düşür.',
                impactDesc: 'Büyüme +1.5%, İşsizlik -0.8%, Rezervler -10B$',
                effect: (state) => {
                    state.gdpGrowth += 1.5;
                    state.unemployment -= 0.8;
                    state.reserves -= 10;
                    return "Vergi muafiyetleri orta vadede yatırımları canlandırdı.";
                }
            }
        ]
    },
    {
        id: 'drought',
        title: 'Tarımsal Kuraklık Tehlikesi',
        desc: 'Mevsim normallerinin altındaki yağışlar nedeniyle tarım havzalarında ciddi bir kuraklık yaşanıyor. Gıda arzı tehlikede.',
        icon: '🌾',
        choices: [
            {
                title: 'Çiftçiye Doğrudan Destek Ödemesi Yap',
                desc: 'Zarar gören çiftçilerin borçlarını ertele ve hibe ver.',
                impactDesc: 'Rezervler -20B$, Enflasyon +1.5%, Memnuniyet +4%',
                effect: (state) => {
                    state.reserves -= 20;
                    state.inflation += 1.5;
                    state.satisfaction += 4.0;
                    return "Çiftçi destekleri üretimi kısmen korudu ancak enflasyonist baskı oluşturdu.";
                }
            },
            {
                title: 'Gıda İthalat Gümrüklerini Sıfırla',
                desc: 'Yerli piyasada fiyatları düşürmek için gıda ithalatını kolaylaştır.',
                impactDesc: 'Enflasyon -2.5%, Memnuniyet -8% (Çiftçiler boykotta)',
                effect: (state) => {
                    state.inflation -= 2.5;
                    state.satisfaction -= 8.0;
                    return "İthal gıda fiyatları düşürdü ancak tarım sektörü sert darbe aldı.";
                }
            }
        ]
    },
    {
        id: 'pandemic',
        title: 'Yeni Bir Salgın Virüs',
        desc: 'Hızlı yayılan bir solunum yolu virüsü nedeniyle sağlık otoriteleri tedbir alınmasını öneriyor.',
        icon: '🦠',
        choices: [
            {
                title: 'Karantina ve Esnaf Sağlık Destek Paketi',
                desc: 'Hızlı kapanma uygula, esnafa doğrudan gelir desteği ver.',
                impactDesc: 'Rezervler -50B$, İşsizlik +3%, Büyüme -3%, Memnuniyet +10%',
                effect: (state) => {
                    state.reserves -= 50;
                    state.unemployment += 3.0;
                    state.gdpGrowth -= 3.0;
                    state.satisfaction += 10.0;
                    return "Karantina can kayıplarını önledi ve halkı mutlu etti ancak ekonomi küçüldü.";
                }
            },
            {
                title: 'Ekonomiyi Açık Tut ve Sürü Bağışıklığı',
                desc: 'Kısıtlamaları minimumda tut, sadece aşılamaya odaklan.',
                impactDesc: 'Büyüme +1.5%, Memnuniyet -15%, Enflasyon +2.5%',
                effect: (state) => {
                    state.gdpGrowth += 1.5;
                    state.satisfaction -= 15.0;
                    state.inflation += 2.5;
                    return "Fabrikalar çalışmaya devam etti ancak sağlık sistemindeki kriz halkta infial yarattı.";
                }
            }
        ]
    },
    {
        id: 'trade_war',
        title: 'Jeopolitik Ticaret Savaşları',
        desc: 'Komşu dev bloklar, gümrük vergilerini karşılıklı olarak artırdı. Küresel ticaret hacmi daralıyor ve ihracat pazarınız tehlikede.',
        icon: '⚔️',
        choices: [
            {
                title: 'Misilleme Yap ve Korumacılığa Geç',
                desc: 'İthal mallara ek gümrük vergileri koyarak yerli sanayiyi koru.',
                impactDesc: 'Büyüme -1.5%, Enflasyon +2%, Memnuniyet +3%',
                effect: (state) => {
                    state.gdpGrowth -= 1.5;
                    state.inflation += 2.0;
                    state.satisfaction += 3.0;
                    return "Korumacılık yerli üreticiyi korusa da hammadde maliyetlerini artırarak enflasyonu yükseltti.";
                }
            },
            {
                title: 'Vergi Kolaylıkları ile Yeni Pazarlara Açıl',
                desc: 'İhracatçılara taşıma ve pazarlama desteği ver.',
                impactDesc: 'Rezervler -25B$, Büyüme +1%, İşsizlik -0.5%',
                effect: (state) => {
                    state.reserves -= 25;
                    state.gdpGrowth += 1.0;
                    state.unemployment -= 0.5;
                    return "İhracat teşvikleri yeni pazarlar bulunmasını sağladı ve büyümeyi destekledi.";
                }
            }
        ]
    },
    {
        id: 'brain_drain',
        title: 'Nitelikli İş Gücü Göçü (Beyin Göçü)',
        desc: 'Üniversite mezunları ve mühendisler arasında yurt dışına göç etme oranları rekor seviyeye ulaştı. Teknoloji ve sağlık sektörlerinde açık oluşuyor.',
        icon: '✈️',
        choices: [
            {
                title: 'Ar-Ge ve Genç Girişimci Hibelerini Katla',
                desc: 'Gençlerin ülkede kalmasını sağlayacak cazip fonlar ve vergi muafiyetleri sun.',
                impactDesc: 'Rezervler -15B$, Büyüme +1.5%, Memnuniyet +6%',
                effect: (state) => {
                    state.reserves -= 15;
                    state.gdpGrowth += 1.5;
                    state.satisfaction += 6.0;
                    return "Teşvikler nitelikli gençlerin ülkede kalma motivasyonunu artırdı.";
                }
            },
            {
                title: 'Sessiz Kal ve Piyasayı İzle',
                desc: 'Müdahale etme, ekonomik dengelerin kendi kendine oluşmasını bekle.',
                impactDesc: 'Büyüme -2%, Memnuniyet -8%, İşsizlik -0.5% (İş gücü azaldı)',
                effect: (state) => {
                    state.gdpGrowth -= 2.0;
                    state.satisfaction -= 8.0;
                    state.unemployment -= 0.5;
                    return "Yetişmiş insan kaynağının kaybı sanayide verimlilik ve büyüme kaybına yol açtı.";
                }
            }
        ]
    },
    {
        id: 'earthquake',
        title: 'Büyük Deprem Felaketi',
        desc: 'Ülkenin sanayi merkezine yakın bir bölgede şiddetli bir deprem meydana geldi. Altyapı ağır hasar gördü.',
        icon: '🌋',
        choices: [
            {
                title: 'Seferberlik ve Hızlı Yeniden İnşa Hamlesi',
                desc: 'Tüm bütçe imkanlarını deprem bölgesine aktar, altyapıyı hızla kur.',
                impactDesc: 'Rezervler -60B$, Büyüme +2% (İnşaat odaklı), Enflasyon +3%, Memnuniyet +10%',
                effect: (state) => {
                    state.reserves -= 60;
                    state.gdpGrowth += 2.0;
                    state.inflation += 3.0;
                    state.satisfaction += 10.0;
                    return "Yeniden inşa hamlesi yaraları hızlı sardı ve inşaat büyümesi getirdi fakat ciddi borç yarattı.";
                }
            },
            {
                title: 'Kademeli ve Tasarruflu Destek',
                desc: 'Mevcut bütçe sınırları dışına çıkmadan kademeli yardım sağla.',
                impactDesc: 'Rezervler -15B$, Memnuniyet -25%, Büyüme -2%',
                effect: (state) => {
                    state.reserves -= 15;
                    state.satisfaction -= 25.0;
                    state.gdpGrowth -= 2.0;
                    return "Destek yetersizliği deprem bölgesinde halkın büyük tepkisine ve sanayinin durmasına neden oldu.";
                }
            }
        ]
    },
    {
        id: 'tourism_boom',
        title: 'Turizm Sektöründe Patlama',
        desc: 'Popüler bir seyahat dergisi ülkenizi yılın en iyi turizm rotası seçti. Yabancı turist akını var, döviz girdisi yüksek.',
        icon: '🏖️',
        choices: [
            {
                title: 'Altyapı ve Tanıtım Yatırımları Yap',
                desc: 'Kıyı ve tarihi bölgelere yatırım yapıp turizmi kalıcı hale getir.',
                impactDesc: 'Rezervler -10B$ (Yatırım), Büyüme +2.5%, Memnuniyet +5%, Rezervler +40B$ (Gelir)',
                effect: (state) => {
                    state.reserves += 30;
                    state.gdpGrowth += 2.5;
                    state.satisfaction += 5.0;
                    return "Turizm altyapısı kalıcı döviz girdisi ve istihdam sağladı.";
                }
            },
            {
                title: 'Geliri Doğrudan Merkez Bankası Rezervine Aktar',
                desc: 'Yatırım yapmadan dövizi kasada tutarak borç öde.',
                impactDesc: 'Rezervler +50B$, Büyüme +0.5%',
                effect: (state) => {
                    state.reserves += 50;
                    state.gdpGrowth += 0.5;
                    return "MB döviz kasası güçlendi ve borç riski azaldı.";
                }
            }
        ]
    }
];

// Aktif Giriş Yapan Kullanıcı Takibi
let currentUser = null;

// Ana Oyun Durum Değişkeni
let gameState = {
    active: false,
    selectedCountry: null,
    turn: 1,
    inflation: 0,
    unemployment: 0,
    gdpGrowth: 0,
    satisfaction: 0,
    reserves: 0,
    gdp: 0,
    interestRate: 0,
    taxRate: 0,
    spendingLevel: 'medium',
    minWageLevel: 'medium',
    history: [],
    eventQueue: []
};

// Sayfa Yüklendiğinde Tetiklenecek Fonksiyonlar
document.addEventListener('DOMContentLoaded', () => {
    initDefaultHighScores(); // Varsayılan rekorları yükle (eğer yoksa)
    initWelcomeScreen();
    loadHighScores();
    loadTheme(); // Kayıtlı temayı yükle
    showAuthScreen();
});

// --- YENİ: VARSAYILAN REKORLAR (SKORLAR) ---
function initDefaultHighScores() {
    if (!localStorage.getItem('ekonomi_sim_scores')) {
        const defaultScores = [
            { username: 'Caner', countryName: 'Germania (Kararlı/Dengeli Senaryo)', flag: '🇩🇪', score: 840, date: new Date().toLocaleDateString('tr-TR') },
            { username: 'Ayşe', countryName: 'Amerika (Rezerv Para Senaryosu)', flag: '🇺🇸', score: 710, date: new Date().toLocaleDateString('tr-TR') },
            { username: 'Mehmet', countryName: 'Türkiye (Yüksek Enflasyon Senaryosu)', flag: '🇹🇷', score: 580, date: new Date().toLocaleDateString('tr-TR') }
        ];
        localStorage.setItem('ekonomi_sim_scores', JSON.stringify(defaultScores));
    }
}

// --- YENİ: AÇIK / KOYU TEMA GEÇİŞ MANTIĞI ---
function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById('theme-toggle-btn');
    
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        btn.textContent = '☀️ Açık Mod';
        localStorage.setItem('ekonomi_sim_theme', 'dark');
    } else {
        body.classList.add('light-mode');
        btn.textContent = '🌙 Koyu Mod';
        localStorage.setItem('ekonomi_sim_theme', 'light');
    }
    
    // Grafikleri yeniden çiz (renk kontrastı için)
    drawCharts();
}

function loadTheme() {
    const savedTheme = localStorage.getItem('ekonomi_sim_theme') || 'dark';
    const body = document.body;
    const btn = document.getElementById('theme-toggle-btn');
    
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        btn.textContent = '🌙 Koyu Mod';
    } else {
        body.classList.remove('light-mode');
        btn.textContent = '☀️ Açık Mod';
    }
}

// --- BÖLÜM 1: KİMLİK DOĞRULAMA (AUTH) MANTIĞI ---

function showAuthScreen() {
    currentUser = null;
    document.getElementById('screen-auth').style.display = 'flex';
    document.getElementById('screen-welcome').style.display = 'none';
    document.getElementById('screen-game').style.display = 'none';
    document.getElementById('header-user-info').style.display = 'none';
    
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('register-username').value = '';
    document.getElementById('register-password').value = '';
    document.getElementById('register-password-confirm').value = '';
    
    hideAlerts();
}

function hideAlerts() {
    document.getElementById('auth-error').style.display = 'none';
    document.getElementById('auth-success').style.display = 'none';
}

function toggleAuthTab(tab) {
    hideAlerts();
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');
    
    if (tab === 'login') {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        formLogin.style.display = 'block';
        formRegister.style.display = 'none';
    } else {
        tabLogin.classList.remove('active');
        tabRegister.classList.add('active');
        formLogin.style.display = 'none';
        formRegister.style.display = 'block';
    }
}

function handleAuthSubmit(event, action) {
    event.preventDefault();
    hideAlerts();
    
    const errorBox = document.getElementById('auth-error');
    const successBox = document.getElementById('auth-success');
    
    let users = JSON.parse(localStorage.getItem('ekonomi_sim_users') || '{}');
    
    if (action === 'register') {
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-password-confirm').value;
        
        if (username.length < 3) {
            errorBox.textContent = "Kullanıcı adı en az 3 karakter olmalıdır!";
            errorBox.style.display = 'block';
            return;
        }
        if (password.length < 4) {
            errorBox.textContent = "Şifre en az 4 karakter olmalıdır!";
            errorBox.style.display = 'block';
            return;
        }
        if (password !== confirmPassword) {
            errorBox.textContent = "Girdiğiniz şifreler eşleşmiyor!";
            errorBox.style.display = 'block';
            return;
        }
        if (users[username.toLowerCase()]) {
            errorBox.textContent = "Bu kullanıcı adı zaten alınmış!";
            errorBox.style.display = 'block';
            return;
        }
        
        users[username.toLowerCase()] = {
            displayName: username,
            password: password
        };
        localStorage.setItem('ekonomi_sim_users', JSON.stringify(users));
        
        successBox.textContent = "Kayıt başarıyla tamamlandı! Giriş yapabilirsiniz.";
        successBox.style.display = 'block';
        
        document.getElementById('register-username').value = '';
        document.getElementById('register-password').value = '';
        document.getElementById('register-password-confirm').value = '';
        setTimeout(() => {
            toggleAuthTab('login');
            document.getElementById('login-username').value = username;
        }, 1200);
        
    } else if (action === 'login') {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        
        const userObj = users[username.toLowerCase()];
        if (!userObj || userObj.password !== password) {
            errorBox.textContent = "Hatalı kullanıcı adı veya şifre!";
            errorBox.style.display = 'block';
            return;
        }
        
        loginUser(userObj.displayName);
    }
}

function loginUser(displayName) {
    currentUser = displayName;
    
    document.getElementById('display-username').textContent = currentUser;
    document.getElementById('header-user-info').style.display = 'flex';
    document.getElementById('screen-auth').style.display = 'none';
    document.getElementById('screen-welcome').style.display = 'flex';
    
    checkSavedGame();
    loadHighScores();
    
    showStatusBarAlert(`👋 Hoş geldin Başkan ${currentUser}! Yönetmek için bir ülke seçin.`);
}

function logoutUser() {
    if (gameState.active) {
        if (!confirm("Devam eden oyununuz kaydedilecektir. Çıkmak istiyor musunuz?")) {
            return;
        }
        saveGameToStorage();
    }
    
    gameState.active = false;
    showAuthScreen();
}

// --- BÖLÜM 2: OYUN KURULUMU VE MANTIĞI ---

function initWelcomeScreen() {
    const grid = document.getElementById('country-cards-grid');
    grid.innerHTML = '';
    
    Object.values(COUNTRIES).forEach(country => {
        const card = document.createElement('div');
        card.className = 'glass-panel country-card';
        card.dataset.id = country.id;
        card.onclick = () => selectCountry(country.id);
        
        card.innerHTML = `
            <div class="country-flag">${country.flag}</div>
            <h3 class="country-name">${country.name}</h3>
            <span class="country-difficulty ${country.diffClass}">${country.difficulty} Seviye</span>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem; min-height: 60px;">
                ${country.desc}
            </p>
            <div class="country-specs">
                <div class="country-specs-item">
                    <span>Başlangıç Enflasyonu:</span>
                    <span class="country-specs-val">%${country.initial.inflation.toFixed(1)}</span>
                </div>
                <div class="country-specs-item">
                    <span>Başlangıç İşsizliği:</span>
                    <span class="country-specs-val">%${country.initial.unemployment.toFixed(1)}</span>
                </div>
                <div class="country-specs-item">
                    <span>Dış Rezervler:</span>
                    <span class="country-specs-val">${country.initial.reserves.toFixed(1)} Milyar $</span>
                </div>
                <div class="country-specs-item">
                    <span>Mevcut Faiz:</span>
                    <span class="country-specs-val">%${country.initial.interestRate.toFixed(1)}</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function selectCountry(countryId) {
    document.querySelectorAll('.country-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`.country-card[data-id="${countryId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
    }
    
    gameState.selectedCountry = countryId;
    document.getElementById('btn-start-game').removeAttribute('disabled');
}

function startGame() {
    if (!gameState.selectedCountry || !currentUser) return;
    
    const countryData = COUNTRIES[gameState.selectedCountry];
    
    gameState.active = true;
    gameState.turn = 1;
    gameState.inflation = countryData.initial.inflation;
    gameState.unemployment = countryData.initial.unemployment;
    gameState.gdpGrowth = countryData.initial.gdpGrowth;
    gameState.satisfaction = countryData.initial.satisfaction;
    gameState.reserves = countryData.initial.reserves;
    gameState.gdp = countryData.initial.gdp;
    gameState.interestRate = countryData.initial.interestRate;
    gameState.taxRate = countryData.initial.taxRate;
    gameState.spendingLevel = countryData.initial.spendingLevel;
    gameState.minWageLevel = countryData.initial.minWageLevel;
    gameState.history = [];
    gameState.eventQueue = [];
    
    saveTurnHistory();
    
    document.getElementById('screen-welcome').style.display = 'none';
    document.getElementById('screen-game').style.display = 'block';
    
    updateControlUI();
    updateDashboardUI();
    drawCharts();
    
    saveGameToStorage();
    
    if (Math.random() > 0.4) {
        triggerRandomEvent();
    }
}

function updateControlUI() {
    const interestSlider = document.getElementById('control-interest');
    interestSlider.value = gameState.interestRate;
    document.getElementById('val-interest').textContent = `%${parseFloat(gameState.interestRate).toFixed(1)}`;
    
    const taxSlider = document.getElementById('control-tax');
    taxSlider.value = gameState.taxRate;
    document.getElementById('val-tax').textContent = `%${parseFloat(gameState.taxRate).toFixed(1)}`;
    
    document.querySelectorAll('#spending-buttons .btn-level').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.level === gameState.spendingLevel) {
            btn.classList.add('active');
        }
    });
    
    document.querySelectorAll('#wage-buttons .btn-level').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.level === gameState.minWageLevel) {
            btn.classList.add('active');
        }
    });
}

function onInterestChange(val) {
    gameState.interestRate = parseFloat(val);
    document.getElementById('val-interest').textContent = `%${gameState.interestRate.toFixed(1)}`;
}

// Slider vergi değişimi
function onTaxChange(val) {
    gameState.taxRate = parseFloat(val);
    document.getElementById('val-tax').textContent = `%${gameState.taxRate.toFixed(1)}`;
}

function selectSpending(level) {
    gameState.spendingLevel = level;
    document.querySelectorAll('#spending-buttons .btn-level').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.level === level) {
            btn.classList.add('active');
        }
    });
}

function selectWage(level) {
    gameState.minWageLevel = level;
    document.querySelectorAll('#wage-buttons .btn-level').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.level === level) {
            btn.classList.add('active');
        }
    });
}

function updateDashboardUI() {
    const country = COUNTRIES[gameState.selectedCountry];
    
    document.getElementById('info-country-flag').textContent = country.flag;
    document.getElementById('info-country-name').textContent = country.name;
    document.getElementById('info-turn').textContent = `Yıl ${Math.ceil(gameState.turn / 4)}, Çeyrek ${(gameState.turn - 1) % 4 + 1}`;
    
    const infCard = document.getElementById('card-inflation');
    const infValEl = document.getElementById('val-inflation');
    const infTrendEl = document.getElementById('trend-inflation');
    infValEl.textContent = `%${gameState.inflation.toFixed(2)}`;
    updateMetricTrendUI(infTrendEl, 'inflation');
    updateMetricStatusColor(infCard, gameState.inflation, [5.0, 15.0, 50.0], true);
    
    const unempCard = document.getElementById('card-unemployment');
    const unempValEl = document.getElementById('val-unemployment');
    const unempTrendEl = document.getElementById('trend-unemployment');
    unempValEl.textContent = `%${gameState.unemployment.toFixed(2)}`;
    updateMetricTrendUI(unempTrendEl, 'unemployment');
    updateMetricStatusColor(unempCard, gameState.unemployment, [5.0, 10.0, 20.0], true);
    
    const growthCard = document.getElementById('card-growth');
    const growthValEl = document.getElementById('val-growth');
    const growthTrendEl = document.getElementById('trend-gdpGrowth');
    growthValEl.textContent = `%${gameState.gdpGrowth.toFixed(2)}`;
    updateMetricTrendUI(growthTrendEl, 'gdpGrowth');
    updateMetricStatusColor(growthCard, gameState.gdpGrowth, [1.0, 3.0, 6.0], false);
    
    const satCard = document.getElementById('card-satisfaction');
    const satValEl = document.getElementById('val-satisfaction');
    const satBarFill = document.getElementById('sat-bar-fill');
    satValEl.textContent = `%${gameState.satisfaction.toFixed(0)}`;
    satBarFill.style.width = `${gameState.satisfaction}%`;
    updateMetricStatusColor(satCard, gameState.satisfaction, [30.0, 50.0, 80.0], false);
    
    const resValEl = document.getElementById('val-reserves');
    resValEl.textContent = `${gameState.reserves.toFixed(1)} Milyar $`;
    if (gameState.reserves < 0) {
        resValEl.style.color = 'var(--color-danger)';
    } else {
        resValEl.style.color = 'var(--text-main)';
    }
    
    calculateBudgetDetailsUI();
    renderTurnLogs();
}

function updateMetricTrendUI(element, metricName) {
    if (gameState.history.length < 2) {
        element.className = 'trend-badge trend-stable';
        element.innerHTML = '● Sabit';
        return;
    }
    
    const prevVal = gameState.history[gameState.history.length - 2][metricName];
    const currVal = gameState.history[gameState.history.length - 1][metricName];
    const diff = currVal - prevVal;
    
    if (Math.abs(diff) < 0.05) {
        element.className = 'trend-badge trend-stable';
        element.innerHTML = '● Stabil';
    } else if (diff > 0) {
        element.className = 'trend-badge trend-up';
        element.innerHTML = `▲ +${diff.toFixed(1)}`;
    } else {
        element.className = 'trend-badge trend-down';
        element.innerHTML = `▼ ${diff.toFixed(1)}`;
    }
}

function updateMetricStatusColor(cardElement, value, thresholds, lowerIsBetter) {
    cardElement.style.boxShadow = '';
    cardElement.style.borderColor = 'var(--border-color)';
    
    if (lowerIsBetter) {
        if (value < thresholds[0]) {
            cardElement.style.borderColor = 'rgba(16, 185, 129, 0.4)';
            cardElement.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.1)';
        } else if (value < thresholds[1]) {
            // Normal
        } else if (value < thresholds[2]) {
            cardElement.style.borderColor = 'rgba(245, 158, 11, 0.4)';
            cardElement.style.boxShadow = '0 0 10px rgba(245, 158, 11, 0.1)';
        } else {
            cardElement.style.borderColor = 'rgba(239, 68, 68, 0.5)';
            cardElement.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.2)';
        }
    } else {
        if (value < thresholds[0]) {
            cardElement.style.borderColor = 'rgba(239, 68, 68, 0.5)';
            cardElement.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.2)';
        } else if (value < thresholds[1]) {
            cardElement.style.borderColor = 'rgba(245, 158, 11, 0.4)';
        } else {
            cardElement.style.borderColor = 'rgba(16, 185, 129, 0.4)';
            cardElement.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.1)';
        }
    }
}

function calculateBudgetDetailsUI() {
    const gdpQuarter = (gameState.gdp / 4);
    
    const taxRevenue = gdpQuarter * (gameState.taxRate / 100) * 0.9; 
    
    let spendingCoeff = 0.05;
    if (gameState.spendingLevel === 'medium') spendingCoeff = 0.10;
    if (gameState.spendingLevel === 'high') spendingCoeff = 0.16;
    const publicExpenditure = gdpQuarter * spendingCoeff;
    
    let wageCoeff = 2.0;
    if (gameState.minWageLevel === 'medium') wageCoeff = 5.0;
    if (gameState.minWageLevel === 'high') wageCoeff = 10.0;
    
    const netBalance = taxRevenue - publicExpenditure - wageCoeff;
    
    document.getElementById('budget-revenue').textContent = `+${taxRevenue.toFixed(1)} B$`;
    document.getElementById('budget-expenses').textContent = `-${(publicExpenditure + wageCoeff).toFixed(1)} B$`;
    
    const balanceEl = document.getElementById('budget-balance-net');
    if (netBalance >= 0) {
        balanceEl.textContent = `+${netBalance.toFixed(1)} B$ (Fazla)`;
        balanceEl.style.color = 'var(--color-success)';
    } else {
        balanceEl.textContent = `${netBalance.toFixed(1)} B$ (Açık)`;
        balanceEl.style.color = 'var(--color-danger)';
    }
}

function renderTurnLogs() {
    const list = document.getElementById('history-log-list');
    list.innerHTML = '';
    
    if (gameState.history.length <= 1) {
        list.innerHTML = '<div style="color: var(--text-muted); font-style: italic; padding: 1rem 0;">Henüz karar geçmişi bulunmuyor.</div>';
        return;
    }
    
    for (let i = gameState.history.length - 1; i > 0; i--) {
        const item = gameState.history[i];
        const prevItem = gameState.history[i - 1];
        
        const infDiff = item.inflation - prevItem.inflation;
        const satDiff = item.satisfaction - prevItem.satisfaction;
        
        const log = document.createElement('div');
        log.className = 'log-item';
        
        let actionsSummary = `Faiz: %${item.interestRate.toFixed(1)} | Vergi: %${item.taxRate.toFixed(1)}`;
        
        log.innerHTML = `
            <div>
                <span class="log-turn">Dönem ${i}:</span>
                <span class="log-text">${actionsSummary}</span>
            </div>
            <div class="log-impact">
                <span style="color: ${infDiff >= 0 ? 'var(--color-danger)' : 'var(--color-success)'}">
                    Enflasyon: ${infDiff >= 0 ? '+' : ''}${infDiff.toFixed(1)}%
                </span>
                &nbsp;|&nbsp;
                <span style="color: ${satDiff >= 0 ? 'var(--color-success)' : 'var(--color-danger)'}">
                    Memnuniyet: ${satDiff >= 0 ? '+' : ''}${satDiff.toFixed(0)}%
                </span>
            </div>
        `;
        list.appendChild(log);
    }
}

function completeQuarter() {
    if (!gameState.active) return;
    
    const interest = gameState.interestRate;
    const tax = gameState.taxRate;
    const spending = gameState.spendingLevel;
    const wage = gameState.minWageLevel;
    
    let spendingVal = 1;
    if (spending === 'low') spendingVal = 0.5;
    if (spending === 'high') spendingVal = 2.0;
    
    let wageVal = 1;
    if (wage === 'low') wageVal = 0.4;
    if (wage === 'high') wageVal = 2.2;
    
    let inflationDelta = (spendingVal * 2.2) + (wageVal * 3.5) - (interest * 0.22) - (tax * 0.12);
    inflationDelta += 0.8; 
    
    let unemploymentDelta = (interest * 0.12) + (tax * 0.1) - (gameState.gdpGrowth * 0.35) - (spendingVal * 1.5);
    
    let inflationPenalty = 0;
    if (gameState.inflation > 15) {
        inflationPenalty = (gameState.inflation - 15) * 0.08;
    }
    if (gameState.inflation < 1) {
        inflationPenalty = (1 - gameState.inflation) * 0.5;
    }
    
    let newGrowth = 4.5 + (spendingVal * 1.8) - (interest * 0.08) - (tax * 0.15) - inflationPenalty;
    
    let satisfactionDelta = (newGrowth * 0.8) 
                            - (gameState.inflation * 0.35) 
                            - (gameState.unemployment * 0.6) 
                            - (tax * 0.25) 
                            + (spendingVal * 2.5) 
                            + (wageVal * 4.0);
    satisfactionDelta += 3.0; 
    
    const gdpQuarter = (gameState.gdp / 4);
    const taxRevenue = gdpQuarter * (tax / 100) * 0.9;
    const publicExpenditure = gdpQuarter * (spendingVal * 0.08);
    const wageSupport = wageVal * 4.5;
    const netBalance = taxRevenue - publicExpenditure - wageSupport;
    
    gameState.inflation += inflationDelta;
    gameState.unemployment += unemploymentDelta;
    gameState.gdpGrowth = newGrowth;
    gameState.satisfaction += satisfactionDelta;
    gameState.reserves += netBalance;
    gameState.gdp = gameState.gdp * (1 + (gameState.gdpGrowth / 100) / 4);
    
    if (gameState.inflation < -2.0) gameState.inflation = -2.0;
    if (gameState.inflation > 200.0) gameState.inflation = 200.0;
    
    if (gameState.unemployment < 1.5) gameState.unemployment = 1.5;
    if (gameState.unemployment > 40.0) gameState.unemployment = 40.0;
    
    if (gameState.satisfaction < 0) gameState.satisfaction = 0;
    if (gameState.satisfaction > 100) gameState.satisfaction = 100;
    
    gameState.turn += 1;
    saveTurnHistory();
    
    if (checkGameOver()) {
        return;
    }
    
    if (gameState.reserves < 0 && gameState.reserves > -30) {
        showStatusBarAlert("⚠️ Ülke borçlanıyor! Hazine rezervleri negatife düştü. Dikkat edin!");
    }
    
    updateDashboardUI();
    drawCharts();
    saveGameToStorage();
    
    if (Math.random() > 0.5) {
        triggerRandomEvent();
    }
}

function saveTurnHistory() {
    gameState.history.push({
        turn: gameState.turn,
        inflation: gameState.inflation,
        unemployment: gameState.unemployment,
        gdpGrowth: gameState.gdpGrowth,
        satisfaction: gameState.satisfaction,
        reserves: gameState.reserves,
        interestRate: gameState.interestRate,
        taxRate: gameState.taxRate
    });
}

// --- BÖLÜM 3: RASTGELE OLAY YÖNETİMİ ---
let activeEvent = null;

function triggerRandomEvent() {
    const randomIndex = Math.floor(Math.random() * RANDOM_EVENTS.length);
    activeEvent = RANDOM_EVENTS[randomIndex];
    
    const backdrop = document.getElementById('modal-event');
    const titleEl = document.getElementById('event-title');
    const descEl = document.getElementById('event-desc');
    const iconEl = document.getElementById('event-icon');
    const choicesContainer = document.getElementById('event-choices');
    
    iconEl.textContent = activeEvent.icon;
    titleEl.textContent = activeEvent.title;
    descEl.textContent = activeEvent.desc;
    
    choicesContainer.innerHTML = '';
    
    activeEvent.choices.forEach((choice, index) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.onclick = () => selectEventChoice(index);
        
        btn.innerHTML = `
            <span class="choice-title">${choice.title}</span>
            <span class="choice-desc">${choice.desc}</span>
            <div class="event-impacts">
                <span class="event-impact-item">💥 Etki: ${choice.impactDesc}</span>
            </div>
        `;
        choicesContainer.appendChild(btn);
    });
    
    backdrop.style.display = 'flex';
}

function selectEventChoice(choiceIndex) {
    if (!activeEvent) return;
    
    const choice = activeEvent.choices[choiceIndex];
    const resultMessage = choice.effect(gameState);
    
    document.getElementById('modal-event').style.display = 'none';
    
    showEventResultPopup(activeEvent.title, resultMessage);
    
    activeEvent = null;
    
    if (gameState.inflation < -2.0) gameState.inflation = -2.0;
    if (gameState.unemployment < 1.5) gameState.unemployment = 1.5;
    if (gameState.satisfaction < 0) gameState.satisfaction = 0;
    if (gameState.satisfaction > 100) gameState.satisfaction = 100;
    
    updateDashboardUI();
    drawCharts();
    saveGameToStorage();
    
    checkGameOver();
}

function showEventResultPopup(eventTitle, message) {
    const backdrop = document.getElementById('modal-result');
    document.getElementById('result-title').textContent = eventTitle + ' Sonucu';
    document.getElementById('result-desc').textContent = message;
    backdrop.style.display = 'flex';
}

function closeResultModal() {
    document.getElementById('modal-result').style.display = 'none';
}

// --- BÖLÜM 4: OYUN BİTİŞ KONTROLÜ ---
function checkGameOver() {
    let gameOver = false;
    let title = "";
    let message = "";
    
    if (gameState.satisfaction < 10) {
        gameOver = true;
        title = "❌ ERKEN SEÇİM VE HALK İSYANI!";
        message = `Halk memnuniyeti %10'un altına düştü. Geniş çaplı grevler ve meclis kararı ile görevden alındınız, ülkeyi erken seçime götürdünüz. Oyuncu <b>${currentUser}</b> bu tur başarısız oldu.`;
    }
    else if (gameState.reserves < -(gameState.gdp * 0.15)) {
        gameOver = true;
        title = "❌ DEVLET İFLASI VE MORATORYUM!";
        message = `Hazine rezervleriniz bütçe borçlanma limitini aştı (${gameState.reserves.toFixed(1)} Milyar $). Oyuncu <b>${currentUser}</b> moratoryum ilan etmek zorunda kaldı ve IMF yönetimi devraldı.`;
    }
    else if (gameState.inflation > 120.0) {
        gameOver = true;
        title = "❌ HİPERENFLASYON ÇÖKÜŞÜ!";
        message = `Enflasyon %120 sınırını aşarak hiperenflasyon sarmalına dönüştü. Oyuncu <b>${currentUser}</b> para birimini ve piyasayı tamamen çökertti.`;
    }
    else if (gameState.turn > 20) {
        gameOver = true;
        title = "🏆 BAŞARILI 5 YIL! (ZAFER)";
        
        let score = (gameState.satisfaction * 3) + (gameState.gdpGrowth * 10) + (gameState.reserves * 0.2) - (gameState.inflation * 1.5) - (gameState.unemployment * 2.0);
        if (score < 0) score = 100;
        
        message = `Tebrikler Başkan <b>${currentUser}</b>! 5 yıllık görev süresini başarıyla tamamladınız.<br><br>
        <b>Nihai Göstergeleriniz:</b><br>
        • Toplumsal Memnuniyet: %${gameState.satisfaction.toFixed(0)}<br>
        • Enflasyon: %${gameState.inflation.toFixed(1)}<br>
        • İşsizlik: %${gameState.unemployment.toFixed(1)}<br>
        • Hazine Rezervleri: ${gameState.reserves.toFixed(1)} Milyar $<br><br>
        <b>Ekonomik Başarı Puanınız: ${score.toFixed(0)} Puan!</b>`;
        
        saveScore(score);
    }
    
    if (gameOver) {
        gameState.active = false;
        
        localStorage.removeItem(`ekonomi_sim_save_${currentUser.toLowerCase()}`);
        
        const backdrop = document.getElementById('modal-gameover');
        document.getElementById('gameover-title').textContent = title;
        document.getElementById('gameover-desc').innerHTML = message;
        backdrop.style.display = 'flex';
        return true;
    }
    return false;
}

function quitGame() {
    document.getElementById('modal-gameover').style.display = 'none';
    document.getElementById('modal-event').style.display = 'none';
    document.getElementById('modal-result').style.display = 'none';
    
    gameState.active = false;
    document.getElementById('screen-game').style.display = 'none';
    document.getElementById('screen-welcome').style.display = 'flex';
    
    initWelcomeScreen();
    loadHighScores();
    checkSavedGame();
}

// --- BÖLÜM 5: SVG TABANLI GRAFİK ÇİZİMİ ---
function drawCharts() {
    if (gameState.history.length === 0) return;
    
    const svg = document.getElementById('trend-svg');
    svg.innerHTML = '';
    
    const width = svg.clientWidth || 600;
    const height = svg.clientHeight || 200;
    const padding = 20;
    
    const maxPoints = Math.max(10, gameState.history.length);
    const xStep = (width - padding * 2) / (maxPoints - 1);
    
    const yMin = 0;
    const yMax = 100;
    
    const getSvgY = (val) => {
        let safeVal = Math.min(yMax, Math.max(yMin, val));
        return height - padding - ((safeVal - yMin) / (yMax - yMin)) * (height - padding * 2);
    };
    
    let infPoints = [];
    let unempPoints = [];
    let satPoints = [];
    
    gameState.history.forEach((h, index) => {
        const x = padding + index * xStep;
        infPoints.push(`${x},${getSvgY(h.inflation)}`);
        unempPoints.push(`${x},${getSvgY(h.unemployment)}`);
        satPoints.push(`${x},${getSvgY(h.satisfaction)}`);
    });
    
    const gridLines = [25, 50, 75];
    gridLines.forEach(lineVal => {
        const y = getSvgY(lineVal);
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', padding);
        line.setAttribute('y1', y);
        line.setAttribute('x2', width - padding);
        line.setAttribute('y2', y);
        
        // Açık/koyu mod için kılavuz çizgisi rengini dinamik kıl
        const isLight = document.body.classList.contains('light-mode');
        line.setAttribute('stroke', isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)');
        line.setAttribute('stroke-dasharray', '4');
        svg.appendChild(line);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', padding - 5);
        text.setAttribute('y', y + 3);
        text.setAttribute('fill', 'var(--text-muted)');
        text.setAttribute('font-size', '9px');
        text.setAttribute('text-anchor', 'end');
        text.textContent = `%${lineVal}`;
        svg.appendChild(text);
    });
    
    if (infPoints.length > 1) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${infPoints.join(' L ')}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'var(--color-danger)');
        path.setAttribute('stroke-width', '2.5');
        path.setAttribute('stroke-linecap', 'round');
        svg.appendChild(path);
    }
    
    if (unempPoints.length > 1) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${unempPoints.join(' L ')}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'var(--color-warning)');
        path.setAttribute('stroke-width', '2.5');
        path.setAttribute('stroke-linecap', 'round');
        svg.appendChild(path);
    }
    
    if (satPoints.length > 1) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${satPoints.join(' L ')}`);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'var(--color-success)');
        path.setAttribute('stroke-width', '3');
        path.setAttribute('stroke-linecap', 'round');
        svg.appendChild(path);
    }
    
    if (gameState.history.length > 0) {
        const lastIdx = gameState.history.length - 1;
        const lastHist = gameState.history[lastIdx];
        const lastX = padding + lastIdx * xStep;
        
        const satCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        satCircle.setAttribute('cx', lastX);
        satCircle.setAttribute('cy', getSvgY(lastHist.satisfaction));
        satCircle.setAttribute('r', '5');
        satCircle.setAttribute('fill', 'var(--color-success)');
        satCircle.setAttribute('stroke', '#fff');
        satCircle.setAttribute('stroke-width', '1.5');
        svg.appendChild(satCircle);
    }
}

window.addEventListener('resize', drawCharts);

// --- BÖLÜM 6: VERİ KAYDETME VE SKOR YÖNETİMİ ---

function saveScore(score) {
    const country = COUNTRIES[gameState.selectedCountry];
    const scoreItem = {
        username: currentUser,
        countryName: country.name,
        flag: country.flag,
        score: Math.round(score),
        date: new Date().toLocaleDateString('tr-TR')
    };
    
    let scores = JSON.parse(localStorage.getItem('ekonomi_sim_scores') || '[]');
    scores.push(scoreItem);
    
    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 5);
    
    localStorage.setItem('ekonomi_sim_scores', JSON.stringify(scores));
}

function loadHighScores() {
    const list = document.getElementById('high-scores-list');
    list.innerHTML = '';
    
    const scores = JSON.parse(localStorage.getItem('ekonomi_sim_scores') || '[]');
    
    if (scores.length === 0) {
        list.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">Henüz kayıtlı yüksek skor yok. 5 yıl dayanarak ilk skoru sen yap!</td></tr>';
        return;
    }
    
    scores.forEach((s, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><b>#${idx + 1}</b></td>
            <td style="color: var(--color-primary); font-weight: 600;">${s.username || 'Misafir'}</td>
            <td>${s.flag} ${s.countryName}</td>
            <td style="color: var(--color-secondary); font-weight: 700;">${s.score}</td>
            <td style="color: var(--text-muted); font-size: 0.8rem;">${s.date}</td>
        `;
        list.appendChild(tr);
    });
}

function saveGameToStorage() {
    if (!currentUser) return;
    localStorage.setItem(`ekonomi_sim_save_${currentUser.toLowerCase()}`, JSON.stringify(gameState));
}

function checkSavedGame() {
    if (!currentUser) return;
    const saved = localStorage.getItem(`ekonomi_sim_save_${currentUser.toLowerCase()}`);
    const continueBtn = document.getElementById('btn-continue-game');
    
    if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.active) {
            continueBtn.style.display = 'inline-flex';
            return;
        }
    }
    continueBtn.style.display = 'none';
}

function loadSavedGame() {
    if (!currentUser) return;
    const saved = localStorage.getItem(`ekonomi_sim_save_${currentUser.toLowerCase()}`);
    if (!saved) return;
    
    gameState = JSON.parse(saved);
    
    document.getElementById('screen-welcome').style.display = 'none';
    document.getElementById('screen-game').style.display = 'block';
    
    updateControlUI();
    updateDashboardUI();
    drawCharts();
    
    showStatusBarAlert("💾 Kayıtlı oyununuz başarıyla yüklendi! İyi şanslar.");
}

function resetHighScores() {
    if (confirm("Tüm en yüksek skorlar sıfırlanacaktır. Emin misiniz?")) {
        localStorage.removeItem('ekonomi_sim_scores');
        initDefaultHighScores(); // Varsayılan skorları geri yükle
        loadHighScores();
    }
}

function showStatusBarAlert(msg) {
    const container = document.getElementById('status-bar-alert-container');
    container.innerHTML = `<div class="status-pill" style="animation: scaleUp 0.25s ease; border-color: var(--color-primary); background: var(--color-primary-glow)">
        <span>${msg}</span>
    </div>`;
    
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}
