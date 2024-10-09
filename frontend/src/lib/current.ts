import { CustomFetch } from "./CustomFetch";

async function getMe(){
    const { response, error } = await CustomFetch('/users/me');

    if(error){
        return false;
    }

    return response.success || false;
}

export {
    getMe
}