// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // On initial load, restore user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('userData');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Login: save user data to state and localStorage
    const login = (userData) => {
        localStorage.setItem('userData', JSON.stringify(userData));
        setCurrentUser(userData);
    };

    // Logout: clear everything
    const logout = () => {
        localStorage.removeItem('userData');
        setCurrentUser(null);
        navigate('/login');
    };
      const token = localStorage.getItem('userToken');

    const value = {
        currentUser,
        login,
        logout,
        loading,
        token,
        isLoggedIn: !!currentUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

// Custom hook to use auth context
export function useAuth() {
    return useContext(AuthContext);
}
