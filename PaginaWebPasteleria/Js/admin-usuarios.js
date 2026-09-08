/* ===========================================================
   Mantenedor de Usuarios - Panel de administración
   Los datos se guardan en localStorage ("usuariosAdmin")
   Requiere Js/validar-run.js cargado antes que este archivo.
   =========================================================== */

function obtenerUsuariosAdmin() {
    let data = JSON.parse(localStorage.getItem('usuariosAdmin'));
    if (!data) {
        data = [
            { run: '191100220', nombre: 'Admin', apellidos: 'Sistema', correo: 'admin@duoc.cl', fechaNacimiento: '1990-01-01', tipo: 'Administrador', region: 'Región Metropolitana de Santiago', comuna: 'Santiago', direccion: 'Av. Siempre Viva 123' },
            { run: '112223339', nombre: 'Cliente', apellidos: 'Demo', correo: 'cliente@gmail.com', fechaNacimiento: '1995-05-05', tipo: 'Cliente', region: 'Región Metropolitana de Santiago', comuna: 'Santiago', direccion: 'Calle Falsa 456' }
        ];
        localStorage.setItem('usuariosAdmin', JSON.stringify(data));
    } else {
        const clienteDemo = data.find(function(usuario) {
            return usuario.correo === 'cliente@gmail.com';
        });

        if (clienteDemo && (clienteDemo.region !== 'Región Metropolitana de Santiago' || clienteDemo.comuna !== 'Santiago')) {
            clienteDemo.region = 'Región Metropolitana de Santiago';
            clienteDemo.comuna = 'Santiago';
            localStorage.setItem('usuariosAdmin', JSON.stringify(data));
        }
    }
    return data;
}

function guardarUsuariosAdmin(data) {
    localStorage.setItem('usuariosAdmin', JSON.stringify(data));
}

