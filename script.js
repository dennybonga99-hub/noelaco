// *** CONFIGURAÇÕES GLOBAIS ***
// TROQUE ESTES VALORES PARA SUA PRODUÇÃO!
const ADMIN_SECRET_CODE = "admin123"; 
const ADMIN_WHATSAPP_NUMBER = "258878384914"; // Seu número de WhatsApp (Moçambique)

// Configuração da Moeda (Metical Moçambicano)
const CURRENCY_SYMBOL = "MZN"; 
const EXCHANGE_RATE = 10.00; // Exemplo: 1 R$ (base) = 10 MZN

// Variáveis de estado
let products = []; 
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentLanguage = localStorage.getItem('language') || 'pt-br';
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// Rastreamento do histórico de telas
let screenHistory = [];
const homeScreenId = 'home-screen'; 

// --- ELEMENTOS DOM ---
// Elementos principais
const loginSection = document.getElementById('login-section');
const mainAppSection = document.getElementById('main-app-section');
const registrationForm = document.getElementById('registration-form');

// Navegação e Header
const backButton = document.getElementById('back-button'); 
const viewProductsBtn = document.getElementById('view-products-btn');

// Produtos e Detalhes
const productGrid = document.getElementById('product-grid');
const productDetailScreen = document.getElementById('product-detail-screen');
const productDetailContent = document.getElementById('product-detail-content');
const backFromDetailButton = document.getElementById('back-from-detail-button');
const commentForm = document.getElementById('comment-form');
const productIdCommentInput = document.getElementById('product-id-comment');
const commentTextInput = document.getElementById('comment-text');
const commentsList = document.getElementById('comments-list');
const noCommentsMessage = document.getElementById('no-comments-message');

// Carrinho
const cartButton = document.getElementById('cart-button');
const cartModal = document.getElementById('cart-modal');
const closeCartButton = document.getElementById('close-cart-button');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalSpan = document.getElementById('cart-total');
const cartItemCountSpan = document.getElementById('cart-item-count');
const checkoutButton = document.getElementById('checkout-button');
const orderConfirmModal = document.getElementById('order-confirm-modal');
const cancelOrderButton = document.getElementById('cancel-order-button');
const sendOrderWhatsappButton = document.getElementById('send-order-whatsapp-button');
const notificationMessage = document.getElementById('notification-message');

// Configurações
const settingsButton = document.getElementById('settings-button');
const settingsScreen = document.getElementById('settings-screen');
const themeToggle = document.getElementById('theme-toggle');
const languageSelect = document.getElementById('language-select');
const logoutButton = document.getElementById('logout-button');

// Login/Foto
const profilePictureInput = document.getElementById('profile-picture');
const profilePictureText = document.getElementById('profile-picture-text');
const profilePictureUploadArea = document.getElementById('profile-picture-upload-area'); 
const profilePreview = document.getElementById('profile-preview'); 
const profilePreviewContainer = document.getElementById('profile-preview-container'); 

// Admin
const adminButton = document.getElementById('admin-button');
const adminLoginModal = document.getElementById('admin-login-modal');
const closeAdminModalButton = document.getElementById('close-admin-modal-button');
const adminLoginForm = document.getElementById('admin-login-form');
const adminScreen = document.getElementById('admin-screen');
const productListAdmin = document.getElementById('product-list-admin');
const addProductForm = document.getElementById('add-product-form');
const formTitle = document.getElementById('form-title');
const submitProductButton = document.getElementById('submit-product-button');
const cancelEditButton = document.getElementById('cancel-edit-button');


