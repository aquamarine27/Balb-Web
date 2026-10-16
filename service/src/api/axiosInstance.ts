import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";



const api = axios.create({
    baseURL: "https://hostname.com",
    headers: {
        "Content-Type": "application/json"
    }
});


api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        };

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


api.interceptors.response.use(
    (response) => {return response},
    (error: AxiosError) => {
        const status = error.response?.status
        if (!error.response){
            // нет сети & сервер не отвечает 
        } else if (status === 401){
            localStorage.removeItem("token")
            //редирект на повторный логин
        } else if (status === 403){
            // forbiden
        } else if (status === 500){
            // internal server error
        }

        return Promise.reject(error)
        
    }
)
