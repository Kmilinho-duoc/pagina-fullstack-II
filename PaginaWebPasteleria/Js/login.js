document.addEventListener('DOMContentLoaded', function() {

    // Usuarios de prueba para probar el sistema
    const usuariosPrueba = [
        { correo: 'admin@duoc.cl', password: 'admin123', nombre: 'Admin Sistema', rol: 'administrador' },
        { correo: 'cliente@gmail.com', password: 'cliente123', nombre: 'Cliente Demo', rol: 'cliente' }
    ];

    const form = document.getElementById('formulario-login');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const passwordInput = document.getElementById('password');
    const passwordError = document.getElementById('password-error');

    form.addEventListener('submit', function(event) {
        
        event.preventDefault();
        event.stopPropagation();
        
        let esValido = true;

        // Validar Correo
        const emailRegex = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
        if (emailInput.value.length === 0) {
            esValido = false;
            emailInput.classList.add('is-invalid');
            emailError.innerText = "El correo es requerido.";
        } else if (emailInput.value.length > 100) {
            esValido = false;
            emailInput.classList.add('is-invalid');
            emailError.innerText = "El correo no puede exceder los 100 caracteres.";
        } else if (!emailRegex.test(emailInput.value.toLowerCase())) {
            esValido = false;
            emailInput.classList.add('is-invalid');
            emailError.innerText = "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
        } else {
            emailInput.classList.remove('is-invalid');
        }

        // Validar Contraseña
        if (passwordInput.value.length === 0) {
            esValido = false;
            passwordInput.classList.add('is-invalid');
            passwordError.innerText = "La contraseña es requerida.";
        } else if (passwordInput.value.length < 4 || passwordInput.value.length > 10) {
            esValido = false;
            passwordInput.classList.add('is-invalid');
            passwordError.innerText = "La contraseña debe tener entre 4 y 10 caracteres.";
        } else {
            passwordInput.classList.remove('is-invalid');
        }

        form.classList.add('was-validated');

        if (esValido) {
            form.classList.remove('was-validated');

            const correoIngresado = emailInput.value.trim().toLowerCase();
            const passwordIngresada = passwordInput.value.trim();

            // Cargar usuarios desde las posibles claves en localStorage ('usuarios' y 'usuariosAdmin')
            const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios')) || [];
            const usuariosAdminGuardados = JSON.parse(localStorage.getItem('usuariosAdmin')) || [];
            
            const todosLosGuardados = [...usuariosGuardados, ...usuariosAdminGuardados];

            // Buscar primero en los de prueba, luego en los guardados en localStorage
            const usuario = usuariosPrueba.find(u => u.correo.toLowerCase() === correoIngresado && u.password === passwordIngresada) ||
                todosLosGuardados.find(u => {
                    const correoUser = (u.correo || u.email || '').toLowerCase();
                    return correoUser === correoIngresado && u.password === passwordIngresada;
                });

            if (!usuario) {
                emailInput.classList.add('is-invalid');
                passwordInput.classList.add('is-invalid');
                alert('Correo o contraseña incorrectos.');
                return;
            }

            const rol = (usuario.rol || usuario.tipo || 'cliente').toLowerCase();

            // Guardar datos de sesión activa
            localStorage.setItem('sesionActual', JSON.stringify({
                correo: usuario.correo || usuario.email,
                nombre: usuario.nombre || 'Cliente',
                rol: rol
            }));

            // Redirección corregida según el rol
            if (rol === 'administrador') {
                alert('¡Inicio de sesión exitoso! Ingresando al panel de administración.');
                window.location.href = 'admin/home.html';
            } else {
                alert('¡Inicio de sesión exitoso!');
                // Redirige al index.html en la misma carpeta que login.html
                window.location.href = 'index.html';
            }
        }
    });
});