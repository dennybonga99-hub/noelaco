// ====================================================================
// Nó&Laço - script.js (Production Ready & Bug Fixed)
// ====================================================================

// ====================================================================
// CONFIGURAÇÃO
// ====================================================================
const CONFIG = {
    CLOUDINARY_CLOUD_NAME: 'ddjpvbggk',
    CLOUDINARY_UPLOAD_PRESET: 'nodelaco_preset',
    ADMIN_WHATSAPP_NUMBERS: [
        '258873319854',   // Admin principal
        '258878384914'    // Admin secundário
    ],
    ADMIN_WHATSAPP_NUMBER: '258873319854',
    CURRENCY_SYMBOL: 'MZN',
    VALID_MZ_PREFIXES: ['82', '83', '84', '85', '86', '87'],
    ADMIN_HASH: 'MTIzNDU2', 
    VERSION_URL: "https://dennybonga99-hub.github.io/noelaco/version.json",
    APP_VERSION: "1.0.2"
};

const state = {
    user: JSON.parse(localStorage.getItem('currentUser')) || null,
    get isAdmin() {
        return this.user && this.user.role === 'admin';
    },
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    favorites: JSON.parse(localStorage.getItem('favorites')) || [], 
    products: [],
    currentCategory: 'all', 
    searchTerm: '', 
    currentLanguage: localStorage.getItem('appLang') || 'pt',
    navigationHistory: [],
    profilePictureFile: null,
    productToEdit: null,
    originalImageFile: null,
    imageSettings: { maxWidth: 800, quality: 0.85 },
    lastScrollPosition: 0,
    carouselInterval: null,
    adminView: 'products', // 'products' ou 'orders'
    map: null,
    mapMarker: null,
    selectedLocation: null,
    deliveryCoordinates: null // Armazena {lat, lng} para o link do WhatsApp
};

// ====================================================================
// HELPERS
// ====================================================================
const getUI = () => ({
    loadingModal: document.getElementById('loading-modal'),
    loadingMessage: document.getElementById('loading-message'),
    notificationMessage: document.getElementById('notification-message'),
    loginSection: document.getElementById('login-section'),
    mainAppSection: document.getElementById('main-app-section'),
    backButton: document.getElementById('back-button'),
    cartButton: document.getElementById('cart-button'),
    cartItemCount: document.getElementById('cart-item-count'),
    adminButton: document.getElementById('admin-button'),
    settingsButton: document.getElementById('settings-button'),
    searchInput: document.getElementById('search-input'),
    userProfilePic: document.getElementById('user-profile-pic'),
    userProfileName: document.getElementById('user-profile-name'),
    productGrid: document.getElementById('product-grid'),
    categoryFilters: document.getElementById('category-filters'),
    productDetailContent: document.getElementById('product-detail-screen'),
    cartModal: document.getElementById('cart-modal'),
    cartPanel: document.getElementById('cart-panel'),
    cartItemsContainer: document.getElementById('cart-items'),
    cartTotal: document.getElementById('cart-total'),
    checkoutButton: document.getElementById('checkout-button'),
    adminLoginModal: document.getElementById('admin-login-modal'),
    userProfileContainer: document.getElementById('user-profile-container'),
    // Elementos do Formulário de Login
    registrationForm: document.getElementById('registration-form'),
    profilePictureInput: document.getElementById('profile-picture'),
    screens: {
        home: document.getElementById('home-screen'),
        products: document.getElementById('products-screen'),
        'product-detail': document.getElementById('product-detail-screen'),
        settings: document.getElementById('settings-screen'),
        admin: document.getElementById('admin-screen'),
        profile: document.getElementById('profile-screen'),
    }
});

// Helper de Modal Robusto
function openModal(modalId, panelId = null) {
    const modal = document.getElementById(modalId);
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!modal) return;

    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
        modal.classList.remove('opacity-0');
        if (panel) {
            panel.classList.remove('translate-x-full', 'scale-95');
        }
    });
}

