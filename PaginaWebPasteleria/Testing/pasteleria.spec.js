// Gracias a nuestro primer test, nos dimos cuenta de que en el index.html, abajo en el newsletter no había una verificación de correo valida, se podia ingresar 
//cualquier correo falso por ejemplo un correo llamado alaska@alaska, por lo que tuvimos que cambiar nuestro primer test de prueba que era más que nada para verificar que la instalación de Jasmine y Karma funcionaban correctamente 
//de newsletter al test para verificar el formulario de contacto. 
// Por lo que adicionalmente tuvimos que cambiar en el index.html la sección del newsletter, para que el newsletter solo acepte correos con dominio @duoc.cl, @profesor.duoc.cl o @gmail.com.



// *************************************** INICIO TEST 1 - HOME  **************************************************************************/
//contacto.html 


describe("Pruebas de validación de correo y número telefónico en formulario de contacto", function() {

    let documentRef;
    let windowRef;

    const isNode = typeof require !== 'undefined';

    beforeEach(function(done) {

        if (isNode) {

            const { JSDOM } = require('jsdom');
            const path = require('path');

            const htmlPath = path.resolve(__dirname, '../Pages/contacto.html');

            JSDOM.fromFile(htmlPath, {
                runScripts: 'dangerously',
                resources: 'usable'
            }).then(jsdom => {

                windowRef = jsdom.window;
                documentRef = windowRef.document;

                windowRef.alert = function() {};

                setTimeout(done, 150);
            });

        } else {

            windowRef = window;
            documentRef = document;

            done();
        }
    });


    // 1. Correo válido y teléfono vacío
    it("debería aceptar un correo válido aunque el teléfono esté vacío", function() {

        const form = documentRef.getElementById('formulario-contacto');
        const nombreInput = documentRef.getElementById('nombre');
        const emailInput = documentRef.getElementById('email');
        const numerotInput = documentRef.getElementById('numerot');
        const comentarioInput = documentRef.getElementById('comentario');

        nombreInput.value = 'Juan Pérez';
        emailInput.value = 'juan.perez@duoc.cl';
        numerotInput.value = '';
        comentarioInput.value = 'Comentario válido.';

        const eventSubmit = new windowRef.Event('submit', {
            bubbles: true,
            cancelable: true
        });

        form.dispatchEvent(eventSubmit);

        expect(emailInput.classList.contains('is-invalid')).toBeFalse();
        expect(numerotInput.classList.contains('is-invalid')).toBeFalse();
    });


    // 2. Teléfono válido y correo vacío
    it("debería aceptar un teléfono válido aunque el correo esté vacío", function() {

        const form = documentRef.getElementById('formulario-contacto');
        const nombreInput = documentRef.getElementById('nombre');
        const emailInput = documentRef.getElementById('email');
        const numerotInput = documentRef.getElementById('numerot');
        const comentarioInput = documentRef.getElementById('comentario');

        nombreInput.value = 'Juan Pérez';
        emailInput.value = '';
        numerotInput.value = '+569 1234 5678';
        comentarioInput.value = 'Comentario válido.';

        const eventSubmit = new windowRef.Event('submit', {
            bubbles: true,
            cancelable: true
        });

        form.dispatchEvent(eventSubmit);

        expect(emailInput.classList.contains('is-invalid')).toBeFalse();
        expect(numerotInput.classList.contains('is-invalid')).toBeFalse();
    });


    // 3. Correo y teléfono válidos
    it("debería aceptar un correo y un teléfono válidos ingresados al mismo tiempo", function() {

        const form = documentRef.getElementById('formulario-contacto');
        const nombreInput = documentRef.getElementById('nombre');
        const emailInput = documentRef.getElementById('email');
        const numerotInput = documentRef.getElementById('numerot');
        const comentarioInput = documentRef.getElementById('comentario');

        nombreInput.value = 'Juan Pérez';
        emailInput.value = 'juan.perez@gmail.com';
        numerotInput.value = '+569 1234 5678';
        comentarioInput.value = 'Comentario válido.';

        const eventSubmit = new windowRef.Event('submit', {
            bubbles: true,
            cancelable: true
        });

        form.dispatchEvent(eventSubmit);

        expect(emailInput.classList.contains('is-invalid')).toBeFalse();
        expect(numerotInput.classList.contains('is-invalid')).toBeFalse();
    });


    // 4. Ambos campos vacíos
    it("debería mostrar error cuando el correo y el teléfono están vacíos", function() {

        const form = documentRef.getElementById('formulario-contacto');
        const nombreInput = documentRef.getElementById('nombre');
        const emailInput = documentRef.getElementById('email');
        const numerotInput = documentRef.getElementById('numerot');
        const emailError = documentRef.getElementById('email-error');

        const comentarioInput = documentRef.getElementById('comentario');

        nombreInput.value = 'Juan Pérez';
        emailInput.value = '';
        numerotInput.value = '';
        comentarioInput.value = 'Comentario válido.';

        const eventSubmit = new windowRef.Event('submit', {
            bubbles: true,
            cancelable: true
        });

        form.dispatchEvent(eventSubmit);

        expect(emailInput.classList.contains('is-invalid')).toBeTrue();
        expect(numerotInput.classList.contains('is-invalid')).toBeTrue();

        expect(emailError.innerText).toBe(
            "Debes ingresar al menos un correo o un número telefónico."
        );
    });


    // 5. Correo inválido
    it("debería rechazar un correo con un dominio no permitido", function() {

        const form = documentRef.getElementById('formulario-contacto');
        const nombreInput = documentRef.getElementById('nombre');
        const emailInput = documentRef.getElementById('email');
        const numerotInput = documentRef.getElementById('numerot');
        const comentarioInput = documentRef.getElementById('comentario');

        nombreInput.value = 'Juan Pérez';
        emailInput.value = 'juan@hotmail.com';
        numerotInput.value = '';
        comentarioInput.value = 'Comentario válido.';

        const eventSubmit = new windowRef.Event('submit', {
            bubbles: true,
            cancelable: true
        });

        form.dispatchEvent(eventSubmit);

        expect(emailInput.classList.contains('is-invalid')).toBeTrue();

        expect(documentRef.getElementById('email-error').innerText).toBe(
            "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com."
        );
    });


    // 6. Teléfono inválido
    it("debería rechazar un número telefónico con formato incorrecto", function() {

        const form = documentRef.getElementById('formulario-contacto');
        const nombreInput = documentRef.getElementById('nombre');
        const emailInput = documentRef.getElementById('email');
        const numerotInput = documentRef.getElementById('numerot');
        const comentarioInput = documentRef.getElementById('comentario');

        nombreInput.value = 'Juan Pérez';
        emailInput.value = '';
        numerotInput.value = '12345678';
        comentarioInput.value = 'Comentario válido.';

        const eventSubmit = new windowRef.Event('submit', {
            bubbles: true,
            cancelable: true
        });

        form.dispatchEvent(eventSubmit);

        expect(numerotInput.classList.contains('is-invalid')).toBeTrue();

        expect(documentRef.getElementById('numerot-error').innerText).toBe(
            "Por favor, ingresa un número telefónico chileno válido (+569 1234 5678)."
        );
    });


    // 7. Correo válido y teléfono inválido
    it("debería rechazar el formulario si el correo es válido pero el teléfono es inválido", function() {

        const form = documentRef.getElementById('formulario-contacto');
        const nombreInput = documentRef.getElementById('nombre');
        const emailInput = documentRef.getElementById('email');
        const numerotInput = documentRef.getElementById('numerot');
        const comentarioInput = documentRef.getElementById('comentario');

        nombreInput.value = 'Juan Pérez';
        emailInput.value = 'juan@duoc.cl';
        numerotInput.value = '569123';
        comentarioInput.value = 'Comentario válido.';

        const eventSubmit = new windowRef.Event('submit', {
            bubbles: true,
            cancelable: true
        });

        form.dispatchEvent(eventSubmit);

        expect(emailInput.classList.contains('is-invalid')).toBeFalse();
        expect(numerotInput.classList.contains('is-invalid')).toBeTrue();
    });


    // 8. Correo inválido y teléfono válido
    it("debería rechazar el formulario si el correo es inválido aunque el teléfono sea válido", function() {

        const form = documentRef.getElementById('formulario-contacto');
        const nombreInput = documentRef.getElementById('nombre');
        const emailInput = documentRef.getElementById('email');
        const numerotInput = documentRef.getElementById('numerot');
        const comentarioInput = documentRef.getElementById('comentario');

        nombreInput.value = 'Juan Pérez';
        emailInput.value = 'juan@hotmail.com';
        numerotInput.value = '569 1234 5678';
        comentarioInput.value = 'Comentario válido.';

        const eventSubmit = new windowRef.Event('submit', {
            bubbles: true,
            cancelable: true
        });

        form.dispatchEvent(eventSubmit);

        expect(emailInput.classList.contains('is-invalid')).toBeTrue();
        expect(numerotInput.classList.contains('is-invalid')).toBeFalse();
    });


    // 9. Teléfono junto: +56912345678
    it("debería aceptar un teléfono válido sin espacios: +56912345678", function() {

        const form = documentRef.getElementById('formulario-contacto');
        const nombreInput = documentRef.getElementById('nombre');
        const emailInput = documentRef.getElementById('email');
        const numerotInput = documentRef.getElementById('numerot');
        const comentarioInput = documentRef.getElementById('comentario');

        nombreInput.value = 'Juan Pérez';
        emailInput.value = '';
        numerotInput.value = '+56912345678';
        comentarioInput.value = 'Comentario válido.';

        const eventSubmit = new windowRef.Event('submit', {
            bubbles: true,
            cancelable: true
        });

        form.dispatchEvent(eventSubmit);

        expect(numerotInput.classList.contains('is-invalid')).toBeFalse();
    });


    // 10. Teléfono sin + y separado: 569 1234 5678
    it("debería aceptar un teléfono válido sin + y con espacios: 569 1234 5678", function() {

        const form = documentRef.getElementById('formulario-contacto');
        const nombreInput = documentRef.getElementById('nombre');
        const emailInput = documentRef.getElementById('email');
        const numerotInput = documentRef.getElementById('numerot');
        const comentarioInput = documentRef.getElementById('comentario');

        nombreInput.value = 'Juan Pérez';
        emailInput.value = '';
        numerotInput.value = '569 1234 5678';
        comentarioInput.value = 'Comentario válido.';

        const eventSubmit = new windowRef.Event('submit', {
            bubbles: true,
            cancelable: true
        });

        form.dispatchEvent(eventSubmit);

        expect(numerotInput.classList.contains('is-invalid')).toBeFalse();
    });

});
// *************************************** TEST 1 FINALIZADO - HOME  **************************************************************************/









