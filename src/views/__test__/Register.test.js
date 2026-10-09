import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Register from '../Register.vue' // Ajusta la ruta relativa según la ubicación de tu test
import Swal from 'sweetalert2'

//Interceptamos SweetAlert2 para evitar que lance ventanas emergentes reales en el DOM.

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn().mockImplementation(() => Promise.resolve({ isConfirmed: true }))
  }
  //Importante: mockeamos .fire() para devolver una Promesa resuelta (Promise.resolve({ isConfirmed: true })) debido a que en el código se utiliza .then(() => { router.push(...) }) tras la alerta.
}))

//Mock del cliente de rutas de Vue Router
const pushMock = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock
  })
}))


describe('Register.vue Component Tests', () => {
  //Limpieza previa a cada prueba para asegurar independencia y aislamiento total
  beforeEach(() => {
    vi.clearAllMocks() // Limpia el historial de ejecuciones de Swal y Router
    localStorage.clear() // Vacía la memoria de almacenamiento local
  })

  
  //Verificación de estructura básica del DOM  
  it('debe renderizar correctamente los elementos del formulario en la interfaz', () => {
    const wrapper = mount(Register)

    //Comprobamos que el título y las etiquetas existen
    expect(wrapper.find('h2').text()).toBe('Registro temporal')
    expect(wrapper.find('label[for="email"]').text()).toBe('Email')
    expect(wrapper.find('label[for="password"]').text()).toBe('Contraseña')

    //Comprobamos la existencia de los inputs y el botón
    expect(wrapper.find('input#email').exists()).toBe(true)
    expect(wrapper.find('input#password').exists()).toBe(true)
    expect(wrapper.find('button').text()).toContain('Registrar')
  })

  
  //Validación cuando los campos están vacíos
  
  it('debe mostrar una alerta de error y detener el proceso si ambos campos están vacíos', async () => {
    const wrapper = mount(Register)

    //Hacemos clic en el botón de registrar sin haber ingresado valores
    await wrapper.find('button').trigger('click')

    //Debe activar la alerta de error de SweetAlert2
    expect(Swal.fire).toHaveBeenCalledWith('Error', 'Completa los campos', 'error')

    //NO debe escribir nada en el localStorage
    expect(localStorage.getItem('tempUser')).toBeNull()

    //NO debe redirigir al usuario
    expect(pushMock).not.toHaveBeenCalled()
  })

  
  //Validación cuando solo falta uno de los dos campos 
  it('debe mostrar una alerta de error si falta el correo o la contraseña', async () => {
    const wrapper = mount(Register)

    //únicamente el correo electrónico pero dejamos la contraseña vacía
    await wrapper.find('input#email').setValue('usuario@ejemplo.com')
    await wrapper.find('button').trigger('click')

    //Verificamos que se bloquee el registro
    expect(Swal.fire).toHaveBeenCalledWith('Error', 'Completa los campos', 'error')
    expect(localStorage.getItem('tempUser')).toBeNull()
    expect(pushMock).not.toHaveBeenCalled()
  })

  
  //Flujo de registro exitoso
  
  it('debe guardar las credenciales en localStorage y redirigir a /usuarios al completar el registro', async () => {
    const wrapper = mount(Register)

    //Asignamos valores a los inputs mediante setValue (actualiza el v-model)
    await wrapper.find('input#email').setValue('marlon@mail.com')
    await wrapper.find('input#password').setValue('12345')

    //Disparamos el evento de clic en el botón
    await wrapper.find('button').trigger('click')

    //Comprobamos la persistencia en localStorage
    const storedUser = JSON.parse(localStorage.getItem('tempUser'))
    expect(storedUser).toEqual({
      email: 'marlon@mail.com',
      password: '12345'
    })

    //Verificamos que se disparó la alerta emergente de confirmación
    expect(Swal.fire).toHaveBeenCalledWith('OK', 'Usuario temporal creado', 'success')

    //Verificamos la redirección tras resolver la Promesa de Swal (.then)
    expect(pushMock).toHaveBeenCalledWith('/usuarios')
  })
})