function closeModal(modalId, panelId = null) {
    const modal = document.getElementById(modalId);
    const panel = panelId ? document.getElementById(panelId) : null;
    if (!modal) return;

    modal.classList.add('opacity-0');
    if (panel) {
        panel.classList.add('translate-x-full', 'scale-95');
    }
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

function formatMoney(amount) {
    const num = parseFloat(amount);
    if (isNaN(num)) return 'MZN 0.00';
    return new Intl.NumberFormat('pt-MZ', {
        style: 'currency',
        currency: 'MZN'
    }).format(num);
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function toggleLoading(show, messageKey = 'loading') {
    const UI = getUI();
    if (!UI.loadingModal || !UI.loadingMessage) return;

    if (show) {
        UI.loadingMessage.textContent = translations[state.currentLanguage]?.[messageKey] || messageKey;
        UI.loadingModal.classList.remove('hidden', 'opacity-0');
    } else {
        UI.loadingModal.classList.add('opacity-0');
        setTimeout(() => UI.loadingModal.classList.add('hidden'), 300);
    }
}

function showNotification(message, type = 'info') {
    const el = document.getElementById('notification-message');
    if (!el) return;

    el.textContent = message;
    el.className = `fixed bottom-6 right-6 p-4 text-white rounded-xl shadow-lg transition-all duration-300 transform z-[110]`;
    
    let colorClass = 'bg-blue-500';
    if (type === 'success') colorClass = 'bg-green-500';
    if (type === 'error') colorClass = 'bg-red-500';
    
    el.classList.add(colorClass);
    el.classList.remove('hidden', 'translate-x-full', 'opacity-0');

    setTimeout(() => {
        el.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => el.classList.add('hidden'), 300);
    }, 4000);
}

// ====================================================================
// TRADUÇÕES
// ====================================================================
const translations = {
    pt: {
        'app-title': 'Nó&Laço - Loja Online',
        'login-title': 'Cadastre-se para Comprar!',
        'profile-picture-label': 'Foto de Perfil',
        'upload-photo': 'Carregar foto',
        'full-name-label': 'Nome Completo',
        'phone-number-label': 'Número de Telefone',
        'login-button': 'Entrar/Registrar',
        'loading': 'Processando...',
        'search-placeholder': 'Buscar produtos...',
        'your-cart-title': 'Seu Carrinho',
        'total-label': 'Total:',
        'checkout-button': 'Finalizar Compra',
        'admin-access-title': 'Acesso de Administrador',
        'admin-code-label': 'Código Secreto',
        'add-new-product-title': 'Adicionar Novo Produto',
        'edit-product-title': 'Editar Produto',
        'add-product-button': 'Adicionar Produto',
        'save-changes-button': 'Salvar Alterações',
        'profile-title': 'Meu Perfil',
        'save-profile-button': 'Salvar Alterações',
        'addresses-title': 'Meus Endereços',
        'logout-button-settings': 'Sair',
        'theme-label': 'Tema Escuro',
        'language-label': 'Idioma',
        'view-all-products': 'Ver Todos os Produtos',
        'featured-title': '✨ Destaques da Semana ✨',
        'all-products-title': 'Todos os Produtos',
        'add-to-cart-btn': 'Adicionar ao Carrinho',
        'address-label': 'Confirme sua localização para a entrega',
        'confirm-order-title': 'Confirmar Pedido',
        'confirm-order-message': 'Seu pedido será enviado via WhatsApp para a finalização e confirmação dos detalhes. Continuar?',
        'cancel-button': 'Cancelar',
        'whatsapp-send-button': 'Enviar por WhatsApp',
        'settings-title': 'Configurações',
        'favorites-title': 'Meus Favoritos',
        'all-category': 'Todos',
        'orders-history-title': 'Meus Pedidos',
        'no-orders-message': 'Você ainda não fez nenhum pedido.',
        'admin-products-tab': 'Produtos',
        'admin-orders-tab': 'Pedidos'
    },
    en: {
        'app-title': 'Nó&Laço - Online Store',
        'login-title': 'Sign Up to Shop!',
        'profile-picture-label': 'Profile Picture',
        'upload-photo': 'Upload photo',
        'full-name-label': 'Full Name',
        'phone-number-label': 'Phone Number',
        'login-button': 'Log In/Register',
        'loading': 'Processing...',
        'search-placeholder': 'Search products...',
        'your-cart-title': 'Your Cart',
        'total-label': 'Total:',
        'checkout-button': 'Checkout',
        'admin-access-title': 'Admin Access',
        'admin-code-label': 'Secret Code',
        'add-new-product-title': 'Add New Product',
        'edit-product-title': 'Edit Product',
        'add-product-button': 'Add Product',
        'save-changes-button': 'Save Changes',
        'profile-title': 'My Profile',
        'save-profile-button': 'Save Changes',
        'addresses-title': 'My Addresses',
        'logout-button-settings': 'Logout',
        'theme-label': 'Dark Mode',
        'language-label': 'Language',
        'view-all-products': 'View All Products',
        'featured-title': '✨ Weekly Highlights ✨',
        'all-products-title': 'All Products',
        'add-to-cart-btn': 'Add to Cart',
        'address-label': 'Confirm your delivery location',
        'confirm-order-title': 'Confirm Order',
        'confirm-order-message': 'Your order will be sent via WhatsApp for finalization. Continue?',
        'cancel-button': 'Cancel',
        'whatsapp-send-button': 'Send via WhatsApp',
        'settings-title': 'Settings',
        'favorites-title': 'My Favorites',
        'all-category': 'All',
        'orders-history-title': 'Order History',
        'no-orders-message': 'You have not placed any orders yet.',
        'admin-products-tab': 'Products',
        'admin-orders-tab': 'Orders'
    }
};

function setLanguage(lang) {
    state.currentLanguage = lang || 'pt';
    localStorage.setItem('appLang', state.currentLanguage);
    
    document.querySelectorAll('[data-lang]').forEach(el => {
        const key = el.getAttribute('data-lang');
        const text = translations[state.currentLanguage][key];
        if (text) {
            if (el.tagName === 'INPUT') el.placeholder = text;
            else el.textContent = text;
        }
    });
}

function applyTheme(isDark) {
    if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
}

// ====================================================================
// NAVEGAÇÃO & HISTORY API (BOTÃO VOLTAR)
// ====================================================================
function navigateToScreen(screenId, productId = null, isPopState = false) {
    const UI = getUI();
    if (!UI.screens[screenId]) return;

    if (state.navigationHistory[state.navigationHistory.length - 1] === 'products') {
        state.lastScrollPosition = window.scrollY;
    }

    if (state.carouselInterval && screenId !== 'home') {
        clearInterval(state.carouselInterval);
        state.carouselInterval = null;
    }

    Object.values(UI.screens).forEach(s => s.classList.add('hidden'));

    // Atualiza histórico interno
    if (state.navigationHistory[state.navigationHistory.length - 1] !== screenId) {
        state.navigationHistory.push(screenId);
    }
    
    // Atualiza History API do navegador (para botão voltar físico)
    if (!isPopState) {
        const urlHash = `#${screenId}${productId ? '/' + productId : ''}`;
        window.history.pushState({ screen: screenId, productId }, "", urlHash);
    }

    UI.backButton?.classList.toggle('hidden', state.navigationHistory.length <= 1);
    UI.screens[screenId].classList.remove('hidden');

    switch (screenId) {
        case 'home': 
            renderHomeScreen(); 
            window.scrollTo(0, 0);
            break;
        case 'products':
            if (state.navigationHistory.length <= 2) {
                state.currentCategory = 'all';
                state.searchTerm = '';
                if(UI.searchInput) UI.searchInput.value = '';
            }
            if(UI.searchInput) UI.searchInput.value = state.searchTerm;
            renderCategories();
            renderProducts();
            if (isPopState && state.lastScrollPosition > 0) {
                requestAnimationFrame(() => {
                    window.scrollTo({ top: state.lastScrollPosition, behavior: "instant" });
                });
            } else if (!isPopState) {
                window.scrollTo(0, 0);
            }
            break;
        case 'product-detail':
            if (productId) renderProductDetail(productId);
            window.scrollTo(0, 0);
            break;
        case 'settings': renderSettingsScreen(); break;
        case 'admin':
            if (state.isAdmin) renderAdminScreen();
            else navigateToScreen('home', null, true); 
            break;
        case 'profile': renderProfileScreen(); break;
    }
    setLanguage(state.currentLanguage);
}

function goBack() {
    // Usa o botão nativo do navegador para manter consistência
    if (window.history.length > 1) {
        window.history.back();
    } else {
        navigateToScreen('home');
    }
}

// ====================================================================
// MAPS (LEAFLET)
// ====================================================================
function initMap() {
    if (state.map) return;

    // Coordenadas iniciais: Maputo, Moçambique
    const initialLat = -25.9692;
    const initialLng = 32.5732;

    state.map = L.map('map-container').setView([initialLat, initialLng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(state.map);

    const icon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    state.mapMarker = L.marker([initialLat, initialLng], { draggable: true, icon: icon }).addTo(state.map);
    
    // Inicializa coordenadas padrão para que o botão 'Confirmar' funcione sem interação inicial
    reverseGeocode(initialLat, initialLng);

    state.mapMarker.on('dragend', async function(e) {
        const { lat, lng } = e.target.getLatLng();
        await reverseGeocode(lat, lng);
    });

    state.map.on('click', async function(e) {
        const { lat, lng } = e.latlng;
        state.mapMarker.setLatLng([lat, lng]);
        await reverseGeocode(lat, lng);
    });
}

async function searchLocation() {
    const query = document.getElementById('map-search-input').value;
    if (!query) return;

    const btn = document.getElementById('map-search-btn');
    const originalText = btn.textContent;
    btn.textContent = "...";
    btn.disabled = true;

    try {
        const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Mozambique')}`);
        const data = await resp.json();

        if (data && data.length > 0) {
            const { lat, lon } = data[0];
            const newLatLng = [parseFloat(lat), parseFloat(lon)];
            state.map.setView(newLatLng, 15);
            state.mapMarker.setLatLng(newLatLng);
            await reverseGeocode(lat, lon);
        } else {
            alert('Local não encontrado. Tente ser mais específico.');
        }
    } catch (e) {
        console.error(e);
        alert('Erro na busca.');
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

async function reverseGeocode(lat, lng) {
    // Garante que são números e salva no estado para o link do WhatsApp
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    state.deliveryCoordinates = { lat: latNum, lng: lngNum };

    const display = document.getElementById('map-selected-address');
    display.textContent = "Buscando endereço...";
    
    try {
        const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await resp.json();
        const address = data.display_name || `Lat: ${latNum.toFixed(5)}, Lng: ${lngNum.toFixed(5)}`;
        state.selectedLocation = address;
        display.textContent = address;
    } catch (e) {
        state.selectedLocation = `Lat: ${latNum.toFixed(5)}, Lng: ${lngNum.toFixed(5)}`;
        display.textContent = state.selectedLocation;
    }
}

// ====================================================================
// LOGIN & USER
// ====================================================================
async function uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CONFIG.CLOUDINARY_UPLOAD_PRESET);
    try {
        const resp = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
        const data = await resp.json();
        return resp.ok ? data.secure_url : null;
    } catch (e) { return null; }
}

function processImage(file, maxWidth = 800, quality = 0.85) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                let { width, height } = img;
                if (width > maxWidth) {
                    height = Math.round(height * (maxWidth / width));
                    width = maxWidth;
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                canvas.toBlob(blob => resolve(blob), 'image/jpeg', quality);
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
}

async function handleRegistration(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    toggleLoading(true);
    
    try {
        const fullNameInput = document.getElementById('full-name');
        const phoneInput = document.getElementById('phone-number');
        
        const fullName = fullNameInput.value.trim();
        const phoneRaw = phoneInput.value.replace(/\D/g, '');

        if (!fullName || phoneRaw.length !== 12 || phoneRaw.substring(0, 3) !== '258') {
            showNotification('Número inválido. Use formato 258841234567', 'error');
            toggleLoading(false);
            return false;
        }

        let picUrl = 'https://placehold.co/100x100?text=User';
        if (state.profilePictureFile) {
            const blob = await processImage(state.profilePictureFile, 300, 0.8);
            const uploaded = await uploadImage(blob);
            if (uploaded) picUrl = uploaded;
        }

        const { doc, getDoc, setDoc } = window.firebase;
        const userRef = doc(window.db, 'users', phoneRaw);
        const docSnap = await getDoc(userRef);
        const isAdmin = CONFIG.ADMIN_WHATSAPP_NUMBERS.includes(phoneRaw);
        
        let existingData = docSnap.exists() ? docSnap.data() : {};
        
        let userData = {
            ...existingData,
            id: phoneRaw, 
            fullName, 
            phoneNumber: phoneRaw, 
            profilePicture: picUrl,
            role: isAdmin ? 'admin' : (existingData.role || 'user'), 
            createdAt: existingData.createdAt || new Date().toISOString()
        };
        
        await setDoc(userRef, userData);
        
        state.user = userData;
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        initializeAppUI();
        showNotification(`Bem-vindo, ${userData.fullName}!`, 'success');
        
    } catch (err) { 
        console.error(err); 
        showNotification('Erro no registro. Verifique a conexão.', 'error'); 
    } finally { 
        toggleLoading(false); 
    }
    return false;
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    localStorage.setItem('cart', JSON.stringify([]));
    window.location.reload();
}

// ====================================================================
// CORE: PRODUCTS & LISTS
// ====================================================================
function listenToProducts() {
    const { collection, query, orderBy, onSnapshot } = window.firebase;
    const q = query(collection(window.db, "products"), orderBy("createdAt", "desc"));

    onSnapshot(q, (snapshot) => {
        state.products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            visible: doc.data().visible ?? true
        }));
        
        const currentScreen = state.navigationHistory[state.navigationHistory.length - 1];
        if (currentScreen === 'products') {
            const currentScroll = window.scrollY;
            renderCategories();
            renderProducts();
            window.scrollTo({ top: currentScroll, behavior: 'instant' });
        } else if (currentScreen === 'home') {
            renderHomeScreen();
        } else if (currentScreen === 'admin') {
            renderAdminScreen();
        }
    });
}

