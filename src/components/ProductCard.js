import React from 'react';

function ProductCard({ product, dispatch }) {
    const discountPercent = Math.round(((product.price - product.salePrice) / product.price) * 100);

    const addToCart = () => {
        dispatch({
            type: 'ADD_TO_CART',
            payload: {
                productId: product._id,
                name: product.name,
                price: product.salePrice,
                image: product.images[0],
                qty: 1
            }
        });
        alert('Đã thêm vào giỏ hàng!');
    };

    return (
        <div className="product-card bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 cursor-pointer">
            <div
                onClick={() => dispatch({ type: 'SET_PAGE', payload: `product-${product._id}` })}
                className="p-4"
            >
                <div className="text-6xl text-center mb-4">{product.images[0]}</div>
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>

                <div className="flex items-center justify-between mb-2">
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-orange-600">
                            ₫{product.salePrice.toLocaleString()}
                        </span>
                        {product.price > product.salePrice && (
                            <span className="text-sm text-gray-500 line-through">
                                ₫{product.price.toLocaleString()}
                            </span>
                        )}
                    </div>
                    {discountPercent > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                            -{discountPercent}%
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1">{product.ratingAvg}</span>
                        <span className="ml-1">({product.ratingCount})</span>
                    </div>
                    <span>Còn {product.stock}</span>
                </div>
            </div>

            <button
                onClick={addToCart}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 transition-colors"
            >
                <i className="fas fa-cart-plus mr-2"></i>
                Thêm vào giỏ
            </button>
        </div>
    );
}

export default ProductCard;
