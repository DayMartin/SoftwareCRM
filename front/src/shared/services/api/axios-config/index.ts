import axios from "axios";
import { errorInterceptor, responseInterceptor } from "./interceptors/";
import { Environment } from "../../../environment";

axios.defaults.withCredentials = false;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const Api = axios.create({
    baseURL: Environment.URL_BASE,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor de requisição para adicionar o token
Api.interceptors.request.use(
    (config) => {
        // Tente obter o token do localStorage
        const token = localStorage.getItem('APP_ACCESS_TOKEN');
        if (token) {
            // Se o token existir, adicione-o ao cabeçalho Authorization
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptores de resposta (opcional, caso queira habilitar)
Api.interceptors.response.use(
    (response) => responseInterceptor(response),
    (error) => errorInterceptor(error),
);

export { Api };