// --- TRADUÇÕES ---
const translations = {
    'pt-br': {
        'welcome': 'Bem-vindo(a)',
        'start_now': 'Comece Agora',
        'discover_products': 'Descubra todos os produtos e informações disponíveis.',
        'view_products': 'Ver Produtos',
        'all_products': 'Todos os Produtos',
        'cart': 'Carrinho de Compras',
        'empty_cart': 'O carrinho está vazio.',
        'total': 'Total:',
        'checkout': 'Finalizar Compra',
        'success_purchase': 'Pedido enviado com sucesso!',
        'settings': 'Configurações',
        'dark_mode': 'Modo Escuro',
        'language': 'Idioma',
        'logout': 'Sair da Conta', 
        'add_to_cart': 'Adicionar ao Carrinho',
        'quantity': 'Quantidade:',
        'highlighted_products': 'Destaques da Semana',
        'highlighted_products_desc': 'Produtos selecionados com carinho para você!',
        'full_name': 'Nome Completo',
        'phone_number': 'Número de Telefone',
        'profile_picture': 'Foto de Perfil (opcional)',
        'upload_photo': 'Carregar uma foto',
        'confirm_order': 'Confirmar Pedido',
        'confirm_message': 'Deseja enviar seu pedido agora via WhatsApp?',
        'cancel': 'Cancelar',
        'send_order_now': 'Fazer Pedido Agora',
        'product_details': 'Detalhes do Produto', 
        'back_to_products': 'Voltar para Produtos', 
        'comments': 'Comentários', 
        'no_comments': 'Nenhum comentário ainda.', 
        'publish_comment': 'Publicar Comentário', 
        'enter_comment': 'Escreva seu comentário aqui...', 
        'added_to_cart': 'Adicionado ao carrinho!',
        'explore': 'Explore, Descubra, Compre.',
        'admin_access': 'Acesso Admin',
        'add_product': 'Adicionar Novo Produto',
        'edit_product': 'Editar Produto',
        'save_product': 'Salvar Produto',
        'cancel_edit': 'Cancelar Edição',
        'admin_list': 'Lista Atual de Produtos',
        'name_placeholder': 'Digite seu nome completo',
        'phone_placeholder': 'Ex: 84 123 4567'
    },
    'en-us': {
        'welcome': 'Welcome',
        'start_now': 'Start Now',
        'discover_products': 'Discover all available products and information.',
        'view_products': 'View Products',
        'all_products': 'All Products',
        'cart': 'Shopping Cart',
        'empty_cart': 'Your cart is empty.',
        'total': 'Total:',
        'checkout': 'Checkout',
        'success_purchase': 'Order sent successfully!',
        'settings': 'Settings',
        'dark_mode': 'Dark Mode',
        'language': 'Language',
        'logout': 'Log Out', 
        'add_to_cart': 'Add to Cart',
        'quantity': 'Quantity:',
        'highlighted_products': 'Weekly Highlights',
        'highlighted_products_desc': 'Products specially selected for you!',
        'full_name': 'Full Name',
        'phone_number': 'Phone Number',
        'profile_picture': 'Profile Picture (optional)',
        'upload_photo': 'Upload a photo',
        'confirm_order': 'Confirm Order',
        'confirm_message': 'Do you want to send your order now via WhatsApp?',
        'cancel': 'Cancel',
        'send_order_now': 'Place Order Now',
        'product_details': 'Product Details', 
        'back_to_products': 'Back to Products', 
        'comments': 'Comments', 
        'no_comments': 'No comments yet.', 
        'publish_comment': 'Post Comment', 
        'enter_comment': 'Write your comment here...', 
        'added_to_cart': 'Added to cart!',
        'explore': 'Explore, Discover, Shop.',
        'admin_access': 'Admin Access',
        'add_product': 'Add New Product',
        'edit_product': 'Edit Product',
        'save_product': 'Save Product',
        'cancel_edit': 'Cancel Edit',
        'admin_list': 'Current Product List',
        'name_placeholder': 'Enter your full name',
        'phone_placeholder': 'Ex: 84 123 4567'
    }
};

// --- FUNÇÕES UTILITÁRIAS ---

function formatPrice(priceReais) {
    const priceMZN = priceReais * EXCHANGE_RATE;
    // O valor é formatado para Meticais (MZN)
    return `${CURRENCY_SYMBOL} ${priceMZN.toLocaleString('pt-MZ', { minimumFractionDigits: 2 })}`;
}

function showNotification(title, message, colorClass) {
    notificationMessage.textContent = `${title}: ${message}`;
    notificationMessage.className = `fixed bottom-6 right-6 bg-${colorClass} text-white px-6 py-3 rounded-xl shadow-xl z-50 transition-all duration-300 transform translate-x-0 opacity-100`;
    
    setTimeout(() => {
        notificationMessage.classList.add('translate-x-full');
        notificationMessage.classList.remove('opacity-100');
        notificationMessage.classList.remove('translate-x-0');
    }, 3000);
}

