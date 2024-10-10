import { CustomFetch } from "./CustomFetch";

async function getMe(){
    const { response, error } = await CustomFetch('/users/me');

    if(error){
        return {
            success: false,
            user: null
        };
    }

    return {
        success: response.success || false,
        user: response.user || null
    }
}

async function logOut(){
    const { response } = await CustomFetch('/users/logout', {
        method: 'POST',
    });

    return response?.success || false;
}

export {
    getMe,
    logOut
}