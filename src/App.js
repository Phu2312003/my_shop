import React, { useReducer, createContext } from 'react';
import Header from './components/Header';
import HomePage from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/Cart';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrdersPage from './pages/OrdersPage';

// Mock Data
const mockCategories = [
    { _id: '1', name: 'Điện thoại & Phụ kiện', slug: 'dien-thoai', icon: '📱' },
    { _id: '2', name: 'Máy tính & Laptop', slug: 'may-tinh', icon: '💻' },
    { _id: '3', name: 'Thời trang Nam', slug: 'thoi-trang-nam', icon: '👔' },
    { _id: '4', name: 'Thời trang Nữ', slug: 'thoi-trang-nu', icon: '👗' },
    { _id: '5', name: 'Mẹ & Bé', slug: 'me-be', icon: '🍼' },
    { _id: '6', name: 'Nhà cửa & Đời sống', slug: 'nha-cua', icon: '🏠' }
];

const mockProducts = [
    {
        _id: '1',
        name: 'iPhone 15 Pro Max 256GB',
        slug: 'iphone-15-pro-max-256gb',
        description: 'iPhone 15 Pro Max với chip A17 Pro mạnh mẽ',
        images: ['📱'],
        categoryId: '1',
        price: 34990000,
        salePrice: 32990000,
        stock: 50,
        sku: 'IP15PM256',
        ratingAvg: 4.8,
        ratingCount: 1250
    },
    {
        _id: '2',
        name: 'MacBook Air M2 13 inch',
        slug: 'macbook-air-m2-13',
        description: 'MacBook Air với chip M2 siêu mỏng nhẹ',
        images: ['💻'],
        categoryId: '2',
        price: 28990000,
        salePrice: 26990000,
        stock: 30,
        sku: 'MBA13M2',
        ratingAvg: 4.9,
        ratingCount: 890
    },
    {
        _id: '3',
        name: 'Áo Polo Nam Cao Cấp',
        slug: 'ao-polo-nam-cao-cap',
        description: 'Áo polo nam chất liệu cotton cao cấp',
        images: ['👔'],
        categoryId: '3',
        price: 299000,
        salePrice: 199000,
        stock: 100,
        sku: 'POLO001',
        ratingAvg: 4.5,
        ratingCount: 456
    },
    {
        _id: '4',
        name: 'Váy Maxi Hoa Nhí',
        slug: 'vay-maxi-hoa-nhi',
        description: 'Váy maxi họa tiết hoa nhí dễ thương',
        images: ['👗'],
        categoryId: '4',
        price: 450000,
        salePrice: 350000,
        stock: 75,
        sku: 'DRESS001',
        ratingAvg: 4.6,
        ratingCount: 234
    }
];

// Context & State Management
export const AppContext = createContext();

const initialState = {
    user: null,
    cart: [],
    products: mockProducts,
    categories: mockCategories,
    orders: [],
    currentPage: 'home',
    searchQuery: '',
    selectedCategory: null
};

function appReducer(state, action) {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'SET_PAGE':
            return { ...state, currentPage: action.payload };
        case 'ADD_TO_CART':
            const existingItem = state.cart.find(item => item.productId === action.payload.productId);
            if (existingItem) {
                return {
                    ...state,
                    cart: state.cart.map(item =>
                        item.productId === action.payload.productId
                            ? { ...item, qty: item.qty + action.payload.qty }
                            : item
                    )
                };
            }
            return { ...state, cart: [...state.cart, action.payload] };
        case 'UPDATE_CART_ITEM':
            return {
                ...state,
                cart: state.cart.map(item =>
                    item.productId === action.payload.productId
                        ? { ...item, qty: action.payload.qty }
                        : item
                )
            };
        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cart: state.cart.filter(item => item.productId !== action.payload)
            };
        case 'CLEAR_CART':
            return { ...state, cart: [] };
        case 'SET_SEARCH':
            return { ...state, searchQuery: action.payload };
        case 'SET_CATEGORY':
            return { ...state, selectedCategory: action.payload };
        case 'ADD_ORDER':
            return { ...state, orders: [...state.orders, action.payload] };
        default:
            return state;
    }
}

// Main App Component
function App() {
    const [state, dispatch] = useReducer(appReducer, initialState);

    const renderPage = () => {
        if (state.currentPage.startsWith('product-')) {
            const productId = state.currentPage.split('-')[1];
            return <ProductDetail productId={productId} state={state} dispatch={dispatch} />;
        }

        switch (state.currentPage) {
            case 'home':
                return <HomePage state={state} dispatch={dispatch} />;
            case 'cart':
                return <CartPage state={state} dispatch={dispatch} />;
            case 'login':
                return <LoginPage dispatch={dispatch} />;
            case 'register':
                return <RegisterPage dispatch={dispatch} />;
            case 'orders':
                return <OrdersPage state={state} dispatch={dispatch} />;
            default:
                return <HomePage state={state} dispatch={dispatch} />;
        }
    };

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            <div className="min-h-screen bg-gray-50">
                <Header state={state} dispatch={dispatch} />
                {renderPage()}
            </div>
        </AppContext.Provider>
    );
}

export default App;
