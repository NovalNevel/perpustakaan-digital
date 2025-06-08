const API_BASE_URL = import.meta.env.VITE_BASE_API_URL;

const auth = () => {
    const register = async (username, email, password, faculty, studyProgram, nim, role = 'USER') => {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                email,
                password,
                faculty,
                studyProgram,
                nim,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { message: errorData.message || "Register failed", status: response.status };
        }

        return await response.json();
    };

    const login = async (email, password) => {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { message: errorData.message || "Login failed", status: response.status };
        }

        try {
            const data = await response.json();

            if (data.accessToken) {
                sessionStorage.setItem("accessToken", data.accessToken);
                sessionStorage.setItem("refreshToken", data.refreshToken);
                sessionStorage.setItem("isLoggedIn", "true");
            }

            if (data.user) {
                sessionStorage.setItem("user", JSON.stringify(data.user));
            }

            return data;
        } catch {
            return { message: "Invalid server response" };
        }
    };

    const refreshToken = async () => {
        const refreshToken = sessionStorage.getItem("refreshToken");
        if (!refreshToken) {
            throw new Error("No refresh token available");
        }

        const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: refreshToken }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Token refresh failed");
        }

        const data = await response.json();
        sessionStorage.setItem("accessToken", data.accessToken);
        return data;
    };

    const logout = async () => {
        const refreshToken = sessionStorage.getItem("refreshToken");

        if (refreshToken) {
            try {
                await fetch(`${API_BASE_URL}/api/auth/logout`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token: refreshToken }),
                });
            } catch (error) {
                console.error("Logout error:", error);
            }
        }

        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("user");
    };

    return {
        register,
        login,
        refreshToken,
        logout,
    };
};

export default auth;
