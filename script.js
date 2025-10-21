// ====================================================================
// Módulo de Configuração e Estado Global
// ====================================================================

const CONFIG = {
    CLOUDINARY_CLOUD_NAME: 'ddjpvbggk',
    CLOUDINARY_UPLOAD_PRESET: 'nodelaco_preset',
    ADMIN_WHATSAPP_NUMBER: '258878384914', // Sem o + para o link do WhatsApp
    INSECURE_ADMIN_CODE: '669900',
    CURRENCY_SYMBOL: 'MZN',
};

const state = {
    user: JSON.parse(localStorage.getItem('currentUser')) || null,
    isAdmin: localStorage.getItem('isAdmin') === 'true',
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    products: [],
    currentLanguage: localStorage.getItem('appLang') || 'pt',
    navigationHistory: [],
    profilePictureFile: null,
    productToEdit: null, // Novo estado para o admin CRUD
};

// ====================================================================
// Módulo de Seletores de UI
// ====================================================================

const UI = {
    // Globais
    loadingModal: document.getElementById('loading-modal'),
    loadingMessage: document.getElementById('loading-message'),
    notificationMessage: document.getElementById('notification-message'),
    loginSection: document.getElementById('login-section'),
    mainAppSection: document.getElementById('main-app-section'),
    backButton: document.getElementById('back-button'),

    // Formulário de Login/Registro
    registrationForm: document.getElementById('registration-form'),
    profilePictureInput: document.getElementById('profile-picture'),
    defaultProfileIcon: document.getElementById('default-profile-icon'),
    profilePreviewContainer: document.getElementById('profile-preview-container'),
    profilePreview: document.getElementById('profile-preview'),

    // Header/Navegação
    cartButton: document.getElementById('cart-button'),
    cartItemCount: document.getElementById('cart-item-count'),
    adminButton: document.getElementById('admin-button'),
    settingsButton: document.getElementById('settings-button'), 
    searchBar: document.getElementById('search-input'), 

    // Telas (Screens)
    screens: {
        'home': document.getElementById('home-screen'),
        'products': document.getElementById('products-screen'),
        'product-detail': document.getElementById('product-detail-screen'),
        'settings': document.getElementById('settings-screen'),
        'admin': document.getElementById('admin-screen'),
    },
    productGrid: null, 
    productDetailContent: document.getElementById('product-detail-screen'),

    // Modal do Carrinho
    cartModal: document.getElementById('cart-modal'),
    cartPanel: document.getElementById('cart-panel'),
    closeCartButton: document.getElementById('close-cart-button'),
    cartItemsContainer: document.getElementById('cart-items'), 
    cartTotal: document.getElementById('cart-total'),
    checkoutButton: document.getElementById('checkout-button'),

    // Modal de Confirmação
    orderConfirmModal: document.getElementById('order-confirm-modal'),
    cancelOrderButton: document.getElementById('cancel-order-button'),
    sendOrderWhatsappButton: document.getElementById('send-order-whatsapp-button'),

    // Modal de Admin
    adminLoginModal: document.getElementById('admin-login-modal'),
    adminLoginForm: document.getElementById('admin-login-form'),
    closeAdminModalButton: document.getElementById('close-admin-modal-button'),
    
    // Admin CRUD UI (Adicionado)
    adminPanelTitle: document.getElementById('admin-panel-title'),
    productFormTitle: document.getElementById('product-form-title'),
    productForm: document.getElementById('product-form'),
    productIdInput: document.getElementById('product-id'),
    productNameInput: document.getElementById('product-name'),
    productPriceInput: document.getElementById('product-price'),
    productCategoryInput: document.getElementById('product-category'),
    productDescriptionInput: document.getElementById('product-description'),
    productImageInput: document.getElementById('product-image'),
    submitProductButton: document.getElementById('submit-product-button'),
    cancelEditButton: document.getElementById('cancel-edit-button'),
    adminProductList: document.getElementById('admin-product-list'),
    noProductsMessage: document.getElementById('no-products-message'),
};

