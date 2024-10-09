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

export {
    getMe
}