function showModalWithAnimation(modalElement) {
    modalElement.classList.remove('hidden');
    setTimeout(() => {
        modalElement.classList.add('opacity-100');
        const content = modalElement.querySelector('div:last-child'); // Assumindo que o conteúdo é o último div filho
        if (content) {
            content.classList.remove('translate-x-full', 'scale-95');
            content.classList.add('translate-x-0', 'scale-100');
        }
    }, 10);
}

function hideModalWithAnimation(modalElement) {
    modalElement.classList.remove('opacity-100');
    const content = modalElement.querySelector('div:last-child');
    if (content) {
        content.classList.add('translate-x-full', 'scale-95');
        content.classList.remove('translate-x-0', 'scale-100');
    }
    setTimeout(() => {
        modalElement.classList.add('hidden');
    }, 300); // Deve ser igual ao tempo de transição no CSS/Tailwind
}


// --- FUNÇÕES DE NAVEGAÇÃO E UI ---

function showScreen(screenId, isBack = false) {
    const screens = [
        document.getElementById('home-screen'), 
        document.getElementById('products-screen'), 
        document.getElementById('settings-screen'), 
        document.getElementById('product-detail-screen'), 
        document.getElementById('admin-screen')
    ];
    
    screens.forEach(screen => {
        if (screen) {
            screen.classList.remove('screen-visible');
            screen.classList.add('hidden');
        }
    });
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
        setTimeout(() => {
            targetScreen.classList.add('screen-visible');
        }, 10); 
    }

    if (!isBack) {
        if (screenHistory.length === 0 || screenHistory[screenHistory.length - 1] !== screenId) {
            screenHistory.push(screenId);
        }
    } else {
        // Se estiver voltando, remove o item atual (o que foi desempilhado)
    }
    
    // Atualiza o botão de voltar
    if (screenHistory.length > 1) {
        backButton.classList.remove('hidden');
    } else {
        backButton.classList.add('hidden');
    }
}

function goBack() {
    if (screenHistory.length > 1) {
        screenHistory.pop();
        const prevScreenId = screenHistory[screenHistory.length - 1];
        showScreen(prevScreenId, true); 
    }
}

function applyTheme() {
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
        themeToggle.checked = true;
    } else {
        document.documentElement.classList.remove('dark');
        themeToggle.checked = false;
    }
}

