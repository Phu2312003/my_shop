import React, { useState } from 'react';

function RegisterPage({ dispatch }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Mật khẩu không khớp!');
            return;
        }
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        dispatch({ type: 'SET_PAGE', payload: 'login' });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Đăng ký</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Họ tên
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Số điện thoại
                        </label>
                        <input
                            type="tel"
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Xác nhận mật khẩu
                        </label>
                        <input
                            type="password"
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Đăng ký
                    </button>
                </form>
                <p className="text-center mt-4">
                    Đã có tài khoản?{' '}
                    <button
                        onClick={() => dispatch({ type: 'SET_PAGE', payload: 'login' })}
                        className="text-orange-600 hover:text-orange-700"
                    >
                        Đăng nhập ngay
                    </button>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
