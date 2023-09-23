/**
 * Retrasa la resolución de una promesa por el tiempo especificado en milisegundos
* @param {number} milliseconds - Tiempo a esperar antes de resolver la promesa
* @returns {Promise<void>} Promesa resuelta después de la espera
*/

export default function sleep(milliseconds) {
    if(milliseconds < 0) return Promise.reject('milliseconds must be positive')
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}