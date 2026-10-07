document.addEventListener('DOMContentLoaded', function() {
    
    const form = document.getElementById('formulario-contacto');
    if (!form) return; 

    const nombreInput = document.getElementById('nombre');
    const nombreError = document.getElementById('nombre-error');
    
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');

    const numerotInput = document.getElementById('numerot');
    const numerotError = document.getElementById('numerot-error');
    
    const comentarioInput = document.getElementById('comentario');
    const comentarioError = document.getElementById('comentario-error');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        let esValido = true;

        // VALIDACIÓN DEL NOMBRE
    if (nombreInput.value.trim().length < 6) {
         esValido = false;
        nombreInput.classList.add('is-invalid');
        nombreError.innerText = "El nombre debe tener al menos 6 caracteres.";
    } else if (nombreInput.value.trim().length > 100) {
        esValido = false;
        nombreInput.classList.add('is-invalid');
        nombreError.innerText = "El nombre no puede exceder los 100 caracteres.";
    } else {
    nombreInput.classList.remove('is-invalid');
    }


        // VALIDACIÓN DEL CORREO
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


        // VALIDACIÓN DEL NÚMERO TELEFÓNICO
        const telefonoRegex = /^(?:\+569 ?\d{4} ?\d{4}|569 ?\d{4} ?\d{4})$/;

        if (numerotInput.value.length > 0) {

            if (!telefonoRegex.test(numerotInput.value)) {
                esValido = false;
                numerotInput.classList.add('is-invalid');
                numerotError.innerText = "Por favor, ingresa un número telefónico chileno válido (+569 1234 5678).";

            } else {
                numerotInput.classList.remove('is-invalid');
            }

        } else {
            numerotInput.classList.remove('is-invalid');
        }


        // DEBE EXISTIR AL MENOS UN MEDIO DE CONTACTO
        if (emailInput.value.length === 0 && numerotInput.value.length === 0) {

            esValido = false;

            emailInput.classList.add('is-invalid');
            numerotInput.classList.add('is-invalid');

            emailError.innerText = "Debes ingresar al menos un correo o un número telefónico.";
            numerotError.innerText = "Debes ingresar al menos un correo o un número telefónico.";
        }


        // VALIDACIÓN DEL COMENTARIO
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