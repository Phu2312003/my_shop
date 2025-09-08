import React from 'react';

function CategoryNav({ categories, selectedCategory, dispatch }) {
    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center space-x-6 overflow-x-auto">
                    <button
                        onClick={() => dispatch({ type: 'SET_CATEGORY', payload: null })}
                        className={`category-item px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                            !selectedCategory ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'
                        }`}
                    >
                        Tất cả
                    </button>
                    {categories.map(category => (
                        <button
                            key={category._id}
                            onClick={() => dispatch({ type: 'SET_CATEGORY', payload: category._id })}
                            className={`category-item px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center space-x-2 ${
                                selectedCategory === category._id ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'
                            }`}
                        >
                            <span className="text-lg">{category.icon}</span>
                            <span>{category.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}

export default CategoryNav;
