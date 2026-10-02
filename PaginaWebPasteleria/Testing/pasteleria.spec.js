// *************************************** TEST 1  **************************************************************************/

describe("Pruebas del Formulario de Contacto - Pastelería Mil Sabores", function() {
    let documentRef;
    let windowRef;

    const isNode = typeof require !== 'undefined';

    beforeEach(function(done) {
        if (isNode) {
            const { JSDOM } = require('jsdom');
            const path = require('path');
            
            // Ruta a contacto.html dentro de la carpeta Pages
            const htmlPath = path.resolve(__dirname, '../Pages/contacto.html'); 

            JSDOM.fromFile(htmlPath, {
                runScripts: 'dangerously',
                resources: 'usable'
            }).then(jsdom => {
                windowRef = jsdom.window;
                documentRef = windowRef.document;
                
                // Muestra un alert simulado para evitar que falle al completar con éxito
                windowRef.alert = function() {}; 
                
                setTimeout(done, 150);
            });
        } else {
            windowRef = window;
            documentRef = document;
            done();
        }
    });

    it("debería mostrar error si el nombre está vacío", function() {
        const form = documentRef.getElementById('formulario-contacto');
        const nombreInput = documentRef.getElementById('nombre');
        const nombreError = documentRef.getElementById('nombre-error');

        nombreInput.value = '';

        const eventSubmit = new windowRef.Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(eventSubmit);

        expect(nombreInput.classList.contains('is-invalid')).toBeTrue();
        expect(nombreError.innerText).toBe("El nombre es requerido.");
    });

    it("debería rechazar un correo con dominio no permitido", function() {
        const form = documentRef.getElementById('formulario-contacto');
        const emailInput = documentRef.getElementById('email');
        const emailError = documentRef.getElementById('email-error');

        emailInput.value = 'usuario@hotmail.com';

        const eventSubmit = new windowRef.Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(eventSubmit);

        expect(emailInput.classList.contains('is-invalid')).toBeTrue();
        expect(emailError.innerText).toBe("Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.");
    });

    it("debería aceptar un correo institucional correcto (@duoc.cl)", function() {
        const form = documentRef.getElementById('formulario-contacto');
        const nombreInput = documentRef.getElementById('nombre');
        const emailInput = documentRef.getElementById('email');
        const comentarioInput = documentRef.getElementById('comentario');

        // Llenamos datos válidos
        nombreInput.value = 'Juan Pérez';
        emailInput.value = 'juan.perez@duoc.cl';
        comentarioInput.value = 'Excelente servicio y productos.';

        const eventSubmit = new windowRef.Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(eventSubmit);

        expect(emailInput.classList.contains('is-invalid')).toBeFalse();
    });
})

// *************************************** TEST 1 FINALIZADO  **************************************************************************/