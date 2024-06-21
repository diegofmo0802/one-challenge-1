/** @type {HTMLInputElement}     Botón de selección de `Modo de codificación` */
let btnEnc     = document.querySelector('#Encode');
/** @type {HTMLInputElement}     Botón de selección de `Modo de decodificación` */
let btnDec     = document.querySelector('#Decode');
/** @type {HTMLInputElement}     Botón de limpieza de campos */
let btnClear   = document.querySelector('#Clear');
/** @type {HTMLInputElement}     Botón de copiar resultados */
let btnCopiar   = document.querySelector('#Copiar');
/** @type {HTMLTextAreaElement}  El campo de texto de codificación/decodificación */
let userInput  = document.querySelector('#Input');
/** @type {HTMLParagraphElement} El campo de salida de la app */
let userOutput = document.querySelector('#Output');
/** @type {HTMLSpanElement} El campo de notificación de la app */
let userNotify =  document.querySelector('#Notify');
/** @type {HTMLSpanElement} El campo de notificación de la app */
let userNError =  document.querySelector('#Error');
/** @type {'Enc'|'Dec'} El modo codificación/decodificación  */
let appMode = 'Enc';

/** Esta expresión regular revisa si hay un valor invalido en el text area */
let invalidChars = /[^a-z\s]/;
/** La id del TimeOut de la notificación mostrada al usuario (si esta activa) */
let CurrentNotifyCopyID = null;
/**
 * Codifica un texto.
 * @param {string} Message El texto a codificar.
 * @returns {string} El texto codificado.
 */
function encode(Message) {
    let Resultado = Message.toLowerCase().replace(/[aeiou]/gi, (match) => {
        switch(match) {
            case 'a': return 'ai';
            case 'e': return 'enter';
            case 'i': return 'imes';
            case 'o': return 'ober';
            case 'u': return 'ufat';
        }
    })
    return Resultado;
}
/**
 * Decodifica un texto.
 * @param {string} Message El texto a decodificar.
 * @returns {string} El texto decodificado.
 */
function decode(Message) {
    let Resultado = Message.toLowerCase().replace(/ai|enter|imes|ober|ufat/gi, (match) => {
        switch(match) {
            case 'ai': return 'a';
            case 'enter': return 'e';
            case 'imes': return 'i';
            case 'ober': return 'o';
            case 'ufat': return 'u';
        }
    });
    return Resultado;
}

/**
 * Muestra un breve mensaje al usuario
 * @param {string} Message El mensaje de notificación.
 * @param {number} Time la duración en pantalla en ms.
 */
function notifyCopyStatus(Message, Time = 1000) {
    if (CurrentNotifyCopyID) clearTimeout(CurrentNotifyCopyID);
    userNotify.innerText = Message;
    CurrentNotifyCopyID = setTimeout(() => {
        userNotify.innerText = '';
        CurrentNotifyCopyID = null;
    }, Time);
}

/**
 * Muestra o elimina un mensaje de error al usuario
 * @param {string|null} Message El mensaje de error a mostrar.          
 */
function showError(Message) {
    userNError.innerText = Message ?? '';
}

/**
 * Limpia el input y el output
 */
function clear() {
    userInput.value = '';
    userOutput.innerText = '';
}
/**
 * Utiliza el input y output del usuario para codificar/decodificar.
 * 
 */
function appExec() {
    if (invalidChars.test(userInput.value)) {
        showError('Solo se aceptan letras minúsculas sin acento');
    } else {
        showError();
        userOutput.innerText = '';
        userOutput.innerText = appMode == 'Enc'
            ? encode(userInput.value)
            : decode(userInput.value);
    }
}

/**
 * Cambia el modo de de la app `codificación/decodificación`
 * @param {'Enc'|'Dec'} mode 
 */
function changeMode(mode) {
    if (mode == 'Dec') {
        btnDec.classList.add('ActiveMode');
        btnEnc.classList.remove('ActiveMode');
    } else {
        btnEnc.classList.add('ActiveMode');
        btnDec.classList.remove('ActiveMode');
    }
    userInput.placeholder = `Ingrese el texto a ${
        mode == 'Dec' ? 'decodificar' : 'codificar'
    } aquí`;
    appMode = mode;
    appExec();
}
async function Copiar() {
    let Result = userOutput.innerText;
    try {
        await navigator.clipboard.writeText(Result);
        notifyCopyStatus('Texto copiado!');
    } catch(error) {
        console.log('Error al copiar el resultado:', error);
        notifyCopyStatus('Error al copiar! :c');
    }
}

// Adición de eventos a la interfaz de usuario

btnDec.addEventListener('click',    () => changeMode('Dec'));
btnEnc.addEventListener('click',    () => changeMode('Enc'));
btnClear.addEventListener('click',  () => clear());
btnCopiar.addEventListener('click', () => Copiar());
userInput.addEventListener('input', /** @param {InputEvent} event*/(event) => {
    appExec();
});