/* ===========================================================
   Control de sesión y permisos del panel de administración.
   Roles: administrador | cliente
   =========================================================== */

document.addEventListener('DOMContentLoaded', function() {

    const sesion = JSON.parse(localStorage.getItem('sesionActual'));

    // Solo un administrador puede entrar al panel de administración.
    if (!sesion || sesion.rol !== 'administrador') {
        alert('Debes iniciar sesión como Administrador para acceder a esta sección.');
        window.location.href = '../login.html';
        return;
    }

    // Datos del usuario en el sidebar
    const nombreEl = document.getElementById('admin-usuario-nombre');
    const rolEl = document.getElementById('admin-usuario-rol');
    if (nombreEl) nombreEl.textContent = sesion.nombre;
    if (rolEl) rolEl.textContent = sesion.rol;

    // Marca el link activo del menú según la página actual
    const paginaActual = window.location.pathname.split('/').pop();
    document.querySelectorAll('.admin-nav a').forEach(function(link) {
        if (link.getAttribute('data-page') === paginaActual) {
            link.classList.add('active');
        }
    });

    // Cerrar sesión
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('sesionActual');
            window.location.href = '../login.html';
        });
    }
});
