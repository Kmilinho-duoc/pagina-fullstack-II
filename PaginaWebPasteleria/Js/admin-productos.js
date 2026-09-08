/* ===========================================================
   Mantenedor de Productos - Panel de administración
   Los datos se guardan en localStorage ("productosAdmin"),
   usando como base inicial el arreglo "productos" de inventario.js
   =========================================================== */

function obtenerProductosAdmin() {
    let data = JSON.parse(localStorage.getItem('productosAdmin'));
    if (!data) {
        data = productos.map(function(p) {
            return {
                id: p.id,
                categoria: p.categoria,
                nombre: p.nombre,
                descripcion: '',
                precio: p.precio,
                stock: 20,
                stockCritico: 5,
                imagen: p.imagen
            };
        });
        localStorage.setItem('productosAdmin', JSON.stringify(data));
    }
    return data;
}

function guardarProductosAdmin(data) {
    localStorage.setItem('productosAdmin', JSON.stringify(data));
}

function obtenerCategorias() {
    const base = obtenerProductosAdmin().map(p => p.categoria);
    return [...new Set(base)];
}

/* ---------- Listado (productosAdmin.html) ---------- */
function inicializarListadoProductos() {
    const tbody = document.getElementById('tabla-productos');
    if (!tbody) return;

    function render() {
        const data = obtenerProductosAdmin();
        tbody.innerHTML = '';

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted py-4">No hay productos registrados.</td></tr>';
            return;
        }

        data.forEach(function(p) {
            const critico = p.stockCritico !== '' && p.stockCritico !== undefined && p.stock <= Number(p.stockCritico);
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${p.id}</td>
                <td>${p.nombre}</td>
                <td>${p.categoria}</td>
                <td>$${Number(p.precio).toLocaleString('es-CL')}</td>
                <td>${p.stock}</td>
                <td>${critico ? 'Stock crítico' : 'Normal'}</td>
                <td class="text-end">
                    <a href="producto-form.html?id=${p.id}" class="btn btn-sm btn-outline-secondary"><i class="bi bi-pencil"></i></a>
                    <button class="btn btn-sm btn-outline-secondary text-danger btn-eliminar-producto" data-id="${p.id}"><i class="bi bi-trash"></i></button>
                </td>
            `;
            tbody.appendChild(fila);
        });

        tbody.querySelectorAll('.btn-eliminar-producto').forEach(function(btn) {
            btn.addEventListener('click', function() {
                if (confirm('¿Eliminar este producto?')) {
                    let data = obtenerProductosAdmin().filter(p => p.id !== this.getAttribute('data-id'));
                    guardarProductosAdmin(data);
                    render();
                }
            });
        });
    }

    render();
}

/* ---------- Formulario (producto-form.html) ---------- */
function inicializarFormularioProducto() {
    const form = document.getElementById('formulario-producto');
    if (!form) return;

    const params = new URLSearchParams(window.location.search);
    const idEditar = params.get('id');

    const categoriaSelect = document.getElementById('categoria');
    obtenerCategorias().forEach(function(cat) {
        categoriaSelect.innerHTML += `<option value="${cat}">${cat}</option>`;
    });

    let productoActual = null;

    if (idEditar) {
        document.getElementById('titulo-formulario-producto').textContent = 'Editar producto';
        productoActual = obtenerProductosAdmin().find(p => p.id === idEditar);
        if (productoActual) {
            document.getElementById('codigo').value = productoActual.id;
            document.getElementById('codigo').setAttribute('readonly', true);
            document.getElementById('nombre').value = productoActual.nombre;
            document.getElementById('descripcion').value = productoActual.descripcion || '';
            document.getElementById('precio').value = productoActual.precio;
            document.getElementById('stock').value = productoActual.stock;
            document.getElementById('stockCritico').value = productoActual.stockCritico;
            document.getElementById('categoria').value = productoActual.categoria;
            document.getElementById('imagen').value = productoActual.imagen || '';
        }
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();

        let esValido = true;
        const codigo = document.getElementById('codigo');
        const nombre = document.getElementById('nombre');
        const descripcion = document.getElementById('descripcion');
        const precio = document.getElementById('precio');
        const stock = document.getElementById('stock');
        const stockCritico = document.getElementById('stockCritico');
        const categoria = document.getElementById('categoria');

        const data = obtenerProductosAdmin();

        // Código: requerido, texto, min 3, sin límite máximo
        if (codigo.value.trim().length < 3) {
            esValido = false;
            codigo.classList.add('is-invalid');
        } else if (!idEditar && data.some(p => p.id.toLowerCase() === codigo.value.trim().toLowerCase())) {
            esValido = false;
            codigo.classList.add('is-invalid');
            codigo.nextElementSibling.textContent = 'Ya existe un producto con ese código.';
        } else {
            codigo.classList.remove('is-invalid');
        }

        // Nombre: requerido, max 100
        if (nombre.value.trim().length === 0 || nombre.value.length > 100) {
            esValido = false;
            nombre.classList.add('is-invalid');
        } else {
            nombre.classList.remove('is-invalid');
        }

        // Descripción: opcional, max 500
        if (descripcion.value.length > 500) {
            esValido = false;
            descripcion.classList.add('is-invalid');
        } else {
            descripcion.classList.remove('is-invalid');
        }

        // Precio: requerido, min 0, decimales permitidos
        if (precio.value === '' || Number(precio.value) < 0) {
            esValido = false;
            precio.classList.add('is-invalid');
        } else {
            precio.classList.remove('is-invalid');
        }

        // Stock: requerido, min 0, solo enteros
        if (stock.value === '' || Number(stock.value) < 0 || !Number.isInteger(Number(stock.value))) {
            esValido = false;
            stock.classList.add('is-invalid');
        } else {
            stock.classList.remove('is-invalid');
        }

        // Stock crítico: opcional, min 0, solo enteros
        if (stockCritico.value !== '' && (Number(stockCritico.value) < 0 || !Number.isInteger(Number(stockCritico.value)))) {
            esValido = false;
            stockCritico.classList.add('is-invalid');
        } else {
            stockCritico.classList.remove('is-invalid');
        }

        // Categoría: requerida
        if (!categoria.value) {
            esValido = false;
            categoria.classList.add('is-invalid');
        } else {
            categoria.classList.remove('is-invalid');
        }

        form.classList.add('was-validated');

        if (!esValido) return;

        const nuevoProducto = {
            id: idEditar ? productoActual.id : codigo.value.trim(),
            categoria: categoria.value,
            nombre: nombre.value.trim(),
            descripcion: descripcion.value.trim(),
            precio: parseFloat(precio.value),
            stock: parseInt(stock.value, 10),
            stockCritico: stockCritico.value !== '' ? parseInt(stockCritico.value, 10) : '',
            imagen: document.getElementById('imagen').value.trim()
        };

        if (idEditar) {
            const index = data.findIndex(p => p.id === idEditar);
            data[index] = nuevoProducto;
        } else {
            data.push(nuevoProducto);
        }

        guardarProductosAdmin(data);
        alert(idEditar ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.');
        window.location.href = 'productosAdmin.html';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    inicializarListadoProductos();
    inicializarFormularioProducto();
});
