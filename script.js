// Dados simulados de produtos (você pode editar isso)
const products = [
    { id: 1, name: "Caderno Pautado", description: "Caderno com capa dura e 100 folhas pautadas.", price: 15.90, imageUrl: "https://placehold.co/400x300/e9e9e9/555555?text=Caderno" },
    { id: 2, name: "Caneta Esferográfica", description: "Caneta de tinta azul com ponta fina.", price: 3.50, imageUrl: "https://placehold.co/400x300/e9e9e9/555555?text=Caneta" },
    { id: 3, name: "Mochila Escolar", description: "Mochila com compartimento para notebook.", price: 120.00, imageUrl: "https://placehold.co/400x300/e9e9e9/555555?text=Mochila" },
    { id: 4, name: "Garrafa Térmica", description: "Garrafa de inox para manter líquidos quentes ou frios.", price: 45.00, imageUrl: "https://placehold.co/400x300/e9e9e9/555555?text=Garrafa" },
    { id: 5, name: "Fones de Ouvido", description: "Fones sem fio com alta qualidade de som.", price: 89.90, imageUrl: "https://placehold.co/400x300/e9e9e9/555555?text=Fones" },
    { id: 6, name: "Cabo USB-C", description: "Cabo para carregamento e transferência de dados.", price: 19.99, imageUrl: "https://placehold.co/400x300/e9e9e9/555555?text=Cabo" },
    { id: 7, name: "Teclado Mecânico", description: "Teclado para jogos e digitação profissional.", price: 250.00, imageUrl: "https://placehold.co/400x300/e9e9e9/555555?text=Teclado" },
    { id: 8, name: "Mouse Óptico", description: "Mouse ergonômico com sensor de alta precisão.", price: 65.50, imageUrl: "https://placehold.co/400x300/e9e9e9/555555?text=Mouse" },
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentLanguage = localStorage.getItem('language') || 'pt-br';
let isDarkMode = localStorage.getItem('darkMode') === 'true';

// NOVO: Rastreamento do histórico de telas
let screenHistory = [];
const homeScreenId = 'home-screen'; // Tela inicial padrão

// ** ATENÇÃO: Mude este número para o seu WhatsApp do Admin/Loja (código do país + número) **
const ADMIN_WHATSAPP_NUMBER = "258841234567"; // Exemplo: 258 84 123 4567

// Elementos do DOM
const loginSection = document.getElementById('login-section');
const mainAppSection = document.getElementById('main-app-section');
const registrationForm = document.getElementById('registration-form');
const productGrid = document.getElementById('product-grid');
const cartButton = document.getElementById('cart-button');
const settingsButton = document.getElementById('settings-button');
const cartModal = document.getElementById('cart-modal');
const closeCartButton = document.getElementById('close-cart-button');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalSpan = document.getElementById('cart-total');
const cartItemCountSpan = document.getElementById('cart-item-count');
const checkoutButton = document.getElementById('checkout-button');
const notificationMessage = document.getElementById('notification-message');
const homeScreen = document.getElementById('home-screen');
const productsScreen = document.getElementById('products-screen');
const settingsScreen = document.getElementById('settings-screen');
const viewProductsBtn = document.getElementById('view-products-btn');
const themeToggle = document.getElementById('theme-toggle');
const languageSelect = document.getElementById('language-select');
const orderConfirmModal = document.getElementById('order-confirm-modal');
const cancelOrderButton = document.getElementById('cancel-order-button');
const sendOrderWhatsappButton = document.getElementById('send-order-whatsapp-button');

// Elementos de Login/Foto
const profilePictureInput = document.getElementById('profile-picture');
const profilePictureText = document.getElementById('profile-picture-text');
const profilePictureUploadArea = document.querySelector('.cursor-pointer'); 
const profilePreview = document.getElementById('profile-preview'); 
const profilePreviewContainer = document.getElementById('profile-preview-container'); 

// Botões de Navegação
const logoutButton = document.getElementById('logout-button');
const backButton = document.getElementById('back-button'); 

// Traduções
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
        'send_order_now': 'Fazer Pedido Agora'
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
        'send_order_now': 'Place Order Now'
    }
};

// --- Funções Principais de Navegação e UI ---

