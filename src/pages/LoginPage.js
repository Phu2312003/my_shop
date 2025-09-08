import React, { useState } from 'react';

function LoginPage({ dispatch }) {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock login
        const user = {
            _id: '1',
            name: 'Nguyễn Văn A',
            email: formData.email,
            roles: ['customer']
        };
        dispatch({ type: 'SET_USER', payload: user });
        dispatch({ type: 'SET_PAGE', payload: 'home' });
        alert('Đăng nhập thành công!');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
                <form onSubmit={handleSubmit}>
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
                    <div className="mb-6">
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
                    <button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Đăng nhập
                    </button>
                </form>
                <p className="text-center mt-4">
                    Chưa có tài khoản?{' '}
                    <button
                        onClick={() => dispatch({ type: 'SET_PAGE', payload: 'register' })}
                        className="text-orange-600 hover:text-orange-700"
                    >
                        Đăng ký ngay
                    </button>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
