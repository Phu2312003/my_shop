import React from 'react';

function OrdersPage({ state, dispatch }) {
    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Đơn hàng của tôi</h2>

            {state.orders.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Chưa có đơn hàng nào</h3>
                    <p className="text-gray-500 mb-4">Hãy đặt hàng để xem lịch sử</p>
                    <button
                        onClick={() => dispatch({ type: 'SET_PAGE', payload: 'home' })}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
                    >
                        Mua sắm ngay
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {state.orders.map(order => (
                        <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold">Đơn hàng #{order._id}</h3>
                                    <p className="text-gray-600 text-sm">
                                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>
                                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                                    Đang xử lý
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                {order.items.map(item => (
                                    <div key={item.productId} className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <span className="text-2xl mr-3">{item.image}</span>
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-gray-600">Số lượng: {item.qty}</p>
                                            </div>
                                        </div>
                                        <span className="font-semibold">₫{(item.price * item.qty).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 flex justify-between items-center">
                                <span className="font-semibold">Tổng cộng:</span>
                                <span className="text-xl font-bold text-orange-600">₫{order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrdersPage;
