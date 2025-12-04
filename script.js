// ====================================================================
// Nó&Laço - app.js (versão corrigida e funcional)
// ====================================================================

// ====================================================================
// Módulo de Configuração e Estado Global
// ====================================================================
const CONFIG = {
    CLOUDINARY_CLOUD_NAME: 'ddjpvbggk',
    CLOUDINARY_UPLOAD_PRESET: 'nodelaco_preset',
    ADMIN_WHATSAPP_NUMBER: '258878384914',
    INSECURE_ADMIN_CODE: '669900',
    CURRENCY_SYMBOL: 'MZN',
    VALID_MZ_PREFIXES: ['82', '83', '84', '85', '86', '87'],
};

const state = {
    user: JSON.parse(localStorage.getItem('currentUser')) || null,

    get isAdmin() {
        return this.user && this.user.role === 'admin';
    },

    cart: JSON.parse(localStorage.getItem('cart')) || [],
    products: [],
    currentLanguage: localStorage.getItem('appLang') || 'pt',
    navigationHistory: [],
    profilePictureFile: null,
    productToEdit: null,
    originalImageFile: null,
    imageSettings: { maxWidth: 800, quality: 0.85 },
    lastScrollPosition: 0,
};

// ====================================================================
// Módulo de Seletores de UI (referências atualizadas)
// ====================================================================
const UI = {
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

    registrationForm: document.getElementById('registration-form'),
    profilePictureInput: document.getElementById('profile-picture'),
    defaultProfileIcon: document.getElementById('default-profile-icon'),
    profilePreviewContainer: document.getElementById('profile-preview-container'),
    profilePreview: document.getElementById('profile-preview'),

    screens: {
        home: document.getElementById('home-screen'),
        products: document.getElementById('products-screen'),
        'product-detail': document.getElementById('product-detail-screen'),
        settings: document.getElementById('settings-screen'),
        admin: document.getElementById('admin-screen'),
        profile: document.getElementById('profile-screen'),
    },

    productGrid: document.getElementById('product-grid'),
    productDetailContent: document.getElementById('product-detail-screen'),

    orderHistoryContainer: document.getElementById('order-history-container'),
    noOrdersMessage: document.getElementById('no-orders-message'),

    profilePicLarge: document.getElementById('profile-pic-large'),
    profileNameDisplay: document.getElementById('profile-name-display'),
    profileEditForm: document.getElementById('profile-edit-form'),
    profileFullNameInput: document.getElementById('profile-full-name'),
    profilePhoneNumberInput: document.getElementById('profile-phone-number'),
    saveProfileButton: document.getElementById('save-profile-button'),
    logoutProfileButton: document.getElementById('logout-profile-button'),
    savedAddressesContainer: document.getElementById('saved-addresses-container'),
    addAddressButton: document.getElementById('add-address-button'),

    cartModal: document.getElementById('cart-modal'),
    cartPanel: document.getElementById('cart-panel'),
    checkoutButton: document.getElementById('checkout-button'),
    deliveryAddressInput: document.getElementById('delivery-address-input'),
    closeCartButton: document.getElementById('close-cart-button'),
    cartItemsContainer: document.getElementById('cart-items'),
    cartTotal: document.getElementById('cart-total'),

    orderConfirmModal: document.getElementById('order-confirm-modal'),
    cancelOrderButton: document.getElementById('cancel-order-button'),
    sendOrderWhatsappButton: document.getElementById('send-order-whatsapp-button'),

    adminLoginModal: document.getElementById('admin-login-modal'),
    adminLoginForm: document.getElementById('admin-login-form'),
    closeAdminModalButton: document.getElementById('close-admin-modal-button'),

    // referências que serão atualizadas quando renderAdminScreen montar o DOM:
    adminPanelTitle: null,
    productFormTitle: null,
    productForm: null,
    productIdInput: null,
    productNameInput: null,
    productPriceInput: null,
    productCategoryInput: null,
    productDescriptionInput: null,
    productImageInput: null,
    productFeatured: null,
    submitProductButton: null,
    cancelEditButton: null,
    adminProductList: null,
    noProductsMessage: null,
};

// ====================================================================
// Verificação de Estrutura do DOM
// ====================================================================
function verifyDOMStructure() {
    const requiredElements = [
        'home-screen',
        'products-screen',
        'product-detail-screen',
        'settings-screen',
        'admin-screen',
        'profile-screen',
        'featured-products-container',
        'no-featured-message',
    ];

    const missingElements = [];

    requiredElements.forEach(elementId => {
        if (!document.getElementById(elementId)) {
            missingElements.push(elementId);
        }
    });

    if (missingElements.length > 0) {
        console.error('⚠️ ELEMENTOS FALTANDO NO HTML:', missingElements);
        return false;
    }

    console.log('✅ Estrutura do DOM verificada com sucesso!');
    return true;
}

// ====================================================================
// Traduções e Utilitários
// ====================================================================
const translations = {
    pt: {
        'app-title': 'Nó&Laço - Loja Online',
        'login-title': 'Cadastre-se para Comprar!',
        'full-name-label': 'Nome Completo',
        'phone-number-label': 'Número de Telefone',
        'login-button': 'Entrar/Registrar',
        'loading': 'Processando...',
        'loading-products': 'Carregando produtos...',
        'upload-photo': 'Carregar uma foto',
        'search-placeholder': 'Buscar produtos...',
        'your-cart-title': 'Seu Carrinho',
        'total-label': 'Total:',
        'checkout-button': 'Finalizar Compra',
        'confirm-order-title': 'Confirmar Pedido',
        'confirm-order-message': 'Seu pedido será enviado via WhatsApp para a finalização e confirmação dos detalhes. Continuar?',
        'cancel-button': 'Cancelar',
        'whatsapp-send-button': 'Enviar por WhatsApp',
        'admin-access-title': 'Acesso de Administrador',
        'admin-code-label': 'Código Secreto',
        'app-brand': 'Nó&Laço',
        'home-welcome': 'Bem-vindo à Nó&Laço!',
        'home-subtitle': 'A sua loja online de acessórios.',
        'view-products-btn': 'Ver Todos os Produtos',
        'add-to-cart-btn': 'Adicionar ao Carrinho',
        'product-details-title': 'Detalhes do Produto',
        'admin-panel-title': 'Painel de Administração',
        'settings-title': 'Configurações',
        'theme-label': 'Tema Escuro',
        'language-label': 'Idioma',
        'logout-button-settings': 'Sair',
        'add-new-product-title': 'Adicionar Novo Produto',
        'edit-product-title': 'Editar Produto',
        'add-product-button': 'Adicionar Produto',
        'save-changes-button': 'Salvar Alterações',
        'confirm-delete-product': 'Tem certeza que deseja excluir este produto?',
        'profile-title': 'Meu Perfil',
        'save-profile-button': 'Salvar Alterações',
        'addresses-title': 'Meus Endereços',
        'no-addresses-msg': 'Nenhum endereço salvo.',
        'logout-button-profile': 'Sair da Conta',
        'address-label': 'Confirme sua localização para a entrega',
    },
    en: {
        'app-title': 'Nó&Laço - Online Store',
        'login-title': 'Sign Up to Shop!',
        'full-name-label': 'Full Name',
        'phone-number-label': 'Phone Number',
        'login-button': 'Log In/Register',
        'loading': 'Processing...',
        'loading-products': 'Loading products...',
        'upload-photo': 'Upload a photo',
        'search-placeholder': 'Search products...',
        'your-cart-title': 'Your Cart',
        'total-label': 'Total:',
        'checkout-button': 'Checkout',
        'confirm-order-title': 'Confirm Order',
        'confirm-order-message': 'Your order will be sent via WhatsApp for finalization. Continue?',
        'cancel-button': 'Cancel',
        'whatsapp-send-button': 'Send via WhatsApp',
        'admin-access-title': 'Admin Access',
        'admin-code-label': 'Secret Code',
        'app-brand': 'Nó&Laço',
        'home-welcome': 'Welcome to Nó&Laço!',
        'home-subtitle': 'Your online accessories store.',
        'view-products-btn': 'View All Products',
        'add-to-cart-btn': 'Add to Cart',
        'product-details-title': 'Product Details',
        'admin-panel-title': 'Admin Panel',
        'settings-title': 'Settings',
        'theme-label': 'Dark Mode',
        'language-label': 'Language',
        'logout-button-settings': 'Logout',
        'add-new-product-title': 'Add New Product',
        'edit-product-title': 'Edit Product',
        'add-product-button': 'Add Product',
        'save-changes-button': 'Save Changes',
        'confirm-delete-product': 'Are you sure you want to delete this product?',
        'profile-title': 'My Profile',
        'save-profile-button': 'Save Changes',
        'addresses-title': 'My Addresses',
        'no-addresses-msg': 'No saved addresses.',
        'logout-button-profile': 'Logout',
        'address-label': 'Confirm your delivery location',
    }
};

