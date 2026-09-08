document.addEventListener('DOMContentLoaded', function() {

    // Usuarios de prueba para probar el sistema (tienda y panel de administración)
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

        
        const emailRegex = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
        if (emailInput.value.length === 0) {
            esValido = false;
            emailInput.classList.add('is-invalid');
            emailError.innerText = "El correo es requerido.";
        } else if (emailInput.value.length > 100) {
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

            // Además de las cuentas de prueba, revisamos los usuarios que
            // se hayan registrado desde registro.html (guardados con contraseña).
            const usuariosRegistrados = (JSON.parse(localStorage.getItem('usuariosAdmin')) || [])
                .filter(u => u.password);

            const usuario = usuariosPrueba.find(u => u.correo === emailInput.value && u.password === passwordInput.value) ||
                usuariosRegistrados.find(u => u.correo === emailInput.value && u.password === passwordInput.value);

            if (!usuario) {
                alert('Correo o contraseña incorrectos. Utiliza una de las cuentas de prueba indicadas en esta página.');
                return;
            }

            const rol = (usuario.rol || usuario.tipo || 'cliente').toLowerCase();

            localStorage.setItem('sesionActual', JSON.stringify({
                correo: usuario.correo,
                nombre: usuario.nombre,
                rol: rol
            }));

            // Solo el administrador entra al panel; cualquier otro caso es cliente.
            if (rol === 'administrador') {
                alert('¡Inicio de sesión exitoso! Ingresando al panel de administración.');
                window.location.href = 'admin/home.html';
            } else {
                alert('¡Inicio de sesión exitoso!');
                window.location.href = '../index.html';
            }
        }
    });
});