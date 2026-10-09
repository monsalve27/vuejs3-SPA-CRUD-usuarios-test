/** @type {import('tailwindcss').Config} */

//1 CONTENT, aquí definimos las rutas de los archivos donde usaré clases de tailwind
//2 THEME: Aquí personalizo el tema visual de mi aplicación
//PLUGINS: importo complementos oficiales o de terceros de tailwind, @tailwindcss/forms para mejorar formularios
module.exports={    
    content:[
        "./index.html",
        "./src/**/*.{vue, js, ts, jsx, tsx}",
    ],
    theme:{
        extend:{
            colors:{
            'brand-primary':'#000022',
            'brand-secondary':'#1e293b',
            },
            fontFamily:{
                'sans':['Inter','sans-serif'],
            }
        },
    },
    plugins:[],
}