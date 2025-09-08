import React, { useState } from 'react';

function ProductDetail({ productId, state, dispatch }) {
    const product = state.products.find(p => p._id === productId);
    const [quantity, setQuantity] = useState(1);

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Sản phẩm không tồn tại</h2>
            </div>
        );
    }

    const addToCart = () => {
        dispatch({
            type: 'ADD_TO_CART',
            payload: {
                productId: product._id,
                name: product.name,
                price: product.salePrice,
                image: product.images[0],
                qty: quantity
            }
        });
        alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={() => dispatch({ type: 'SET_PAGE', payload: 'home' })}
                className="mb-6 text-orange-600 hover:text-orange-700"
            >
                ← Quay lại
            </button>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                    <div className="text-center">
                        <div className="text-9xl mb-4">{product.images[0]}</div>
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

                        <div className="flex items-center mb-4">
                            <span className="text-yellow-400 text-lg">★★★★★</span>
                            <span className="ml-2 text-gray-600">({product.ratingCount} đánh giá)</span>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center space-x-4 mb-2">
                                <span className="text-3xl font-bold text-orange-600">
                                    ₫{product.salePrice.toLocaleString()}
                                </span>
                                {product.price > product.salePrice && (
                                    <span className="text-xl text-gray-500 line-through">
                                        ₫{product.price.toLocaleString()}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-600">Còn lại: {product.stock} sản phẩm</p>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-semibold mb-2">Mô tả sản phẩm:</h3>
                            <p className="text-gray-700">{product.description}</p>
                        </div>

                        <div className="flex items-center space-x-4 mb-6">
                            <span className="font-semibold">Số lượng:</span>
                            <div className="flex items-center border rounded">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-3 py-1 hover:bg-gray-100"
                                >
                                    -
                                </button>
                                <span className="px-4 py-1 border-x">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="px-3 py-1 hover:bg-gray-100"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={addToCart}
                                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                            >
                                <i className="fas fa-cart-plus mr-2"></i>
                                Thêm vào giỏ hàng
                            </button>
                            <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                                Mua ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
