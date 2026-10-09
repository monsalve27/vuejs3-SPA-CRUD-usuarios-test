<script setup>
import {ref, onMounted, watch, computed } from 'vue';
import { RouterLink } from 'vue-router';
import  axios  from 'axios';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

const users = ref([]);
const searchQuery = ref('');

const er = ref(false);
const dataError =ref(''); 
//Variables de paginación
const currentPage = ref(1); // en que página estoy
const itemsPerPage = ref(5); //5,10,20 cantidad de items por página
//Reiniciar a la página cuando el usuario cambia la cantidad por página o realiza una busqueda
watch([itemsPerPage, searchQuery], () => {
    currentPage.value = 1;
});
onMounted(async () => {
    try{
        const { data } = await axios.get('https://jsonplaceholder.typicode.com/users');
        users.value = data;        
    } catch (error) {
        er.value = true;
        dataError.value = error.message || 'No se pudo conectar con el servidor';
    }
});

//filtrar los usuarios según el texto de búsqueda(nombre o email)
const filteredUsers = computed(()=>{
    if(!searchQuery.value.trim()) return users.value;
    const query = searchQuery.value.toLowerCase().trim();
    return users.value.filter(u => 
        u.name.toLowerCase().includes(query) || 
        u.email.toLowerCase().includes(query)
    );
});

//Funcion para exportar a excel
const exportToExcel = () => {
    if(filteredUsers.value.length === 0){
        Swal.fire({
        title: "Sin datos",
        text: 'No hay usuarios disponibles para exportar',
        icon: 'info',
        confirmButtonColor: '#4f46e5'
        });
        return;
    }
    
    //Map para estructurar las columnas del archivo Excel
    const dataToExport = filteredUsers.value.map(user => ({
        ID:user.id,
        Nombre:user.name,
        Email: user.email
    }));
    
    //Crear libro y hoja de calculo
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet,"Usuarios");

    //Descargar el archivo
    XLSX.writeFile(workbook, `Reporte_Usuarios_${new Date().toISOString().slice(0,10)}.xlsx`);
    Swal.fire({
        title: "Listado exportado con exito",
        text: 'Se ha generado el archivo Excel con los registros solicitados.',
        icon: 'success',
        timer:2000,
        showConfirmButton:false        
    });
}


// Cálculos para la paginación (reactiva)
const totalPages = computed(()=>{
    return Math.ceil(filteredUsers.value.length / itemsPerPage.value) || 1
});
const startIndex = computed(() => {
    return (currentPage.value - 1) * itemsPerPage.value;
});
const endIndex = computed(() => {
    return startIndex.value + itemsPerPage.value;
});

//subarreglo que se muestre en la tabla
const paginatedUsers = computed(() => {
    return filteredUsers.value.slice(startIndex.value, endIndex.value); //0-5 = [0,1,2,3,4] 5 es fin index y no se incluye 
});

//Funciones de navegación
const nextPage = () => {
    if(currentPage.value < totalPages.value) currentPage.value++;
};
const prevPage = () => {
    if(currentPage.value > 1 ) currentPage.value--;
};
const goToPage = (page) => {
    currentPage.value = page;
}

