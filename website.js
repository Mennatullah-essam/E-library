// Enhanced Data Management with Digital Books Focus
const appState = {
    currentUser: null,
    books: [
        { 
            id: 1,
            title: 'The Art of Computer Programming',
            author: 'Donald Knuth',
            category: 'Technology',
            price: 89.99,
            description: 'A comprehensive study of computer programming algorithms and their analysis. Essential reading for serious programmers and computer scientists.',
            image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=500&fit=crop',
            format: 'PDF, EPUB',
            pages: 650,
            publisher: 'Addison-Wesley',
            rating: 4.8,
            downloads: 12500
        },
        { 
            id: 2,
            title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
            author: 'Robert C. Martin',
            category: 'Technology',
            price: 45.99,
            description: 'Learn how to write clean, maintainable code that professionals can understand and work with efficiently.',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=500&fit=crop',
            format: 'PDF, MOBI',
            pages: 464,
            publisher: 'Prentice Hall',
            rating: 4.7,
            downloads: 8900
        },
        { 
            id: 3,
            title: 'Sapiens: A Brief History of Humankind',
            author: 'Yuval Noah Harari',
            category: 'History',
            price: 32.99,
            description: 'A groundbreaking narrative of humanity\'s creation and evolution that explores the ways in which biology and history have defined us.',
            image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=500&fit=crop',
            format: 'EPUB, PDF',
            pages: 443,
            publisher: 'Harper',
            rating: 4.6,
            downloads: 15600
        },
        { 
            id: 4,
            title: 'The Phoenix Project: A Novel About IT, DevOps, and Helping Your Business Win',
            author: 'Gene Kim',
            category: 'Business',
            price: 38.50,
            description: 'A novel about how an IT manager uses DevOps principles to transform his company\'s technology operations and save the business.',
            image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=500&fit=crop',
            format: 'PDF, EPUB',
            pages: 432,
            publisher: 'IT Revolution Press',
            rating: 4.5,
            downloads: 7200
        },
        { 
            id: 5,
            title: 'Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones',
            author: 'James Clear',
            category: 'Self-Help',
            price: 28.99,
            description: 'Tiny changes, remarkable results. Learn how to build good habits and break bad ones with practical strategies.',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
            format: 'EPUB, MOBI',
            pages: 320,
            publisher: 'Avery',
            rating: 4.8,
            downloads: 23400
        },
        { 
            id: 6,
            title: 'The Lean Startup: How Today\'s Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses',
            author: 'Eric Ries',
            category: 'Business',
            price: 35.99,
            description: 'A new approach to business that\'s being adopted around the world, changing how companies are built and new products are launched.',
            image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=500&fit=crop',
            format: 'PDF, EPUB',
            pages: 336,
            publisher: 'Crown Business',
            rating: 4.4,
            downloads: 15600
        }
    ],
    favorites: [],
    cart: [],
    publishedBooks: [],
    orders: [],
    users: []
};

// Enhanced App Initialization
function initApp() {
    loadFromLocalStorage();
    renderFeaturedBooks();
    updateNavigation();
    setupEventListeners();
    console.log('E-LIBRARY initialized successfully');
}

// Enhanced Local Storage Management
function saveToLocalStorage() {
    const stateToSave = {
        currentUser: appState.currentUser,
        favorites: appState.favorites,
        cart: appState.cart,
        publishedBooks: appState.publishedBooks,
        orders: appState.orders,
        users: appState.users,
        lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('appState', JSON.stringify(stateToSave));
}

function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('appState');
        if (saved) {
            const parsed = JSON.parse(saved);
            appState.currentUser = parsed.currentUser || null;
            appState.favorites = parsed.favorites || [];
            appState.cart = parsed.cart || [];
            appState.publishedBooks = parsed.publishedBooks || [];
            appState.orders = parsed.orders || [];
            appState.users = parsed.users || [];
            
            console.log('App state loaded from localStorage');
        }
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        // Reset to default state if loading fails
        appState.favorites = [];
        appState.cart = [];
        appState.publishedBooks = [];
        appState.orders = [];
    }
}