function renderProductCard(product) {
    const safeName = escapeHtml(product.name);
    const safeCat = escapeHtml(product.category);
    const imgUrl = product.imageUrl || 'https://placehold.co/400x300';
    const jsName = safeName.replace(/'/g, "\\'"); 
    const btnText = translations[state.currentLanguage]['add-to-cart-btn'] || 'Adicionar ao Carrinho';
    const isFav = state.favorites.includes(product.id);
    const safePrice = product.price || 0;

    return `
        <div class="product-card bg-primary shadow-xl rounded-xl overflow-hidden group relative">
            <button onclick="toggleFavorite(event, '${product.id}')" class="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 transition-colors ${isFav ? 'text-red-500 fill-current' : 'text-gray-400'}" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </button>

            <div class="overflow-hidden h-48">
                <img src="${imgUrl}" loading="lazy" onerror="this.src='https://placehold.co/400x300?text=Sem+Imagem'" alt="${safeName}" class="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110" onclick="navigateToScreen('product-detail', '${product.id}')">
            </div>
            <div class="p-4">
                <h3 class="text-lg font-bold truncate text-primary">${safeName}</h3>
                <p class="text-secondary text-sm mb-2">${safeCat}</p>
                <p class="text-xl font-extrabold text-brand-primary mb-3">${formatMoney(safePrice)}</p>
                <button
                    class="w-full py-2 px-4 bg-brand-primary text-white rounded-lg hover:bg-brand-hover text-sm font-semibold shadow-md active:scale-95 transition-transform"
                    onclick="addToCart('${product.id}', '${jsName}', ${safePrice}, '${imgUrl}')"
                    data-lang="add-to-cart-btn">
                    ${btnText}
                </button>
            </div>
        </div>
    `;
}

function renderProducts() {
    const UI = getUI();
    if (!UI.productGrid) return;
    
    let filtered = state.products.filter(p => {
        const matchesVisibility = p.visible !== false;
        const matchesCategory = state.currentCategory === 'all' || p.category === state.currentCategory;
        return matchesVisibility && matchesCategory;
    });

    if (state.searchTerm) {
        const term = state.searchTerm.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(term));
    }
    
    if (filtered.length === 0) {
        UI.productGrid.innerHTML = `<p class="col-span-full text-center text-secondary py-10">Nenhum produto encontrado.</p>`;
    } else {
        UI.productGrid.innerHTML = filtered.map(renderProductCard).join('');
    }
    setLanguage(state.currentLanguage);
}

function renderCategories() {
    const UI = getUI();
    if (!UI.categoryFilters) return;
    const allCategories = ['all', ...new Set(state.products.map(p => p.category).filter(Boolean))];
    UI.categoryFilters.innerHTML = allCategories.map(cat => {
        const isActive = state.currentCategory === cat;
        const displayName = cat === 'all' ? (translations[state.currentLanguage]['all-category'] || 'Todos') : cat;
        return `<button onclick="setCategory('${cat}')" class="px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${isActive ? 'bg-brand-primary text-white shadow-md' : 'bg-secondary text-secondary border border-main hover:border-brand-primary'}">${displayName}</button>`;
    }).join('');
}
window.setCategory = (cat) => { state.currentCategory = cat; renderCategories(); renderProducts(); };
function toggleFavorite(e, productId) { e.stopPropagation(); const idx = state.favorites.indexOf(productId); if (idx > -1) { state.favorites.splice(idx, 1); showNotification('Removido dos favoritos', 'info'); } else { state.favorites.push(productId); showNotification('Adicionado aos favoritos', 'success'); } localStorage.setItem('favorites', JSON.stringify(state.favorites)); const currentScreen = state.navigationHistory[state.navigationHistory.length - 1]; if (currentScreen === 'products') renderProducts(); else if (currentScreen === 'profile') renderProfileScreen(); else if (currentScreen === 'product-detail') renderProductDetail(productId); }

