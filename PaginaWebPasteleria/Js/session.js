document.addEventListener('DOMContentLoaded', function () {
    // 1. Obtener la sesión activa desde localStorage
    const sesion = JSON.parse(localStorage.getItem('sesionActual'));

    // 2. Seleccionar el contenedor de la sub-navegación superior
    const subNav = document.querySelector('.sub-nav');

    if (subNav) {
        if (sesion && sesion.nombre) {
            // Si hay sesión activa, muestra "Hola, [Nombre]" y botón de Cerrar Sesión
            subNav.innerHTML = `
                <span class="me-2 fw-bold text-dark">
                    <i class="bi bi-person-circle me-1"></i>Hola, ${sesion.nombre}
                </span> | 
                <a href="#" id="btn-logout" class="ms-2 text-danger text-decoration-none">Cerrar sesión</a>
            `;

            // Evento para cerrar la sesión
            document.getElementById('btn-logout').addEventListener('click', function (e) {
                e.preventDefault();
                localStorage.removeItem('sesionActual');
                window.location.href = 'login.html';
            });
        } else {
            // Si no hay sesión, muestra los enlaces predeterminados
            subNav.innerHTML = `
                <a href="login.html" class="text-decoration-none">Iniciar sesión</a> | 
                <a href="registro.html" class="text-decoration-none">Registrar usuario</a>
            `;
        }
    }
});

