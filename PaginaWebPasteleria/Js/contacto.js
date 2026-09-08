document.addEventListener('DOMContentLoaded', function() {
    
    const form = document.getElementById('formulario-contacto');
    if (!form) return; 

    const nombreInput = document.getElementById('nombre');
    const nombreError = document.getElementById('nombre-error');
    
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    
    const comentarioInput = document.getElementById('comentario');
    const comentarioError = document.getElementById('comentario-error');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        let esValido = true;

        if (nombreInput.value.length === 0) {
            esValido = false;
            nombreInput.classList.add('is-invalid');
            nombreError.innerText = "El nombre es requerido.";
        } else if (nombreInput.value.length > 100) {
            esValido = false;
            nombreInput.classList.add('is-invalid');
            nombreError.innerText = "El nombre no puede exceder los 100 caracteres.";
        } else {
            nombreInput.classList.remove('is-invalid');
        }

        const emailRegex = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
        if (emailInput.value.length > 0) {
            if (emailInput.value.length > 100) {
                esValido = false;
                emailInput.classList.add('is-invalid');
                emailError.innerText = "El correo no puede exceder los 100 caracteres.";
            } else if (!emailRegex.test(emailInput.value)) {
                esValido = false;
                emailInput.classList.add('is-invalid');
                emailError.innerText = "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
            } else {
                emailInput.classList.remove('is-invalid');
            }
        } else {
            emailInput.classList.remove('is-invalid');
        }


        if (comentarioInput.value.length === 0) {
            esValido = false;
            comentarioInput.classList.add('is-invalid');
            comentarioError.innerText = "El comentario es requerido.";
        } else if (comentarioInput.value.length > 500) {
            esValido = false;
            comentarioInput.classList.add('is-invalid');
            comentarioError.innerText = "El comentario no puede exceder los 500 caracteres.";
        } else {
            comentarioInput.classList.remove('is-invalid');
        }


        form.classList.add('was-validated');


        if (esValido) {
            form.classList.remove('was-validated');
            alert('¡Mensaje enviado con éxito!');
            form.reset(); 
        }
    });
});