// Enhanced Navigation with Route Management
function navigateTo(page) {
    const protectedPages = ['favorites', 'cart', 'profile', 'publisher'];
    const authRequiredPages = ['favorites', 'cart', 'profile', 'publisher'];
    
    // Check authentication for protected pages
    if (authRequiredPages.includes(page) && !appState.currentUser) {
        showToast('Please sign in to access this page', 'error');
        navigateTo('login');
        return;
    }

    // Check role-based access
    if (page === 'publisher' && appState.currentUser?.role !== 'publisher') {
        showToast('Publisher access required', 'error');
        navigateTo('home');
        return;
    }

    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
    });

    // Show target page
    const pageElement = document.getElementById(page);
    if (pageElement) {
        pageElement.classList.add('active');
        pageElement.style.display = 'block';

        // Load page-specific content
        loadPageContent(page);
    }

    // Update browser history
    window.history.pushState({ page }, '', `#${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function loadPageContent(page) {
    switch (page) {
        case 'browse':
            renderAllBooks();
            break;
        case 'favorites':
            renderFavorites();
            break;
        case 'cart':
            renderCart();
            break;
        case 'profile':
            renderProfile();
            break;
        case 'publisher':
            renderPublisherDashboard();
            break;
        case 'home':
            renderFeaturedBooks();
            break;
    }
}

// Enhanced Book Rendering with Digital Features
function renderFeaturedBooks() {
    const container = document.getElementById('featuredBooks');
    if (container) {
        const featuredBooks = appState.books.slice(0, 4);
        container.innerHTML = featuredBooks.map(book => createBookCard(book)).join('');
    }
}

function renderAllBooks() {
    const container = document.getElementById('allBooks');
    if (container) {
        container.innerHTML = appState.books.map(book => createBookCard(book)).join('');
    }
}

function createBookCard(book) {
    const isFavorited = appState.favorites.includes(book.id);
    const isInCart = appState.cart.some(item => item.id === book.id);
    const isPublished = appState.publishedBooks.includes(book.id);

    return `
        <div class="book-card" data-book-id="${book.id}" data-category="${book.category}">
            <div class="book-image" style="background-image: url('${book.image}')">
                <span>📖</span>
                <div class="book-actions">
                    <button class="book-action-btn ${isFavorited ? 'favorited' : ''}" 
                            onclick="toggleFavorite(${book.id})"
                            title="${isFavorited ? 'Remove from favorites' : 'Add to favorites'}">
                        ${isFavorited ? '❤️' : '🤍'}
                    </button>
                    <button class="book-action-btn ${isInCart ? 'carted' : ''}" 
                            onclick="toggleCart(${book.id})"
                            title="${isInCart ? 'Remove from cart' : 'Add to cart'}">
                        ${isInCart ? '🛒' : '🛍️'}
                    </button>
                </div>
                ${isPublished ? '<div class="published-badge" style="position: absolute; top: 10px; left: 10px; background: var(--success-color); color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.7rem; font-weight: 600;">YOURS</div>' : ''}
            </div>
            <div class="book-info">
                <div class="book-title">${book.title}</div>
                <div class="book-author">by ${book.author}</div>
                <div class="book-category">${book.category}</div>
                <div class="book-meta" style="display: flex; justify-content: space-between; align-items: center; margin: 0.5rem 0; font-size: 0.85rem; color: var(--text-light);">
                    <span>⭐ ${book.rating}</span>
                    <span>📥 ${book.downloads.toLocaleString()}</span>
                </div>
                <div class="book-formats" style="font-size: 0.8rem; color: var(--text-light); margin-bottom: 1rem;">
                    Formats: ${book.format}
                </div>
                <div class="book-price">$${book.price.toFixed(2)}</div>
                <div class="book-footer">
                    <button class="btn btn-primary" onclick="toggleCart(${book.id})">
                        ${isInCart ? 'Remove from Cart' : 'Add to Cart'}
                    </button>
                    <button class="btn btn-secondary" onclick="showBookDetails(${book.id})" style="flex: 0.5;">
                        Details
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Enhanced Book Filtering
function filterBooks(category) {
    const books = document.querySelectorAll('.book-card');
    books.forEach(book => {
        if (category === 'all' || book.dataset.category === category) {
            book.style.display = 'block';
        } else {
            book.style.display = 'none';
        }
    });
    
    // Update active filter button
    document.querySelectorAll('.btn-outline').forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline');
    });
    
    if (category !== 'all') {
        const activeBtn = Array.from(document.querySelectorAll('.btn-outline')).find(btn => 
            btn.textContent.includes(category)
        );
        if (activeBtn) {
            activeBtn.classList.remove('btn-outline');
            activeBtn.classList.add('btn-primary');
        }
    }
}

