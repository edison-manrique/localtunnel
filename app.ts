import LocalTunnel from "./modules/localtunel/localtunnel.ts"
import input from "./modules/utils/input.ts"


let localport: number = Number(await input("Ingresa el puerto de tu servidor localhost"))
while(localport < 80 || localport > 10000){
    console.log("el puerto local debe ser >= 80 & <= 10000")
    localport = Number(await input("Ingresa el puerto de tu servidor localhost"))
}

let subdomain: string = await input("Ingresa el subdominio")
while(subdomain.length < 3){
    console.log("el subdominio debe tener como mínimo 3 caracteres")
    subdomain = await input("Ingrese el subdominio")
}


const tunnel = new LocalTunnel(localport, subdomain)
tunnel.onOpen(info => console.log(info))

await tunnel.open()