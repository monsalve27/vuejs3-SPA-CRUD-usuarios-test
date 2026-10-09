import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('sessionUser')) || null,
        isLogged: JSON.parse(localStorage.getItem('sessionUser')) ? true : false
    }),
    actions: {
        login(email,password){
            const tmp = JSON.parse(localStorage.getItem('tempUser'))

            if(tmp && tmp.email === email && tmp.password === password){
                this.user = tmp;
                this.isLogged = true;
                localStorage.setItem('sessionUser', JSON.stringify(tmp))
                return true;
            }
            return false;
        },
        logout() {
            this.user = null;
            this.isLogged = false;
            localStorage.removeItem('sessionUser');
        }
    }
});