function applyTranslations() {
    const lang = translations[currentLanguage];
    
    // Header e Botões de Navegação
    document.querySelector('#home-screen h2').textContent = lang.highlighted_products;
    document.querySelector('#home-screen p.text-lg').textContent = lang.highlighted_products_desc;
    document.querySelector('#home-screen h3').textContent = lang.start_now;
    document.querySelector('#home-screen .text-center p:nth-child(2)').textContent = lang.discover_products;
    viewProductsBtn.textContent = lang.view_products;
    
    // Tela de Produtos
    document.querySelector('#products-screen h2').textContent = lang.all_products;

    // Tela de Configurações
    document.querySelector('#settings-screen h2').textContent = lang.settings;
    document.querySelector('#settings-screen span.text-lg').textContent = lang.dark_mode;
    document.querySelector('#settings-screen label[for="language-select"]').textContent = lang.language;
    logoutButton.textContent = lang.logout;
    
    // Modais
    document.querySelector('#cart-modal h2').textContent = lang.cart;
    document.getElementById('cart-total-label').textContent = lang.total;
    checkoutButton.textContent = lang.checkout;
    document.querySelector('#order-confirm-modal h3').textContent = lang.confirm_order;
    document.querySelector('#order-confirm-modal p').textContent = lang.confirm_message;
    cancelOrderButton.textContent = lang.cancel;
    sendOrderWhatsappButton.textContent = lang.send_order_now;
    
    // Tela de Detalhes e Comentários
    if (backFromDetailButton) backFromDetailButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>${lang.back_to_products}`;
    if (document.querySelector('#comments-section h3')) document.querySelector('#comments-section h3').textContent = lang.comments;
    if (commentTextInput) commentTextInput.placeholder = lang.enter_comment;
    if (noCommentsMessage) noCommentsMessage.textContent = lang.no_comments;
    if (document.querySelector('#comment-form button')) document.querySelector('#comment-form button').textContent = lang.publish_comment;

    // Admin
    if (document.querySelector('#admin-login-modal h3')) document.querySelector('#admin-login-modal h3').textContent = lang.admin_access;
    if (formTitle) formTitle.textContent = lang.add_product;
    if (submitProductButton) submitProductButton.textContent = lang.save_product;
    if (cancelEditButton) cancelEditButton.textContent = lang.cancel_edit;
    if (document.querySelector('#product-list-admin')) document.querySelector('#product-list-admin').closest('.bg-white').querySelector('h3').textContent = lang.admin_list;

    // Login
    document.getElementById('full-name').placeholder = lang.name_placeholder;
    document.getElementById('phone-number').placeholder = lang.phone_placeholder;
    document.querySelector('label[for="full-name"]').textContent = lang.full_name;
    document.querySelector('label[for="phone-number"]').textContent = lang.phone_number;
    document.querySelector('label[for="profile-picture-upload"]').textContent = lang.profile_picture;
    profilePictureText.textContent = lang.upload_photo;


    // Re-renderiza o carrinho com a nova moeda/idioma
    updateCart(false);
    
    // Recarrega a lista de produtos (para traduzir botões)
    renderProducts();
}


// --- FUNÇÕES DE PRODUTOS E CARRINHO ---

function renderProducts() {
    productGrid.innerHTML = '';
    const lang = translations[currentLanguage];
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl cursor-pointer'; 
        productCard.dataset.id = product.id; 
        
        productCard.innerHTML = `
            <img class="w-full h-48 object-cover transition-transform duration-300 hover:scale-110" src="${product.imageUrl}" alt="${product.name}">
            <div class="p-4">
                <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">${product.name}</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${product.description ? product.description.substring(0, 50) + '...' : ''}</p>
                <div class="mt-4 flex items-center justify-between">
                    <span class="text-2xl font-extrabold text-brand-primary dark:text-brand-light">${formatPrice(product.price)}</span>
                    <button data-id="${product.id}" class="add-to-cart-btn bg-brand-primary text-white text-sm font-semibold py-2 px-4 rounded-full shadow-md hover:bg-brand-hover dark:bg-brand-light dark:hover:bg-brand-primary transition-colors duration-300 transform hover:scale-105">
                        ${lang.add_to_cart}
                    </button>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

function renderProductDetail(product) {
    const lang = translations[currentLanguage];
    
    productDetailContent.innerHTML = `
        <div class="lg:flex lg:space-x-10">
            <div class="lg:w-1/2 mb-6 lg:mb-0 overflow-hidden rounded-xl shadow-lg border-4 border-brand-light/30">
                <img src="${product.imageUrl}" alt="${product.name}" class="w-full h-96 object-cover transition-transform duration-500 hover:scale-105">
            </div>
            
            <div class="lg:w-1/2 space-y-6">
                <h2 class="text-4xl font-extrabold text-gray-900 dark:text-gray-100">${product.name}</h2>
                <span class="inline-block px-3 py-1 text-sm font-semibold text-white bg-brand-primary rounded-full">${lang.product_details}</span>
                
                <p class="text-2xl font-bold text-brand-primary dark:text-brand-light">${formatPrice(product.price)}</p>
                
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">${product.description}</p>
                
                <button data-id="${product.id}" class="add-to-cart-detail-btn w-full bg-green-500 text-white font-extrabold py-3 px-4 rounded-xl shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-[1.01]">
                    ${lang.add_to_cart}
                </button>
            </div>
        </div>
    `;
    
    productIdCommentInput.value = product.id;
}

function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    renderProductDetail(product);
    loadComments(productId);
    showScreen('product-detail-screen');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ 
            id: product.id, 
            name: product.name, 
            price: product.price, 
            quantity: 1 
        });
    }
    updateCart();
    showNotification(translations[currentLanguage].added_to_cart, `${product.name} adicionado.`, 'green-500');
}

function updateCart(saveToStorage = true) { 
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let totalItems = 0;
    const lang = translations[currentLanguage];

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="text-center text-gray-500 dark:text-gray-400 py-6">${lang.empty_cart}</p>`;
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            totalItems += item.quantity;
            const cartItem = document.createElement('div');
            cartItem.className = 'flex items-center justify-between py-3 px-2 border-b last:border-b-0 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 rounded-lg';
            cartItem.innerHTML = `
                <div>
                    <p class="text-brand-primary dark:text-brand-light font-semibold">${item.name}</p>
                    <p class="text-gray-600 dark:text-gray-400 text-sm">${lang.quantity} ${item.quantity} x ${formatPrice(item.price)}</p>
                </div>
                <span class="font-bold text-brand-primary dark:text-brand-light">${formatPrice(itemTotal)}</span>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }
    cartTotalSpan.textContent = formatPrice(total);
    cartItemCountSpan.textContent = totalItems;
    
    if (saveToStorage) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