function setLanguage(lang) {
    state.currentLanguage = lang;
    localStorage.setItem('appLang', lang);

    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                element.placeholder = translations[lang][key];
            } else if (element.tagName === 'TITLE') {
                document.title = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
}

function toggleLoading(show, messageKey = 'loading') {
    if (!UI.loadingModal || !UI.loadingMessage) return;

    if (show) {
        UI.loadingMessage.textContent = translations[state.currentLanguage][messageKey] || messageKey;
        UI.loadingModal.classList.remove('hidden', 'opacity-0');
        setTimeout(() => UI.loadingModal.classList.remove('opacity-0'), 10);
    } else {
        UI.loadingModal.classList.add('opacity-0');
        setTimeout(() => UI.loadingModal.classList.add('hidden'), 300);
    }
}

function showNotification(message, type = 'info') {
    if (!UI.notificationMessage) return;

    UI.notificationMessage.textContent = message;
    UI.notificationMessage.classList.remove('bg-green-500', 'bg-red-500', 'bg-blue-500');

    let bgColor = 'bg-blue-500';
    if (type === 'success') bgColor = 'bg-green-500';
    if (type === 'error') bgColor = 'bg-red-500';

    UI.notificationMessage.classList.add(bgColor);
    UI.notificationMessage.classList.remove('hidden', 'translate-x-full', 'opacity-0');

    setTimeout(() => UI.notificationMessage.classList.remove('translate-x-full', 'opacity-0'), 10);

    setTimeout(() => {
        UI.notificationMessage.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => UI.notificationMessage.classList.add('hidden'), 300);
    }, 4000);
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

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    applyTheme(isDark);
}

// ====================================================================
// Navegação
// ====================================================================
function navigateToScreen(screenId, productId = null, isGoingBack = false) {

    // Verificar existência da tela
    if (!screenId || !UI.screens[screenId]) {
        console.error(`Erro: Tela "${screenId}" não encontrada. Redirecionando para home.`);
        screenId = 'home';
    }

    const currentScreen = state.navigationHistory[state.navigationHistory.length - 1];

    // Salvar posição da lista de produtos
    if (currentScreen === 'products') {
        state.lastScrollPosition = window.scrollY;
    }

    // Esconder todas as telas
    Object.values(UI.screens).forEach(s => s?.classList.add('hidden'));

    // Registrar histórico
    if (!isGoingBack) {
        const lastScreen = state.navigationHistory[state.navigationHistory.length - 1];
        if (lastScreen !== screenId) {
            state.navigationHistory.push(screenId);
        }
    }

    // Exibir botão voltar
    if (state.navigationHistory.length > 1) {
        UI.backButton?.classList.remove('hidden');
    } else {
        UI.backButton?.classList.add('hidden');
    }

    // Mostrar a tela escolhida
    const screen = UI.screens[screenId];
    if (!screen) {
        console.error(`Erro crítico: Elemento da tela "${screenId}" não existe no DOM.`);
        return;
    }
    screen.classList.remove('hidden');

    // Renderizações específicas
    try {
        switch (screenId) {
            case 'home':
                renderHomeScreen();
                break;

            case 'products':
                UI.searchInput.value = '';
                renderProducts(state.products);

                if (isGoingBack && state.lastScrollPosition) {
                    requestAnimationFrame(() =>
                        window.scrollTo({ top: state.lastScrollPosition, behavior: "instant" })
                    );
                } else {
                    window.scrollTo(0, 0);
                }
                break;

            case 'product-detail':
                if (productId) renderProductDetail(productId);
                window.scrollTo(0, 0);
                break;

            case 'settings':
                renderSettingsScreen();
                break;

            case 'admin':
                state.isAdmin ? renderAdminScreen() : navigateToScreen('home');
                break;

            case 'profile':
                renderProfileScreen();
                break;
        }

    } catch (error) {
        console.error(`Erro ao renderizar tela "${screenId}":`, error);
        showNotification('Erro ao carregar a tela. Tente novamente.', 'error');
    }
}

function goBack() {
    if (state.navigationHistory.length <= 1) {
        navigateToScreen('home', null, true);
        return;
    }
    state.navigationHistory.pop();
    const previousScreen = state.navigationHistory[state.navigationHistory.length - 1];
    navigateToScreen(previousScreen || 'home', null, true);
}

// ====================================================================
// Upload / imagens
// ====================================================================
async function uploadImage(fileOrDataUrl) {
    const formData = new FormData();
    let fileToUpload = fileOrDataUrl;

    if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
        fileToUpload = dataURLtoBlob(fileOrDataUrl);
    }

    if (!(fileToUpload instanceof Blob || fileToUpload instanceof File)) {
        console.error("Erro: Tipo de arquivo inválido para upload.");
        return null;
    }

    formData.append('file', fileToUpload);
    formData.append('upload_preset', CONFIG.CLOUDINARY_UPLOAD_PRESET);

    try {
        const resp = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
        });
        const data = await resp.json();
        if (resp.ok) return data.secure_url;
        else throw new Error(data.error ? data.error.message : 'Upload failed');
    } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        return null;
    }
}

function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[arr.length - 1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

// Redimensiona/compacta e retorna DataURL (string). Já testado com canvas-toDataURL.
function processImage(file, maxWidth = 800, quality = 0.85) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round(height * (maxWidth / width));
                    width = maxWidth;
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                try {
                    const dataUrl = canvas.toDataURL('image/jpeg', quality);
                    resolve(dataUrl);
                } catch (err) {
                    reject('Erro ao gerar imagem processada: ' + err);
                }
            };

            img.onerror = () => reject('Erro ao carregar imagem para redimensionar.');
        };

        reader.onerror = () => reject('Erro ao ler o ficheiro.');
    });
}

// ====================================================================
// Login / Registro / Perfil
// ====================================================================
function handleProfilePictureChange(event) {
    const file = event.target.files && event.target.files[0];
    if (file) {
        state.profilePictureFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            if (UI.profilePreview) UI.profilePreview.src = e.target.result;
            UI.defaultProfileIcon?.classList.add('hidden');
            UI.profilePreviewContainer?.classList.remove('hidden');
            document.getElementById('profile-picture-upload-area')?.classList.remove('border-dashed', 'border-main');
            document.getElementById('profile-picture-upload-area')?.classList.add('border-solid', 'border-brand-primary');
        };
        reader.readAsDataURL(file);
    }
}

async function handleRegistration(event) {
    event.preventDefault();
    toggleLoading(true, 'loading');

    const { doc, getDoc, setDoc } = window.firebase;
    const db = window.db;

    const fullName = document.getElementById('full-name').value.trim();
    const phoneNumberRaw = document.getElementById('phone-number').value.trim();
    const phoneNumber = phoneNumberRaw.replace(/\D/g, '');

    const REQUIRED_PHONE_LENGTH = 12;

    if (!fullName || !phoneNumber) {
        showNotification('Por favor, preencha todos os campos.', 'error');
        toggleLoading(false);
        return;
    }

    const operatorPrefix = phoneNumber.substring(3, 5);

    if (phoneNumber.substring(0, 3) !== '258' || phoneNumber.length !== REQUIRED_PHONE_LENGTH) {
        showNotification(`Por favor, insira um número válido de ${REQUIRED_PHONE_LENGTH} dígitos, começando com 258.`, 'error');
        toggleLoading(false);
        return;
    }

    if (!CONFIG.VALID_MZ_PREFIXES.includes(operatorPrefix)) {
        showNotification(`O prefixo ${operatorPrefix} não é reconhecido. Use 82, 83, 84, 85, 86 ou 87.`, 'error');
        toggleLoading(false);
        return;
    }

    try {
        let profilePicUrl = 'https://placehold.co/100x100?text=User';

        if (state.profilePictureFile) {
            showNotification('Fazendo upload da foto...', 'info');
            // Process image for profile pic (smaller)
            const processed = await processImage(state.profilePictureFile, 300, 0.8);
            profilePicUrl = await uploadImage(processed) || profilePicUrl;
        }

        const userRef = doc(db, 'users', phoneNumber);
        const docSnap = await getDoc(userRef);

        const isAdministrator = phoneNumber === CONFIG.ADMIN_WHATSAPP_NUMBER;

        let userData;
        if (docSnap.exists()) {
            userData = docSnap.data();
            showNotification(`Bem-vindo(a) de volta, ${userData.fullName}!`, 'success');
            userData.role = isAdministrator ? 'admin' : (userData.role || 'user');
        } else {
            const role = isAdministrator ? 'admin' : 'user';

            userData = {
                id: phoneNumber,
                fullName,
                phoneNumber,
                profilePicture: profilePicUrl,
                role: role,
                createdAt: new Date().toISOString(),
            };
            await setDoc(userRef, userData);
            showNotification(`Cadastro realizado. Bem-vindo(a), ${userData.fullName}!`, 'success');
        }

        state.user = userData;
        localStorage.setItem('currentUser', JSON.stringify(userData));

        initializeAppUI();
    } catch (error) {
        console.error("Erro no registro/login: ", error);
        showNotification('Ocorreu um erro. Tente novamente.', 'error');
    } finally {
        toggleLoading(false);
    }
}