function remove(id) {
    Swal.fire({
        title: "Eliminar",
        text: '¿Eliminar usuario?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'Cancelar'

    }).then((res)=>{
        if(res.isConfirmed){
            users.value = users.value.filter(user => user.id !== id)
            //Reajustar págia si la actual queda vacía
            if(currentPage.value > totalPages.value){
                currentPage.value = totalPages.value;
            }
            Swal.fire('Eliminado','Usuario eliminado', 'success');
        }
    });
};
</script>
<template>
    <div class="space-y-6">
        <!-- Encabezado con título y botón de acción-->    
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <i class="fa fa-users text-indigo-600"></i>
                <span>Usuarios</span>                
            </h3>
            <!--Exportar a Excel-->
            <div class="flex items-center gap-3">
                <button
                    @click="exportToExcel"
                    class="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer"
                    title="Exportar a Excel"
                >
                    <i class="fa-solid fa-file-excel"></i>
                    <span>Exportar a Excel</span>
                </button>
            </div>
            <RouterLink 
                    to="/usuarios/crear"
                    class="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-800 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                    <i class="fa fa-plus"></i>
                    <span>Nuevo</span>
            </RouterLink>
        </div>
        
        <!-- Tarjeta contenedora de la tabla de usuarios -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <!-- Selector de Registro por página 5,10,20 y busqueda-->
            <div class="p-4 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50 text-sm text-slate-600">
                <!-- Selector de registros -->
                <div class="flex items-center gap-2 w-full md:w-auto">
                    <span>Mostrar</span>
                    <select 
                        v-model="itemsPerPage"
                        class="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs cursor-pointer"
                    >
                        <option :value="5">5</option>
                        <option :value="10">10</option>
                        <option :value="20">20</option>
                    </select>
                    <span>Registros por página</span>
                    <span class="ml-auto text-xs font-medium text-slate-500 hidden sm:inline">
                        Mostrando {{ filteredUsers.length > 0 ? startIndex + 1 : 0 }} - {{ Math.min(endIndex,filteredUsers.length) }} de {{ filteredUsers.length }}
                    </span>
                </div>
                
                <!-- Input de búsqueda-->
                <div class="relative w-full md:w-72 mt-2">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                        <i class="fa fa-search"></i>
                    </span>
                    <input 
                        v-model="searchQuery"
                        type="text"
                        placeholder="Buscar..."
                        class="w-full pl-9 pr-8 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs transition-all"
                    />
                    <button
                        v-if="searchQuery"
                        @click="searchQuery = ''"
                        class="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600 transition-colors duration-150"
                        title="Limpiar búsqueda"
                    >
                        <i class="fa fa-times-circle"></i>
                    </button>
                </div>

                
            </div>
            <!--Tabla de datos de usuarios -->
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">        
                    <thead>
                        <tr class="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                            <th class="py-3.5 px-4">ID</th>
                            <th class="py-3.5 px-4">Nombre</th>
                            <th class="py-3.5 px-4">Email</th>
                            <th class="py-3.5 px-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200 text-sm text-slate-700">
                        <tr 
                            v-for="user in paginatedUsers" :key="user.id"
                            class="hover:bg-slate-50/80 transition-colors duration-150"
                        >
                            <td class="py-3.5 px-4 font-mono font-medium text-slate-500">{{ user.id }}</td>
                            <td class="py-3.5 px-4 font-medium">{{ user.name }}</td>
                            <td class="py-3.5 px-4 text-slate-900">{{ user.email }}</td>
                            <td class="py-3.5 px-4">
                                <div class="flex items-center justify-end gap-2">
                                    <RouterLink
                                        :to="`/usuarios/${user.id}/editar`"
                                        class="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors duration-150 cursor-pointer"
                                        title="Editar usuario"
                                    >
                                        <i class="fa fa-edit text-base"></i>
                                    </RouterLink>
                                    <button
                                        class="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-150 cursor-pointer"
                                        title="Eliminar usuario"
                                        @click="remove(user.id)"
                                    >
                                        <i class="fa fa-trash text-base"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <!-- Estado cuando la búsqueda no arroja resutados o la lista está vacía -->
                        <tr v-if="filteredUsers.length === 0 && !er">
                            <td colspan="4" class="py-8 text-center text-slate-400">
                                <span v-if="searchQuery">No se encontraron coincidencias con "{{ searchQuery }}"</span>
                                <span v-else>¡No hay usuarios registrados!</span>
                            </td>
                        </tr>
                        <!-- Estado de Error de servidor/red -->
                        <tr v-if="er">
                            <td colspan="4" class="py-8 text-center text-red-700 bg-red-200">
                                <i class="fa-solid fa-exclamation-circle text-lg"></i>
                                <span>Error al cargar usuarios, {{ dataError }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- Footer con Paginador -->
            <div v-if="totalPages > 1 && !er" class="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">  
                <span class="text-sm text-slate-600">
                    Página <span class="font-semibold text-slate-900">{{ currentPage }}</span> de <span class="font-semibold text-slate-900">{{ totalPages }}</span>
                </span>
                <!--Botones de navegación-->
                <div class="inline-flex items-center gap-1">
                    <button
                        @click="prevPage"
                        :disabled="currentPage === 1"
                        class="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer flex items-center gap-1"
                    >
                        <i class="fa fa-chevron-left text-xs"></i>
                        <span>Anterior</span>
                    </button>
                    <button
                        v-for="page in totalPages"
                        :key="page"
                        @click="goToPage(page)"
                        :class="['px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer', currentPage === page ? 'bg-indigo-600 text-white font-semibold shadow-xs' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100']"
                    >
                        {{ page }}
                    </button>
                    <button
                        @click="nextPage"
                        :disabled="currentPage === totalPages"
                        class="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer flex items-center gap-1"
                    >
                        <span>Siguiente</span>
                        <i class="fa fa-chevron-right text-xs"></i>
                    </button>
                </div>
            </div> 
        </div>
    </div>
</template>
<style></style>