function clearCart() {
    cart = [];
    updateCart();
    localStorage.removeItem('cart');
}

function sendOrderToWhatsApp() {
    hideModalWithAnimation(orderConfirmModal);
    
    const userName = localStorage.getItem('userName') || 'Cliente';
    const userPhone = localStorage.getItem('userPhone') || 'Não Informado';

    let message = `Olá! Meu nome é ${userName} e gostaria de fazer um pedido da Nó&Laço.\n\n`;
    message += `*Detalhes do Cliente:*\n`;
    message += `*Nome:* ${userName}\n`;
    message += `*Telefone:* +258 ${userPhone}\n\n`;
    message += `*Meu Pedido:*\n`;

    let totalReais = 0;
    cart.forEach((item, index) => {
        const itemTotalReais = item.price * item.quantity;
        totalReais += itemTotalReais;
        message += `${index + 1}. ${item.name} (${formatPrice(item.price)}) x ${item.quantity} = ${formatPrice(itemTotalReais)}\n`;
    });

    message += `\n*Total a Pagar:* ${formatPrice(totalReais)}`;
    message += `\n\nPor favor, confirme a disponibilidade e o valor total. Obrigado!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    clearCart();
    showNotification(translations[currentLanguage].success_purchase, "Detalhes do pedido enviados.", 'green-500');
}


// --- FUNÇÕES DE FIREBASE ---

async function loadProducts() {
    if (typeof db === 'undefined') return;
    
    try {
        const snapshot = await db.collection('produtos').get();
        products = snapshot.docs.map(doc => ({
            id: doc.id, 
            ...doc.data()
        }));
        
        console.log(`Produtos carregados: ${products.length}`);
        renderProducts(); 
        if (adminScreen && !adminScreen.classList.contains('hidden')) {
            renderAdminProductList();
        }
        
    } catch (error) {
        console.error("Erro ao carregar produtos do Firestore:", error);
    }
}

async function loadComments(productId) {
    const lang = translations[currentLanguage];
    commentsList.innerHTML = '';
    
    if (typeof db === 'undefined') {
        commentsList.innerHTML = `<p class="text-red-500 dark:text-red-400">ERRO: Firebase não conectado para carregar comentários.</p>`;
        return;
    }

    try {
        const commentsRef = db.collection('comments').where('productId', '==', productId.toString()).orderBy('timestamp', 'desc');
        const snapshot = await commentsRef.get();
        
        if (snapshot.empty) {
            noCommentsMessage.classList.remove('hidden');
        } else {
            noCommentsMessage.classList.add('hidden');
            snapshot.forEach(doc => {
                const data = doc.data();
                const commentDiv = document.createElement('div');
                commentDiv.className = 'border-l-4 border-brand-primary/50 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm';
                commentDiv.innerHTML = `
                    <p class="font-semibold text-gray-800 dark:text-gray-200">${data.userName || 'Cliente'}</p>
                    <p class="text-gray-600 dark:text-gray-400 mt-1">${data.text}</p>
                    <span class="text-xs text-gray-400 dark:text-gray-500 block mt-1">${data.timestamp ? new Date(data.timestamp.toDate()).toLocaleString() : 'Agora'}</span>
                `;
                commentsList.appendChild(commentDiv);
            });
        }
    } catch (error) {
        console.error("Erro ao carregar comentários:", error);
        commentsList.innerHTML = `<p class="text-red-500 dark:text-red-400">Não foi possível carregar os comentários.</p>`;
    }
}

// --- FUNÇÕES DE ADMIN (CRUD) ---

function renderAdminProductList() {
    productListAdmin.innerHTML = '';
    
    if (products.length === 0) {
        productListAdmin.innerHTML = '<p class="text-center text-gray-500 py-4">Nenhum produto cadastrado.</p>';
        return;
    }

    products.forEach(product => {
        const item = document.createElement('div');
        item.className = 'flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow';
        item.innerHTML = `
            <div class="flex items-center space-x-4">
                <img src="${product.imageUrl}" class="w-12 h-12 object-cover rounded-md" alt="${product.name}">
                <div>
                    <p class="font-bold text-gray-900 dark:text-gray-100">${product.name}</p>
                    <p class="text-sm text-brand-primary dark:text-brand-light">${formatPrice(product.price)}</p>
                </div>
            </div>
            <div class="space-x-2">
                <button data-id="${product.id}" class="edit-product-btn text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200 p-1 rounded transition-colors" title="Editar">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 pointer-events-none" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-4.606 5.645L1 17.25V19h1.75l8.114-8.114-2.828-2.828z" /></svg>
                </button>
                <button data-id="${product.id}" class="remove-product-btn text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200 p-1 rounded transition-colors" title="Remover">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 pointer-events-none" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 100 2v6a1 1 0 100-2V8z" clip-rule="evenodd" /></svg>
                </button>
            </div>
        `;
        productListAdmin.appendChild(item);
    });
}

function fillProductFormForEdit(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('product-id-to-edit').value = productId;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-image-url').value = product.imageUrl;
    
    formTitle.textContent = translations[currentLanguage].edit_product;
    submitProductButton.textContent = translations[currentLanguage].save_product;
    cancelEditButton.classList.remove('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetProductForm() {
    addProductForm.reset();
    document.getElementById('product-id-to-edit').value = '';
    formTitle.textContent = translations[currentLanguage].add_product;
    submitProductButton.textContent = translations[currentLanguage].save_product;
    cancelEditButton.classList.add('hidden');
}


// --- EVENT LISTENERS ---

// Login/Registro e Foto
if (profilePictureUploadArea) {
    profilePictureUploadArea.addEventListener('click', () => {
        profilePictureInput.click();
    });
}
profilePictureInput.addEventListener('change', () => {
    const file = profilePictureInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profilePreview.src = e.target.result;
            profilePreviewContainer.classList.remove('hidden');
        }
        reader.readAsDataURL(file);
        profilePictureText.textContent = file.name;
    } else {
        profilePreview.src = '';
        profilePreviewContainer.classList.add('hidden');
        profilePictureText.textContent = translations[currentLanguage].upload_photo;
    }
});

registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    const fullName = document.getElementById('full-name').value;
    const phoneNumber = document.getElementById('phone-number').value.replace(/\s/g, '');
    const file = profilePictureInput.files[0];
    let photoURL = '';

    try {
        if (file) {
            const storageRef = storage.ref(`profile_pictures/${phoneNumber}-${Date.now()}`);
            const uploadTask = await storageRef.put(file);
            photoURL = await uploadTask.ref.getDownloadURL();
        }

        await db.collection('users').doc(phoneNumber).set({
            fullName: fullName,
            phone: phoneNumber,
            photoURL: photoURL,
            registeredAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        // Salvar dados na memória local para manter o login
        localStorage.setItem('isRegistered', 'true');
        localStorage.setItem('userName', fullName);
        localStorage.setItem('userPhone', phoneNumber);
        localStorage.setItem('userPhotoURL', photoURL);
        
        loginSection.classList.add('hidden');
        mainAppSection.classList.remove('hidden');
        showScreen(homeScreenId);

    } catch (error) {
        console.error("Erro no registro ou upload:", error);
        alert("Ocorreu um erro ao tentar registrar. Verifique sua conexão e tente novamente.");
    }
});

// Navegação
viewProductsBtn.addEventListener('click', () => showScreen('products-screen'));
settingsButton.addEventListener('click', () => showScreen('settings-screen'));
if (backButton) backButton.addEventListener('click', goBack);
if (backFromDetailButton) backFromDetailButton.addEventListener('click', () => showScreen('products-screen'));
if (logoutButton) logoutButton.addEventListener('click', () => {
    localStorage.clear();
    location.reload(); 
});

// Carrinho e Checkout
cartButton.addEventListener('click', () => showModalWithAnimation(cartModal));
closeCartButton.addEventListener('click', () => hideModalWithAnimation(cartModal));
checkoutButton.addEventListener('click', () => {
    if (cart.length > 0) {
        hideModalWithAnimation(cartModal);
        showModalWithAnimation(orderConfirmModal);
    } else {
        showNotification("Carrinho Vazio", "Adicione produtos antes de finalizar.", 'red-500');
    }
});
cancelOrderButton.addEventListener('click', () => hideModalWithAnimation(orderConfirmModal));
sendOrderWhatsappButton.addEventListener('click', sendOrderToWhatsApp);

// Interação com Produtos (Grid de Produtos)
productGrid.addEventListener('click', (e) => {
    const target = e.target;
    const productId = target.closest('.rounded-2xl[data-id]')?.dataset.id || target.closest('.add-to-cart-btn')?.dataset.id;
    
    if (!productId) return;

    if (target.classList.contains('add-to-cart-btn')) {
        e.stopPropagation();
        addToCart(productId);
    } else if (target.closest('.rounded-2xl[data-id]')) {
        showProductDetail(productId);
    }
});

// Interação com Detalhes (Tela de Detalhes)
productDetailContent.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-detail-btn')) {
        addToCart(e.target.dataset.id);
    }
});

// Comentários
commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (typeof db === 'undefined') return;

    const productId = productIdCommentInput.value;
    const commentText = commentTextInput.value.trim();
    const userName = localStorage.getItem('userName') || 'Cliente';

    if (commentText.length === 0) return;

    try {
        await db.collection('comments').add({
            productId: productId,
            text: commentText,
            userName: userName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        commentTextInput.value = ''; 
        loadComments(productId); 
        
        showNotification("Comentário Publicado", "Obrigado pela sua opinião!", 'brand-primary');

    } catch (error) {
        console.error("Erro ao publicar comentário:", error);
        showNotification("Erro", "Não foi possível publicar seu comentário.", 'red-500');
    }
});

// Tema e Idioma
themeToggle.addEventListener('change', () => {
    isDarkMode = themeToggle.checked;
    localStorage.setItem('darkMode', isDarkMode);
    applyTheme();
});
languageSelect.addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    localStorage.setItem('language', currentLanguage);
    applyTranslations();
});

// Admin
adminButton.addEventListener('click', () => showModalWithAnimation(adminLoginModal));
closeAdminModalButton.addEventListener('click', () => hideModalWithAnimation(adminLoginModal));

adminLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = document.getElementById('admin-code').value;
    
    if (code === ADMIN_SECRET_CODE) {
        hideModalWithAnimation(adminLoginModal);
        showScreen('admin-screen');
        renderAdminProductList();
        resetProductForm();
    } else {
        alert("Código Secreto Incorreto.");
    }
    adminLoginForm.reset();
});

// CRUD de Produtos
addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const idToEdit = document.getElementById('product-id-to-edit').value;
    const data = {
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        price: parseFloat(document.getElementById('product-price').value),
        imageUrl: document.getElementById('product-image-url').value,
    };
    
    try {
        if (idToEdit) {
            await db.collection('produtos').doc(idToEdit).update(data);
            showNotification("Sucesso", `Produto ${data.name} atualizado.`, 'green-500');
        } else {
            await db.collection('produtos').add(data);
            showNotification("Sucesso", `Produto ${data.name} adicionado.`, 'green-500');
        }
        resetProductForm();
        await loadProducts(); // Recarrega todas as listas
    } catch (error) {
        console.error("Erro no CRUD do produto:", error);
        showNotification("Erro", "Falha ao salvar o produto.", 'red-500');
    }
});

productListAdmin.addEventListener('click', async (e) => {
    const target = e.target;
    const productId = target.closest('[data-id]')?.dataset.id;
    if (!productId) return;

    if (target.classList.contains('edit-product-btn')) {
        fillProductFormForEdit(productId);
    } else if (target.classList.contains('remove-product-btn')) {
        if (confirm("Tem certeza que deseja remover este produto?")) {
            try {
                await db.collection('produtos').doc(productId).delete();
                showNotification("Removido", "Produto excluído com sucesso.", 'red-500');
                await loadProducts();
            } catch (error) {
                console.error("Erro ao remover produto:", error);
                showNotification("Erro", "Falha ao remover o produto.", 'red-500');
            }
        }
    }
});

cancelEditButton.addEventListener('click', resetProductForm);


// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    const isRegistered = localStorage.getItem('isRegistered');
    
    if (isRegistered === 'true') {
        loginSection.classList.add('hidden');
        mainAppSection.classList.remove('hidden');
        showScreen(homeScreenId);
    } else {
        loginSection.classList.remove('hidden');
        mainAppSection.classList.add('hidden');
        screenHistory = [];
    }

    applyTheme();
    languageSelect.value = currentLanguage;
    applyTranslations();
    
    loadProducts(); 

});