function renderProductDetail(productId) {
    const UI = getUI(); const product = state.products.find(p => p.id === productId); if (!product || !UI.productDetailContent) return;
    const safeName = escapeHtml(product.name); const safeDesc = escapeHtml(product.description); const jsName = safeName.replace(/'/g, "\\'"); const btnText = translations[state.currentLanguage]['add-to-cart-btn'] || 'Adicionar ao Carrinho'; const isFav = state.favorites.includes(product.id);
    const safePrice = product.price || 0;
    
    UI.productDetailContent.innerHTML = `<div class="max-w-4xl mx-auto bg-primary rounded-xl shadow-2xl overflow-hidden md:flex animate-fade-in relative"><button onclick="toggleFavorite(event, '${product.id}')" class="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/80 hover:bg-white shadow-md"><svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 transition-colors ${isFav ? 'text-red-500 fill-current' : 'text-gray-400'}" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></button><div class="md:w-1/2 p-4"><img src="${product.imageUrl || 'https://placehold.co/600x600'}" onerror="this.src='https://placehold.co/600x600?text=Sem+Imagem'" alt="${safeName}" class="w-full h-96 object-cover rounded-lg shadow-lg"></div><div class="md:w-1/2 p-6 space-y-4"><h1 class="text-4xl font-extrabold text-brand-primary">${safeName}</h1><p class="text-secondary text-lg">${escapeHtml(product.category)}</p><p class="text-2xl font-black text-green-500">${formatMoney(safePrice)}</p><p class="text-primary leading-relaxed">${safeDesc || 'Sem descrição.'}</p><div class="pt-4"><button class="w-full py-3 px-6 bg-brand-primary text-white rounded-xl hover:bg-brand-hover text-lg font-semibold shadow-lg active:scale-95 transition-transform" onclick="addToCart('${product.id}', '${jsName}', ${safePrice}, '${product.imageUrl}')">${btnText}</button></div></div></div>`; setLanguage(state.currentLanguage);
}

function renderHomeScreen() {
    const container = document.getElementById('featured-products-container'); if (!container) return; if (state.carouselInterval) { clearInterval(state.carouselInterval); state.carouselInterval = null; } const featured = state.products.filter(p => p.featured && p.visible !== false); if (featured.length === 0) { document.getElementById('no-featured-message')?.classList.remove('hidden'); container.innerHTML = ''; container.classList.remove('carousel-wrapper'); } else { document.getElementById('no-featured-message')?.classList.add('hidden'); container.innerHTML = `<div class="carousel-wrapper overflow-hidden relative w-full rounded-2xl"><div id="carousel-track" class="flex transition-transform duration-700 ease-in-out h-64 md:h-80">${featured.map(p => `<div class="flex-shrink-0 w-full md:w-1/3 p-2 h-full cursor-pointer" onclick="navigateToScreen('product-detail', '${p.id}')"><img src="${p.imageUrl}" loading="lazy" onerror="this.src='https://placehold.co/400x300?text=Destaque'" class="w-full h-full object-cover rounded-xl shadow-md hover:scale-105 transition-transform duration-300" alt="Destaque"></div>`).join('')}</div></div>`; const track = document.getElementById('carousel-track'); if (track && featured.length > 1) { let index = 0; const itemsToShow = window.innerWidth >= 768 ? 3 : 1; const totalItems = featured.length; if (totalItems <= itemsToShow) return; state.carouselInterval = setInterval(() => { index++; if (index > totalItems - itemsToShow) { index = 0; } const percent = index * (100 / itemsToShow); track.style.transform = `translateX(-${percent}%)`; }, 3000); } } const viewBtn = document.getElementById('view-all-products-button'); if(viewBtn) viewBtn.onclick = () => navigateToScreen('products'); setLanguage(state.currentLanguage);
}

// ====================================================================
// CART & ORDERS
// ====================================================================
function updateCartUI() {
    const UI = getUI();
    if (!UI.cartItemsContainer) return;
    
    // Auto-preencher endereço se salvo
    const addressInput = document.getElementById('delivery-address-input');
    if (addressInput && state.user && state.user.address && !addressInput.value) {
        addressInput.value = state.user.address;
    }

    state.cart = state.cart.filter(i => i.quantity > 0);
    localStorage.setItem('cart', JSON.stringify(state.cart));
    const totalQty = state.cart.reduce((acc, item) => acc + item.quantity, 0);
    if (UI.cartItemCount) UI.cartItemCount.textContent = totalQty;
    if (state.cart.length === 0) {
        UI.cartItemsContainer.innerHTML = `<p class="text-center text-secondary py-10">Carrinho vazio.</p>`;
        UI.cartTotal.textContent = formatMoney(0);
        UI.checkoutButton.disabled = true;
    } else {
        let total = 0;
        UI.cartItemsContainer.innerHTML = state.cart.map(item => {
            const safePrice = item.price || 0;
            total += safePrice * item.quantity;
            return `
                <div class="flex items-center justify-between p-3 bg-primary rounded-lg shadow-sm cart-item">
                    <img src="${item.imageUrl}" onerror="this.src='https://placehold.co/100x100?text=Item'" class="w-12 h-12 object-cover rounded-md">
                    <div class="flex-grow mx-3 truncate">
                        <p class="font-semibold truncate text-primary">${escapeHtml(item.name)}</p>
                        <p class="text-sm text-secondary">${formatMoney(safePrice)} x ${item.quantity}</p>
                    </div>
                    <div class="flex items-center space-x-2">
                        <input type="number" min="1" value="${item.quantity}" onchange="updateCartItemQuantity('${item.id}', this.value)" class="w-12 text-center border rounded-md bg-secondary text-primary">
                        <button class="text-red-500 hover:text-red-700" onclick="removeFromCart('${item.id}')">&times;</button>
                    </div>
                </div>
            `;
        }).join('');
        UI.cartTotal.textContent = formatMoney(total);
        UI.checkoutButton.disabled = false;
    }
}
window.addToCart = (id, name, price, imageUrl) => {
    const existing = state.cart.find(i => i.id === id);
    if (existing) existing.quantity++; else state.cart.push({ id, name, price, imageUrl, quantity: 1 });
    updateCartUI(); showNotification(`${name} adicionado!`, 'success');
};
window.removeFromCart = (id) => { state.cart = state.cart.filter(i => i.id !== id); updateCartUI(); };
window.updateCartItemQuantity = (id, qty) => { const item = state.cart.find(i => i.id === id); if (item) item.quantity = parseInt(qty); updateCartUI(); };

async function sendOrderViaWhatsApp() {
    const address = document.getElementById('delivery-address-input')?.value.trim();
    if (!address) { showNotification('Endereço obrigatório!', 'error'); return; }
    
    toggleLoading(true, 'loading');

    try {
        const total = state.cart.reduce((a, b) => a + ((b.price || 0) * b.quantity), 0);
        
        // Verifica se devemos usar coordenadas ou texto. 
        // Se o listener 'input' rodou, state.deliveryCoordinates será null
        const finalLocation = state.deliveryCoordinates || null;

        const orderData = {
            userId: state.user.id,
            userName: state.user.fullName,
            userPhone: state.user.phoneNumber,
            address: address,
            items: state.cart,
            total: total,
            status: 'pending', 
            location: finalLocation,
            createdAt: new Date().toISOString()
        };

        const { collection, addDoc, doc, updateDoc } = window.firebase;
        
        // 1. Salvar Pedido
        await addDoc(collection(window.db, 'orders'), orderData);

        // 2. Salvar Endereço no Perfil do Usuário
        if (state.user.address !== address) {
             const userRef = doc(window.db, 'users', state.user.id);
             await updateDoc(userRef, { address: address });
             state.user.address = address;
             localStorage.setItem('currentUser', JSON.stringify(state.user));
        }

        // --- GERAÇÃO DA MENSAGEM DO WHATSAPP ---
        
        let mapLink = '';
        if (state.deliveryCoordinates && state.deliveryCoordinates.lat) {
            // Alta precisão (Pino do Mapa)
            mapLink = `https://www.google.com/maps/search/?api=1&query=${state.deliveryCoordinates.lat},${state.deliveryCoordinates.lng}`;
        } else {
            // Endereço Manual: Adiciona contexto (Moçambique) para melhorar a busca
            const cleanAddress = address.trim();
            // Evita duplicação se o usuário já digitou o país
            const queryAddr = (cleanAddress.toLowerCase().includes('moçambique') || cleanAddress.toLowerCase().includes('mozambique')) 
                              ? cleanAddress 
                              : `${cleanAddress}, Moçambique`;
                              
            mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryAddr)}`;
        }

        // Lista de Itens Formatada e Limpa
        const itemsText = state.cart.map(i => {
             const subtotal = formatMoney((i.price || 0) * i.quantity);
            return `📦 *${i.quantity}x ${i.name}*\n   💵 Total: ${subtotal}`;
        }).join('\n\n');

        let msg = `*NOVO PEDIDO - Nó&Laço*\n━━━━━━━━━━━━━━━━\n`;
        msg += `👤 *Cliente:* ${state.user.fullName}\n`;
        msg += `📞 *Tel:* ${state.user.phoneNumber}\n`;
        msg += `📍 *Endereço:* ${address}\n`;
        msg += `🔗 *Mapa:* ${mapLink}\n\n`;
        msg += `*ITENS DO PEDIDO:*\n${itemsText}\n`;
        msg += `━━━━━━━━━━━━━━━━\n`;
        msg += `*💰 TOTAL: ${formatMoney(total)}*`;

        window.open(`https://wa.me/${CONFIG.ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
        
        state.cart = []; 
        updateCartUI(); 
        closeModal('order-confirm-modal');
        closeModal('cart-modal', 'cart-panel');
        showNotification('Pedido registrado com sucesso!', 'success');
        
    } catch (e) {
        console.error("Erro ao salvar pedido", e);
        showNotification('Erro ao registrar pedido. Tente novamente.', 'error');
    } finally {
        toggleLoading(false);
    }
}