/* ---------- Listado (usuarios.html) ---------- */
function inicializarListadoUsuarios() {
    const tbody = document.getElementById('tabla-usuarios');
    if (!tbody) return;

    function render() {
        const data = obtenerUsuariosAdmin();
        tbody.innerHTML = '';

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted py-4">No hay usuarios registrados.</td></tr>';
            return;
        }

        data.forEach(function(u) {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${u.run}</td>
                <td>${u.nombre} ${u.apellidos}</td>
                <td>${u.correo}</td>
                <td>${u.tipo}</td>
                <td>${u.comuna || '-'}</td>
                <td class="text-end">
                    <a href="usuario-form.html?run=${u.run}" class="btn btn-sm btn-outline-secondary"><i class="bi bi-pencil"></i></a>
                    <button class="btn btn-sm btn-outline-secondary text-danger btn-eliminar-usuario" data-run="${u.run}"><i class="bi bi-trash"></i></button>
                </td>
            `;
            tbody.appendChild(fila);
        });

        tbody.querySelectorAll('.btn-eliminar-usuario').forEach(function(btn) {
            btn.addEventListener('click', function() {
                if (confirm('¿Eliminar este usuario?')) {
                    let data = obtenerUsuariosAdmin().filter(u => u.run !== this.getAttribute('data-run'));
                    guardarUsuariosAdmin(data);
                    render();
                }
            });
        });
    }

    render();
}

/* ---------- Formulario (usuario-form.html) ---------- */
function inicializarFormularioUsuario() {
    const form = document.getElementById('formulario-usuario');
    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    const runEditar = params.get('run');

    const regionSelect = document.getElementById('region');
    const comunaSelect = document.getElementById('comuna');

    for (const region in regionesComunas) {
        regionSelect.innerHTML += `<option value="${region}">${region}</option>`;
    }

    regionSelect.addEventListener('change', function() {
        comunaSelect.innerHTML = '<option value="" selected disabled>Seleccione la comuna...</option>';
        if (this.value) {
            comunaSelect.disabled = false;
            regionesComunas[this.value].forEach(function(comuna) {
                comunaSelect.innerHTML += `<option value="${comuna}">${comuna}</option>`;
            });
        } else {
            comunaSelect.disabled = true;
        }
    });

    let usuarioActual = null;

    if (runEditar) {
        document.getElementById('titulo-formulario-usuario').textContent = 'Editar usuario';
        usuarioActual = obtenerUsuariosAdmin().find(u => u.run === runEditar);
        if (usuarioActual) {
            document.getElementById('run').value = usuarioActual.run;
            document.getElementById('run').setAttribute('readonly', true);
            document.getElementById('nombre').value = usuarioActual.nombre;
            document.getElementById('apellidos').value = usuarioActual.apellidos;
            document.getElementById('correo').value = usuarioActual.correo;
            document.getElementById('password').value = usuarioActual.password || '';
            document.getElementById('fechaNacimiento').value = usuarioActual.fechaNacimiento || '';
            document.getElementById('tipo').value = usuarioActual.tipo;
            document.getElementById('direccion').value = usuarioActual.direccion;
            regionSelect.value = usuarioActual.region || '';
            if (usuarioActual.region) {
                comunaSelect.disabled = false;
                regionesComunas[usuarioActual.region].forEach(function(comuna) {
                    comunaSelect.innerHTML += `<option value="${comuna}">${comuna}</option>`;
                });
                comunaSelect.value = usuarioActual.comuna || '';
            }
        }
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();

        let esValido = true;
        const run = document.getElementById('run');
        const nombre = document.getElementById('nombre');
        const apellidos = document.getElementById('apellidos');
        const correo = document.getElementById('correo');
        const password = document.getElementById('password');
        const tipo = document.getElementById('tipo');
        const direccion = document.getElementById('direccion');

        const data = obtenerUsuariosAdmin();
        const emailRegex = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;

        // Run: requerido, válido, sin puntos ni guion, min 7 max 9
        const runLimpio = run.value.trim().toUpperCase();
        if (runLimpio.length < 7 || runLimpio.length > 9 || !validarRun(runLimpio)) {
            esValido = false;
            run.classList.add('is-invalid');
        } else if (!runEditar && data.some(u => u.run === runLimpio)) {
            esValido = false;
            run.classList.add('is-invalid');
            run.nextElementSibling.textContent = 'Ya existe un usuario con ese RUN.';
        } else {
            run.classList.remove('is-invalid');
        }

        // Nombre: requerido, max 50
        if (nombre.value.trim().length === 0 || nombre.value.length > 50) {
            esValido = false;
            nombre.classList.add('is-invalid');
        } else {
            nombre.classList.remove('is-invalid');
        }

        // Apellidos: requerido, max 100
        if (apellidos.value.trim().length === 0 || apellidos.value.length > 100) {
            esValido = false;
            apellidos.classList.add('is-invalid');
        } else {
            apellidos.classList.remove('is-invalid');
        }

        // Correo: requerido, max 100, dominio permitido
        if (correo.value.length === 0 || correo.value.length > 100 || !emailRegex.test(correo.value)) {
            esValido = false;
            correo.classList.add('is-invalid');
        } else {
            correo.classList.remove('is-invalid');
        }

        // Contraseña: requerida, entre 4 y 10 caracteres
        if (password.value.length < 4 || password.value.length > 10) {
            esValido = false;
            password.classList.add('is-invalid');
        } else {
            password.classList.remove('is-invalid');
        }

        // Tipo de usuario: requerido
        if (!tipo.value) {
            esValido = false;
            tipo.classList.add('is-invalid');
        } else {
            tipo.classList.remove('is-invalid');
        }

        // Dirección: requerida, max 300
        if (direccion.value.trim().length === 0 || direccion.value.length > 300) {
            esValido = false;
            direccion.classList.add('is-invalid');
        } else {
            direccion.classList.remove('is-invalid');
        }

        // Región / Comuna: requeridas
        if (!regionSelect.value) {
            esValido = false;
            regionSelect.classList.add('is-invalid');
        } else {
            regionSelect.classList.remove('is-invalid');
        }
        if (!comunaSelect.value) {
            esValido = false;
            comunaSelect.classList.add('is-invalid');
        } else {
            comunaSelect.classList.remove('is-invalid');
        }

        if (!esValido) return;

        const nuevoUsuario = {
            run: runEditar ? usuarioActual.run : runLimpio,
            nombre: nombre.value.trim(),
            apellidos: apellidos.value.trim(),
            correo: correo.value.trim(),
            password: password.value,
            fechaNacimiento: document.getElementById('fechaNacimiento').value,
            tipo: tipo.value,
            region: regionSelect.value,
            comuna: comunaSelect.value,
            direccion: direccion.value.trim()
        };

        if (runEditar) {
            const index = data.findIndex(u => u.run === runEditar);
            data[index] = nuevoUsuario;
        } else {
            data.push(nuevoUsuario);
        }

        guardarUsuariosAdmin(data);
        alert(runEditar ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.');
        window.location.href = 'usuarios.html';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    inicializarListadoUsuarios();
    inicializarFormularioUsuario();
});