function handleLogout() {
    localStorage.removeItem('currentUser');
    // manter outros dados locais úteis? dependendo do UX, podemos ou não limpar tudo.
    state.user = null;
    state.cart = [];
    localStorage.setItem('cart', JSON.stringify([]));
    window.location.reload();
}

function handleProfileEdit(event) {
    event.preventDefault();

    if (!state.user) return;
    toggleLoading(true, 'loading');

    const newFullName = UI.profileFullNameInput?.value.trim() || state.user.fullName;
    const newPhoneNumber = UI.profilePhoneNumberInput?.value.trim() || state.user.phoneNumber;

    state.user.fullName = newFullName;
    state.user.phoneNumber = newPhoneNumber;
    localStorage.setItem('currentUser', JSON.stringify(state.user));

    if (UI.userProfileName) {
        UI.userProfileName.textContent = newFullName.split(' ')[0];
    }

    renderProfileScreen();

    showNotification('Perfil atualizado com sucesso!', 'success');
    toggleLoading(false);
}

// ====================================================================
// Produtos / Renderização
// ====================================================================
function listenToProducts() {
    const { collection, query, orderBy, onSnapshot } = window.firebase;
    const db = window.db;

    const q = query(
        collection(db, "products"),
        orderBy("createdAt", "desc")
    );

    onSnapshot(q, (snapshot) => {
        state.products = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                visible: data.visible ?? true
            };
        });

        // 🔥 Atualiza telas automaticamente
        renderHomeScreen();
        renderProducts(state.products);
        if (state.isAdmin) renderAdminScreen();
    });
}