function showScreen(screenId, isBack = false) {
    const screens = [homeScreen, productsScreen, settingsScreen];
    
    // 1. Oculta todas as telas
    screens.forEach(screen => screen.classList.add('hidden'));
    
    // 2. Mostra a tela desejada
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
    }

    // 3. Gerencia o histórico de navegação
    if (!isBack) {
        // Evita adicionar a mesma tela repetidamente
        if (screenHistory.length === 0 || screenHistory[screenHistory.length - 1] !== screenId) {
            screenHistory.push(screenId);
        }
    } else {
        // Se for um "voltar", remove a tela atual do histórico
        screenHistory.pop();
    }
    
    // 4. Mostra/Oculta o botão de voltar
    // O botão só aparece se houver mais de uma tela no histórico E se a tela atual não for a Home
    if (screenHistory.length > 1 && screenHistory[screenHistory.length - 1] !== homeScreenId) {
        backButton.classList.remove('hidden');
    } else {
        backButton.classList.add('hidden');
    }
}

function goBack() {
    if (screenHistory.length > 1) {
        // Usa a lógica de pop e repush da tela anterior
        screenHistory.pop();
        const prevScreenId = screenHistory[screenHistory.length - 1];
        showScreen(prevScreenId, true);
    }
}

function previewProfilePicture(file) {
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            profilePreview.src = e.target.result;
            profilePreviewContainer.classList.remove('hidden');
        }
        reader.readAsDataURL(file);
    } else {
        profilePreview.src = '';
        profilePreviewContainer.classList.add('hidden');
    }
}

function applyTranslations() {
    const lang = translations[currentLanguage];
    
    // Login Screen
    document.querySelector('label[for="full-name"]').textContent = lang.full_name;
    document.querySelector('label[for="phone-number"]').textContent = lang.phone_number;
    document.querySelector('label[for="profile-picture"]').textContent = lang.profile_picture;
    
    // Atualiza o texto do upload e lida com o estado da pré-visualização
    const file = profilePictureInput.files[0];
    if (file) {
        profilePictureText.textContent = file.name;
        previewProfilePicture(file);
    } else {
        profilePictureText.textContent = lang.upload_photo;
        previewProfilePicture(null);
    }
    
    // Main App (traduções de texto, mantidas do código anterior)
    document.querySelector('#home-screen h2').textContent = lang.highlighted_products;
    document.querySelector('#home-screen h3').textContent = lang.start_now;
    const homeDesc = document.querySelector('#home-screen p.text-gray-600');
    if (homeDesc) homeDesc.textContent = lang.discover_products;
    
    document.getElementById('view-products-btn').textContent = lang.view_products;
    document.querySelector('#products-screen h2').textContent = lang.all_products;
    document.querySelector('#cart-modal h2').textContent = lang.cart;
    document.getElementById('cart-total-label').textContent = lang.total;
    document.getElementById('checkout-button').textContent = lang.checkout;
    document.getElementById('notification-message').textContent = lang.success_purchase;
    document.querySelector('#settings-screen h2').textContent = lang.settings;
    document.querySelector('#settings-screen span').textContent = lang.dark_mode;
    document.querySelector('#settings-screen label[for="language-select"]').textContent = lang.language;

    if (logoutButton) {
        logoutButton.textContent = lang.logout;
    }

    // Order Confirmation Modal
    document.querySelector('#order-confirm-modal h3').textContent = lang.confirm_order;
    document.querySelector('#order-confirm-modal p').textContent = lang.confirm_message;
    cancelOrderButton.textContent = lang.cancel;
    sendOrderWhatsappButton.textContent = lang.send_order_now;
    
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => btn.textContent = lang.add_to_cart);
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="text-center text-gray-500 dark:text-gray-400">${lang.empty_cart}</p>`;
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

function renderProducts() {
    productGrid.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105';
        productCard.innerHTML = `
            <img class="w-full h-48 object-cover" src="${product.imageUrl}" alt="${product.name}">
            <div class="p-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">${product.name}</h3>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${product.description}</p>
                <div class="mt-4 flex items-center justify-between">
                    <span class="text-xl font-bold text-brand-primary dark:text-brand-light">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                    <button data-id="${product.id}" class="add-to-cart-btn bg-brand-primary text-white text-sm font-semibold py-2 px-4 rounded-full hover:bg-brand-hover dark:bg-brand-light dark:hover:bg-brand-primary transition-colors duration-200">
                        ${translations[currentLanguage].add_to_cart}
                    </button>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

function updateCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="text-center text-gray-500 dark:text-gray-400">${translations[currentLanguage].empty_cart}</p>`;
    } else {
        cart.forEach(item => {
            total += item.price * item.quantity;
            totalItems += item.quantity;
            const cartItem = document.createElement('div');
            cartItem.className = 'flex items-center justify-between py-2 border-b last:border-b-0 dark:border-gray-700';
            cartItem.innerHTML = `
                <div>
                    <p class="text-brand-primary dark:text-brand-light font-semibold">${item.name}</p>
                    <p class="text-gray-600 dark:text-gray-400 text-sm">${translations[currentLanguage].quantity} ${item.quantity} x R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                </div>
                <span class="font-bold text-brand-primary dark:text-brand-light">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }
    cartTotalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    cartItemCountSpan.textContent = totalItems;
    localStorage.setItem('cart', JSON.stringify(cart));
}

function sendOrderToWhatsApp() {
    if (cart.length === 0) return;

    const userName = localStorage.getItem('userName') || 'Cliente Novo';
    const userPhone = localStorage.getItem('userPhone') || 'Não Informado';
    const userPhotoLink = localStorage.getItem('userPhotoURL') || 'Nenhuma';
    let total = 0;
    
    let orderDetails = `*NOVO PEDIDO - Nó&Laço*\n\n`;
    orderDetails += `*Cliente:* ${userName}\n`;
    orderDetails += `*Telefone:* +258 ${userPhone}\n`;
    orderDetails += `*Link da Foto (Admin):* ${userPhotoLink}\n\n`;
    orderDetails += `*Itens do Pedido:*\n`;

    cart.forEach(item => {
        total += item.price * item.quantity;
        const subtotal = (item.price * item.quantity).toFixed(2).replace('.', ',');
        orderDetails += `  - ${item.name} (${item.quantity}x) = R$ ${subtotal}\n`;
    });

    orderDetails += `\n*Total a Pagar:* R$ ${total.toFixed(2).replace('.', ',')}\n\n`;
    orderDetails += `_Por favor, confirme a disponibilidade e a forma de pagamento._`;

    const encodedMessage = encodeURIComponent(orderDetails);
    const whatsappLink = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappLink, '_blank');

    cart = [];
    updateCart();
    cartModal.classList.add('hidden');
    orderConfirmModal.classList.add('hidden');
    
    notificationMessage.classList.remove('hidden');
    setTimeout(() => {
        notificationMessage.classList.add('hidden');
    }, 3000);
}

function logoutUser() {
    // 1. Limpa todas as informações de login do usuário no LocalStorage
    localStorage.removeItem('isRegistered');
    localStorage.removeItem('userName');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userPhotoURL');
    
    // 2. Limpa o formulário e a pré-visualização
    registrationForm.reset();
    previewProfilePicture(null); 
    profilePictureText.textContent = translations[currentLanguage].upload_photo;
    
    // 3. Reseta o histórico e muda para a tela de Login
    screenHistory = [];
    mainAppSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
}


// --- Event Listeners ---

// Listener para a área de clique do upload de foto
if (profilePictureUploadArea) {
    profilePictureUploadArea.addEventListener('click', () => {
        profilePictureInput.click();
    });
}

// Listener para pré-visualização de foto (atualiza texto e imagem)
profilePictureInput.addEventListener('change', () => {
    applyTranslations();
});


