// Variables globales para el manejo del formulario de registro
const form = document.getElementById('registerForm'); // Referencia al formulario de registro
const nombreInput = document.getElementById('nombre'); // Referencia al campo de nombre
const emailInput = document.getElementById('email'); // Referencia al campo de email
const passwordInput = document.getElementById('password'); // Referencia al campo de contraseña
const confirmPasswordInput = document.getElementById('confirm_password'); // Referencia al campo de confirmar contraseña
const telefonoInput = document.getElementById('telefono'); // Referencia al campo de teléfono
const terminosCheckbox = document.getElementById('terminos'); // Referencia al checkbox de términos
const submitBtn = document.querySelector('.btn-primary'); // Referencia al botón de envío

// Array para almacenar usuarios registrados (simula base de datos)
let registeredUsers = [
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

// Función para mostrar mensajes de éxito en campos
function showSuccess(input) {
    clearError(input); // Limpia errores previos
    input.style.borderColor = '#059669'; // Cambia el borde a verde
}

// Función para limpiar mensajes de error
function clearError(input) {
    const existingError = input.parentNode.querySelector('.error-message'); // Busca errores existentes
    if (existingError) {
        existingError.remove(); // Elimina el mensaje de error si existe
    }
    input.style.borderColor = '#e2e8f0'; // Restaura el color original del borde
}

// Función para validar nombre (solo letras y espacios)
function validateName(name) {
    const nameRegex = /^[A-Za-zÀ-ÿ\u00f1\u00d1\s]+$/; // Permite letras, acentos, ñ y espacios
    return nameRegex.test(name) && name.length >= 2; // Al menos 2 caracteres
}

// Función para validar formato de email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para email válido
    return emailRegex.test(email); // Retorna true si el email es válido
}

// Función para verificar si el email ya está registrado
function isEmailAlreadyRegistered(email) {
    return registeredUsers.some(user => user.email.toLowerCase() === email.toLowerCase()); // Compara emails en minúsculas
}

// Función para validar fortaleza de contraseña
function validatePasswordStrength(password) {
    const hasMinLength = password.length >= 8; // Mínimo 8 caracteres
    const hasUpperCase = /[A-Z]/.test(password); // Al menos una mayúscula
    const hasLowerCase = /[a-z]/.test(password); // Al menos una minúscula
    const hasNumbers = /\d/.test(password); // Al menos un número
    
    return {
        isValid: hasMinLength && hasUpperCase && hasLowerCase && hasNumbers,
        hasMinLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers
    };
}

// Función para validar teléfono (opcional pero si se llena debe ser válido)
function validatePhone(phone) {
    if (!phone) return true; // Es opcional, válido si está vacío
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,15}$/; // Formato internacional básico
    return phoneRegex.test(phone); // Retorna true si es válido
}

// Función para mostrar estado de carga en el botón
function setLoadingState(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true; // Deshabilita el botón
        submitBtn.textContent = 'Creando cuenta...'; // Cambia el texto
        submitBtn.style.cursor = 'not-allowed'; // Cambia el cursor
    } else {
        submitBtn.disabled = false; // Habilita el botón
        submitBtn.textContent = 'Crear Cuenta'; // Restaura el texto original
        submitBtn.style.cursor = 'pointer'; // Restaura el cursor
    }
}

// Función para mostrar indicador de fortaleza de contraseña
function showPasswordStrength(password) {
    const strengthDiv = passwordInput.parentNode.querySelector('.password-strength') || 
                       document.createElement('div'); // Busca o crea indicador
    strengthDiv.className = 'password-strength'; // Asigna clase
    
    if (!passwordInput.parentNode.querySelector('.password-strength')) {
        passwordInput.parentNode.appendChild(strengthDiv); // Añade si no existe
    }
    
    if (!password) {
        strengthDiv.innerHTML = ''; // Limpia si no hay contraseña
        return;
    }
    
    const strength = validatePasswordStrength(password); // Valida fortaleza
    let strengthText = 'Debe contener: '; // Texto base
    let strengthItems = []; // Array de requisitos
    
    strengthItems.push(strength.hasMinLength ? '✅ 8+ caracteres' : '❌ 8+ caracteres');
    strengthItems.push(strength.hasUpperCase ? '✅ Mayúscula' : '❌ Mayúscula');
    strengthItems.push(strength.hasLowerCase ? '✅ Minúscula' : '❌ Minúscula');
    strengthItems.push(strength.hasNumbers ? '✅ Número' : '❌ Número');
    
    strengthDiv.innerHTML = `
        <small style="color: ${strength.isValid ? '#059669' : '#d97706'}; font-size: 0.75rem; line-height: 1.2;">
            ${strengthText}<br>${strengthItems.join(' | ')}
        </small>
    `; // Muestra los requisitos con colores
}

// Función para simular registro de usuario
function registerUser(userData) {
    return new Promise((resolve, reject) => {
        // Simula demora de red de 2 segundos
        setTimeout(() => {
            if (isEmailAlreadyRegistered(userData.email)) {
                reject(new Error('Este email ya está registrado')); // Rechaza si email existe
            } else {
                registeredUsers.push(userData); // Añade el nuevo usuario
                resolve(userData); // Resuelve con datos del usuario
            }
        }, 2000);
    });
}

// Función para mostrar notificación de éxito
function showSuccessMessage() {
    const successDiv = document.createElement('div'); // Crea elemento de éxito
    successDiv.className = 'success-message'; // Asigna clase CSS
    successDiv.textContent = '¡Cuenta creada exitosamente! Redirigiendo al login...'; // Mensaje de éxito
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
        max-width: 300px;
    `; // Estilos inline para la notificación
    
    document.body.appendChild(successDiv); // Añade la notificación al body
    
    // Elimina la notificación después de 4 segundos
    setTimeout(() => {
        successDiv.remove();
    }, 4000);
}

// Event listeners para validación en tiempo real

// Validación del nombre
nombreInput.addEventListener('blur', function() {
    clearError(this); // Limpia errores previos
    const name = this.value.trim(); // Nombre sin espacios
    if (name && !validateName(name)) {
        showError(this, 'El nombre solo debe contener letras y espacios (mín. 2 caracteres)');
    } else if (name && validateName(name)) {
        showSuccess(this); // Muestra éxito si es válido
    }
});

// Validación del email
emailInput.addEventListener('blur', function() {
    clearError(this); // Limpia errores previos
    const email = this.value.trim(); // Email sin espacios
    if (email && !validateEmail(email)) {
        showError(this, 'Por favor ingresa un email válido');
    } else if (email && isEmailAlreadyRegistered(email)) {
        showError(this, 'Este email ya está registrado');
    } else if (email && validateEmail(email)) {
        showSuccess(this); // Muestra éxito si es válido
    }
});

// Validación de contraseña con indicador de fortaleza
passwordInput.addEventListener('input', function() {
    clearError(this); // Limpia errores previos
    showPasswordStrength(this.value); // Muestra indicador de fortaleza
    
    // Revalida confirmación si ya tiene contenido
    if (confirmPasswordInput.value) {
        validatePasswordMatch(); // Revalida coincidencia
    }
});

// Función para validar coincidencia de contraseñas
function validatePasswordMatch() {
    clearError(confirmPasswordInput); // Limpia errores previos
    const password = passwordInput.value; // Contraseña original
    const confirmPassword = confirmPasswordInput.value; // Confirmación
    
    if (confirmPassword && password !== confirmPassword) {
        showError(confirmPasswordInput, 'Las contraseñas no coinciden');
        return false;
    } else if (confirmPassword && password === confirmPassword) {
        showSuccess(confirmPasswordInput); // Muestra éxito si coinciden
        return true;
    }
    return true;
}

// Validación de confirmación de contraseña
confirmPasswordInput.addEventListener('blur', validatePasswordMatch);
confirmPasswordInput.addEventListener('input', validatePasswordMatch);

// Validación del teléfono
telefonoInput.addEventListener('blur', function() {
    clearError(this); // Limpia errores previos
    const phone = this.value.trim(); // Teléfono sin espacios
    if (phone && !validatePhone(phone)) {
        showError(this, 'Formato de teléfono inválido (ej: +57 300 123 4567)');
    } else if (phone && validatePhone(phone)) {
        showSuccess(this); // Muestra éxito si es válido
    }
});

// Event listeners para limpiar errores mientras se escribe
[nombreInput, emailInput, telefonoInput].forEach(input => {
    input.addEventListener('input', function() {
        if (this.parentNode.querySelector('.error-message')) {
            clearError(this); // Limpia errores mientras escribe
        }
    });
});

// Event listener principal para el envío del formulario
form.addEventListener('submit', async function(e) {
    e.preventDefault(); // Previene el envío por defecto del formulario
    
    // Limpia todos los errores previos
    [nombreInput, emailInput, passwordInput, confirmPasswordInput, telefonoInput].forEach(clearError);
    
    // Obtiene los valores de los campos
    const nombre = nombreInput.value.trim(); // Nombre sin espacios
    const email = emailInput.value.trim(); // Email sin espacios
    const password = passwordInput.value; // Contraseña
    const confirmPassword = confirmPasswordInput.value; // Confirmación
    const telefono = telefonoInput.value.trim(); // Teléfono sin espacios
    const aceptaTerminos = terminosCheckbox.checked; // Estado del checkbox
    
    let hasErrors = false; // Flag para rastrear errores
    
    // Validación del nombre
    if (!nombre) {
        showError(nombreInput, 'El nombre es obligatorio');
        hasErrors = true;
    } else if (!validateName(nombre)) {
        showError(nombreInput, 'El nombre solo debe contener letras y espacios (mín. 2 caracteres)');
        hasErrors = true;
    }
    
    // Validación del email
    if (!email) {
        showError(emailInput, 'El email es obligatorio');
        hasErrors = true;
    } else if (!validateEmail(email)) {
        showError(emailInput, 'Por favor ingresa un email válido');
        hasErrors = true;
    } else if (isEmailAlreadyRegistered(email)) {
        showError(emailInput, 'Este email ya está registrado');
        hasErrors = true;
    }
    
    // Validación de contraseña
    if (!password) {
        showError(passwordInput, 'La contraseña es obligatoria');
        hasErrors = true;
    } else {
        const passwordStrength = validatePasswordStrength(password); // Valida fortaleza
        if (!passwordStrength.isValid) {
            showError(passwordInput, 'La contraseña debe cumplir todos los requisitos');
            hasErrors = true;
        }
    }
    
    // Validación de confirmación de contraseña
    if (!confirmPassword) {
        showError(confirmPasswordInput, 'Confirma tu contraseña');
        hasErrors = true;
    } else if (password !== confirmPassword) {
        showError(confirmPasswordInput, 'Las contraseñas no coinciden');
        hasErrors = true;
    }
    
    // Validación del teléfono (opcional)
    if (telefono && !validatePhone(telefono)) {
        showError(telefonoInput, 'Formato de teléfono inválido');
        hasErrors = true;
    }
    
    // Validación de términos y condiciones
    if (!aceptaTerminos) {
        showError(terminosCheckbox, 'Debes aceptar los términos y condiciones');
        hasErrors = true;
    }
    
    // Si hay errores, no continúa
    if (hasErrors) {
        return;
    }
    
    // Inicia el proceso de registro
    setLoadingState(true); // Muestra estado de carga
    
    try {
        const userData = { // Datos del nuevo usuario
            name: nombre,
            email: email,
            password: password,
            phone: telefono || null,
            registrationDate: new Date().toISOString()
        };
        
        await registerUser(userData); // Intenta registrar usuario
        showSuccessMessage(); // Muestra mensaje de éxito
        
        // Redirige al login después de 3 segundos
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 3000);
        
    } catch (error) {
        // Maneja errores de registro
        setLoadingState(false); // Quita el estado de carga
        showError(emailInput, error.message); // Muestra el error
    }
});

// Inicialización cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    // Enfoca el primer campo cuando carga la página
    nombreInput.focus();
    
    // Añade event listeners adicionales para mejorar UX
    
    // Formatea automáticamente el teléfono mientras se escribe
    telefonoInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, ''); // Solo números
        if (value.length > 0) {
            // Formato básico para números colombianos
            if (value.startsWith('57')) {
                value = '+' + value;
            } else if (!value.startsWith('+')) {
                value = '+57' + value;
            }
        }
        // No modifica el value automáticamente para no interferir con la escritura
    });
    
    // Añade indicador visual para campos obligatorios
    const requiredFields = [nombreInput, emailInput, passwordInput, confirmPasswordInput];
    requiredFields.forEach(field => {
        const label = field.parentNode.querySelector('label');
        if (label && !label.innerHTML.includes('*')) {
            label.innerHTML += ' <span style="color: #dc2626;">*</span>';
        }
    });
});

// Animación CSS para las notificaciones
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
    
    .password-strength {
        margin-top: 0.5rem;
    }
    
    .error-message {
        animation: shake 0.3s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    input:focus {
        transform: scale(1.02);
        transition: all 0.2s ease;
    }
`; // Definición de animaciones y estilos
document.head.appendChild(style); // Añade los estilos al head