const config = { // Temporary
    SERVER_URL: "http://localhost:5000",
}

/**
 * CustomFetch is a function that makes a fetch request to a specified URL with given options.
 * It automatically includes an Authorization header if a token is present in localStorage.
 * It also includes the 'Content-Type' header set to 'application/json' and sends credentials with the request.
 *
 * @param {string} url - The URL to which the fetch request is made. This URL is appended to the SERVER_URL from the config.
 * @param {Object} options - The options for the fetch request. This can include method (GET, POST, etc.), headers, body, etc.
 * @returns {Array} - Returns an array where the first element is the Response object representing the response to the request (or null if the request failed), and the second element is the error that occurred (or null if the request was successful). The Response object can be used to retrieve the response's content (e.g., JSON, text, etc.)
*/
export async function CustomFetch(url:string, options:any = {}) {
    const headers = {
        "Content-Type": "application/json",
    };

    let responseJson, error = null;

    try {
        const response = await fetch(config.SERVER_URL + url, { 
            ...options, 
            headers: { ...headers, ...options.headers },
            credentials: 'include',
        });

        // Assuming JSON response, but you can enhance this for different responses
        responseJson = await response.json();
    } catch (err) {
        error = { message: (err as Error).message, status: (err as any).status || 'unknown' };
    }

    return { response: responseJson, error };
}