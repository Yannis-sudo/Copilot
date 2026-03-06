const API_BASE_URL = "http://localhost:5555/api";

async function createaccountrequest(username: string, email: string, password: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/create-account`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || "Account creation failed");
        }
        
        const data: { message: string } = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating account:", error);
        throw error;
    }
}

async function loginrequest(email: string, password: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || "Login failed");
        }
        
        const data: [{ message: string }] = await response.json();
        return data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
}

export { createaccountrequest, loginrequest };