// ====================================================================
// ADMIN PAINEL
// ====================================================================
function renderAdminScreen() {
    const UI = getUI();
    const adminScreen = UI.screens['admin'];
    
    // Switch de abas (Se não existir, cria)
    let tabsContainer = document.getElementById('admin-tabs');
    if (!tabsContainer) {
        adminScreen.innerHTML = `
            <div id="admin-panel-title" class="mb-6 flex justify-between items-center">
                <h2 class="text-3xl font-bold text-brand-primary">Painel Admin</h2>
                <div id="admin-tabs" class="flex space-x-2 bg-secondary p-1 rounded-lg border border-main">
                    <button onclick="setAdminView('products')" id="tab-products" class="px-4 py-2 rounded-md text-sm font-bold transition-colors">Produtos</button>
                    <button onclick="setAdminView('orders')" id="tab-orders" class="px-4 py-2 rounded-md text-sm font-bold transition-colors">Pedidos</button>
                </div>
            </div>
            <div id="admin-content"></div>
        `;
        tabsContainer = document.getElementById('admin-tabs');
    }

    // Atualiza estilo das abas
    document.getElementById('tab-products').className = `px-4 py-2 rounded-md text-sm font-bold transition-colors ${state.adminView === 'products' ? 'bg-brand-primary text-white' : 'text-primary hover:bg-primary'}`;
    document.getElementById('tab-orders').className = `px-4 py-2 rounded-md text-sm font-bold transition-colors ${state.adminView === 'orders' ? 'bg-brand-primary text-white' : 'text-primary hover:bg-primary'}`;

    const content = document.getElementById('admin-content');
    
    if (state.adminView === 'products') {
        content.innerHTML = `
             <div class="bg-secondary p-6 rounded-xl shadow-lg mb-8">
                <h3 class="text-xl font-bold mb-4 text-primary" data-lang="add-new-product-title">Adicionar Novo Produto</h3>
                <form id="product-form" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" id="product-name" placeholder="Nome do Produto" class="p-3 border border-main rounded-xl bg-primary text-primary" required>
                    <input type="number" id="product-price" placeholder="Preço (MZN)" class="p-3 border border-main rounded-xl bg-primary text-primary" step="0.01" required>
                    <select id="product-category" class="p-3 border border-main rounded-xl bg-primary text-primary">
                        <option value="Colares">Colares</option>
                        <option value="Pulseiras">Pulseiras</option>
                        <option value="Brincos">Brincos</option>
                        <option value="Aneis">Anéis</option>
                        <option value="Conjuntos">Conjuntos</option>
                        <option value="Outros">Outros</option>
                    </select>
                    <div class="flex items-center space-x-2 bg-primary p-3 border border-main rounded-xl">
                        <label class="flex items-center cursor-pointer">
                            <span class="mr-2 text-secondary">Imagem:</span>
                            <input type="file" id="product-image" accept="image/*" class="text-sm text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-hover">
                        </label>
                    </div>
                    <div id="image-preview-container" class="col-span-1 md:col-span-2 hidden justify-center">
                         <img id="image-preview" src="" class="h-32 object-contain rounded-lg border border-main">
                    </div>
                    <textarea id="product-description" placeholder="Descrição Detalhada" class="p-3 border border-main rounded-xl bg-primary text-primary col-span-1 md:col-span-2" rows="3"></textarea>
                    <div class="col-span-1 md:col-span-2 flex items-center">
                        <input type="checkbox" id="product-featured" class="w-5 h-5 text-brand-primary rounded focus:ring-brand-primary border-gray-300">
                        <label for="product-featured" class="ml-2 text-primary font-medium">Destacar este produto na Home</label>
                    </div>
                    <div class="col-span-1 md:col-span-2 flex space-x-2">
                        <button type="submit" id="submit-product-button" class="flex-grow bg-brand-primary text-white py-3 rounded-xl hover:bg-brand-hover font-bold shadow-md transition-transform transform active:scale-95" data-lang="add-product-button">Adicionar Produto</button>
                        <button type="button" id="cancel-edit-button" class="hidden px-6 bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600 font-bold shadow-md transition-transform transform active:scale-95">Cancelar</button>
                    </div>
                </form>
            </div>
            
            <div class="overflow-x-auto bg-secondary rounded-xl shadow-lg">
                <table class="w-full text-left border-collapse">
                    <thead class="bg-primary text-secondary uppercase text-xs font-semibold">
                        <tr>
                            <th class="px-6 py-3 border-b border-main">Produto</th>
                            <th class="px-6 py-3 border-b border-main">Preço</th>
                            <th class="px-6 py-3 border-b border-main">Status</th>
                            <th class="px-6 py-3 border-b border-main text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody id="admin-product-list" class="divide-y divide-main text-primary text-sm"></tbody>
                </table>
            </div>
        `;
        renderProductListRows(); 
    } else {
        // ORDERS VIEW
        content.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-primary">Gerenciar Pedidos</h3>
                <button onclick="renderAdminScreen()" class="p-2 bg-primary rounded-full hover:bg-gray-200 text-primary" title="Atualizar"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v3.276a1 1 0 01-2 0V14.899a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" /></svg></button>
            </div>
            <div id="admin-orders-list" class="space-y-4">
                <div class="flex justify-center py-8"><svg class="animate-spin h-8 w-8 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>
            </div>
        `;
        fetchAdminOrders();
    }
}

window.setAdminView = (view) => {
    state.adminView = view;
    renderAdminScreen();
}

function renderProductListRows() {
    const list = document.getElementById('admin-product-list'); 
    if (!list) return;
    
    list.innerHTML = state.products.map(p => {
        const safePrice = p.price || 0;
        return `
        <tr class="border-b border-main hover:bg-main/10">
            <td class="px-6 py-4 flex items-center"><img src="${p.imageUrl}" onerror="this.src='https://placehold.co/100x100'" class="w-10 h-10 rounded-full mr-3 object-cover"><span>${escapeHtml(p.name)}</span></td>
            <td class="px-6 py-4">${formatMoney(safePrice)}</td>
            <td class="px-6 py-4 space-x-1"><span class="px-2 py-1 text-xs rounded-full ${p.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">Destaque: ${p.featured ? 'Sim' : 'Não'}</span><span class="px-2 py-1 text-xs rounded-full ${p.visible !== false ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}">${p.visible !== false ? 'Visível' : 'Oculto'}</span></td>
            <td class="px-6 py-4 space-x-2 text-right">
                <button onclick="toggleProductVisibility('${p.id}')" title="Visibilidade" class="text-gray-600 hover:text-blue-600">👁️</button>
                <button onclick="editProduct('${p.id}')" title="Editar" class="text-blue-600">✏️</button>
                <button onclick="toggleProductFeatured('${p.id}')" title="Destaque" class="text-yellow-500">⭐</button>
                <button onclick="deleteProduct('${p.id}')" title="Excluir" class="text-red-600">🗑️</button>
            </td>
        </tr>
    `}).join('');

    const form = document.getElementById('product-form');
    if(form && !form.dataset.listening) {
        form.addEventListener('submit', handleProductSubmit);
        document.getElementById('product-image').addEventListener('change', (e) => { if(e.target.files[0]) { state.originalImageFile = e.target.files[0]; const reader = new FileReader(); reader.onload = (ev) => { document.getElementById('image-preview').src = ev.target.result; document.getElementById('image-preview-container').classList.remove('hidden'); }; reader.readAsDataURL(e.target.files[0]); } });
        document.getElementById('cancel-edit-button').addEventListener('click', resetProductForm);
        form.dataset.listening = "true";
    }
}

async function fetchAdminOrders() {
    const list = document.getElementById('admin-orders-list');
    if (!list) return;

    const { collection, getDocs, orderBy, query } = window.firebase;
    let querySnapshot;

    // SAFE GUARD 2.0: Verifica se 'limit' foi carregado corretamente do Firebase
    // Acessa diretamente do window.firebase para evitar variáveis stale
    let safeLimit = null;
    if (window.firebase && typeof window.firebase.limit === 'function') {
        safeLimit = window.firebase.limit(50);
    }

    try {
        // Tenta buscar ordenado (Requer índice no Firebase Console)
        // Usamos array de constraints para permitir adicionar o limit condicionalmente
        const queryConstraints = [collection(window.db, "orders"), orderBy("createdAt", "desc")];
        if (safeLimit) queryConstraints.push(safeLimit);
        
        const q = query(...queryConstraints);
        querySnapshot = await getDocs(q);
    } catch (e) {
        console.warn("Falha na ordenação via DB (índice ausente?), tentando ordenação local...", e);
        try {
            // Fallback: Busca simples (sem orderBy)
            // Também usamos o array para proteger o limit
            const fallbackConstraints = [collection(window.db, "orders")];
            if (safeLimit) fallbackConstraints.push(safeLimit);

            const qFallback = query(...fallbackConstraints);
            querySnapshot = await getDocs(qFallback);
        } catch (e2) {
            console.error("Erro crítico:", e2);
            list.innerHTML = `<p class="text-center text-red-500 py-8">Erro crítico ao carregar pedidos.<br><span class="text-xs text-gray-500">${e2.message}</span></p>`;
            return;
        }
    }
        
    if (querySnapshot.empty) {
        list.innerHTML = `<p class="text-center text-secondary py-8">Nenhum pedido encontrado.</p>`;
        return;
    }

    // Processa os dados
    let orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Garante ordenação se o fallback foi usado
    orders.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    list.innerHTML = orders.map(order => {
        const date = new Date(order.createdAt).toLocaleString(state.currentLanguage === 'pt' ? 'pt-BR' : 'en-US');
        
        let statusColor = 'bg-gray-100 text-gray-800';
        if (order.status === 'completed') statusColor = 'bg-green-100 text-green-800';
        if (order.status === 'cancelled') statusColor = 'bg-red-100 text-red-800';
        if (order.status === 'pending') statusColor = 'bg-yellow-100 text-yellow-800';

        const itemsList = order.items.map(i => `<div class="text-sm text-secondary flex justify-between"><span>${i.quantity}x ${i.name}</span><span>${formatMoney((i.price || 0) * i.quantity)}</span></div>`).join('');

        // Link do mapa no pedido do Admin
        let mapLinkButton = '';
        if (order.location && order.location.lat && order.location.lng) {
             mapLinkButton = `<a href="https://www.google.com/maps/search/?api=1&query=${order.location.lat},${order.location.lng}" target="_blank" class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-bold hover:bg-blue-200 mr-auto sm:mr-0 sm:ml-2 text-center flex items-center justify-center" title="Ver localização exata">📍 Mapa (Pino)</a>`;
        } else if (order.address) {
             const cleanAddress = order.address.toLowerCase().includes('moçambique') ? order.address : `${order.address}, Moçambique`;
             mapLinkButton = `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanAddress)}" target="_blank" class="px-4 py-2 bg-gray-100 text-blue-700 rounded-lg text-sm font-bold hover:bg-gray-200 mr-auto sm:mr-0 sm:ml-2 text-center flex items-center justify-center" title="Buscar no mapa">📍 Mapa (Busca)</a>`;
        }

        return `
            <div class="bg-secondary border border-main rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start border-b border-main pb-3 mb-3">
                    <div>
                        <p class="font-bold text-lg text-primary">${order.userName}</p>
                        <p class="text-sm text-secondary">${order.userPhone} | ${date}</p>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColor}">${order.status === 'pending' ? 'Pendente' : (order.status === 'completed' ? 'Concluído' : 'Cancelado')}</span>
                </div>
                <div class="mb-3">
                        <p class="text-sm font-semibold text-primary mb-1">Endereço:</p>
                        <p class="text-sm text-secondary italic bg-primary p-2 rounded">${escapeHtml(order.address)}</p>
                </div>
                <div class="mb-4 bg-primary p-3 rounded-lg">
                    ${itemsList}
                    <div class="flex justify-between font-bold text-primary mt-2 border-t border-main pt-2">
                        <span>Total</span>
                        <span>${formatMoney(order.total)}</span>
                    </div>
                </div>
                ${order.status === 'pending' ? `
                <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-2 border-t border-main mt-2">
                        ${mapLinkButton}
                        <button onclick="updateOrderStatus('${order.id}', 'cancelled')" class="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-bold hover:bg-red-200">Cancelar</button>
                        <button onclick="updateOrderStatus('${order.id}', 'completed')" class="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-bold hover:bg-green-200">Concluir</button>
                </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

window.updateOrderStatus = async (orderId, newStatus) => {
    if(!confirm(`Mudar status para ${newStatus}?`)) return;
    try {
        await window.firebase.updateDoc(window.firebase.doc(window.db, "orders", orderId), { status: newStatus });
        fetchAdminOrders(); // Recarrega
        showNotification('Status atualizado!', 'success');
    } catch(e) {
        showNotification('Erro ao atualizar.', 'error');
    }
}

function handleAdminLogin(e) {
    e.preventDefault();
    const code = document.getElementById('admin-code').value;
    if (btoa(code) === CONFIG.ADMIN_HASH && state.user) {
        state.user.role = 'admin'; 
        localStorage.setItem('currentUser', JSON.stringify(state.user));
        document.getElementById('admin-button').classList.remove('hidden');
        closeModal('admin-login-modal');
        navigateToScreen('admin'); 
        showNotification('Admin ativado!', 'success');
    } else { 
        showNotification('Código inválido ou não logado.', 'error'); 
    }
}
async function handleProductSubmit(e) {
    e.preventDefault(); toggleLoading(true);
    try {
        const name = document.getElementById('product-name').value;
        const price = parseFloat(document.getElementById('product-price').value);
        const category = document.getElementById('product-category').value;
        const desc = document.getElementById('product-description').value;
        const featured = document.getElementById('product-featured').checked;
        const { doc, setDoc, collection } = window.firebase;
        let imgUrl = state.productToEdit?.imageUrl || '';
        if (state.originalImageFile) { const blob = await processImage(state.originalImageFile); const uploaded = await uploadImage(blob); if (uploaded) imgUrl = uploaded; }
        const data = { name, price, category, description: desc, featured, imageUrl: imgUrl, updatedAt: new Date().toISOString() };
        if (state.productToEdit) await setDoc(doc(window.db, 'products', state.productToEdit.id), data, { merge: true });
        else { const newRef = doc(collection(window.db, 'products')); await setDoc(newRef, { ...data, id: newRef.id, createdAt: new Date().toISOString(), visible: true }); }
        showNotification('Produto salvo!', 'success'); resetProductForm();
        if(state.adminView === 'products') renderProductListRows();
    } catch (err) { console.error(err); showNotification('Erro ao salvar.', 'error'); } finally { toggleLoading(false); }
}
function resetProductForm() {
    document.getElementById('product-form').reset(); state.productToEdit = null; state.originalImageFile = null;
    document.getElementById('image-preview-container').classList.add('hidden');
    document.getElementById('submit-product-button').textContent = "Adicionar Produto";
    document.getElementById('cancel-edit-button').classList.add('hidden');
}
window.editProduct = (id) => {
    const p = state.products.find(x => x.id === id); if (!p) return; state.productToEdit = p;
    document.getElementById('product-name').value = p.name; document.getElementById('product-price').value = p.price;
    document.getElementById('product-category').value = p.category; document.getElementById('product-description').value = p.description;
    document.getElementById('product-featured').checked = p.featured;
    document.getElementById('submit-product-button').textContent = "Salvar Alterações";
    document.getElementById('cancel-edit-button').classList.remove('hidden');
    document.getElementById('admin-panel-title').scrollIntoView({ behavior: 'smooth' });
};
window.deleteProduct = async (id) => { if (!confirm('Excluir?')) return; try { await window.firebase.deleteDoc(window.firebase.doc(window.db, 'products', id)); showNotification('Excluído.', 'success'); } catch (e) { showNotification('Erro.', 'error'); } };
window.toggleProductVisibility = async (id) => { const p = state.products.find(x => x.id === id); try { await window.firebase.updateDoc(window.firebase.doc(window.db, 'products', id), { visible: !p.visible }); showNotification(`Produto ${!p.visible ? 'visível' : 'oculto'}.`, 'success'); } catch (e) { showNotification('Erro.', 'error'); } };
window.toggleProductFeatured = async (id) => { const p = state.products.find(x => x.id === id); try { await window.firebase.updateDoc(window.firebase.doc(window.db, 'products', id), { featured: !p.featured }); } catch (e) { console.error(e); } };

function renderSettingsScreen() {
    const el = document.getElementById('settings-screen');
    el.innerHTML = `
        <div class="max-w-xl mx-auto bg-secondary p-8 rounded-xl shadow-lg space-y-6">
            <h2 class="text-2xl font-bold text-center" data-lang="settings-title">Configurações</h2>
            <div class="flex justify-between items-center border-b border-main pb-4">
                <span data-lang="theme-label">Tema Escuro</span>
                <input type="checkbox" id="theme-toggle" class="w-6 h-6" ${document.documentElement.classList.contains('dark') ? 'checked' : ''}>
            </div>
            <div class="flex justify-between items-center border-b border-main pb-4">
                <span data-lang="language-label">Idioma</span>
                <select id="lang-select" class="bg-primary border border-main rounded p-1">
                    <option value="pt">Português</option>
                    <option value="en">English</option>
                </select>
            </div>
            <button id="logout-button" class="w-full bg-red-500 text-white py-3 rounded-lg" data-lang="logout-button-settings">Sair</button>
        </div>
    `;
    
    document.getElementById('theme-toggle').onchange = (e) => applyTheme(e.target.checked);
    document.getElementById('lang-select').value = state.currentLanguage;
    document.getElementById('lang-select').onchange = (e) => {
        setLanguage(e.target.value);
        setTimeout(renderSettingsScreen, 50);
    };
    document.getElementById('logout-button').onclick = handleLogout;
    setLanguage(state.currentLanguage);
}

async function renderProfileScreen() {
    if (!state.user) return;
    const el = document.getElementById('profile-screen');
    const favoriteProducts = state.products.filter(p => state.favorites.includes(p.id));
    const hasFavorites = favoriteProducts.length > 0;
    const favTitle = translations[state.currentLanguage]['favorites-title'] || 'Meus Favoritos';
    const ordersTitle = translations[state.currentLanguage]['orders-history-title'] || 'Meus Pedidos';
    const noOrdersMsg = translations[state.currentLanguage]['no-orders-message'] || 'Você ainda não fez nenhum pedido.';
    let favHtml = '';
    if (hasFavorites) {
        favHtml = `<div class="mt-8"><h3 class="text-xl font-bold mb-4">${favTitle}</h3><div class="grid grid-cols-2 gap-4">${favoriteProducts.map(p => `<div class="bg-primary rounded-lg shadow p-2 cursor-pointer" onclick="navigateToScreen('product-detail', '${p.id}')"><img src="${p.imageUrl}" onerror="this.src='https://placehold.co/100x100?text=Item'" class="w-full h-24 object-cover rounded mb-2"><p class="text-sm font-semibold truncate">${escapeHtml(p.name)}</p><p class="text-xs text-brand-primary font-bold">${formatMoney(p.price || 0)}</p></div>`).join('')}</div></div>`;
    }
    let ordersHtml = `<div class="mt-8"><h3 class="text-xl font-bold mb-4">${ordersTitle}</h3><div class="flex justify-center"><svg class="animate-spin h-6 w-6 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div></div>`;
    el.innerHTML = `<div class="max-w-xl mx-auto bg-secondary p-8 rounded-xl shadow-lg space-y-6"><h2 class="text-2xl font-bold text-center" data-lang="profile-title">Meu Perfil</h2><div class="flex flex-col items-center"><img src="${state.user.profilePicture}" onerror="this.src='https://placehold.co/100x100?text=User'" class="w-24 h-24 rounded-full border-4 border-brand-primary mb-2"><h3 class="text-xl font-semibold">${state.user.fullName}</h3></div><div class="space-y-4"><input type="text" value="${state.user.fullName}" class="w-full p-3 border border-main rounded bg-primary text-primary" disabled><input type="text" value="${state.user.phoneNumber}" class="w-full p-3 border border-main rounded bg-primary text-primary" disabled></div>${favHtml}<div id="orders-container">${ordersHtml}</div><button onclick="handleLogout()" class="w-full bg-red-500 text-white py-3 rounded-lg mt-6">Sair</button></div>`;
    setLanguage(state.currentLanguage);
    try {
        const { collection, query, where, getDocs } = window.firebase;
        const q = query(collection(window.db, "orders"), where("userId", "==", state.user.id));
        const querySnapshot = await getDocs(q);
        const ordersContainer = document.getElementById('orders-container');
        if (querySnapshot.empty) {
            ordersContainer.innerHTML = `<div class="mt-8"><h3 class="text-xl font-bold mb-4">${ordersTitle}</h3><p class="text-secondary text-center py-4">${noOrdersMsg}</p></div>`;
        } else {
            const sortedDocs = querySnapshot.docs.sort((a, b) => new Date(b.data().createdAt) - new Date(a.data().createdAt));
            const list = sortedDocs.map(doc => {
                const data = doc.data();
                const date = new Date(data.createdAt).toLocaleDateString(state.currentLanguage === 'pt' ? 'pt-BR' : 'en-US');
                const itemCount = data.items.reduce((a,b)=>a+b.quantity, 0);
                return `<div class="order-card p-4 rounded-lg shadow mb-3 border border-main bg-primary"><div class="flex justify-between items-center mb-2"><span class="text-sm text-secondary">${date}</span><span class="status-badge status-${data.status}">${data.status === 'pending' ? 'Pendente' : (data.status === 'completed' ? 'Concluído' : 'Cancelado')}</span></div><div class="flex justify-between items-center font-bold"><span>${itemCount} Itens</span><span class="text-brand-primary">${formatMoney(data.total)}</span></div></div>`;
            }).join('');
            ordersContainer.innerHTML = `<div class="mt-8"><h3 class="text-xl font-bold mb-4">${ordersTitle}</h3><div class="space-y-2">${list}</div></div>`;
        }
    } catch (e) {
        console.error('Erro profile:', e);
        const ordersContainer = document.getElementById('orders-container');
        if(ordersContainer) ordersContainer.innerHTML = `<div class="mt-8"><p class="text-red-500 text-center">Erro ao carregar histórico.</p></div>`; 
    }
}

function setupEventListeners() {
    const UI = getUI();
    
    // LOGIN FORM EVENTS
    if (UI.registrationForm) {
        // Evento padrão de submit
        UI.registrationForm.addEventListener('submit', handleRegistration);
        
        // Listener redundante no botão de submit para mobile (caso o teclado virtual interfira no evento de submit padrão)
        const submitBtn = UI.registrationForm.querySelector('button[type="submit"]');
        if(submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                // Se o formulário for válido, chama a função. Se não, deixa o navegador mostrar os erros de validação HTML5.
                if(UI.registrationForm.checkValidity()) {
                    handleRegistration(e);
                }
            });
        }
    }

    // PROFILE PICTURE UPLOAD
    if (UI.profilePictureInput) {
        UI.profilePictureInput.addEventListener('change', e => {
            const file = e.target.files[0];
            if(file) {
                state.profilePictureFile = file;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const preview = document.getElementById('profile-preview');
                    const container = document.getElementById('profile-preview-container');
                    const icon = document.getElementById('default-profile-icon');
                    
                    if(preview) preview.src = ev.target.result;
                    if(container) container.classList.remove('hidden');
                    if(icon) icon.classList.add('hidden');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (UI.searchInput) {
        UI.searchInput.addEventListener('input', (e) => {
            if(state.navigationHistory[state.navigationHistory.length-1] !== 'products') navigateToScreen('products');
            state.searchTerm = e.target.value;
            renderProducts(); 
        });
    }
    if (UI.backButton) UI.backButton.addEventListener('click', goBack);
    if (UI.settingsButton) UI.settingsButton.addEventListener('click', () => navigateToScreen('settings'));
    
    // Fix: usar UI.userProfileContainer diretamente
    if (UI.userProfileContainer) UI.userProfileContainer.addEventListener('click', () => navigateToScreen('profile'));
    
    // CART EVENTS - Usando novo helper openModal
    if (UI.cartButton) {
        UI.cartButton.addEventListener('click', () => { 
            updateCartUI(); 
            openModal('cart-modal', 'cart-panel');
        });
    }
    document.getElementById('close-cart-button').addEventListener('click', () => { 
        closeModal('cart-modal', 'cart-panel');
    });

    // MAP EVENTS
    document.getElementById('open-map-button').addEventListener('click', () => {
        openModal('map-modal');
        // Inicializa o mapa apenas quando o modal for aberto para garantir renderização correta
        setTimeout(() => {
             initMap();
             state.map.invalidateSize();
        }, 100);
    });
    
    document.getElementById('close-map-button').addEventListener('click', () => closeModal('map-modal'));
    document.getElementById('map-search-btn').addEventListener('click', searchLocation);
    document.getElementById('confirm-location-btn').addEventListener('click', () => {
        if(state.selectedLocation) {
            document.getElementById('delivery-address-input').value = state.selectedLocation;
            closeModal('map-modal');
        } else {
            alert('Por favor, selecione um ponto no mapa.');
        }
    });

    // Reseta coordenadas se o usuário editar o endereço manualmente (Garante consistência do link do mapa)
    const addrInput = document.getElementById('delivery-address-input');
    if (addrInput) {
        addrInput.addEventListener('input', () => {
            state.deliveryCoordinates = null;
        });
    }

    // ORDER EVENTS - Usando novo helper openModal
    if (UI.checkoutButton) {
        UI.checkoutButton.addEventListener('click', () => { 
            openModal('order-confirm-modal');
        });
    }
    document.getElementById('cancel-order-button').addEventListener('click', () => { 
        closeModal('order-confirm-modal');
    });

    document.getElementById('send-order-whatsapp-button').addEventListener('click', sendOrderViaWhatsApp);
    
    // ADMIN EVENTS
    if (UI.adminButton) { 
        UI.adminButton.addEventListener('click', () => { 
            if(state.isAdmin) navigateToScreen('admin'); 
            else openModal('admin-login-modal');
        }); 
    }
    document.getElementById('admin-login-form')?.addEventListener('submit', handleAdminLogin);
    document.getElementById('close-admin-modal-button')?.addEventListener('click', () => closeModal('admin-login-modal'));
    
    // HISTORY API (BACK BUTTON) POPSTATE EVENT
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.screen) {
            navigateToScreen(event.state.screen, event.state.productId, true);
        } else {
            // Fallback para estado inicial
            navigateToScreen('home', null, true);
        }
    });
}

