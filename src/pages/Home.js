import React from 'react';
import CategoryNav from '../components/CategoryNav';
import ProductCard from '../components/ProductCard';

function HomePage({ state, dispatch }) {
    const filteredProducts = state.products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(state.searchQuery.toLowerCase());
        const matchesCategory = !state.selectedCategory || product.categoryId === state.selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div>
            <CategoryNav
                categories={state.categories}
                selectedCategory={state.selectedCategory}
                dispatch={dispatch}
            />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        {state.selectedCategory
                            ? state.categories.find(c => c._id === state.selectedCategory)?.name
                            : 'Sản phẩm nổi bật'
                        }
                    </h2>
                    <p className="text-gray-600">Tìm thấy {filteredProducts.length} sản phẩm</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                        <ProductCard key={product._id} product={product} dispatch={dispatch} />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">Không tìm thấy sản phẩm</h3>
                        <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HomePage;