function renderProductCard(product) {
    const imgUrl = product.imageUrl || 'https://placehold.co/400x300?text=Produto';
    const truncatedName = (product.name || '').replace(/'/g, "\\'");
    const price = (typeof product.price === 'number') ? product.price.toFixed(2) : product.price;
    return `
        <div class="bg-primary shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <img src="${imgUrl}" alt="${product.name}" class="w-full h-48 object-cover cursor-pointer" onclick="navigateToScreen('product-detail', '${product.id}')">
            <div class="p-4">
                <h3 class="text-lg font-bold truncate">${product.name}</h3>
                <p class="text-secondary text-sm mb-2">${product.category || ''}</p>
                <p class="text-xl font-extrabold text-brand-primary mb-3">${CONFIG.CURRENCY_SYMBOL} ${price}</p>
                <button
                    class="w-full py-2 px-4 bg-brand-primary text-white rounded-lg hover:bg-brand-hover transition-colors duration-300 text-sm font-semibold"
                    onclick="addToCart('${product.id}', '${truncatedName}', ${product.price}, '${imgUrl}')"
                    data-lang="add-to-cart-btn">
                    Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `;
}

function renderProducts(products) {
    const productsScreen = UI.screens['products'];
    if (!productsScreen) {
        console.error("Erro: O elemento products-screen não foi encontrado.");
        return;
    }

    // 🔥 FILTRAR produtos ocultos
    products = products.filter(p => p.visible !== false);

    if (!document.getElementById('product-grid')) {
        productsScreen.innerHTML = `<div id="product-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4"></div>`;
        UI.productGrid = document.getElementById('product-grid');
    }

    if (UI.productGrid) {
        if (!products || products.length === 0) {
            UI.productGrid.innerHTML = `<p class="text-center text-xl py-10 text-secondary">Nenhum produto encontrado.</p>`;
        } else {
            UI.productGrid.innerHTML = products.map(renderProductCard).join('');
        }
    }
    setLanguage(state.currentLanguage);
}

function renderProductDetail(productId) {
    state.lastScrollPosition = window.scrollY;

    const product = state.products.find(p => p.id === productId);
    if (!product) {
        showNotification('Produto não encontrado.', 'error');
        navigateToScreen('products');

        setTimeout(() => {
            window.scrollTo(0, state.lastScrollPosition || 0);
        }, 10);

        return;
    }

    const imgUrl = product.imageUrl || 'https://placehold.co/600x600?text=Produto';

    UI.productDetailContent.innerHTML = `
        <div class="max-w-4xl mx-auto bg-primary rounded-xl shadow-2xl overflow-hidden md:flex">
            <div class="md:w-1/2 p-4">
                <img src="${imgUrl}" alt="${product.name}" class="w-full h-96 object-cover rounded-lg shadow-lg">
            </div>
            <div class="md:w-1/2 p-6 space-y-4">
                <h1 class="text-4xl font-extrabold text-brand-primary">${product.name}</h1>
                <p class="text-secondary text-lg">${product.category}</p>
                <p class="text-2xl font-black text-green-500">${CONFIG.CURRENCY_SYMBOL} ${product.price.toFixed(2)}</p>
                <p class="text-primary leading-relaxed">${product.description || 'Descrição não disponível.'}</p>

                <div class="pt-4">
                    <button
                        class="w-full py-3 px-6 bg-brand-primary text-white rounded-xl hover:bg-brand-hover transition-colors duration-300 text-lg font-semibold flex items-center justify-center space-x-2"
                        onclick="addToCart('${product.id}', '${(product.name||'').replace(/'/g, "\\'")}', ${product.price}, '${imgUrl}')">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span data-lang="add-to-cart-btn">Adicionar ao Carrinho</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    setLanguage(state.currentLanguage);
}

// ====================================================================
// Carrinho
// ====================================================================
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(state.cart));
}

function updateCartUI() {
    if (!UI.cartItemCount || !UI.cartItemsContainer || !UI.cartTotal || !UI.checkoutButton) return;

    UI.cartItemCount.textContent = state.cart.reduce((total, item) => total + item.quantity, 0);
    UI.cartItemsContainer.innerHTML = '';

    if (state.cart.length === 0) {
        UI.cartItemsContainer.innerHTML = `<p class="text-center text-secondary py-10">O carrinho está vazio.</p>`;
        UI.cartTotal.textContent = `${CONFIG.CURRENCY_SYMBOL} 0.00`;
        UI.checkoutButton.disabled = true;
        return;
    }

    let total = 0;
    state.cart.forEach(item => {
        total += item.price * item.quantity;
        UI.cartItemsContainer.innerHTML += `
            <div class="flex items-center justify-between p-3 bg-primary rounded-lg shadow-sm">
                <img src="${item.imageUrl}" alt="${item.name}" class="w-12 h-12 object-cover rounded-md">
                <div class="flex-grow mx-3 truncate">
                    <p class="font-semibold truncate">${item.name}</p>
                    <p class="text-sm text-secondary">${CONFIG.CURRENCY_SYMBOL} ${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <div class="flex items-center space-x-2">
                    <input type="number" min="1" value="${item.quantity}"
                        onchange="updateCartItemQuantity('${item.id}', this.value)"
                        class="w-12 text-center border rounded-md bg-secondary border-main text-primary">
                    <button class="text-red-500 hover:text-red-700 p-1 rounded-full" onclick="removeFromCart('${item.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
            </div>
        `;
    });

    UI.cartTotal.textContent = `${CONFIG.CURRENCY_SYMBOL} ${total.toFixed(2)}`;
    UI.checkoutButton.disabled = false;
}

function addToCart(id, name, price, imageUrl, quantity = 1) {
    const existingItem = state.cart.find(item => item.id === id);
    const qty = parseInt(quantity);

    if (existingItem) {
        existingItem.quantity += qty;
    } else {
        state.cart.push({ id, name, price, imageUrl, quantity: qty });
    }

    saveCart();
    updateCartUI();
    showNotification(`${name} adicionado ao carrinho!`, 'success');
}

function removeFromCart(id) {
    state.cart = state.cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
    showNotification('Item removido do carrinho.', 'info');
}

function updateCartItemQuantity(id, quantity) {
    const qty = parseInt(quantity);
    if (qty <= 0 || isNaN(qty)) {
        removeFromCart(id);
        return;
    }

    const item = state.cart.find(i => i.id === id);
    if (item) {
        item.quantity = qty;
        saveCart();
        updateCartUI();
    }
}

function openCartModal() {
    if (!UI.cartModal || !UI.cartPanel) return;

    updateCartUI();
    UI.cartModal.classList.remove('hidden');
    setTimeout(() => {
        UI.cartModal.classList.add('opacity-100');
        UI.cartPanel.classList.remove('translate-x-full');
    }, 10);
}

function closeCartModal() {
    if (!UI.cartModal || !UI.cartPanel) return;

    UI.cartPanel.classList.add('translate-x-full');
    UI.cartModal.classList.remove('opacity-100');
    setTimeout(() => UI.cartModal.classList.add('hidden'), 300);
}

function prepareOrderMessage() {
    const deliveryAddress = state.user.deliveryAddress || "Endereço não fornecido";
    const encodedAddress = encodeURIComponent(deliveryAddress);
    const mapUrl = `https://www.google.com/maps/search/${encodedAddress}`;

    const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const formattedItems = state.cart.map((item, index) => {
        const subtotal = (item.price * item.quantity).toFixed(2);
        return `
${index + 1}) *${item.name}*
- Quantidade: ${item.quantity}
- Subtotal: ${CONFIG.CURRENCY_SYMBOL} ${subtotal}
`;
    }).join("");

    const message = `
 *NOVO PEDIDO – Nó&Laço*

 *Cliente:* ${state.user.fullName}
 *Telefone:* ${state.user.phoneNumber}
 *Endereço:* ${deliveryAddress}

 *Mapa:* ${mapUrl}

------------------------------
 *Itens do Pedido:*
${formattedItems}
------------------------------

 *Total:* *${CONFIG.CURRENCY_SYMBOL} ${total.toFixed(2)}*

 Obrigado!
Por favor confirme o pagamento e entrega.
    `;

    return encodeURIComponent(message.trim());
}

function sendOrderViaWhatsApp() {
    const message = prepareOrderMessage();
    const whatsappUrl = `https://wa.me/${CONFIG.ADMIN_WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappUrl, '_blank');

    state.cart = [];
    saveCart();
    updateCartUI();
    closeOrderConfirmModal();
    closeCartModal();
    showNotification('Pedido enviado com sucesso para o WhatsApp!', 'success');
}

function openOrderConfirmModal() {
    if (!UI.orderConfirmModal || !UI.deliveryAddressInput) return;

    if (state.cart.length === 0) {
        showNotification('O carrinho está vazio!', 'error');
        return;
    }

    const address = UI.deliveryAddressInput.value.trim();
    if (!address) {
        showNotification('Por favor, insira o endereço de entrega completo!', 'error');
        UI.deliveryAddressInput.focus();
        return;
    }

    state.user.deliveryAddress = address;

    UI.orderConfirmModal.classList.remove('hidden', 'opacity-0');
    setTimeout(() => UI.orderConfirmModal.classList.remove('opacity-0'), 10);
}

function closeOrderConfirmModal() {
    if (!UI.orderConfirmModal) return;

    UI.orderConfirmModal.classList.add('opacity-0');
    setTimeout(() => UI.orderConfirmModal.classList.add('hidden'), 300);
}

// ====================================================================
// Admin / CRUD Produtos (fixes e destaque)
// ====================================================================

function handleAdminLogin(event) {
    event.preventDefault();
    const code = document.getElementById('admin-code')?.value;

    if (code === CONFIG.INSECURE_ADMIN_CODE) {
        if (state.user) {
            state.user.role = 'admin';
            localStorage.setItem('currentUser', JSON.stringify(state.user));
            updateAdminVisibility();
            closeAdminModal();
            showNotification('Acesso de Admin ativado!', 'success');
            navigateToScreen('admin');
        } else {
            showNotification('Faça login primeiro para usar este código.', 'error');
        }
    } else {
        showNotification('Código secreto incorreto.', 'error');
    }

    if (document.getElementById('admin-code')) {
        document.getElementById('admin-code').value = '';
    }
}

function closeAdminModal() {
    if (!UI.adminLoginModal) return;
    UI.adminLoginModal.classList.add('opacity-0');
    setTimeout(() => UI.adminLoginModal.classList.add('hidden'), 300);
}

function updateAdminVisibility() {
    if (!UI.adminButton) return;

    if (state.isAdmin) {
        UI.adminButton.classList.remove('hidden');
    } else {
        UI.adminButton.classList.add('hidden');
    }
}

function resetProductForm() {
    if (!UI.productForm) return;

    UI.productForm.reset();
    if (UI.productIdInput) UI.productIdInput.value = '';
    if (UI.productFormTitle) {
        UI.productFormTitle.textContent = translations[state.currentLanguage]['add-new-product-title'] || 'Adicionar Novo Produto';
    }
    if (UI.submitProductButton) {
        UI.submitProductButton.textContent = translations[state.currentLanguage]['add-product-button'] || 'Adicionar Produto';
        UI.submitProductButton.classList.remove('bg-blue-500', 'hover:bg-blue-600');
        UI.submitProductButton.classList.add('bg-green-500', 'hover:bg-green-600');
    }
    if (UI.cancelEditButton) UI.cancelEditButton.classList.add('hidden');

    state.productToEdit = null;
    state.originalImageFile = null;

    if (UI.productImageInput) UI.productImageInput.value = '';
    if (UI.productFeatured) UI.productFeatured.checked = false;
}

// Função principal que salva produto (create/update)
async function handleProductSubmit(e) {
    e.preventDefault();
    toggleLoading(true, 'loading');

    const db = window.db;
    const { collection, doc, setDoc, updateDoc } = window.firebase;

    const isEditing = !!state.productToEdit;
    let productRef = null;

    try {
        const productName = UI.productNameInput?.value.trim();
        const productPrice = parseFloat(UI.productPriceInput?.value);
        const productCategory = UI.productCategoryInput?.value.trim();
        const productDescription = UI.productDescriptionInput?.value.trim();
        const isFeatured = !!(UI.productFeatured && UI.productFeatured.checked);

        if (!productName || isNaN(productPrice) || productPrice <= 0 || !productCategory) {
            showNotification('Por favor, preencha nome, preço (válido) e categoria.', 'error');
            toggleLoading(false);
            return;
        }

        // Determinar referência (novo ou existente)
        if (isEditing) {
            productRef = doc(db, 'products', state.productToEdit.id);
        } else {
            productRef = doc(collection(db, 'products')); // gera um docRef com id automático
        }

        // Preparar image (se houver originalImageFile)
        let productImageUrl = state.productToEdit?.imageUrl || 'https://placehold.co/400x300?text=Produto';

        if (state.originalImageFile) {
            // usa configurações atuais ou padrão
            const maxW = state.imageSettings?.maxWidth || 800;
            const quality = typeof state.imageSettings?.quality === 'number' ? state.imageSettings.quality : 0.85;

            const processedDataUrl = await processImage(state.originalImageFile, maxW, quality);
            // uploadImage aceita DataURL (converterá internamente)
            const uploadedUrl = await uploadImage(processedDataUrl);
            if (uploadedUrl) {
                productImageUrl = uploadedUrl;
            } else {
                showNotification('Erro ao fazer upload da imagem. Produto não salvo.', 'error');
                toggleLoading(false);
                return;
            }
        }

        // Montar objeto produto
        const now = new Date().toISOString();
        const productData = {
            name: productName,
            price: productPrice,
            category: productCategory,
            description: productDescription,
            imageUrl: productImageUrl,
            featured: isFeatured,
            updatedAt: now,
        };

        // Se for criar novo, definir createdAt e id
        if (!isEditing) {
            productData.createdAt = now;
            productData.id = productRef.id;
            await setDoc(productRef, productData);
            showNotification('Produto criado com sucesso!', 'success');
        } else {
            // manter createdAt existente
            productData.id = state.productToEdit.id;
            await setDoc(productRef, { ...state.productToEdit, ...productData }, { merge: true });
            showNotification('Produto atualizado com sucesso!', 'success');
        }

        // Atualizar lista local e UI
        listenToProducts();
        renderAdminScreen();
        resetProductForm();
    } catch (error) {
        console.error("Erro ao salvar produto:", error);
        showNotification('Erro ao salvar produto. Veja console.', 'error');
    } finally {
        toggleLoading(false);
    }
}

function editProduct(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    state.productToEdit = product;

    if (UI.productIdInput) UI.productIdInput.value = product.id;
    if (UI.productNameInput) UI.productNameInput.value = product.name;
    if (UI.productPriceInput) UI.productPriceInput.value = product.price;
    if (UI.productCategoryInput) UI.productCategoryInput.value = product.category;
    if (UI.productDescriptionInput) UI.productDescriptionInput.value = product.description;
    if (UI.productFeatured) UI.productFeatured.checked = !!product.featured;

    if (UI.productFormTitle) UI.productFormTitle.textContent = translations[state.currentLanguage]['edit-product-title'] || 'Editar Produto';
    if (UI.submitProductButton) {
        UI.submitProductButton.textContent = translations[state.currentLanguage]['save-changes-button'] || 'Salvar Alterações';
        UI.submitProductButton.classList.remove('bg-green-500', 'hover:bg-green-600');
        UI.submitProductButton.classList.add('bg-blue-500', 'hover:bg-blue-600');
    }
    if (UI.cancelEditButton) UI.cancelEditButton.classList.remove('hidden');

    const titleElement = document.getElementById('admin-panel-title');
    if (titleElement) titleElement.scrollIntoView({ behavior: 'smooth' });
}
window.editProduct = editProduct;

async function deleteProduct(productId) {
    if (!confirm(translations[state.currentLanguage]['confirm-delete-product'] || 'Tem certeza que deseja excluir este produto?')) {
        return;
    }

    toggleLoading(true, 'loading');
    try {
        const { doc, deleteDoc } = window.firebase;
        const db = window.db;

        await deleteDoc(doc(db, 'products', productId));
        showNotification('Produto excluído com sucesso!', 'success');
        listenToProducts();
        renderAdminScreen();
    } catch (error) {
        console.error("Erro ao excluir produto: ", error);
        showNotification('Erro ao excluir produto. Tente novamente.', 'error');
    } finally {
        toggleLoading(false);
    }
}
window.deleteProduct = deleteProduct;

// ====================================================================
// NOVO MÓDULO: Alternar Visibilidade do Produto (O OLHO)
// ====================================================================
async function toggleProductVisibility(productId, isCurrentlyVisible) {
    if (!state.isAdmin) {
        showNotification('Apenas administradores podem alterar a visibilidade.', 'error');
        return;
    }
    toggleLoading(true, 'Ajustando visibilidade...');
    try {
        const ref = doc(db, 'products', productId);
        // O status é invertido em relação ao estado atual
        const newVisibleStatus = !isCurrentlyVisible; 
        
        await updateDoc(ref, { 
            visible: newVisibleStatus, // Este é o NOVO campo no Firebase
            updatedAt: new Date().toISOString() 
        });

        // Após a atualização, recarrega os dados e a tela de Admin
        listenToProducts(); 
        renderAdminScreen();
        
        showNotification(newVisibleStatus ? 'Produto definido como VISÍVEL.' : 'Produto definido como OCULTO.', 'success');

    } catch (error) {
        console.error('Erro ao atualizar visibilidade:', error);
        showNotification('Erro ao atualizar visibilidade do produto.', 'error');
    } finally {
        toggleLoading(false);
    }
}

// Atualiza o status "featured" do produto (toggle)
async function toggleProductFeatured(productId) {
    try {
        toggleLoading(true, 'loading');
        const { doc, updateDoc } = window.firebase;
        const db = window.db;

        const product = state.products.find(p => p.id === productId);
        if (!product) throw new Error('Produto não encontrado');

        const newFeatured = !product.featured;
        const ref = doc(db, 'products', productId);
        await updateDoc(ref, { featured: newFeatured, updatedAt: new Date().toISOString() });

        // atualizar localmente e na UI
        listenToProducts();
        renderAdminScreen();
        showNotification(newFeatured ? 'Produto marcado como destaque.' : 'Produto removido dos destaques.', 'success');
    } catch (error) {
        console.error('Erro ao atualizar destaque:', error);
        showNotification('Erro ao atualizar destaque do produto.', 'error');
    } finally {
        toggleLoading(false);
    }
}

window.toggleProductVisibility = async function(productId) {
    try {
        const { doc, updateDoc } = window.firebase;
        const db = window.db;

        const product = state.products.find(p => p.id === productId);
        if (!product) return;

        const newStatus = !product.visible;

        await updateDoc(doc(db, "products", productId), {
            visible: newStatus
        });

        product.visible = newStatus;

        showNotification(
            newStatus ? "Produto agora está visível!" : "Produto ocultado!",
            "success"
        );

        // Atualiza todas as telas que dependem de produtos
        renderProductList();
        renderHomeScreen();
        renderProducts(state.products);

    } catch (error) {
        console.error("Erro ao alterar visibilidade:", error);
        showNotification("Erro ao alterar status do produto.", "error");
    }
}

window.toggleProductFeatured = toggleProductFeatured;

// Filtragem simples
function filterProducts(searchTerm, category = 'all') {
    const term = (searchTerm || '').toLowerCase().trim();

    const categoryFiltered = category === 'all'
        ? state.products
        : state.products.filter(product =>
            product.category && product.category.toLowerCase() === category.toLowerCase()
        );

    if (!term) {
        return categoryFiltered;
    }

    return categoryFiltered.filter(product =>
        (product.name || '').toLowerCase().includes(term) ||
        (product.description && product.description.toLowerCase().includes(term))
    );
}

function handleSearch(event) {
    const searchTerm = event.target.value;
    const currentScreenId = state.navigationHistory[state.navigationHistory.length - 1];

    if (searchTerm.trim() && currentScreenId !== 'products') {
        navigateToScreen('products');
    }

    const currentCategory = 'all';
    const filteredProducts = filterProducts(searchTerm, currentCategory);

    renderProducts(filteredProducts);
}

// ====================================================================
// Renderização de telas (home/settings/profile/admin)
// ====================================================================
function renderHomeScreen() {
    const homeScreen = UI.screens['home'];
    if (!homeScreen) {
        console.error("Erro: #home-screen não encontrada.");
        return;
    }

    const featuredContainer = document.getElementById('featured-products-container');
    const noFeaturedMessage = document.getElementById('no-featured-message');

    if (!state.products || state.products.length === 0) {
        return; // NÃO renderiza nada até o snapshot vir completo
    }

    homeScreen.classList.remove('hidden');
    featuredContainer.innerHTML = '';

    const featuredProducts = state.products.filter(p => p.featured && p.visible !== false);

    if (featuredProducts.length > 0) {
        noFeaturedMessage.classList.add('hidden');
        featuredContainer.innerHTML = featuredProducts.slice(0, 3).map(renderProductCard).join('');
    } else {
        noFeaturedMessage.classList.remove('hidden');
    }

    const viewAllBtn = document.getElementById('view-all-products-button');
    if (viewAllBtn) {
        viewAllBtn.onclick = () => navigateToScreen('products');
    }

    setLanguage(state.currentLanguage);}

function renderSettingsScreen() {
    const settingsScreen = UI.screens['settings'];
    if (!settingsScreen) return;

    settingsScreen.innerHTML = `
        <div class="max-w-xl mx-auto bg-secondary p-10 rounded-2xl shadow-xl space-y-8">
            <h2 class="text-3xl font-bold text-center text-brand-primary tracking-wide" data-lang="settings-title">Configurações</h2>

            <div class="flex justify-between items-center border-b pb-4 border-main/40">
                <label for="theme-toggle" class="text-lg font-medium text-primary tracking-wide" data-lang="theme-label">Tema Escuro</label>
                <input type="checkbox" id="theme-toggle" class="toggle toggle-lg bg-main checked:bg-brand-primary">
            </div>

            <div class="flex justify-between items-center border-b pb-4 border-main/40">
                <label for="lang-select" class="text-lg font-medium text-primary tracking-wide" data-lang="language-label">Idioma</label>
                <select id="lang-select" class="p-2 border border-main/40 rounded-xl bg-primary text-primary shadow-inner">
                    <option value="pt">Português (PT)</option>
                    <option value="en">English (EN)</option>
                </select>
            </div>

            ${state.user ? `
                <button id="logout-button" class="w-full py-3 px-4 rounded-xl text-lg font-semibold text-white bg-red-500 hover:bg-red-600 shadow-md hover:shadow-lg transition-all duration-300" data-lang="logout-button-settings">Sair</button>
            ` : ''}
        </div>
    `;

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.checked = document.documentElement.classList.contains('dark');
        themeToggle.addEventListener('change', e => applyTheme(e.target.checked));
    }

    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.value = state.currentLanguage;
        langSelect.addEventListener('change', e => {
            setLanguage(e.target.value);
            if (state.user) renderHomeScreen();
            renderSettingsScreen();
        });
    }

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) logoutButton.addEventListener('click', handleLogout);

    setLanguage(state.currentLanguage);
}

function renderProfileScreen() {
    if (!state.user) {
        navigateToScreen('home');
        return;
    }

    const profileScreen = document.getElementById('profile-screen');
    if (!profileScreen) return;

    profileScreen.innerHTML = `
        <div class="max-w-xl mx-auto bg-secondary p-8 rounded-xl shadow-2xl space-y-6">
            <h2 class="text-3xl font-bold text-center text-brand-primary" data-lang="profile-title">Meu Perfil</h2>

            <div class="flex flex-col items-center border-b pb-6 border-main">
                <img id="profile-pic-large" src="${state.user.profilePicture || 'https://placehold.co/150x150'}"
                     alt="Perfil"
                     class="w-32 h-32 rounded-full object-cover border-4 border-brand-primary mb-3 cursor-pointer transition-transform duration-300 hover:scale-105">
                <h3 id="profile-name-display" class="text-xl font-semibold text-primary mb-2">${state.user.fullName}</h3>
                <button id="change-profile-pic-btn" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    Alterar Foto
                </button>
                <input type="file" id="profile-picture-input" class="hidden" accept="image/*">
            </div>

            <form id="profile-edit-form" class="space-y-4" novalidate>
                <div>
                    <label for="profile-full-name" class="block text-sm font-medium text-secondary">Nome Completo</label>
                    <input type="text" id="profile-full-name" required class="mt-1 block w-full p-3 border border-main rounded-lg bg-primary text-primary focus:ring-brand-primary focus:border-brand-primary" value="${state.user.fullName}" autocomplete="name">
                </div>
                <div>
                    <label for="profile-phone-number" class="block text-sm font-medium text-secondary">Telefone (WhatsApp)</label>
                    <input type="tel" id="profile-phone-number" required class="mt-1 block w-full p-3 border border-main rounded-lg bg-primary text-primary focus:ring-brand-primary focus:border-brand-primary" value="${state.user.phoneNumber || ''}" autocomplete="tel">
                </div>
                
                <button type="submit" id="save-profile-button" data-lang="save-profile-button"
                        class="w-full py-3 px-4 rounded-xl text-lg font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors">
                    Salvar Alterações
                </button>
            </form>

            <div class="pt-6 border-t border-main">
                 <h4 class="text-xl font-bold text-primary mb-3" data-lang="addresses-title">Meus Endereços</h4>
                 <div id="saved-addresses-container" class="space-y-3">
                     ${state.user.deliveryAddress
                        ? `<div class="bg-primary p-3 rounded-lg flex justify-between items-center shadow-sm">
                                <span class="text-sm text-primary font-medium">${state.user.deliveryAddress} (Padrão)</span>
                                <button class="text-blue-500 hover:text-blue-700 text-sm">Editar</button>
                           </div>`
                        : `<p class="text-secondary" data-lang="no-addresses-msg">Nenhum endereço salvo.</p>`}
                 </div>
                 <button id="add-address-button" class="mt-4 w-full py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-hover transition-colors">
                     + Adicionar Novo Endereço
                 </button>
            </div>

            <button id="logout-profile-button" data-lang="logout-button-profile" class="w-full py-3 px-4 rounded-xl text-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors duration-300 mt-6">
                 Sair da Conta
            </button>
        </div>

        <!-- MODAL MODERNO DE PREVIEW -->
        <div id="profile-pic-modal" class="fixed inset-0 hidden justify-center items-center bg-black bg-opacity-70 z-50 opacity-0 transition-opacity duration-300">
            <div class="relative">
                <img id="profile-pic-modal-img" class="max-w-full max-h-[80vh] rounded-lg shadow-lg transform scale-90 transition-transform duration-300">
                <button id="close-modal-btn" class="absolute top-2 right-2 text-white text-2xl font-bold hover:text-red-500">&times;</button>
            </div>
        </div>
    `;

    const profilePic = document.getElementById('profile-pic-large');
    const changeBtn = document.getElementById('change-profile-pic-btn');
    const fileInput = document.getElementById('profile-picture-input');
    const modal = document.getElementById('profile-pic-modal');
    const modalImg = document.getElementById('profile-pic-modal-img');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // Abrir modal com animação
    profilePic.addEventListener('click', () => {
        modalImg.src = profilePic.src;
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.add('opacity-100'), 10);
        modalImg.classList.add('scale-100');
    });

    // Fechar modal
    const closeModal = () => {
        modal.classList.remove('opacity-100');
        modalImg.classList.remove('scale-100');
        setTimeout(() => modal.classList.add('hidden'), 300);
    };

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target === closeModalBtn) closeModal();
    });
    closeModalBtn.addEventListener('click', closeModal);

    // Abrir seletor de arquivo
    changeBtn.addEventListener('click', () => fileInput.click());

    // Upload Cloudinary
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) return;

        // Preview local imediato
        const reader = new FileReader();
        reader.onload = (evt) => profilePic.src = evt.target.result;
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CONFIG.CLOUDINARY_UPLOAD_PRESET);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/upload`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            state.user.profilePicture = data.secure_url;
            localStorage.setItem('currentUser', JSON.stringify(state.user));
            showNotification('Foto de perfil atualizada com sucesso!', 'success');
        } catch (err) {
            console.error(err);
            showNotification('Falha ao enviar a foto. Tente novamente.', 'error');
        }
    });

    // Salvar alterações do perfil
    const profileForm = document.getElementById('profile-edit-form');
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const fullName = document.getElementById('profile-full-name').value.trim();
        const phoneNumber = document.getElementById('profile-phone-number').value.trim();

        state.user.fullName = fullName;
        state.user.phoneNumber = phoneNumber;

        // Atualizar exibição imediata
        if (UI.profileNameDisplay) UI.profileNameDisplay.textContent = fullName;
        if (UI.userProfileName) UI.userProfileName.textContent = fullName.split(' ')[0];

        localStorage.setItem('currentUser', JSON.stringify(state.user));
        showNotification('Perfil atualizado com sucesso!', 'success');
    });

    setLanguage(state.currentLanguage);
}

