const BASE_URL = import.meta.env.VITE_BASE_API_URL;

const auth = () => {
    const register = async (username, email, password, faculty, studyProgram, nim) => {
        const response = await fetch(`${BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password, faculty, studyProgram, nim }),
        });
        return response.json();
    };

    const login = async (email, password) => {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            return { message: "Login failed", status: response.status };
        }

        try {
            return await response.json();
        } catch {
            return { message: "Invalid server response" };
        }
    };

    return {
        register,
        login,
    };
};

export default auth;