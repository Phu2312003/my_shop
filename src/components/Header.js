import React from 'react';

function Header({ state, dispatch }) {
    const cartItemCount = state.cart.reduce((sum, item) => sum + item.qty, 0);

    return (
        <header className="gradient-bg text-white shadow-lg">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <h1
                            className="text-2xl font-bold cursor-pointer"
                            onClick={() => dispatch({ type: 'SET_PAGE', payload: 'home' })}
                        >
                            🛒 Shopee Clone
                        </h1>
                        <div className="hidden md:flex items-center bg-white rounded-lg px-3 py-2 text-gray-700">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="outline-none w-64"
                                value={state.searchQuery}
                                onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                            />
                            <i className="fas fa-search ml-2 text-orange-500"></i>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        {state.user ? (
                            <div className="flex items-center space-x-4">
                                <span>Xin chào, {state.user.name}</span>
                                <button
                                    onClick={() => dispatch({ type: 'SET_PAGE', payload: 'orders' })}
                                    className="hover:text-orange-200"
                                >
                                    Đơn hàng
                                </button>
                                <button
                                    onClick={() => dispatch({ type: 'SET_USER', payload: null })}
                                    className="hover:text-orange-200"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => dispatch({ type: 'SET_PAGE', payload: 'login' })}
                                    className="hover:text-orange-200"
                                >
                                    Đăng nhập
                                </button>
                                <button
                                    onClick={() => dispatch({ type: 'SET_PAGE', payload: 'register' })}
                                    className="hover:text-orange-200"
                                >
                                    Đăng ký
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => dispatch({ type: 'SET_PAGE', payload: 'cart' })}
                            className="relative hover:text-orange-200"
                        >
                            <i className="fas fa-shopping-cart text-xl"></i>
                            {cartItemCount > 0 && (
                                <span className="cart-badge absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                    {cartItemCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