function setupProfilePictureModal() {
    // Evita duplicar modal
    if (document.getElementById('profile-pic-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'profile-pic-modal';
    modal.style = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        display: none;
        flex-direction: column;
    `;

    modal.innerHTML = `
        <img id="profile-pic-preview" src="${state.user.profilePicture || 'https://placehold.co/150x150'}" 
             class="max-w-xs max-h-96 rounded-lg mb-4 object-cover border-4 border-white">
        <input type="file" id="profile-pic-input" accept="image/*" class="mb-3">
        <button id="close-profile-pic-modal" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Fechar</button>
    `;

    document.body.appendChild(modal);

    const input = modal.querySelector('#profile-pic-input');
    const preview = modal.querySelector('#profile-pic-preview');
    const closeBtn = modal.querySelector('#close-profile-pic-modal');

    // Abrir modal
    modal.style.display = 'flex';

    // Fechar modal
    closeBtn.onclick = () => modal.style.display = 'none';

    // Trocar foto
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith('image/')) return alert('Selecione uma imagem válida.');

        const reader = new FileReader();
        reader.onload = (evt) => {
            preview.src = evt.target.result;
            UI.profilePicLarge.src = evt.target.result;
            // Salvar no estado ou enviar para servidor
            state.profilePictureFile = file;
        };
        reader.readAsDataURL(file);
    };

    // Inicialmente escondido
    modal.style.display = 'none';
}

function openProfilePictureModal() {
    const modal = document.getElementById('profile-pic-modal');
    if (modal) modal.style.display = 'flex';
}

// Render admin screen e inicializa handlers de imagem e lista de produtos
function renderAdminScreen() {
    if (typeof resetProductForm === 'function') resetProductForm();

    const adminScreen = UI.screens['admin'];
    if (!adminScreen) return;

    adminScreen.innerHTML = `
        <div class="container mx-auto p-4 max-w-4xl">
            <h2 id="admin-panel-title" class="text-2xl font-bold text-red-600 mb-6" data-lang="admin-panel-title">Painel de Administração</h2>

            <div class="bg-secondary rounded-lg shadow-md p-6 mb-8">
                <h3 id="product-form-title" class="text-xl font-semibold mb-4" data-lang="add-new-product-title">Adicionar Novo Produto</h3>

                <form id="product-form" class="space-y-4">
                    <input type="hidden" id="product-id">

                    <div>
                        <label class="block text-primary font-medium mb-2">Nome do Produto</label>
                        <input type="text" id="product-name" required class="w-full px-4 py-2 border border-main rounded-lg bg-primary text-primary focus:ring-2 focus:ring-red-500">
                    </div>

                    <div>
                        <label class="block text-primary font-medium mb-2">Preço (MZN)</label>
                        <input type="number" id="product-price" step="0.01" required class="w-full px-4 py-2 border border-main rounded-lg bg-primary text-primary focus:ring-2 focus:ring-red-500">
                    </div>

                    <div>
                        <label class="block text-primary font-medium mb-2">Categoria</label>
                        <input type="text" id="product-category" required class="w-full px-4 py-2 border border-main rounded-lg bg-primary text-primary focus:ring-2 focus:ring-red-500">
                    </div>

                    <div>
                        <label class="block text-primary font-medium mb-2">Descrição</label>
                        <textarea id="product-description" rows="4" required class="w-full px-4 py-2 border border-main rounded-lg bg-primary text-primary focus:ring-2 focus:ring-red-500"></textarea>
                    </div>

                    <div>
                        <label class="block text-primary font-medium mb-2">Imagem do Produto</label>

                        <input type="file" id="product-image" accept="image/*" class="hidden">

                        <button type="button" id="choose-image-button"
                            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 mb-3">
                            📁 Escolher Imagem
                        </button>

                        <div id="image-preview-container" class="hidden mt-4">
                            <div class="border-2 border-main rounded-lg p-4 bg-primary">
                                <p class="text-sm font-semibold text-primary mb-2">Preview:</p>
                                <img id="image-preview" class="max-w-full h-64 object-contain rounded-lg mb-3 mx-auto">
                                <div id="image-info" class="text-sm text-secondary space-y-1 mb-4"></div>

                                <div class="space-y-3 bg-secondary p-3 rounded">
                                    <div>
                                        <label class="text-sm">Tamanho Máx: <span id="size-value">800px</span></label>
                                        <input type="range" id="max-size-slider" min="400" max="1200" value="800" step="50" class="w-full">
                                    </div>
                                    <div>
                                        <label class="text-sm">Qualidade: <span id="quality-value">85%</span></label>
                                        <input type="range" id="quality-slider" min="50" max="100" value="85" class="w-full">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-3">
                        <label class="flex items-center gap-2 text-sm">
                            <input type="checkbox" id="product-featured" class="rounded">
                            <span class="text-primary">Marcar como destaque</span>
                        </label>
                    </div>

                    <div class="flex gap-3">
                        <button type="submit" id="submit-product-button" class="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700" data-lang="add-product-button">Adicionar Produto</button>

                        <button type="button" id="cancel-edit-button" class="hidden px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600">Cancelar</button>
                    </div>
                </form>
            </div>

            <div class="bg-secondary rounded-lg shadow-md overflow-hidden">
                <h3 class="text-xl font-semibold p-6 border-b border-main">Produtos Cadastrados</h3>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-main">
                        <thead class="bg-primary">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-secondary uppercase">Produto</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-secondary uppercase">Preço</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-secondary uppercase">Status</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-secondary uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody id="admin-product-list" class="bg-primary divide-y divide-main"></tbody>
                    </table>
                </div>
                <p id="no-products-message" class="hidden text-center text-secondary py-8">Nenhum produto cadastrado ainda.</p>
            </div>
        </div>
    `;

    // Dar um pequeno tempo para o DOM montar e então ligar handlers
    setTimeout(() => {
        UI.productForm = document.getElementById('product-form');
        UI.productIdInput = document.getElementById('product-id');
        UI.productNameInput = document.getElementById('product-name');
        UI.productPriceInput = document.getElementById('product-price');
        UI.productCategoryInput = document.getElementById('product-category');
        UI.productDescriptionInput = document.getElementById('product-description');
        UI.productImageInput = document.getElementById('product-image');
        UI.productFeatured = document.getElementById('product-featured');
        UI.submitProductButton = document.getElementById('submit-product-button');
        UI.cancelEditButton = document.getElementById('cancel-edit-button');
        UI.productFormTitle = document.getElementById('product-form-title');
        UI.adminProductList = document.getElementById('admin-product-list');
        UI.noProductsMessage = document.getElementById('no-products-message');

        // Hooks imagem
        setupImageHandlers();

        // botão escolher imagem
        const chooseBtn = document.getElementById('choose-image-button');
        if (chooseBtn) chooseBtn.addEventListener('click', () => document.getElementById('product-image')?.click());

        // listeners do form
        if (UI.productForm) UI.productForm.addEventListener('submit', handleProductSubmit);
        if (UI.cancelEditButton) UI.cancelEditButton.addEventListener('click', resetProductForm);

        // render list
        renderProductList();
    }, 80);

    if (typeof setLanguage === 'function' && state.currentLanguage) {
        setLanguage(state.currentLanguage);
    }
}

function renderProductList() {
    if (!UI.adminProductList || !UI.noProductsMessage) return;

    UI.adminProductList.innerHTML = '';

    if (state.products.length === 0) {
        UI.noProductsMessage.classList.remove('hidden');
        return;
    } else {
        UI.noProductsMessage.classList.add('hidden');
    }

    state.products.forEach(product => {
        const visible = product.visible !== false; // padrão = visível

        UI.adminProductList.innerHTML += `
            <tr class="hover:bg-primary/50 transition-colors duration-200">
                
                <!-- Produto + Imagem -->
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <img class="h-10 w-10 rounded-full object-cover mr-4" 
                             src="${product.imageUrl || 'https://placehold.co/100x100?text=P'}" 
                             alt="${product.name}">
                        <div class="text-sm font-medium text-primary">${product.name}</div>
                    </div>
                </td>

                <!-- Preço -->
                <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                    ${CONFIG.CURRENCY_SYMBOL} ${(product.price || 0).toFixed(2)}
                </td>

                <!-- STATUS -->
                <td class="px-6 py-4 whitespace-nowrap space-x-1">

                    ${product.featured
                        ? `<span class="px-2 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800">Destaque</span>`
                        : `<span class="px-2 inline-flex text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Normal</span>`
                    }

                    ${visible
                        ? `<span class="px-2 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Visível</span>`
                        : `<span class="px-2 inline-flex text-xs font-semibold rounded-full bg-red-100 text-red-800">Oculto</span>`
                    }
                </td>

                <!-- AÇÕES -->
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">

                    <button onclick="editProduct('${product.id}')"
                        class="text-blue-600 hover:text-blue-900 transition">
                        Editar
                    </button>

                    <button onclick="deleteProduct('${product.id}')"
                        class="text-red-600 hover:text-red-900 transition">
                        Excluir
                    </button>

                    <button onclick="toggleProductFeatured('${product.id}')"
                        class="text-green-600 hover:text-green-900 transition">
                        ${product.featured ? 'Remover Destaque' : 'Marcar Destaque'}
                    </button>

                    <button onclick="toggleProductVisibility('${product.id}')"
                        class="text-yellow-600 hover:text-yellow-800 transition flex items-center gap-1">

                        ${visible ? '👁️ Ocultar' : '👁️‍🗨️ Exibir'}
                    </button>

                </td>
            </tr>
        `;
    });
}

// Setup do preview e sliders
function setupImageHandlers() {
    const fileInput = document.getElementById('product-image');
    const previewContainer = document.getElementById('image-preview-container');
    const previewImage = document.getElementById('image-preview');
    const imageInfo = document.getElementById('image-info');

    const maxSizeSlider = document.getElementById('max-size-slider');
    const sizeValue = document.getElementById('size-value');

    const qualitySlider = document.getElementById('quality-slider');
    const qualityValue = document.getElementById('quality-value');

    if (!fileInput) return;

    // substituir input para remover listeners antigos
    const newFileInput = fileInput.cloneNode(true);
    fileInput.parentNode.replaceChild(newFileInput, fileInput);

    newFileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];

        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Por favor, selecione apenas arquivos de imagem.');
                return;
            }

            state.originalImageFile = file;

            const reader = new FileReader();
            reader.onload = function (evt) {
                if (previewContainer) previewContainer.classList.remove('hidden');
                if (previewImage) previewImage.src = evt.target.result;

                if (imageInfo) {
                    imageInfo.innerHTML = `
                        <p><strong>Arquivo:</strong> ${file.name}</p>
                        <p><strong>Tamanho Original:</strong> ${(file.size / 1024).toFixed(2)} KB</p>
                    `;
                }
            };
            reader.readAsDataURL(file);
        }
    });

    if (maxSizeSlider && sizeValue) {
        maxSizeSlider.value = state.imageSettings.maxWidth || 800;
        sizeValue.textContent = maxSizeSlider.value + 'px';
        maxSizeSlider.addEventListener('input', (e) => {
            sizeValue.textContent = e.target.value + 'px';
            state.imageSettings.maxWidth = parseInt(e.target.value, 10);
        });
    }

    if (qualitySlider && qualityValue) {
        qualitySlider.value = Math.round((state.imageSettings.quality || 0.85) * 100);
        qualityValue.textContent = qualitySlider.value + '%';
        qualitySlider.addEventListener('input', (e) => {
            qualityValue.textContent = e.target.value + '%';
            state.imageSettings.quality = parseInt(e.target.value, 10) / 100;
        });
    }
}

// ====================================================================
// FUNÇÃO PARA CRIAR CADA LINHA DA TABELA ADMIN
// ====================================================================
function createAdminProductRow(product) {
    // Se o produto não tem 'visible' definido, assumimos que é true (compatibilidade)
    const isVisible = product.visible !== false; 
    const isFeatured = product.featured;

    // Estilo para destacar produtos ocultos (opcional, mas útil)
    const rowClass = isVisible ? 'hover:bg-main' : 'bg-red-50 dark:bg-red-900/20 hover:bg-red-100/50'; 
    const iconClass = isVisible ? 'fas fa-eye' : 'fas fa-eye-slash';
    const titleText = isVisible ? 'Ocultar Produto (Visível)' : 'Exibir Produto (Oculto)';
    
    // O template HTML para a linha da tabela
    return `
        <tr class="transition-colors duration-200 ${rowClass}" data-id="${product.id}">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                ${product.name}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                ${product.category || 'N/A'}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary">
                ${CONFIG.CURRENCY_SYMBOL} ${product.price.toFixed(2)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <span class="${isFeatured ? 'text-green-600' : 'text-gray-500'}">
                    ${isFeatured ? 'Sim' : 'Não'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3 flex items-center justify-end">
                
                <button 
                    onclick="toggleProductVisibility('${product.id}', ${isVisible})" 
                    title="${titleText}"
                    class="text-blue-500 hover:text-blue-700 transition-colors duration-200 p-1"
                >
                    <i class="${iconClass} text-lg"></i>
                </button>

                <button 
                    onclick="editProduct('${product.id}')" 
                    title="Editar Produto"
                    class="text-brand-primary hover:text-brand-hover transition-colors duration-200 p-1"
                >
                    <i class="fas fa-edit"></i>
                </button>

                <button 
                    onclick="toggleProductFeatured('${product.id}', ${isFeatured})" 
                    title="${isFeatured ? 'Remover Destaque' : 'Marcar Destaque'}"
                    class="${isFeatured ? 'text-yellow-500 hover:text-yellow-700' : 'text-gray-500 hover:text-gray-700'} transition-colors duration-200 p-1"
                >
                    <i class="fas fa-star"></i>
                </button>
                
                <button 
                    onclick="deleteProduct('${product.id}')" 
                    title="Excluir Produto"
                    class="text-red-500 hover:text-red-700 transition-colors duration-200 p-1"
                >
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `;
}

// ====================================================================
// Eventos globais e inicialização
// ====================================================================
function setupEventListeners() {
    if (UI.registrationForm) UI.registrationForm.addEventListener('submit', handleRegistration);
    if (UI.profilePictureInput) UI.profilePictureInput.addEventListener('change', handleProfilePictureChange);

    if (UI.searchInput) {
        UI.searchInput.addEventListener('keyup', handleSearch);
        UI.searchInput.addEventListener('change', handleSearch);
    }

    if (UI.backButton) UI.backButton.addEventListener('click', goBack);
    if (UI.settingsButton) UI.settingsButton.addEventListener('click', () => navigateToScreen('settings'));
    if (UI.viewAllProductsButton) UI.viewAllProductsButton?.addEventListener('click', () => navigateToScreen('products'));

    if (UI.userProfilePic) UI.userProfilePic.addEventListener('click', () => navigateToScreen('profile'));
    if (UI.userProfileName) UI.userProfileName.addEventListener('click', () => navigateToScreen('profile'));

    if (UI.cartButton) UI.cartButton.addEventListener('click', openCartModal);
    if (UI.closeCartButton) UI.closeCartButton.addEventListener('click', closeCartModal);
    if (UI.checkoutButton) UI.checkoutButton.addEventListener('click', openOrderConfirmModal);

    if (UI.cancelOrderButton) UI.cancelOrderButton.addEventListener('click', closeOrderConfirmModal);
    if (UI.sendOrderWhatsappButton) UI.sendOrderWhatsappButton.addEventListener('click', sendOrderViaWhatsApp);

    if (UI.profileEditForm) UI.profileEditForm.addEventListener('submit', handleProfileEdit);
    if (UI.logoutProfileButton) UI.logoutProfileButton.addEventListener('click', handleLogout);

    if (UI.adminButton) {
        UI.adminButton.addEventListener('click', () => {
            if (state.isAdmin) {
                navigateToScreen('admin');
            } else {
                if (UI.adminLoginModal) {
                    UI.adminLoginModal.classList.remove('hidden', 'opacity-0');
                    setTimeout(() => UI.adminLoginModal.classList.remove('opacity-0'), 10);
                }
            }
        });
    }

    if (UI.adminLoginForm) UI.adminLoginForm.addEventListener('submit', handleAdminLogin);
    if (UI.closeAdminModalButton) UI.closeAdminModalButton.addEventListener('click', closeAdminModal);

    window.navigateToScreen = navigateToScreen;
    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;
    window.updateCartItemQuantity = updateCartItemQuantity;
    window.editProduct = editProduct;
    window.deleteProduct = deleteProduct;
    window.toggleProductFeatured = toggleProductFeatured;
}

async function initializeAppUI() {
    try {
        UI.loginSection?.classList.add('hidden');
        UI.mainAppSection?.classList.remove('hidden');

        // Atualizar UI do usuário
        if (state.user && UI.userProfileName && UI.userProfilePic) {
            UI.userProfileName.textContent = state.user.fullName.split(' ')[0];
            UI.userProfilePic.src = state.user.profilePicture || 'https://placehold.co/100x100';
        }

        // 1️⃣ Carregar produtos antes da navegação
        listenToProducts();

        // Resetar o histórico corretamente
        state.navigationHistory = [];

        // 3️⃣ Agora sim ir para home
        navigateToScreen('home');

        updateCartUI();
        updateAdminVisibility();

    } catch (error) {
        console.error('Erro ao inicializar a interface:', error);
        showNotification('Erro ao inicializar a aplicação.', 'error');
    }
}

function initializeApp() {
    if (!window.db) {
        console.error("Firebase não inicializado.");
        document.body.innerHTML = "<h1 class='text-center text-red-500 p-8'>Erro Crítico: A conexão com o banco de dados falhou.</h1>";
        return;
    }

    if (!verifyDOMStructure()) {
        console.error('Inicialização abortada devido a elementos faltantes.');
        showNotification('Erro de estrutura da página. Recarregue a página.', 'error');
        return;
    }

    initializeTheme();
    setLanguage(state.currentLanguage);
    setupEventListeners();

    if (state.user) {
        initializeAppUI();
    } else {
        UI.loginSection?.classList.remove('hidden');
        UI.mainAppSection?.classList.add('hidden');
        state.navigationHistory = [];
        UI.backButton?.classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);

// ====================================================================
// Sistema OTA de Atualização - Nó&Laço
// ====================================================================

// Versão atual da aplicação
const APP_VERSION = "1.0.0";

// URL REAL do version.json hospedado no GitHub Pages
const VERSION_URL = "https://dennybonga99-hub.github.io/noelaco/version.json";

async function checkForAppUpdate() {
    // Ignora verificação no localhost (ambiente de desenvolvimento)
    const isLocalhost =
        window.location.hostname.includes("127.0.0.1") ||
        window.location.hostname.includes("localhost");

    if (isLocalhost) {
        console.log("Modo local: verificação de versão ignorada.");
        return;
    }

    try {
        const response = await fetch(VERSION_URL, { cache: "no-store" });

        // Caso a URL não exista
        if (!response.ok) {
            console.warn("Arquivo version.json não encontrado no servidor.");
            return;
        }

        const data = await response.json();

        if (!data.version) {
            console.warn("version.json inválido ou incompleto.");
            return;
        }

        if (data.version !== APP_VERSION) {
            showUpdatePopup(data.version, data.changes, data.forceUpdate);
        }

    } catch (error) {
        console.warn("Falha ao verificar atualização OTA:", error.message);
    }
}

function showUpdatePopup(newVersion, changes, forceUpdate = false) {
    const popup = document.createElement("div");
    popup.id = "update-popup";
    popup.style = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999999;
    `;

    popup.innerHTML = `
        <div style="
            background: white;
            padding: 25px;
            width: 85%;
            max-width: 380px;
            border-radius: 20px;
            text-align: center;
            font-family: Arial;
        ">
            <h2 style="font-size: 22px; margin-bottom: 10px; color: #1a1a1a;">
                Atualização Disponível
            </h2>

            <p style="font-size: 16px; margin-bottom: 15px;">
                Nova versão disponível: <b>${newVersion}</b>
            </p>

            <p style="font-size: 14px; margin-bottom: 15px; color: gray;">
                ${changes || "Melhorias aplicadas."}
            </p>

            <button id="update-now-btn" style="
                width: 100%;
                background: #0d6efd;
                color: white;
                padding: 12px;
                margin-bottom: 8px;
                border-radius: 12px;
                font-size: 16px;
                border: none;
            ">Atualizar Agora</button>

            ${!forceUpdate ? `
            <button id="update-later-btn" style="
                width: 100%;
                background: #ddd;
                color: #333;
                padding: 12px;
                border-radius: 12px;
                font-size: 16px;
                border: none;
            ">Depois</button>` : ""}
        </div>
    `;

    document.body.appendChild(popup);

    document.getElementById("update-now-btn").onclick = () => {
        popup.remove();
        reloadWithUpdate();
    };

    if (!forceUpdate) {
        document.getElementById("update-later-btn").onclick = () => popup.remove();
    }
}

function reloadWithUpdate() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then(regs => {
            for (let reg of regs) reg.unregister();
            location.reload(true);
        });
    } else {
        location.reload(true);
    }
}

// Inicialização
window.addEventListener("load", () => {
    setTimeout(() => checkForAppUpdate(), 1500);
});