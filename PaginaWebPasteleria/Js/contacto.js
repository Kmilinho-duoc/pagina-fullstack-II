// Validaciones 
function validarFormularioContacto(event) {
    if (event && event.type === 'submit') {
        event.preventDefault();
        if (event.stopPropagation) event.stopPropagation();
    }

    const form = document.getElementById('formulario-contacto');
    if (!form) return false;

    const nombreInput = document.getElementById('nombre');
    const nombreError = document.getElementById('nombre-error');
    
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');

    const numerotInput = document.getElementById('numerot');
    const numerotError = document.getElementById('numerot-error');
    
    const comentarioInput = document.getElementById('comentario');
    const comentarioError = document.getElementById('comentario-error');

    let esValido = true;

    // Limpieza previa
    [nombreInput, emailInput, numerotInput, comentarioInput].forEach(input => {
        if (input) input.classList.remove('is-invalid');
    });

    if (nombreError) nombreError.innerText = '';
    if (emailError) emailError.innerText = '';
    if (numerotError) numerotError.innerText = '';
    if (comentarioError) comentarioError.innerText = '';

    const nombreVal = nombreInput ? nombreInput.value.trim() : '';
    const emailVal = emailInput ? emailInput.value.trim() : '';
    const numerotVal = numerotInput ? numerotInput.value.trim() : '';
    const comentarioVal = comentarioInput ? comentarioInput.value.trim() : '';

    // 1. VALIDACIÓN DEL NOMBRE
    if (nombreVal.length < 6) {
        esValido = false;
        if (nombreInput) nombreInput.classList.add('is-invalid');
        if (nombreError) nombreError.innerText = "El nombre debe tener al menos 6 caracteres.";
    } else if (nombreVal.length > 100) {
        esValido = false;
        if (nombreInput) nombreInput.classList.add('is-invalid');
        if (nombreError) nombreError.innerText = "El nombre no puede exceder los 100 caracteres.";
    }

    // 2. VALIDACIÓN DE CORREO Y TELÉFONO
    const emailRegex = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    const telefonoRegex = /^(?:\+569 ?\d{4} ?\d{4}|569 ?\d{4} ?\d{4}|\+569\d{8}|569\d{8})$/;

    if (emailVal === '' && numerotVal === '') {
        esValido = false;
        if (emailInput) emailInput.classList.add('is-invalid');
        if (numerotInput) numerotInput.classList.add('is-invalid');
        if (emailError) emailError.innerText = "Debes ingresar al menos un correo o un número telefónico.";
        if (numerotError) numerotError.innerText = "Debes ingresar al menos un correo o un número telefónico.";
    } else {
        if (emailVal !== '') {
            if (emailVal.length > 100) {
                esValido = false;
                if (emailInput) emailInput.classList.add('is-invalid');
                if (emailError) emailError.innerText = "El correo no puede exceder los 100 caracteres.";
            } else if (!emailRegex.test(emailVal)) {
                esValido = false;
                if (emailInput) emailInput.classList.add('is-invalid');
                if (emailError) emailError.innerText = "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
            }
        }

        if (numerotVal !== '') {
            if (!telefonoRegex.test(numerotVal)) {
                esValido = false;
                if (numerotInput) numerotInput.classList.add('is-invalid');
                if (numerotError) numerotError.innerText = "Por favor, ingresa un número telefónico chileno válido (+569 1234 5678).";
            }
        }
    }

    // 3. VALIDACIÓN DEL COMENTARIO
    if (comentarioVal.length === 0) {
        esValido = false;
        if (comentarioInput) comentarioInput.classList.add('is-invalid');
        if (comentarioError) comentarioError.innerText = "El comentario es requerido.";
    } else if (comentarioVal.length > 500) {
        esValido = false;
        if (comentarioInput) comentarioInput.classList.add('is-invalid');
        if (comentarioError) comentarioError.innerText = "El comentario no puede exceder los 500 caracteres.";
    }

    if (esValido) {
        form.classList.remove('was-validated');
    } else {
        form.classList.add('was-validated');
    }

    return esValido;
}

// Inicialización de eventos
function inicializarFormulario() {
    const form = document.getElementById('formulario-contacto');
    if (!form) return;

    form.addEventListener('submit', validarFormularioContacto);

    // Escuchar eventos dinámicos para las pruebas de Jasmine
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', validarFormularioContacto);
        input.addEventListener('change', validarFormularioContacto);
        input.addEventListener('blur', validarFormularioContacto);
    });
}

// Ejecutar cuando el DOM esté listo o inmediatamente si ya cargó
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarFormulario);
} else {
    inicializarFormulario();
}