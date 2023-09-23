import readline from 'node:readline'; // Importa el módulo readline de Node.js y asigna la función a una constante readline.


export default function input(question: string): Promise<string> { // Define la función input, que acepta un mensaje de texto
    const rl = readline.createInterface({ // Crea una interfaz de lectura con las entradas del usuario y los mensajes de salida del proceso actual
        input: process.stdin,
        output: process.stdout
    })
    return new Promise((resolve) => { // Crea una nueva promesa
        rl.question(`${question}: `, (answer) => { // Solicita la entrada del usuario con una interrogante al texto de entrada definido
            rl.close() // Cierra la interfaz readline una vez resuelta la promesa y se verifica la entrada
            resolve(answer)
        })
    })
}