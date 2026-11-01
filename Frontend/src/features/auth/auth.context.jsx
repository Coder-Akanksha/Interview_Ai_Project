import { createContext, useState, useEffect } from 'react';
import { getCurrentUser } from "./services/auth.api.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAndSetCurrentUser = async () => {
            try {
                const data = await getCurrentUser();
                setUser(data.user);
            } catch (error) {
                // If not logged in or session expired
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        getAndSetCurrentUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
