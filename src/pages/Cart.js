import React from 'react';

function CartPage({ state, dispatch }) {
    const total = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const updateQuantity = (productId, newQty) => {
        if (newQty <= 0) {
            dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
        } else {
            dispatch({ type: 'UPDATE_CART_ITEM', payload: { productId, qty: newQty } });
        }
    };

    const checkout = () => {
        if (state.cart.length === 0) {
            alert('Giỏ hàng trống!');
            return;
        }

        if (!state.user) {
            alert('Vui lòng đăng nhập để đặt hàng!');
            dispatch({ type: 'SET_PAGE', payload: 'login' });
            return;
        }

        const order = {
            _id: Date.now().toString(),
            userId: state.user._id,
            items: [...state.cart],
            total: total,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        dispatch({ type: 'ADD_ORDER', payload: order });
        dispatch({ type: 'CLEAR_CART' });
        alert('Đặt hàng thành công!');
        dispatch({ type: 'SET_PAGE', payload: 'orders' });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Giỏ hàng của bạn</h2>

            {state.cart.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🛒</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Giỏ hàng trống</h3>
                    <p className="text-gray-500 mb-4">Hãy thêm sản phẩm vào giỏ hàng</p>
                    <button
                        onClick={() => dispatch({ type: 'SET_PAGE', payload: 'home' })}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
                    >
                        Tiếp tục mua sắm
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md">
                            {state.cart.map(item => (
                                <div key={item.productId} className="flex items-center p-4 border-b last:border-b-0">
                                    <div className="text-4xl mr-4">{item.image}</div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                        <p className="text-orange-600 font-bold">₫{item.price.toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => updateQuantity(item.productId, item.qty - 1)}
                                            className="w-8 h-8 border rounded hover:bg-gray-100"
                                        >
                                            -
                                        </button>
                                        <span className="w-12 text-center">{item.qty}</span>
                                        <button
                                            onClick={() => updateQuantity(item.productId, item.qty + 1)}
                                            className="w-8 h-8 border rounded hover:bg-gray-100"
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.productId })}
                                            className="ml-4 text-red-500 hover:text-red-700"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                            <h3 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h3>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span>Tạm tính:</span>
                                    <span>₫{total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Phí vận chuyển:</span>
                                    <span className="text-green-600">Miễn phí</span>
                                </div>
                                <hr />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Tổng cộng:</span>
                                    <span className="text-orange-600">₫{total.toLocaleString()}</span>
                                </div>
                            </div>
                            <button
                                onClick={checkout}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-colors"
                            >
                                Đặt hàng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CartPage;
