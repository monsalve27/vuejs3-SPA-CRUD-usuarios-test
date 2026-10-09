<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth';
import { storeToRefs } from 'pinia';

// Estado para el menu desplegable movil
const isOpen = ref(false);
// Instanciar del store y del router
const authStore = useAuthStore();
const router = useRouter();
//Extraer la propiedades reactivas del estado usando storeToRefs
const { isLogged, user } = storeToRefs(authStore);
//Extraemos la acción logout, directamente desde la tienda
const { logout } = authStore;

const handleLogut = () => {
  logout();
  isOpen.value = false;
  router.push('/');
};

</script>

<template>
  <nav class="bg-slate-900 text-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Brand Marca / Logo -->
        <RouterLink to="/usuarios" class="flex items-center gap-2 font-bold text-lg text-white hover:text-slate-200">
          <i class="fa fa-graduation-cap text-xl"></i>
          <span>Académico</span>
        </RouterLink>

        <!-- Botón Hamburguesa Móvil -->
        <button 
          @click="isOpen = !isOpen" 
          class="md:hidden p-2 rounded-md hover:bg-slate-800 text-slate-300 focus:outline-none"
        >
          <i :class="isOpen ? 'fa fa-xmark text-xl' : 'fa fa-bars text-xl'"></i>
        </button>

        <!-- Menú Desktop -->
        <div class="hidden md:flex items-center gap-4">          
          <RouterLink             
            to="/usuarios" 
            class="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 text-slate-200"
          >
            <i class="fa fa-users"></i>
            <span>Usuarios</span>
          </RouterLink>
          <!-- si No está logueado -->
          <RouterLink   
            v-if="!isLogged"          
            to="/" 
            class="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-800 transition-colors duration-200"
          >
            <i class="fa fa-right-to-bracket"></i>
            <span>Login</span>
          </RouterLink> 
          
          <!-- si si está logueado-->
          <div v-else class="flex items-center gap-3">
            <span class="text-sm font-medium text-slate-200 flex items-center gap-2">
              <i class="fa fa-user-circle text-lg text-slate-400"></i>
              <span>{{ user?.email }}</span>
            </span>
            <button
              @click="handleLogut"
              class="flex items-center gap-2 bg-red-600 hover:bg-red-800 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-xs transition-colors duration-200 focus:outline-none focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900 cursor-pointer"
            >
              <i class="fa fa-sign-out-alt"></i>
              <span>Salir</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Menú Desplegable Móvil con transición suave-->
    <Transition name="slide-fade">
      <div v-if="isOpen" class="md:hidden px-2 pt-2 pb-3 space-y-1 bg-slate-800 overflow-hidden">
      <RouterLink 
        to="/usuarios" 
        @click="isOpen = false"
        class="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-700 transition-colors duration-200"
      >
        <i class="fa fa-users"></i>
        <span>Usuarios</span>
      </RouterLink>
      <!-- Authenticación Móvil-->
      <div class="pt-2 pb-1 border-t border-slate-700 mt-2 space-y-1">
        <!--Si No está logueado-->
        <RouterLink
          v-if="!isLogged"
          to="/"
          @click="isOpen = false"
          class="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-700 transition-colors duration-200"
        >
        <i class="fa fa-right-to-bracket"></i>
        <span>Login</span>
        </RouterLink>

        <!-- Si si está logueado -->
        <div v-else class="px-3 py-2 space-y-2">
          <div class="flex items-center gap-2 text-lg font-medium text-slate-200">
            <i class="fa fa-user-circle text-base text-slate-400"></i>
            <span>{{ user?.email }}</span>
          </div>
          <button
            @click="handleLogut"
            class="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-lg font-medium py-2 rounded-md transition-colors duration-200 cursor-pointer"
          >
          <i class="fa fa-sign-out-alt"></i>
          <span>Salir</span>
          </button>
        </div> 
      </div> 
    </div>
    </Transition> 
    
  </nav>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-in-out;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from, .slide-fade-leave-to{
  transform: translateY(-10px);
  opacity: 0;
  max-height: 0;
}
.slide-fade-leave-to, .slide-fade-enter-from{
  transform: translateY(0);
  opacity: 1;
  max-height: 300px;
}
</style>