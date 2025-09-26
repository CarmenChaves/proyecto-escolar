// Variables globales para el manejo del formulario
const form = document.getElementById('loginForm'); // Referencia al formulario de login
const emailInput = document.getElementById('email'); // Referencia al campo de email
const passwordInput = document.getElementById('password'); // Referencia al campo de contraseña
const submitBtn = document.querySelector('.btn-primary'); // Referencia al botón de envío
const rememberCheckbox = document.getElementById('remember'); // Referencia al checkbox de recordar

// Datos de usuarios simulados (en producción vendrían del backend)
const users = [
    { email: 'usuario@demo.com', password: '12345678', name: 'Usuario Demo' },
    { email: 'test@gastocontrol.com', password: 'password123', name: 'Usuario Test' }
];

// Función para mostrar mensajes de error
function showError(input, message) {
    clearError(input); // Limpia errores previos
    const errorDiv = document.createElement('div'); // Crea elemento para mostrar error
    errorDiv.className = 'error-message'; // Asigna clase CSS
    errorDiv.textContent = message; // Establece el mensaje de error
    errorDiv.style.color = '#dc2626'; // Color rojo para errores
    errorDiv.style.fontSize = '0.875rem'; // Tamaño de fuente pequeño
    errorDiv.style.marginTop = '0.25rem'; // Margen superior pequeño
    input.parentNode.appendChild(errorDiv); // Añade el error después del input
    input.style.borderColor = '#dc2626'; // Cambia el borde a rojo
}

// Función para limpiar mensajes de error
function clearError(input) {
    const existingError = input.parentNode.querySelector('.error-message'); // Busca errores existentes
    if (existingError) {
        existingError.remove(); // Elimina el mensaje de error si existe
    }
    input.style.borderColor = '#e2e8f0'; // Restaura el color original del borde
}

// Función para validar formato de email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para email válido
    return emailRegex.test(email); // Retorna true si el email es válido
}

// Función para validar contraseña
function validatePassword(password) {
    return password.length >= 8; // Retorna true si tiene al menos 8 caracteres
}

// Función para mostrar estado de carga en el botón
function setLoadingState(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true; // Deshabilita el botón
        submitBtn.textContent = 'Iniciando sesión...'; // Cambia el texto
        submitBtn.style.cursor = 'not-allowed'; // Cambia el cursor
    } else {
        submitBtn.disabled = false; // Habilita el botón
        submitBtn.textContent = 'Iniciar Sesión'; // Restaura el texto original
        submitBtn.style.cursor = 'pointer'; // Restaura el cursor
    }
}

// Función para simular autenticación
function authenticateUser(email, password) {
    return new Promise((resolve, reject) => {
        // Simula demora de red de 1.5 segundos
        setTimeout(() => {
            const user = users.find(u => u.email === email && u.password === password); // Busca usuario
            if (user) {
                resolve(user); // Resuelve con datos del usuario si es válido
            } else {
                reject(new Error('Credenciales incorrectas')); // Rechaza si no es válido
            }
        }, 1500);
    });
}

// Función para guardar sesión del usuario
function saveUserSession(user) {
    // En lugar de localStorage, usamos variables globales
    window.currentUser = { // Guarda datos del usuario actual
        email: user.email,
        name: user.name,
        loginTime: new Date().toISOString(),
        remember: rememberCheckbox.checked
    };
}

// Función para mostrar notificación de éxito
function showSuccessMessage() {
    const successDiv = document.createElement('div'); // Crea elemento de éxito
    successDiv.className = 'success-message'; // Asigna clase CSS
    successDiv.textContent = '¡Inicio de sesión exitoso! Redirigiendo...'; // Mensaje de éxito
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #059669;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `; // Estilos inline para la notificación
    
    document.body.appendChild(successDiv); // Añade la notificación al body
    
    // Elimina la notificación después de 3 segundos
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Event listener para validación en tiempo real del email
emailInput.addEventListener('blur', function() {
    clearError(this); // Limpia errores previos
    if (this.value && !validateEmail(this.value)) {
        showError(this, 'Por favor ingresa un email válido'); // Muestra error si es inválido
    }
});

// Event listener para validación en tiempo real de la contraseña
passwordInput.addEventListener('input', function() {
    clearError(this); // Limpia errores previos
    if (this.value && !validatePassword(this.value)) {
        showError(this, 'La contraseña debe tener al menos 8 caracteres'); // Muestra error si es inválida
    }
});

// Event listener para limpiar errores cuando el usuario empieza a escribir
emailInput.addEventListener('input', function() {
    if (this.parentNode.querySelector('.error-message')) {
        clearError(this); // Limpia errores mientras escribe
    }
});

// Event listener principal para el envío del formulario
form.addEventListener('submit', async function(e) {
    e.preventDefault(); // Previene el envío por defecto del formulario
    
    // Limpia todos los errores previos
    clearError(emailInput);
    clearError(passwordInput);
    
    // Obtiene los valores de los campos
    const email = emailInput.value.trim(); // Email sin espacios
    const password = passwordInput.value; // Contraseña
    
    let hasErrors = false; // Flag para rastrear si hay errores
    
    // Validación del email
    if (!email) {
        showError(emailInput, 'El email es obligatorio'); // Error si está vacío
        hasErrors = true;
    } else if (!validateEmail(email)) {
        showError(emailInput, 'Por favor ingresa un email válido'); // Error si formato es inválido
        hasErrors = true;
    }
    
    // Validación de la contraseña
    if (!password) {
        showError(passwordInput, 'La contraseña es obligatoria'); // Error si está vacía
        hasErrors = true;
    } else if (!validatePassword(password)) {
        showError(passwordInput, 'La contraseña debe tener al menos 8 caracteres'); // Error si es muy corta
        hasErrors = true;
    }
    
    // Si hay errores, no continúa
    if (hasErrors) {
        return;
    }
    
    // Inicia el proceso de autenticación
    setLoadingState(true); // Muestra estado de carga
    
    try {
        const user = await authenticateUser(email, password); // Intenta autenticar
        saveUserSession(user); // Guarda la sesión del usuario
        showSuccessMessage(); // Muestra mensaje de éxito
        
        // Redirige a la página de gastos después de 2 segundos
        setTimeout(() => {
            window.location.href = 'expenses.html';
        }, 2000);
        
    } catch (error) {
        // Maneja errores de autenticación
        setLoadingState(false); // Quita el estado de carga
        showError(passwordInput, error.message); // Muestra el error
    }
});

// Event listener para mostrar/ocultar contraseña (funcionalidad extra)
document.addEventListener('DOMContentLoaded', function() {
    // Crea botón para mostrar/ocultar contraseña
    const togglePassword = document.createElement('button'); // Botón para toggle
    togglePassword.type = 'button'; // Tipo button para no enviar form
    togglePassword.innerHTML = '👁️'; // Icono de ojo
    togglePassword.style.cssText = `
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        z-index: 10;
    `; // Estilos para posicionar el botón
    
    // Hace el contenedor del password relativo
    passwordInput.parentNode.style.position = 'relative';
    passwordInput.style.paddingRight = '40px'; // Espacio para el botón
    passwordInput.parentNode.appendChild(togglePassword); // Añade el botón
    
    // Event listener para el toggle de contraseña
    togglePassword.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text'; // Muestra la contraseña
            this.innerHTML = '🙈'; // Cambia el icono
        } else {
            passwordInput.type = 'password'; // Oculta la contraseña
            this.innerHTML = '👁️'; // Restaura el icono
        }
    });
});

// Animación CSS para la notificación (se añade al documento)
const style = document.createElement('style'); // Crea elemento style
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`; // Definición de la animación
document.head.appendChild(style); // Añade los estilos al head