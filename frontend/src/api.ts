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
        const data: { message: string } = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating account:", error);
        throw error;
    }
}

export { createaccountrequest }