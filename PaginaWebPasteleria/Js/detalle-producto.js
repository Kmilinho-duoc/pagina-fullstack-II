document.addEventListener('DOMContentLoaded', function() {

    
    const carritoBtn = document.getElementById('carrito-btn');
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    function actualizarBotonCarrito() {
        const totalItems = carrito.reduce((total, item) => total + item.quantity, 0);
        if (carritoBtn) {
            carritoBtn.innerHTML = `
                <i class="bi bi-cart"></i> Carrito (${totalItems})
            `;
        }
    }

    function agregarAlCarrito(idProducto, cantidad) {
        const itemEnCarrito = carrito.find(item => item.id === idProducto);
        
        if (itemEnCarrito) {
            itemEnCarrito.quantity += cantidad;
        } else {
            carrito.push({ id: idProducto, quantity: cantidad });
        }
        
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarBotonCarrito();
        alert('Producto(s) añadido(s) al carrito');
    }

    
    const params = new URLSearchParams(window.location.search);
    const productoId = params.get('id');
    // Usamos el catálogo administrado (localStorage) para que refleje
    // los precios y productos que agrega o edita el administrador.
    const listaProductos = typeof obtenerProductosAdmin === 'function' ? obtenerProductosAdmin() : productos;
    const producto = listaProductos.find(p => p.id === productoId);

    if (producto) {
        document.title = `${producto.nombre} - Pastelería Mil Sabores`;
        document.getElementById('producto-breadcrumb').textContent = producto.nombre;
        document.getElementById('producto-descripcion').textContent = producto.descripcion;
        document.getElementById('producto-nombre').textContent = producto.nombre;
        document.getElementById('producto-precio').textContent = `$${producto.precio.toLocaleString('es-CL')} CLP`;

        document.getElementById('producto-imagen').src = producto.imagen;
        document.getElementById('producto-imagen').alt = producto.nombre;

        
        
        const btnAnadir = document.getElementById('btn-anadir-detalle');
        const inputCantidad = document.getElementById('cantidad');
        
        btnAnadir.addEventListener('click', function() {
            const cantidad = parseInt(inputCantidad.value, 10);
            if (cantidad > 0) {
                agregarAlCarrito(producto.id, cantidad);
            }
        });

    } else {
        document.getElementById('detalle-producto-container').innerHTML = 
            '<h1 class="text-center">Producto no encontrado</h1>';
    }

    actualizarBotonCarrito();
});