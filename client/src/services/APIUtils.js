import axios from 'axios'

export const instance = axios.create({
   baseURL: 'http://localhost:5000/api/'
})

instance.interceptors.request.use(function (config) {
   const token = localStorage.getItem('token')
   config.headers.Authorization =  token ? `Bearer ${token}` : ''

   return config
})

instance.interceptors.response.use(function (response) {
   return response
}, function (error) {

   if (!error.response) {
      return Promise.reject({
         status: 503,
         message: 'Сервер временно не доступен'
      })
   }

   return Promise.reject(error)
})