function initializeAppUI() {
    const UI = getUI();
    UI.loginSection.classList.add('hidden');
    UI.mainAppSection.classList.remove('hidden');
    if (state.user) {
        UI.userProfileName.textContent = state.user.fullName.split(' ')[0];
        UI.userProfilePic.src = state.user.profilePicture;
        UI.userProfilePic.onerror = function() { this.src = 'https://placehold.co/100x100?text=User'; };
        
        // FIX: Mostrar botão de admin para que usuários comuns possam tentar logar
        UI.adminButton.classList.remove('hidden');
    }
    listenToProducts();
    
    // Injeta estado inicial no histórico para garantir que o primeiro "voltar" funcione
    window.history.replaceState({ screen: 'home' }, "", "#home");
    navigateToScreen('home', null, true); // true para não duplicar history
    
    updateCartUI();
    setLanguage(state.currentLanguage);
}

function init() {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    
    // RACE CONDITION FIX: Garante inicialização independente da ordem de carregamento
    if (window.firebase) {
        runApp();
    } else {
        window.addEventListener('firebase-ready', runApp);
    }
}

function runApp() {
    window.removeEventListener('firebase-ready', runApp);
    applyTheme(localStorage.getItem('theme') === 'dark');
    setupEventListeners();
    if (state.user) initializeAppUI();
    else { const UI = getUI(); UI.loginSection.classList.remove('hidden'); UI.mainAppSection.classList.add('hidden'); }
    
    fetch(CONFIG.VERSION_URL).then(r=>r.json()).then(data => { if(data.version !== CONFIG.APP_VERSION && !window.location.host.includes('localhost')) { if(confirm(`Nova versão disponível: ${data.version}. Atualizar?`)) window.location.reload(true); } }).catch(console.warn);

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW falhou', err));
    }
}

// Inicializa quando o DOM estiver pronto ou se já estiver
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}