// ====================================================================
// Módulo de Traduções e Utilitários (Funções genéricas)
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
        'home-subtitle': 'A sua loja online de acessórios. Escolha a sua categoria favorita e comece a comprar!',
        'view-products-btn': 'Ver Todos os Produtos',
        'add-to-cart-btn': 'Adicionar ao Carrinho',
        'product-details-title': 'Detalhes do Produto',
        'admin-panel-title': 'Painel de Administração',
        'settings-title': 'Configurações',
        'theme-label': 'Tema Escuro',
        'language-label': 'Idioma',
        'logout-button-settings': 'Sair',
        // ADMIN CRUD TRADUÇÕES
        'add-new-product-title': 'Adicionar Novo Produto', 
        'edit-product-title': 'Editar Produto', 
        'add-product-button': 'Adicionar Produto', 
        'save-changes-button': 'Salvar Alterações', 
        'confirm-delete-product': 'Tem certeza que deseja excluir este produto?', 
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
        'confirm-order-message': 'Your order will be sent via WhatsApp for finalization and detail confirmation. Continue?',
        'cancel-button': 'Cancel',
        'whatsapp-send-button': 'Send via WhatsApp',
        'admin-access-title': 'Admin Access',
        'admin-code-label': 'Secret Code',
        'app-brand': 'Nó&Laço',
        'home-welcome': 'Welcome to Nó&Laço!',
        'home-subtitle': 'Your online accessories store. Choose your favorite category and start shopping!',
        'view-products-btn': 'View All Products',
        'add-to-cart-btn': 'Add to Cart',
        'product-details-title': 'Product Details',
        'admin-panel-title': 'Admin Panel',
        'settings-title': 'Settings',
        'theme-label': 'Dark Mode',
        'language-label': 'Language',
        'logout-button-settings': 'Logout',
        // ADMIN CRUD TRADUÇÕES
        'add-new-product-title': 'Add New Product', 
        'edit-product-title': 'Edit Product', 
        'add-product-button': 'Add Product', 
        'save-changes-button': 'Save Changes', 
        'confirm-delete-product': 'Are you sure you want to delete this product?',
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
    if (show) {
        UI.loadingMessage.textContent = translations[state.currentLanguage][messageKey] || 'Loading...';
        UI.loadingModal.classList.remove('hidden', 'opacity-0');
        setTimeout(() => UI.loadingModal.classList.remove('opacity-0'), 10);
    } else {
        UI.loadingModal.classList.add('opacity-0');
        setTimeout(() => UI.loadingModal.classList.add('hidden'), 300);
    }
}

function showNotification(message, type = 'info') {
    UI.notificationMessage.textContent = message;
    UI.notificationMessage.classList.remove('bg-green-500', 'bg-red-500', 'bg-blue-500');

    let bgColor = 'bg-blue-500';
    if (type === 'success') bgColor = 'bg-green-500';
    if (type === 'error') bgColor = 'bg-red-500';

    UI.notificationMessage.classList.add(bgColor);
    UI.notificationMessage.classList.remove('hidden', 'translate-x-full', 'opacity-0');
    
    // Animação de entrada
    setTimeout(() => UI.notificationMessage.classList.remove('translate-x-full', 'opacity-0'), 10);

    // Animação de saída
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
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    applyTheme(isDark);
}

// --- Funções de Navegação ---
function navigateToScreen(screenId, productId = null) {
    Object.values(UI.screens).forEach(screen => {
        if (screen) screen.classList.add('hidden');
    });

    if (screenId === 'home') {
        UI.backButton.classList.add('hidden');
    } else {
        UI.backButton.classList.remove('hidden');
    }

    const lastScreen = state.navigationHistory[state.navigationHistory.length - 1];
    if (lastScreen !== screenId) {
        state.navigationHistory.push(screenId);
    }

    const screen = UI.screens[screenId];
    if (screen) screen.classList.remove('hidden');

    if (screenId === 'home') {
        renderHomeScreen();
    } else if (screenId === 'products') {
        renderProducts(state.products);
    } else if (screenId === 'product-detail' && productId) {
        renderProductDetail(productId);
    } else if (screenId === 'settings') {
        renderSettingsScreen();
    } else if (screenId === 'admin') {
        if (state.isAdmin) renderAdminScreen();
        else navigateToScreen('home'); // Redireciona se não for admin
    }
}