// Listener PRINCIPAL de Login/Registro com Firebase Storage e Firestore
registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede o recarregamento padrão
    
    console.log("Tentativa de registro iniciada...");
    
    const fullName = document.getElementById('full-name').value;
    const phoneNumber = document.getElementById('phone-number').value;
    const profilePictureFile = document.getElementById('profile-picture').files[0];
    let photoURL = null; 

    // Verifica se as variáveis do Firebase estão acessíveis
    if (typeof storage === 'undefined' || typeof db === 'undefined') {
        console.error("ERRO: As variáveis 'storage' e/ou 'db' do Firebase não estão definidas. Verifique o bloco <script> no HTML.");
        alert("Erro de inicialização do Firebase. Verifique o console.");
        return; 
    }

    // 1. Faz o upload da foto, SE ela existir
    if (profilePictureFile) {
        console.log("Tentando fazer upload da foto...");
        try {
            const storageRef = storage.ref(`fotos_perfil/${Date.now()}_${profilePictureFile.name}`);
            const snapshot = await storageRef.put(profilePictureFile);
            photoURL = await snapshot.ref.getDownloadURL();
            console.log("Foto de perfil carregada com sucesso:", photoURL);
            
        } catch (error) {
            // Se o upload falhar (ex: regras do Storage), avisa e continua sem foto
            console.error("Erro CRÍTICO ao fazer upload da foto. Continuando sem foto:", error);
            alert("Erro ao carregar a foto de perfil. Você será registrado sem foto. Verifique o console para mais detalhes.");
            photoURL = null; 
        }
    }

    // 2. Salva os dados do usuário no Firestore (Banco de Dados)
    try {
        const userRef = db.collection('clientes').doc(phoneNumber.replace(/ /g, ''));
        
        await userRef.set({
            nome: fullName,
            telefone: phoneNumber,
            fotoURL: photoURL,
            dataRegistro: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log("Dados do cliente salvos no Firestore.");

    } catch (error) {
        // Se o salvamento no Firestore falhar, para o login
        console.error("Erro CRÍTICO ao salvar dados do cliente no Firestore:", error);
        alert("Erro ao salvar dados no banco de dados. Tente novamente.");
        return; 
    }

    // 3. Continua o fluxo normal do app (Salva no LocalStorage e muda de tela)
    localStorage.setItem('isRegistered', 'true');
    localStorage.setItem('userName', fullName);
    localStorage.setItem('userPhone', phoneNumber);
    localStorage.setItem('userPhotoURL', photoURL); 

    loginSection.classList.add('hidden');
    mainAppSection.classList.remove('hidden');
    // Inicia o app na Home, adicionando-a ao histórico
    showScreen(homeScreenId); 
    console.log("Registro bem-sucedido. Tela principal exibida.");
});

// Listener para botões de navegação
viewProductsBtn.addEventListener('click', () => {
    showScreen('products-screen');
});

settingsButton.addEventListener('click', () => {
    showScreen('settings-screen');
});

if (backButton) {
    backButton.addEventListener('click', goBack);
}

if (logoutButton) {
    logoutButton.addEventListener('click', logoutUser);
}

// Listeners do Carrinho (mantidos do código anterior)
productGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
        const productId = parseInt(e.target.dataset.id);
        const product = products.find(p => p.id === productId);

        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCart();
    }
});

cartButton.addEventListener('click', () => {
    cartModal.classList.remove('hidden');
});

closeCartButton.addEventListener('click', () => {
    cartModal.classList.add('hidden');
});

checkoutButton.addEventListener('click', () => {
    if (cart.length > 0) {
        cartModal.classList.add('hidden');
        orderConfirmModal.classList.remove('hidden');
    } else {
        alert("O carrinho está vazio. Adicione produtos para continuar.");
    }
});

sendOrderWhatsappButton.addEventListener('click', sendOrderToWhatsApp);

cancelOrderButton.addEventListener('click', () => {
    orderConfirmModal.classList.add('hidden');
});

themeToggle.addEventListener('change', () => {
    isDarkMode = themeToggle.checked;
    localStorage.setItem('darkMode', isDarkMode);
    applyTheme();
});

languageSelect.addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    localStorage.setItem('language', currentLanguage);
    applyTranslations();
    renderProducts();
    updateCart();
});

// --- Inicialização da aplicação ---
document.addEventListener('DOMContentLoaded', () => {
    const isRegistered = localStorage.getItem('isRegistered');
    if (isRegistered === 'true') {
        // Se já registrado, vai para a tela principal
        loginSection.classList.add('hidden');
        mainAppSection.classList.remove('hidden');
        // A tela inicial (home-screen) é o primeiro item do histórico
        showScreen(homeScreenId);
    } else {
        // Se não registrado, mostra a tela de login
        loginSection.classList.remove('hidden');
        mainAppSection.classList.add('hidden');
        screenHistory = []; // Limpa o histórico em caso de logout
    }

    applyTheme();
    languageSelect.value = currentLanguage;
    applyTranslations();
    renderProducts();
    updateCart();
});