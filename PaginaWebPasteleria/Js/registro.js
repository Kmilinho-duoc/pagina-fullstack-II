document.addEventListener('DOMContentLoaded', function() {

    // Los usuarios registrados desde la tienda se guardan en la MISMA
    // lista que usa el panel de administrador ("usuariosAdmin"), para
    // que aparezcan en el mantenedor de usuarios y puedan iniciar sesión.
    function obtenerUsuarios() {
        return JSON.parse(localStorage.getItem('usuariosAdmin')) || [];
    }

    function guardarUsuarios(data) {
        localStorage.setItem('usuariosAdmin', JSON.stringify(data));
    }

    const regionSelect = document.getElementById('region');
    const comunaSelect = document.getElementById('comuna');

    for (const region in regionesComunas) {
        regionSelect.innerHTML += `<option value="${region}">${region}</option>`;
    }

    regionSelect.addEventListener('change', function() {
        const regionSeleccionada = this.value;
        comunaSelect.innerHTML = '<option value="" selected disabled>Seleccione la comuna...</option>';

        if (regionSeleccionada) {
            comunaSelect.disabled = false;
            regionesComunas[regionSeleccionada].forEach(comuna => {
                comunaSelect.innerHTML += `<option value="${comuna}">${comuna}</option>`;
            });
        } else {
            comunaSelect.disabled = true;
        }
    });

    const form = document.getElementById('formulario-registro');
    const runInput = document.getElementById('run');
    const runError = document.getElementById('run-error');
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const confirmarEmailInput = document.getElementById('confirmar-email');
    const passwordInput = document.getElementById('password');
    const confirmarPasswordInput = document.getElementById('confirmar-password');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();

        let esValido = true;
        const usuarios = obtenerUsuarios();

        // Run: requerido, válido, sin puntos ni guion, 7 a 9 caracteres.
        const runLimpio = runInput.value.trim().toUpperCase();
        if (runLimpio.length < 7 || runLimpio.length > 9 || !validarRun(runLimpio)) {
            esValido = false;
            runInput.classList.add('is-invalid');
            runError.innerText = 'Ingresa un run válido (7 a 9 caracteres, sin puntos ni guion).';
        } else if (usuarios.some(u => u.run === runLimpio)) {
            esValido = false;
            runInput.classList.add('is-invalid');
            runError.innerText = 'Ya existe una cuenta registrada con ese run.';
        } else {
            runInput.classList.remove('is-invalid');
        }

        if (nombreInput.value.trim().length === 0) {
            esValido = false;
            nombreInput.classList.add('is-invalid');
        } else {
            nombreInput.classList.remove('is-invalid');
        }

        const emailRegex = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
        if (!emailRegex.test(emailInput.value)) {
            esValido = false;
            emailInput.classList.add('is-invalid');
            emailError.innerText = "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
        } else if (usuarios.some(u => u.correo.toLowerCase() === emailInput.value.toLowerCase())) {
            esValido = false;
            emailInput.classList.add('is-invalid');
            emailError.innerText = "Ya existe una cuenta registrada con este correo.";
        } else {
            emailInput.classList.remove('is-invalid');
        }

        if (emailInput.value !== confirmarEmailInput.value) {
            esValido = false;
            confirmarEmailInput.classList.add('is-invalid');
        } else {
            confirmarEmailInput.classList.remove('is-invalid');
        }

        if (passwordInput.value.length < 4 || passwordInput.value.length > 10) {
            esValido = false;
            passwordInput.classList.add('is-invalid');
        } else {
            passwordInput.classList.remove('is-invalid');
        }

        if (passwordInput.value !== confirmarPasswordInput.value) {
            esValido = false;
            confirmarPasswordInput.classList.add('is-invalid');
        } else {
            confirmarPasswordInput.classList.remove('is-invalid');
        }

        if (!esValido) return;

        // Guardamos el nuevo usuario (queda visible también en el
        // mantenedor de usuarios del panel de administración).
        usuarios.push({
            run: runLimpio,
            nombre: nombreInput.value.trim(),
            apellidos: '',
            correo: emailInput.value.trim(),
            password: passwordInput.value,
            telefono: document.getElementById('telefono').value.trim(),
            fechaNacimiento: '',
            tipo: 'Cliente',
            region: regionSelect.value,
            comuna: comunaSelect.value,
            direccion: ''
        });
        guardarUsuarios(usuarios);

        alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
        window.location.href = 'login.html';
    });
});
