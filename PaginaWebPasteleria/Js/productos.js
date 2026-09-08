document.addEventListener('DOMContentLoaded', function() {

    const carritoBtn = document.getElementById('carrito-btn');
    const grid = document.getElementById('productos-grid');
    
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    function actualizarBotonCarrito() {
        const totalItems = carrito.reduce((total, item) => total + item.quantity, 0);
        if (carritoBtn) {
            carritoBtn.innerHTML = `
                <i class="bi bi-cart"></i> Carrito (${totalItems})
            `;
        }
    }

    function agregarAlCarrito(idProducto) {
        const itemEnCarrito = carrito.find(item => item.id === idProducto);
        
        if (itemEnCarrito) {
            itemEnCarrito.quantity++;
        } else {
            carrito.push({ id: idProducto, quantity: 1 });
        }
        
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarBotonCarrito();
    }

    if (!grid) {
        actualizarBotonCarrito();
        return;
    }

    grid.innerHTML = '';

    // Usamos el catálogo administrado (localStorage), así los precios
    // y productos nuevos del panel de administrador se ven reflejados aquí.
    const listaProductos = typeof obtenerProductosAdmin === 'function' ? obtenerProductosAdmin() : productos;

    listaProductos.forEach(producto => {
        const col = document.createElement('div');
        col.classList.add('col');
        
        col.innerHTML = `
          <a href="detalle-producto.html?id=${producto.id}" class="card-link">
            <div class="card h-100">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                </div>
                <div class="card-footer d-flex justify-content-between align-items-center">
                    <span class="price-text">$${producto.precio.toLocaleString('es-CL')} CLP</span>
                    
                    <button class="btn btn-primary btn-add-cart" data-id="${producto.id}">
                        <i class="bi bi-cart-plus"></i>
                        <span class="visually-hidden">Añadir al carrito</span>
                    </button>
                </div>
            </div>
          </a>
        `;
        
        grid.appendChild(col);
    });

    grid.querySelectorAll('.btn-add-cart').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation(); 
            
            const idProducto = this.getAttribute('data-id');
            agregarAlCarrito(idProducto);
        });
    });

    actualizarBotonCarrito();
});