// *************************************** INICIO TEST 2 - HOME **************************************************************************/
//contacto.html
describe("Pruebas de validación del nombre en formulario de contacto", function() {

    let documentRef;
    let windowRef;

    const isNode = typeof require !== 'undefined';

    beforeEach(function(done) {

        if (isNode) {

            const { JSDOM } = require('jsdom');
            const path = require('path');

            const htmlPath = path.resolve(__dirname, '../Pages/contacto.html');

            JSDOM.fromFile(htmlPath, {
                runScripts: 'dangerously',
                resources: 'usable'
            }).then(jsdom => {

                windowRef = jsdom.window;
                documentRef = windowRef.document;

                windowRef.alert = function() {};

                setTimeout(done, 150);
            });

        } else {

            windowRef = window;
            documentRef = document;

            done();
        }
    });


    // 1. Nombre vacío
    it("debería mostrar error si el nombre está vacío", function() {

        const form = documentRef.getElementById('formulario-contacto');
        const nombreInput = documentRef.getElementById('nombre');
        const nombreError = documentRef.getElementById('nombre-error');

        nombreInput.value = '';

        const eventSubmit = new windowRef.Event('submit', {
            bubbles: true,
            cancelable: true
        });

        form.dispatchEvent(eventSubmit);

        expect(nombreInput.classList.contains('is-invalid')).toBeTrue();

        expect(nombreError.innerText).toBe(
            "El nombre debe tener al menos 6 caracteres."
        );
    });


    // 2. Nombre con menos de 6 caracteres
    it("debería rechazar un nombre con menos de 6 caracteres", function() {

        const form = documentRef.getElementById('formulario-contacto');
        const nombreInput = documentRef.getElementById('nombre');

        nombreInput.value = 'Ana';

        const eventSubmit = new windowRef.Event('submit', {
            bubbles: true,
            cancelable: true
        });

        form.dispatchEvent(eventSubmit);

        expect(nombreInput.classList.contains('is-invalid')).toBeTrue();
    });


    // 3. Nombre de exactamente 6 caracteres
    it("debería aceptar un nombre de exactamente 6 caracteres", function() {

        const form = documentRef.getElementById('formulario-contacto');
        const nombreInput = documentRef.getElementById('nombre');
        const emailInput = documentRef.getElementById('email');
        const comentarioInput = documentRef.getElementById('comentario');

        nombreInput.value = 'Ana Li';
        emailInput.value = 'ana.li@gmail.com';
        comentarioInput.value = 'Comentario válido.';

        const eventSubmit = new windowRef.Event('submit', {
            bubbles: true,
            cancelable: true
        });

        form.dispatchEvent(eventSubmit);

        expect(nombreInput.classList.contains('is-invalid')).toBeFalse();
    });


    // 4. Nombre y apellido
    it("debería aceptar un nombre compuesto por nombre y apellido", function() {

        const form = documentRef.getElementById('formulario-contacto');
        const nombreInput = documentRef.getElementById('nombre');
        const emailInput = documentRef.getElementById('email');
        const comentarioInput = documentRef.getElementById('comentario');

        nombreInput.value = 'Juan Pérez';
        emailInput.value = 'juan.perez@duoc.cl';
        comentarioInput.value = 'Quiero realizar un pedido.';

        const eventSubmit = new windowRef.Event('submit', {
            bubbles: true,
            cancelable: true
        });

        form.dispatchEvent(eventSubmit);

        expect(nombreInput.classList.contains('is-invalid')).toBeFalse();
    });


    // 5. Nombre con varios nombres
    it("debería aceptar un nombre con varios nombres y apellidos", function() {

        const form = documentRef.getElementById('formulario-contacto');
        const nombreInput = documentRef.getElementById('nombre');
        const emailInput = documentRef.getElementById('email');
        const comentarioInput = documentRef.getElementById('comentario');

        nombreInput.value = 'María José González Soto';
        emailInput.value = 'maria.jose@gmail.com';
        comentarioInput.value = 'Necesito una torta para un cumpleaños.';

        const eventSubmit = new windowRef.Event('submit', {
            bubbles: true,
            cancelable: true
        });

        form.dispatchEvent(eventSubmit);

        expect(nombreInput.classList.contains('is-invalid')).toBeFalse();
    });


    // 6. Nombre con tildes
    it("debería aceptar nombres y apellidos que contengan tildes", function() {

        const form = documentRef.getElementById('formulario-contacto');
        const nombreInput = documentRef.getElementById('nombre');
        const emailInput = documentRef.getElementById('email');
        const comentarioInput = documentRef.getElementById('comentario');

        nombreInput.value = 'José María';
        emailInput.value = 'jose.maria@gmail.com';
        comentarioInput.value = 'Comentario válido.';

        const eventSubmit = new windowRef.Event('submit', {
            bubbles: true,
            cancelable: true
        });

        form.dispatchEvent(eventSubmit);

        expect(nombreInput.classList.contains('is-invalid')).toBeFalse();
    });


    // 7. Nombre y apellido extranjero
    it("debería aceptar un nombre y apellido de origen extranjero", function() {

        const form = documentRef.getElementById('formulario-contacto');
        const nombreInput = documentRef.getElementById('nombre');
        const emailInput = documentRef.getElementById('email');
        const comentarioInput = documentRef.getElementById('comentario');

        nombreInput.value = 'Li Wei';
        emailInput.value = 'li.wei@gmail.com';
        comentarioInput.value = 'Quiero realizar un pedido.';

        const eventSubmit = new windowRef.Event('submit', {
            bubbles: true,
            cancelable: true
        });

        form.dispatchEvent(eventSubmit);

        expect(nombreInput.classList.contains('is-invalid')).toBeFalse();
    });


    // 8. Espacios al inicio y al final
    it("debería validar el nombre ignorando espacios al inicio y al final", function() {

        const form = documentRef.getElementById('formulario-contacto');
        const nombreInput = documentRef.getElementById('nombre');
        const emailInput = documentRef.getElementById('email');
        const comentarioInput = documentRef.getElementById('comentario');

        nombreInput.value = '  Juan Pérez  ';
        emailInput.value = 'juan.perez@gmail.com';
        comentarioInput.value = 'Comentario válido.';

        const eventSubmit = new windowRef.Event('submit', {
            bubbles: true,
            cancelable: true
        });

        form.dispatchEvent(eventSubmit);

        expect(nombreInput.classList.contains('is-invalid')).toBeFalse();
    });


    // 9. Solo espacios
    it("debería rechazar un nombre compuesto solamente por espacios", function() {

        const form = documentRef.getElementById('formulario-contacto');
        const nombreInput = documentRef.getElementById('nombre');

        nombreInput.value = '      ';

        const eventSubmit = new windowRef.Event('submit', {
            bubbles: true,
            cancelable: true
        });

        form.dispatchEvent(eventSubmit);

        expect(nombreInput.classList.contains('is-invalid')).toBeTrue();
    });


    // 10. Nombre de más de 100 caracteres
    it("debería rechazar un nombre que supere los 100 caracteres", function() {

        const form = documentRef.getElementById('formulario-contacto');
        const nombreInput = documentRef.getElementById('nombre');
        const nombreError = documentRef.getElementById('nombre-error');

        nombreInput.value = 'A'.repeat(101);

        const eventSubmit = new windowRef.Event('submit', {
            bubbles: true,
            cancelable: true
        });

        form.dispatchEvent(eventSubmit);

        expect(nombreInput.classList.contains('is-invalid')).toBeTrue();

        expect(nombreError.innerText).toBe(
            "El nombre no puede exceder los 100 caracteres."
        );
    });

});


// *************************************** TEST 2 FINALIZADO - HOME **************************************************************************/

//test 3 - validacion del comentario 
















// *************************************** TEST 1 - ADMINISTRADOR  **************************************************************************/




// *************************************** TEST 1 FINALIZADO - ADMINISTRADOR  **************************************************************************/