// Enhanced Favorites Management
function toggleFavorite(bookId) {
    if (!appState.currentUser) {
        showToast('Please sign in to add favorites', 'error');
        navigateTo('login');
        return;
    }

    const index = appState.favorites.indexOf(bookId);
    if (index > -1) {
        appState.favorites.splice(index, 1);
        showToast('Removed from favorites');
    } else {
        appState.favorites.push(bookId);
        showToast('Added to favorites ❤️');
    }
    
    saveToLocalStorage();
    updateNavigation();
    refreshBookDisplays();
}

function renderFavorites() {
    const container = document.getElementById('favoritesList');
    if (!container) return;

    if (appState.favorites.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">❤️</div>
                <h2>No Favorites Yet</h2>
                <p>Start building your personal library by adding books to favorites</p>
                <button class="btn btn-primary" onclick="navigateTo('browse')">
                    <span>📚</span>
                    Discover Books
                </button>
            </div>
        `;
        return;
    }

    const favoriteBooks = appState.books.filter(book => appState.favorites.includes(book.id));
    container.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <h3 style="color: var(--text-light); font-weight: 400;">
                You have ${favoriteBooks.length} favorite book${favoriteBooks.length !== 1 ? 's' : ''}
            </h3>
        </div>
        <div class="books-grid">${favoriteBooks.map(book => createBookCard(book)).join('')}</div>
    `;
}

// Enhanced Cart Management with Digital Purchases
function toggleCart(bookId) {
    if (!appState.currentUser) {
        showToast('Please sign in to add items to cart', 'error');
        navigateTo('login');
        return;
    }

    const book = appState.books.find(b => b.id === bookId);
    const index = appState.cart.findIndex(item => item.id === bookId);

    if (index > -1) {
        appState.cart.splice(index, 1);
        showToast('Removed from cart');
    } else {
        appState.cart.push({ 
            ...book, 
            quantity: 1,
            addedAt: new Date().toISOString()
        });
        showToast('Added to cart 🛒');
    }

    saveToLocalStorage();
    updateNavigation();
    refreshBookDisplays();
}

function renderCart() {
    const container = document.getElementById('cartList');
    const summaryContainer = document.getElementById('cartSummary');

    if (!container || !summaryContainer) return;

    if (appState.cart.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🛒</div>
                <h2>Your Cart is Empty</h2>
                <p>Add some digital books to start your reading journey</p>
                <button class="btn btn-primary" onclick="navigateTo('browse')">
                    <span>📚</span>
                    Browse Books
                </button>
            </div>
        `;
        summaryContainer.innerHTML = '';
        return;
    }

    const cartHTML = `
        <div class="books-grid">
            ${appState.cart.map(item => `
                <div class="book-card">
                    <div class="book-image" style="background-image: url('${item.image}')"></div>
                    <div class="book-info">
                        <div class="book-title">${item.title}</div>
                        <div class="book-author">by ${item.author}</div>
                        <div class="book-category">${item.category}</div>
                        <div class="book-price">$${item.price.toFixed(2)}</div>
                        <div class="book-formats" style="font-size: 0.8rem; color: var(--text-light); margin: 0.5rem 0;">
                            Digital Download
                        </div>
                        <button class="remove-btn" onclick="toggleCart(${item.id})">
                            <span>🗑️</span>
                            Remove
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    const subtotal = appState.cart.reduce((sum, item) => sum + item.price, 0);
    const tax = subtotal * 0.1; // 10% tax
    const finalTotal = subtotal + tax;

    const summaryHTML = `
        <div class="cart-summary">
            <h3 style="margin-bottom: 1.5rem; color: var(--primary-color);">Order Summary</h3>
            <div class="summary-row">
                <span>Subtotal (${appState.cart.length} items):</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Tax (10%):</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>$${finalTotal.toFixed(2)}</span>
            </div>
            <div style="margin-top: 2rem;">
                <button class="btn btn-primary" style="width: 100%;" onclick="processCheckout()">
                    <span>💳</span>
                    Proceed to Checkout
                </button>
                <button class="btn btn-secondary" style="width: 100%; margin-top: 1rem;" onclick="navigateTo('browse')">
                    <span>📚</span>
                    Continue Shopping
                </button>
            </div>
        </div>
    `;

    container.innerHTML = cartHTML;
    summaryContainer.innerHTML = summaryHTML;
}

// Enhanced Checkout Process
function processCheckout() {
    if (appState.cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }

    // Simulate payment processing
    showToast('Processing your order...', 'success');
    
    setTimeout(() => {
        const order = {
            id: Date.now(),
            items: [...appState.cart],
            total: appState.cart.reduce((sum, item) => sum + item.price, 0),
            date: new Date().toISOString(),
            status: 'completed'
        };

        appState.orders.push(order);
        appState.cart = [];
        
        saveToLocalStorage();
        updateNavigation();
        
        showToast('🎉 Purchase successful! Books are available in your library', 'success');
        navigateTo('home');
    }, 2000);
}

// Enhanced Profile Management
function renderProfile() {
    if (!appState.currentUser) {
        navigateTo('login');
        return;
    }

    const profileName = document.getElementById('profileName');
    const profileRole = document.getElementById('profileRole');
    const profileEmail = document.getElementById('profileEmail');
    const profileType = document.getElementById('profileType');
    const profileFavCount = document.getElementById('profileFavCount');
    const profileCartCount = document.getElementById('profileCartCount');
    const profilePublishedCount = document.getElementById('profilePublishedCount');
    const profileJoinDate = document.getElementById('profileJoinDate');
    const profileAvatar = document.getElementById('profileAvatar');

    if (profileName) profileName.textContent = appState.currentUser.name;
    if (profileRole) profileRole.textContent = appState.currentUser.role.charAt(0).toUpperCase() + appState.currentUser.role.slice(1);
    if (profileEmail) profileEmail.textContent = appState.currentUser.email;
    if (profileType) profileType.textContent = `${appState.currentUser.role.charAt(0).toUpperCase() + appState.currentUser.role.slice(1)} Account`;
    if (profileFavCount) profileFavCount.textContent = `${appState.favorites.length} book${appState.favorites.length !== 1 ? 's' : ''}`;
    if (profileCartCount) profileCartCount.textContent = `${appState.cart.length} item${appState.cart.length !== 1 ? 's' : ''}`;
    if (profilePublishedCount) {
        const publishedCount = appState.publishedBooks.length;
        profilePublishedCount.textContent = `${publishedCount} book${publishedCount !== 1 ? 's' : ''}`;
    }
    if (profileJoinDate) profileJoinDate.textContent = appState.currentUser.joinDate || 'January 2024';
    if (profileAvatar) profileAvatar.textContent = appState.currentUser.role === 'publisher' ? '📊' : '👤';
}

// Enhanced Publisher Dashboard
function handlePublishBook(event) {
    event.preventDefault();

    if (!appState.currentUser || appState.currentUser.role !== 'publisher') {
        showToast('Only publishers can publish books', 'error');
        return;
    }

    const title = document.getElementById('bookTitle').value.trim();
    const author = document.getElementById('bookAuthor').value.trim();
    const category = document.getElementById('bookCategory').value;
    const price = parseFloat(document.getElementById('bookPrice').value);
    const description = document.getElementById('bookDescription').value.trim();

    // Validation
    if (!title || !author || !category || !price || !description) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    if (price < 0) {
        showToast('Price must be a positive number', 'error');
        return;
    }

    const newBook = {
        id: Math.max(...appState.books.map(b => b.id), 0) + 1,
        title,
        author,
        category,
        price,
        description,
        publishedBy: appState.currentUser.email,
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=500&fit=crop',
        format: 'PDF, EPUB',
        pages: Math.floor(Math.random() * 500) + 100,
        publisher: appState.currentUser.name,
        rating: (Math.random() * 0.5 + 4.5).toFixed(1),
        downloads: 0,
        publishedAt: new Date().toISOString()
    };

    appState.books.push(newBook);
    appState.publishedBooks.push(newBook.id);
    saveToLocalStorage();
    
    showToast('Book published successfully! 📚');
    document.getElementById('publisherForm').reset();
    renderPublisherDashboard();
    
    // Refresh other book displays
    renderFeaturedBooks();
    renderAllBooks();
}

function renderPublisherDashboard() {
    const container = document.getElementById('publishedBooks');
    if (!container) return;

    const publishedBooks = appState.books.filter(book => appState.publishedBooks.includes(book.id));

    if (publishedBooks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📚</div>
                <h2>No Published Books Yet</h2>
                <p>Start building your catalog by publishing your first book</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <h3 style="color: var(--text-light); font-weight: 400;">
                You have published ${publishedBooks.length} book${publishedBooks.length !== 1 ? 's' : ''}
            </h3>
        </div>
        <div class="books-grid">${publishedBooks.map(book => createBookCard(book)).join('')}</div>
    `;
}

// Enhanced Authentication System
function handleSignup(event) {
    event.preventDefault();

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const role = document.getElementById('signupRole').value;

    // Basic validation
    if (!name || !email || !password || !role) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }

    // Check if user already exists
    if (appState.users.some(user => user.email === email)) {
        showToast('An account with this email already exists', 'error');
        return;
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        password, // In real app, this should be hashed
        role,
        joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
        createdAt: new Date().toISOString()
    };

    appState.users.push(newUser);
    appState.currentUser = newUser;
    saveToLocalStorage();
    updateNavigation();
    
    showToast(`Welcome to E-LIBRARY, ${name}! 🎉`, 'success');
    navigateTo('home');
}

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Find user
    const user = appState.users.find(u => u.email === email && u.password === password);
    
    if (user) {
        appState.currentUser = user;
        saveToLocalStorage();
        updateNavigation();
        
        showToast(`Welcome back, ${user.name}! 👋`, 'success');
        navigateTo('home');
    } else {
        showToast('Invalid email or password', 'error');
    }
}

function logout() {
    appState.currentUser = null;
    appState.favorites = [];
    appState.cart = [];
    saveToLocalStorage();
    updateNavigation();
    showToast('Logged out successfully', 'success');
    navigateTo('home');
}

// Enhanced Navigation Updates
function updateNavigation() {
    const authButtons = document.getElementById('authButtons');
    const logoutBtn = document.getElementById('logoutBtn');
    const publisherIcon = document.getElementById('publisherIcon');
    const profileIcon = document.getElementById('profileIcon');
    const favBadge = document.getElementById('favBadge');
    const cartBadge = document.getElementById('cartBadge');

    if (appState.currentUser) {
        if (authButtons) authButtons.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (profileIcon) profileIcon.style.display = 'block';

        if (appState.currentUser.role === 'publisher') {
            if (publisherIcon) publisherIcon.style.display = 'block';
        } else {
            if (publisherIcon) publisherIcon.style.display = 'none';
        }
    } else {
        if (authButtons) authButtons.style.display = 'flex';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (publisherIcon) publisherIcon.style.display = 'none';
        if (profileIcon) profileIcon.style.display = 'none';
    }

    // Update badges
    if (favBadge) {
        if (appState.favorites.length > 0) {
            favBadge.textContent = appState.favorites.length > 9 ? '9+' : appState.favorites.length;
            favBadge.style.display = 'flex';
        } else {
            favBadge.style.display = 'none';
        }
    }

    if (cartBadge) {
        if (appState.cart.length > 0) {
            cartBadge.textContent = appState.cart.length > 9 ? '9+' : appState.cart.length;
            cartBadge.style.display = 'flex';
        } else {
            cartBadge.style.display = 'none';
        }
    }
}

// Enhanced Toast Notifications
function showToast(message, type = 'success') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(toast => toast.remove());

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'error' : ''}`;
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span>${type === 'error' ? '❌' : '✅'}</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);

    // Auto remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

// Utility Functions
function refreshBookDisplays() {
    if (document.getElementById('browse').classList.contains('active')) {
        renderAllBooks();
    }
    if (document.getElementById('favorites').classList.contains('active')) {
        renderFavorites();
    }
    if (document.getElementById('home').classList.contains('active')) {
        renderFeaturedBooks();
    }
}

function setupEventListeners() {
    // Handle browser back/forward buttons
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.page) {
            navigateTo(event.state.page);
        }
    });

    // Add some demo users for testing
    if (appState.users.length === 0) {
        appState.users.push({
            id: 1,
            name: 'Demo Reader',
            email: 'reader@demo.com',
            password: 'demo123',
            role: 'reader',
            joinDate: 'January 2024'
        });
        appState.users.push({
            id: 2,
            name: 'Demo Publisher',
            email: 'publisher@demo.com',
            password: 'demo123',
            role: 'publisher',
            joinDate: 'January 2024'
        });
    }
}

function showBookDetails(bookId) {
    const book = appState.books.find(b => b.id === bookId);
    if (book) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3000;
            padding: 2rem;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 1rem; max-width: 500px; width: 100%; max-height: 80vh; overflow-y: auto;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <h3 style="color: var(--primary-color); margin: 0;">Book Details</h3>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
                </div>
                <div style="display: grid; gap: 1rem;">
                    <div><strong>Title:</strong> ${book.title}</div>
                    <div><strong>Author:</strong> ${book.author}</div>
                    <div><strong>Category:</strong> ${book.category}</div>
                    <div><strong>Price:</strong> $${book.price.toFixed(2)}</div>
                    <div><strong>Formats:</strong> ${book.format}</div>
                    <div><strong>Pages:</strong> ${book.pages}</div>
                    <div><strong>Rating:</strong> ⭐ ${book.rating} (${book.downloads.toLocaleString()} downloads)</div>
                    <div><strong>Description:</strong> ${book.description}</div>
                </div>
                <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                    <button class="btn btn-primary" onclick="toggleCart(${book.id}); this.parentElement.parentElement.parentElement.remove()">
                        ${appState.cart.some(item => item.id === book.id) ? 'Remove from Cart' : 'Add to Cart'}
                    </button>
                    <button class="btn btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

// Initialize the application
window.addEventListener('load', initApp);
window.addEventListener('beforeunload', saveToLocalStorage);

// Make functions globally available
window.navigateTo = navigateTo;
window.toggleFavorite = toggleFavorite;
window.toggleCart = toggleCart;
window.handleSignup = handleSignup;
window.handleLogin = handleLogin;
window.handlePublishBook = handlePublishBook;
window.logout = logout;
window.filterBooks = filterBooks;
window.processCheckout = processCheckout;
window.showBookDetails = showBookDetails;