function goBack() {
    state.navigationHistory.pop(); 
    const previousScreenId = state.navigationHistory[state.navigationHistory.length - 1];

    if (previousScreenId) {
        state.navigationHistory.pop(); 
        navigateToScreen(previousScreenId);
    } else {
        navigateToScreen('home');
    }
}

// ====================================================================
// MÓDULO DE LÓGICA DA APLICAÇÃO (Com Firebase v9)
// ====================================================================

// --- Funções de Upload ---

async function uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CONFIG.CLOUDINARY_UPLOAD_PRESET);

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (response.ok) return data.secure_url;
        else throw new Error(data.error.message);
    } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        return null;
    }
}

// --- Lógica de Login/Registro ---

function handleProfilePictureChange(event) {
    const file = event.target.files[0];
    if (file) {
        state.profilePictureFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            UI.profilePreview.src = e.target.result;
            UI.defaultProfileIcon.classList.add('hidden');
            UI.profilePreviewContainer.classList.remove('hidden');
            document.getElementById('profile-picture-upload-area').classList.remove('border-dashed', 'border-main');
            document.getElementById('profile-picture-upload-area').classList.add('border-solid', 'border-brand-primary');
            document.getElementById('profile-picture-text').textContent = translations[state.currentLanguage]['upload-photo'];
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
    const phoneNumber = document.getElementById('phone-number').value.trim().replace(/\D/g, '');

    if (!fullName || !phoneNumber) {
        showNotification('Por favor, preencha todos os campos.', 'error');
        toggleLoading(false);
        return;
    }

    try {
        let profilePicUrl = 'https://placehold.co/100x100?text=User';

        if (state.profilePictureFile) {
            showNotification('Fazendo upload da foto...', 'info');
            profilePicUrl = await uploadImage(state.profilePictureFile);
            if (!profilePicUrl) {
                showNotification('O upload da foto falhou, usando imagem padrão.', 'error');
            }
        }

        const userRef = doc(db, 'users', phoneNumber);
        const docSnap = await getDoc(userRef);

        let userData;
        if (docSnap.exists()) {
            userData = docSnap.data();
            showNotification(`Bem-vindo(a) de volta, ${userData.fullName}!`, 'success');
        } else {
            userData = {
                id: phoneNumber,
                fullName,
                phoneNumber,
                profilePicture: profilePicUrl,
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
    localStorage.clear();
    state.user = null;
    state.isAdmin = false;
    state.cart = [];
    window.location.reload();
}

// --- Funções de Produto e Renderização ---

async function fetchProducts() {
    toggleLoading(true, 'loading-products');
    const { collection, query, orderBy, getDocs } = window.firebase;
    const db = window.db;

    try {
        const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        state.products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    } catch (error) {
        console.error("Erro ao buscar produtos: ", error);
        showNotification('Não foi possível carregar os produtos.', 'error');
    } finally {
        toggleLoading(false);
    }
}

function renderProductCard(product) {
    const imgUrl = product.imageUrl || 'https://placehold.co/400x300?text=Produto';
    return `
        <div class="bg-primary shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <img src="${imgUrl}" alt="${product.name}" class="w-full h-48 object-cover cursor-pointer" onclick="navigateToScreen('product-detail', '${product.id}')">
            <div class="p-4">
                <h3 class="text-lg font-bold truncate">${product.name}</h3>
                <p class="text-secondary text-sm mb-2">${product.category}</p>
                <p class="text-xl font-extrabold text-brand-primary mb-3">${CONFIG.CURRENCY_SYMBOL} ${product.price.toFixed(2)}</p>
                <button 
                    class="w-full py-2 px-4 bg-brand-primary text-white rounded-lg hover:bg-brand-hover transition-colors duration-300 text-sm font-semibold"
                    onclick="addToCart('${product.id}', '${product.name.replace(/'/g, "\\'")}', ${product.price}, '${imgUrl}')"
                    data-lang="add-to-cart-btn">
                    Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `;
}

function renderProducts(products) {
    const productsScreen = UI.screens['products'];
    if (!productsScreen.innerHTML.trim() || !document.getElementById('product-grid')) {
        productsScreen.innerHTML = `<div id="product-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4"></div>`;
        UI.productGrid = document.getElementById('product-grid');
    }
    
    const filteredProducts = products; // Lógica de busca/filtro pode ser implementada aqui

    if (UI.productGrid) {
        UI.productGrid.innerHTML = filteredProducts.map(renderProductCard).join('');
    }
    setLanguage(state.currentLanguage);
}

function renderProductDetail(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) {
        showNotification('Produto não encontrado.', 'error');
        navigateToScreen('products');
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
                        onclick="addToCart('${product.id}', '${product.name.replace(/'/g, "\\'")}', ${product.price}, '${imgUrl}')">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span data-lang="add-to-cart-btn">Adicionar ao Carrinho</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    setLanguage(state.currentLanguage);
}


// --- Funções de Carrinho ---

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(state.cart));
}

function updateCartUI() {
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
    if (qty <= 0) {
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
    updateCartUI();
    UI.cartModal.classList.remove('hidden');
    UI.cartPanel.classList.remove('translate-x-full');
    setTimeout(() => UI.cartModal.classList.add('opacity-100'), 10);
}

function closeCartModal() {
    UI.cartPanel.classList.add('translate-x-full');
    UI.cartModal.classList.remove('opacity-100');
    setTimeout(() => UI.cartModal.classList.add('hidden'), 300);
}

function prepareOrderMessage() {
    const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    let message = `*Novo Pedido Nó&Laço*\n\n`;
    message += `*Cliente:* ${state.user.fullName} (Tel: ${state.user.phoneNumber})\n\n`;
    message += `*Itens do Pedido:*\n`;

    state.cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   Quantidade: ${item.quantity}\n`;
        message += `   Preço: ${CONFIG.CURRENCY_SYMBOL} ${item.price.toFixed(2)}/un\n`;
        message += `   Subtotal: ${CONFIG.CURRENCY_SYMBOL} ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    message += `\n*Total a Pagar:* ${CONFIG.CURRENCY_SYMBOL} ${total.toFixed(2)}\n\n`;
    message += `Por favor, confirme os detalhes do pagamento e entrega.`;

    return encodeURIComponent(message);
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
    if (state.cart.length === 0) {
        showNotification('O carrinho está vazio!', 'error');
        return;
    }
    UI.orderConfirmModal.classList.remove('hidden', 'opacity-0');
    setTimeout(() => UI.orderConfirmModal.classList.remove('opacity-0'), 10);
}

function closeOrderConfirmModal() {
    UI.orderConfirmModal.classList.add('opacity-0');
    setTimeout(() => UI.orderConfirmModal.classList.add('hidden'), 300);
}

// --- Funções de Admin e CRUD de Produtos ---

function handleAdminLogin(event) {
    event.preventDefault();
    const code = document.getElementById('admin-code').value;

    if (code === CONFIG.INSECURE_ADMIN_CODE) {
        state.isAdmin = true;
        localStorage.setItem('isAdmin', 'true');
        closeAdminModal();
        showNotification('Login de Admin bem-sucedido!', 'success');
        navigateToScreen('admin');
    } else {
        showNotification('Código secreto incorreto.', 'error');
    }
    document.getElementById('admin-code').value = '';
}

function closeAdminModal() {
    UI.adminLoginModal.classList.add('opacity-0');
    setTimeout(() => UI.adminLoginModal.classList.add('hidden'), 300);
}

function updateAdminButtonVisibility() {
    if (state.isAdmin) {
        UI.adminButton.classList.remove('hidden');
    } 
    // Mantido visível para login: UI.adminButton.classList.add('hidden');
}

// ADMIN CRUD FUNCTIONS

function resetProductForm() {
    UI.productForm.reset();
    UI.productIdInput.value = '';
    UI.productFormTitle.textContent = translations[state.currentLanguage]['add-new-product-title'] || 'Adicionar Novo Produto';
    UI.submitProductButton.textContent = translations[state.currentLanguage]['add-product-button'] || 'Adicionar Produto';
    UI.submitProductButton.classList.remove('bg-blue-500', 'hover:bg-blue-600');
    UI.submitProductButton.classList.add('bg-green-500', 'hover:bg-green-600');
    UI.cancelEditButton.classList.add('hidden');
    state.productToEdit = null;
    UI.productImageInput.value = ''; // Limpa o campo de arquivo
}

async function handleProductSubmit(event) {
    event.preventDefault();
    toggleLoading(true, 'loading');

    const { doc, setDoc, collection } = window.firebase;
    const db = window.db;

    const id = UI.productIdInput.value || doc(collection(db, "products")).id; 
    const isEditing = !!UI.productIdInput.value;

    const productName = UI.productNameInput.value;
    const productPrice = parseFloat(UI.productPriceInput.value);
    const productCategory = UI.productCategoryInput.value;
    const productDescription = UI.productDescriptionInput.value;
    let productImageUrl = isEditing && state.productToEdit ? state.productToEdit.imageUrl : 'https://placehold.co/400x300?text=Produto'; 

    try {
        if (UI.productImageInput.files[0]) {
            showNotification('Fazendo upload da imagem do produto...', 'info');
            const newImageUrl = await uploadImage(UI.productImageInput.files[0]);
            if (newImageUrl) {
                productImageUrl = newImageUrl;
            } else {
                showNotification('Falha no upload da imagem, usando a imagem anterior/padrão.', 'error');
            }
        }

        const productData = {
            name: productName,
            price: productPrice,
            category: productCategory,
            description: productDescription,
            imageUrl: productImageUrl,
            createdAt: state.productToEdit ? state.productToEdit.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await setDoc(doc(db, 'products', id), productData);

        if (isEditing) {
            showNotification('Produto atualizado com sucesso!', 'success');
        } else {
            showNotification('Novo produto adicionado com sucesso!', 'success');
        }

        await fetchProducts(); 
        renderAdminScreen(); 
        resetProductForm();

    } catch (error) {
        console.error("Erro ao salvar produto: ", error);
        showNotification('Erro ao salvar produto. Tente novamente.', 'error');
    } finally {
        toggleLoading(false);
    }
}

function editProduct(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    state.productToEdit = product; 

    UI.productIdInput.value = product.id;
    UI.productNameInput.value = product.name;
    UI.productPriceInput.value = product.price;
    UI.productCategoryInput.value = product.category;
    UI.productDescriptionInput.value = product.description;
    
    UI.productFormTitle.textContent = translations[state.currentLanguage]['edit-product-title'] || 'Editar Produto';
    UI.submitProductButton.textContent = translations[state.currentLanguage]['save-changes-button'] || 'Salvar Alterações';
    UI.submitProductButton.classList.remove('bg-green-500', 'hover:bg-green-600');
    UI.submitProductButton.classList.add('bg-blue-500', 'hover:bg-blue-600');
    UI.cancelEditButton.classList.remove('hidden');

    UI.adminPanelTitle.scrollIntoView({ behavior: 'smooth' });
}

async function deleteProduct(productId) {
    if (!confirm(translations[state.currentLanguage]['confirm-delete-product'] || 'Tem certeza que deseja excluir este produto?')) {
        return;
    }

    toggleLoading(true, 'loading');
    const { doc, deleteDoc } = window.firebase;
    const db = window.db;

    try {
        await deleteDoc(doc(db, 'products', productId));

        showNotification('Produto excluído com sucesso!', 'success');
        await fetchProducts(); 
        renderAdminScreen(); 

    } catch (error) {
        console.error("Erro ao excluir produto: ", error);
        showNotification('Erro ao excluir produto. Tente novamente.', 'error');
    } finally {
        toggleLoading(false);
    }
}


// ====================================================================
// Módulo de Renderização de Telas
// ====================================================================

function renderHomeScreen() {
    const homeScreen = UI.screens['home'];
    homeScreen.innerHTML = `
        <div class="text-center py-16 px-4 bg-secondary rounded-xl shadow-lg">
            <h2 class="text-5xl font-extrabold text-brand-primary mb-4" data-lang="home-welcome">Bem-vindo à Nó&Laço!</h2>
            <p class="text-xl text-secondary mb-8" data-lang="home-subtitle">A sua loja online de acessórios. Escolha a sua categoria favorita e comece a comprar!</p>
            <button id="view-products-btn" class="py-3 px-8 bg-brand-primary text-white text-lg font-semibold rounded-xl hover:bg-brand-hover transition-colors duration-300" data-lang="view-products-btn">
                Ver Todos os Produtos
            </button>
        </div>

        <h3 class="text-3xl font-bold mt-12 mb-6 text-primary">Destaques</h3>
        <div id="featured-products-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            ${state.products.slice(0, 3).map(renderProductCard).join('')}
        </div>
    `;
    document.getElementById('view-products-btn').addEventListener('click', () => navigateToScreen('products'));
    setLanguage(state.currentLanguage);
}

function renderSettingsScreen() {
    const settingsScreen = UI.screens['settings'];
    settingsScreen.innerHTML = `
        <div class="max-w-xl mx-auto bg-secondary p-8 rounded-xl shadow-2xl space-y-6">
            <h2 class="text-3xl font-bold text-center text-brand-primary" data-lang="settings-title">Configurações</h2>
            
            <div class="flex justify-between items-center border-b pb-4 border-main">
                <label for="theme-toggle" class="text-lg font-medium text-primary" data-lang="theme-label">Tema Escuro</label>
                <input type="checkbox" id="theme-toggle" class="toggle toggle-lg bg-main checked:bg-brand-primary">
            </div>

            <div class="flex justify-between items-center border-b pb-4 border-main">
                <label for="lang-select" class="text-lg font-medium text-primary" data-lang="language-label">Idioma</label>
                <select id="lang-select" class="p-2 border border-main rounded-lg bg-primary text-primary">
                    <option value="pt">Português (PT)</option>
                    <option value="en">English (EN)</option>
                </select>
            </div>
            
            ${state.user ? `
            <button id="logout-button" class="w-full py-3 px-4 rounded-xl text-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors duration-300" data-lang="logout-button-settings">
                Sair
            </button>` : ''}
        </div>
    `;
    
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.checked = document.documentElement.classList.contains('dark');
    themeToggle.addEventListener('change', (e) => applyTheme(e.target.checked));

    const langSelect = document.getElementById('lang-select');
    langSelect.value = state.currentLanguage;
    langSelect.addEventListener('change', (e) => {
        setLanguage(e.target.value);
        if (state.user) renderHomeScreen(); 
        renderSettingsScreen(); 
    });

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) logoutButton.addEventListener('click', handleLogout);

    setLanguage(state.currentLanguage);
}

function renderAdminScreen() {
    // A estrutura da tela admin está no HTML, apenas injetamos a lista de produtos
    resetProductForm(); // Garante que o formulário está limpo ao entrar
    
    UI.adminProductList.innerHTML = '';

    if (state.products.length === 0) {
        UI.noProductsMessage.classList.remove('hidden');
    } else {
        UI.noProductsMessage.classList.add('hidden');
        state.products.forEach(product => {
            UI.adminProductList.innerHTML += `
                <tr class="hover:bg-primary/50 transition-colors duration-200">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <img class="h-10 w-10 rounded-full object-cover mr-4" src="${product.imageUrl || 'https://placehold.co/100x100?text=P'}" alt="${product.name}">
                            <div class="text-sm font-medium text-primary">${product.name}</div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary">${CONFIG.CURRENCY_SYMBOL} ${product.price.toFixed(2)}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button onclick="editProduct('${product.id}')" class="text-blue-600 hover:text-blue-900 transition-colors duration-200">Editar</button>
                        <button onclick="deleteProduct('${product.id}')" class="text-red-600 hover:text-red-900 transition-colors duration-200">Excluir</button>
                    </td>
                </tr>
            `;
        });
    }

    setLanguage(state.currentLanguage);
}


// ====================================================================
// Módulo Principal da Aplicação e Eventos
// ====================================================================

function setupEventListeners() {
    // Formulário de Login/Registro
    if (UI.registrationForm) UI.registrationForm.addEventListener('submit', handleRegistration);
    if (UI.profilePictureInput) UI.profilePictureInput.addEventListener('change', handleProfilePictureChange);

    // Navegação
    if (UI.backButton) UI.backButton.addEventListener('click', goBack);
    if (UI.settingsButton) UI.settingsButton.addEventListener('click', () => navigateToScreen('settings'));
    
    // Carrinho
    if (UI.cartButton) UI.cartButton.addEventListener('click', openCartModal);
    if (UI.closeCartButton) UI.closeCartButton.addEventListener('click', closeCartModal);
    if (UI.checkoutButton) UI.checkoutButton.addEventListener('click', openOrderConfirmModal);

    // Confirmação de Pedido
    if (UI.cancelOrderButton) UI.cancelOrderButton.addEventListener('click', closeOrderConfirmModal);
    if (UI.sendOrderWhatsappButton) UI.sendOrderWhatsappButton.addEventListener('click', sendOrderViaWhatsApp);

    // Admin
    if (UI.adminButton) {
        UI.adminButton.addEventListener('click', () => {
            if (state.isAdmin) {
                navigateToScreen('admin');
            } else {
                UI.adminLoginModal.classList.remove('hidden');
                setTimeout(() => UI.adminLoginModal.classList.remove('opacity-0'), 10);
            }
        });
    }
    if (UI.adminLoginForm) UI.adminLoginForm.addEventListener('submit', handleAdminLogin);
    if (UI.closeAdminModalButton) UI.closeAdminModalButton.addEventListener('click', closeAdminModal);
    
    // Admin CRUD Listeners
    if (UI.productForm) UI.productForm.addEventListener('submit', handleProductSubmit);
    if (UI.cancelEditButton) UI.cancelEditButton.addEventListener('click', resetProductForm);

    // Torna as funções globais para uso no HTML inline (ex: onclick)
    window.navigateToScreen = navigateToScreen;
    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;
    window.updateCartItemQuantity = updateCartItemQuantity;
    window.editProduct = editProduct;
    window.deleteProduct = deleteProduct;
}

async function initializeAppUI() {
    UI.loginSection.classList.add('hidden');
    UI.mainAppSection.classList.remove('hidden');
    
    await fetchProducts(); 
    
    state.navigationHistory = ['home'];
    navigateToScreen('home');

    updateCartUI();
    updateAdminButtonVisibility();
}

function initializeApp() {
    if (!window.db) {
        console.error("Firebase não inicializado.");
        document.body.innerHTML = "<h1>Erro Crítico: A conexão com o banco de dados falhou.</h1>";
        return;
    }
    
    initializeTheme();
    setupEventListeners();
    setLanguage(state.currentLanguage); // Aplica as traduções

    if (state.user) {
        initializeAppUI();
    } else {
        UI.loginSection.classList.remove('hidden');
        UI.mainAppSection.classList.add('hidden');
        state.navigationHistory = [];
        UI.backButton.classList.add('hidden');
    }
};

// Inicia a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializeApp);