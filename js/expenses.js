// Variables globales para el manejo del dashboard de gastos
const expenseForm = document.getElementById('expenseForm'); // Referencia al formulario de gastos
const fechaInput = document.getElementById('fecha'); // Referencia al campo de fecha
const categoriaSelect = document.getElementById('categoria'); // Referencia al select de categoría
const montoInput = document.getElementById('monto'); // Referencia al campo de monto
const descripcionTextarea = document.getElementById('descripcion'); // Referencia al textarea de descripción
const expensesList = document.querySelector('.expenses-list'); // Referencia a la lista de gastos
const filterSelect = document.querySelector('.filter-select'); // Referencia al filtro de categorías
const userGreeting = document.querySelector('.user-greeting'); // Referencia al saludo del usuario

// Array para almacenar gastos (simula base de datos)
let expenses = [
    {
        id: 1,
        fecha: '2024-10-15',
        categoria: 'alimentacion',
        monto: 45000,
        descripcion: 'Almuerzo restaurante',
        timestamp: new Date('2024-10-15').getTime()
    },
    {
        id: 2,
        fecha: '2024-10-14',
        categoria: 'transporte',
        monto: 12000,
        descripcion: 'Transporte público',
        timestamp: new Date('2024-10-14').getTime()
    },
    {
        id: 3,
        fecha: '2024-10-13',
        categoria: 'vivienda',
        monto: 180000,
        descripcion: 'Pago de servicios',
        timestamp: new Date('2024-10-13').getTime()
    },
    {
        id: 4,
        fecha: '2024-10-12',
        categoria: 'entretenimiento',
        monto: 25000,
        descripcion: 'Cine con amigos',
        timestamp: new Date('2024-10-12').getTime()
    },
    {
        id: 5,
        fecha: '2024-10-11',
        categoria: 'salud',
        monto: 68000,
        descripcion: 'Medicamentos',
        timestamp: new Date('2024-10-11').getTime()
    }
];

// Configuración de iconos y colores por categoría
const categoryConfig = {
    alimentacion: { icon: '🍔', color: '#fef3c7', name: 'Alimentación' },
    transporte: { icon: '🚌', color: '#dbeafe', name: 'Transporte' },
    vivienda: { icon: '🏠', color: '#d1fae5', name: 'Vivienda' },
    salud: { icon: '💊', color: '#fed7d7', name: 'Salud' },
    entretenimiento: { icon: '🎬', color: '#fce7f3', name: 'Entretenimiento' },
    educacion: { icon: '📚', color: '#e0e7ff', name: 'Educación' },
    ropa: { icon: '👕', color: '#f3e8ff', name: 'Ropa' },
    otros: { icon: '📦', color: '#f1f5f9', name: 'Otros' }
};

// Función para obtener datos del usuario actual
function getCurrentUser() {
    return window.currentUser || { name: 'Usuario', email: 'usuario@demo.com' }; // Datos por defecto si no hay usuario
}

// Función para formatear números como moneda colombiana
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', { // Formato para Colombia
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0 // Sin decimales para pesos colombianos
    }).format(amount);
}

// Función para formatear fechas en español
function formatDate(dateString) {
    const date = new Date(dateString); // Crea objeto Date
    return date.toLocaleDateString('es-CO', { // Formato colombiano
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Función para generar ID único para gastos
function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9); // ID basado en timestamp y string aleatorio
}

// Función para mostrar mensajes de error
function showError(input, message) {
    clearError(input); // Limpia errores previos
    const errorDiv = document.createElement('div'); // Crea elemento para error
    errorDiv.className = 'error-message'; // Asigna clase CSS
    errorDiv.textContent = message; // Establece mensaje
    errorDiv.style.color = '#dc2626'; // Color rojo
    errorDiv.style.fontSize = '0.875rem'; // Tamaño pequeño
    errorDiv.style.marginTop = '0.25rem'; // Margen superior
    input.parentNode.appendChild(errorDiv); // Añade después del input
    input.style.borderColor = '#dc2626'; // Borde rojo
}

// Función para limpiar mensajes de error
function clearError(input) {
    const existingError = input.parentNode.querySelector('.error-message'); // Busca errores
    if (existingError) {
        existingError.remove(); // Elimina si existe
    }
    input.style.borderColor = '#e2e8f0'; // Restaura color del borde
}

// Función para validar fecha (no puede ser futura)
function validateDate(date) {
    const inputDate = new Date(date); // Fecha ingresada
    const today = new Date(); // Fecha actual
    today.setHours(23, 59, 59, 999); // Final del día actual
    return inputDate <= today; // No puede ser futura
}

// Función para validar monto (debe ser positivo)
function validateAmount(amount) {
    return amount > 0 && amount <= 99999999; // Entre 1 y 99 millones
}

// Función para mostrar notificación temporal
function showNotification(message, type = 'success') {
    const notification = document.createElement('div'); // Crea elemento de notificación
    notification.className = 'notification'; // Asigna clase
    notification.textContent = message; // Establece mensaje
    
    const bgColor = type === 'success' ? '#059669' : '#dc2626'; // Verde para éxito, rojo para error
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `; // Estilos para la notificación
    
    document.body.appendChild(notification); // Añade al documento
    
    // Elimina después de 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Función para crear elemento HTML de gasto
function createExpenseElement(expense) {
    const config = categoryConfig[expense.categoria] || categoryConfig.otros; // Obtiene configuración de categoría
    
    const expenseDiv = document.createElement('div'); // Crea contenedor del gasto
    expenseDiv.className = 'expense-item'; // Asigna clase CSS
    expenseDiv.dataset.id = expense.id; // Añade ID como data attribute
    expenseDiv.dataset.category = expense.categoria; // Añade categoría para filtros
    
    expenseDiv.innerHTML = `
        <div class="expense-info">
            <div class="expense-category" style="background: ${config.color}">
                ${config.icon}
            </div>
            <div class="expense-details">
                <h3>${expense.descripcion || config.name}</h3>
                <p class="expense-date">${formatDate(expense.fecha)}</p>
            </div>
        </div>
        <div class="expense-amount">${formatCurrency(expense.monto)}</div>
        <button class="delete-expense" title="Eliminar gasto" style="
            background: #dc2626;
            color: white;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            cursor: pointer;
            margin-left: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
        ">×</button>
    `; // HTML del elemento de gasto con botón de eliminar
    
    // Añade event listener para eliminar
    const deleteBtn = expenseDiv.querySelector('.delete-expense');
    deleteBtn.addEventListener('click', () => deleteExpense(expense.id));
    
    return expenseDiv; // Retorna el elemento creado
}

// Función para eliminar un gasto
function deleteExpense(expenseId) {
    if (confirm('¿Estás seguro de que deseas eliminar este gasto?')) { // Confirmación
        expenses = expenses.filter(expense => expense.id != expenseId); // Elimina del array
        renderExpenses(); // Re-renderiza la lista
        updateSummary(); // Actualiza estadísticas
        showNotification('Gasto eliminado correctamente'); // Muestra confirmación
    }
}

// Función para renderizar la lista de gastos
function renderExpenses(filteredExpenses = null) {
    const expensesToShow = filteredExpenses || expenses; // Usa gastos filtrados o todos
    const sortedExpenses = expensesToShow.sort((a, b) => b.timestamp - a.timestamp); // Ordena por fecha desc
    
    // Limpia la lista actual
    expensesList.innerHTML = '';
    
    if (sortedExpenses.length === 0) {
        // Muestra mensaje si no hay gastos
        expensesList.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #6b7280;">
                <p>No hay gastos registrados</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">Agrega tu primer gasto usando el formulario</p>
            </div>
        `;
        return;
    }
    
    // Crea elementos para cada gasto
    sortedExpenses.forEach(expense => {
        const expenseElement = createExpenseElement(expense); // Crea elemento
        expensesList.appendChild(expenseElement); // Añade a la lista
    });
}

// Función para calcular y actualizar estadísticas
function updateSummary() {
    const currentMonth = new Date().getMonth(); // Mes actual
    const currentYear = new Date().getFullYear(); // Año actual
    
    // Filtra gastos del mes actual
    const currentMonthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.fecha);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
    
    const totalAmount = currentMonthExpenses.reduce((sum, expense) => sum + expense.monto, 0); // Suma total
    const expenseCount = currentMonthExpenses.length; // Cantidad de gastos
    const dailyAverage = expenseCount > 0 ? totalAmount / new Date().getDate() : 0; // Promedio diario
    
    // Actualiza elementos del DOM
    document.querySelector('.stat-item:nth-child(1) .stat-value').textContent = formatCurrency(totalAmount);
    document.querySelector('.stat-item:nth-child(2) .stat-value').textContent = expenseCount;
    document.querySelector('.stat-item:nth-child(3) .stat-value').textContent = formatCurrency(dailyAverage);
}

// Función para filtrar gastos por categoría
function filterExpensesByCategory(category) {
    if (!category) {
        renderExpenses(); // Muestra todos si no hay filtro
        return;
    }
    
    const filtered = expenses.filter(expense => expense.categoria === category); // Filtra por categoría
    renderExpenses(filtered); // Renderiza filtrados
}

// Event listener para el filtro de categorías
filterSelect.addEventListener('change', function() {
    filterExpensesByCategory(this.value); // Filtra según selección
});

// Event listener para validación de fecha en tiempo real
fechaInput.addEventListener('change', function() {
    clearError(this); // Limpia errores previos
    if (this.value && !validateDate(this.value)) {
        showError(this, 'La fecha no puede ser futura'); // Error si es futura
    }
});

// Event listener para validación de monto
montoInput.addEventListener('input', function() {
    clearError(this); // Limpia errores previos
    const amount = parseFloat(this.value); // Convierte a número
    if (this.value && !validateAmount(amount)) {
        showError(this, 'El monto debe estar entre $1 y $99.999.999'); // Error si no es válido
    }
});

// Event listener principal para agregar gasto
expenseForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Previene envío por defecto
    
    // Limpia errores previos
    [fechaInput, categoriaSelect, montoInput].forEach(clearError);
    
    // Obtiene valores del formulario
    const fecha = fechaInput.value; // Fecha seleccionada
    const categoria = categoriaSelect.value; // Categoría seleccionada
    const monto = parseFloat(montoInput.value); // Monto como número
    const descripcion = descripcionTextarea.value.trim(); // Descripción sin espacios
    
    let hasErrors = false; // Flag para errores
    
    // Validación de fecha
    if (!fecha) {
        showError(fechaInput, 'La fecha es obligatoria');
        hasErrors = true;
    } else if (!validateDate(fecha)) {
        showError(fechaInput, 'La fecha no puede ser futura');
        hasErrors = true;
    }
    
    // Validación de categoría
    if (!categoria) {
        showError(categoriaSelect, 'Selecciona una categoría');
        hasErrors = true;
    }
    
    // Validación de monto
    if (!monto) {
        showError(montoInput, 'El monto es obligatorio');
        hasErrors = true;
    } else if (!validateAmount(monto)) {
        showError(montoInput, 'El monto debe estar entre $1 y $99.999.999');
        hasErrors = true;
    }
    
    // Si hay errores, no continúa
    if (hasErrors) {
        return;
    }
    
    // Crea nuevo gasto
    const newExpense = {
        id: generateId(), // ID único
        fecha: fecha,
        categoria: categoria,
        monto: monto,
        descripcion: descripcion || categoryConfig[categoria].name, // Usa nombre de categoría si no hay descripción
        timestamp: new Date(fecha).getTime() // Timestamp para ordenamiento
    };
    
    // Añade el gasto al array
    expenses.unshift(newExpense); // Añade al principio para mostrarlo primero
    
    // Actualiza la interfaz
    renderExpenses(); // Re-renderiza lista
    updateSummary(); // Actualiza estadísticas
    
    // Limpia el formulario
    expenseForm.reset(); // Resetea todos los campos
    
    // Muestra confirmación
    showNotification('Gasto agregado correctamente');
    
    // Enfoca el primer campo para siguiente entrada
    fechaInput.focus();
});

// Función para establecer fecha de hoy por defecto
function setTodayAsDefault() {
    const today = new Date(); // Fecha actual
    const todayString = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    fechaInput.value = todayString; // Establece como valor por defecto
}

// Función de inicialización
function initializeDashboard() {
    const user = getCurrentUser(); // Obtiene datos del usuario
    
    // Personaliza el saludo
    if (userGreeting) {
        userGreeting.textContent = `Hola, ${user.name.split(' ')[0]}`; // Solo primer nombre
    }
    
    // Establece fecha de hoy
    setTodayAsDefault();
    
    // Renderiza gastos iniciales
    renderExpenses();
    
    // Actualiza estadísticas
    updateSummary();
    
    // Enfoca el primer campo
    fechaInput.focus();
}

// Función para verificar autenticación
function checkAuthentication() {
    // En una aplicación real, verificarías el token de sesión
    const currentUser = getCurrentUser();
    
    if (!currentUser.email) {
        // Redirige al login si no hay usuario
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

// Event listener para cerrar sesión
document.addEventListener('click', function(e) {
    if (e.target.textContent === 'Cerrar Sesión') {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            // Limpia datos de sesión
            window.currentUser = null;
            // Redirige al login
            window.location.href = 'login.html';
        }
    }
});

// Inicialización cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    if (checkAuthentication()) { // Solo inicializa si está autenticado
        initializeDashboard(); // Inicializa el dashboard
    }
});

// Animaciones CSS
const style = document.createElement('style'); // Crea elemento de estilos
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
    
    .expense-item {
        transition: all 0.3s ease;
    }
    
    .expense-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .delete-expense:hover {
        background: #b91c1c !important;
        transform: scale(1.1);
    }
`; // Definición de animaciones y efectos
document.head.appendChild(style); // Añade estilos al head