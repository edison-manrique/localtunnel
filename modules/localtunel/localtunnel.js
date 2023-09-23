import localtunnel from 'localtunnel'


export default class LocalTunnel {

    #events
    #localport
    #subdomain

    constructor(localport, subdomain) {
    this.#localport = localport || null;
    this.#subdomain = subdomain || '';
    this.#events = {}
    this.tunnel = null
    }

    setPort(num) {
        this.#localport = num
        return this
    }

    setSubdomain(num) {
        this.#subdomain = num
        return this
    }

    async open(localhost, cert, key) {
        const config = {
            port: this.#localport, //(number) [required] The local port number to expose through localtunnel.
            subdomain: this.#subdomain, //(string) Request a specific subdomain on the proxy server. Note You may not actually receive this name depending on availability.
            local_https: false //(boolean) Disable tunneling to local HTTPS server.
        }
        if(localhost){
            config.local_host = localhost//(string) Proxy to this hostname instead of localhost. This will also cause the Host header to be re-written to this value in proxied requests.
        }
        if(cert && key){
            config.allow_invalid_cert = true //(boolean) Disable certificate checks for your local HTTPS server (ignore cert/key/ca options).
            config.local_https = true //(boolean) Enable tunneling to local HTTPS server.
            //config.local_ca = ca //(string) Path to certificate authority file for self-signed certificates.
            config.local_cert = cert //(string) Path to certificate PEM file for local HTTPS server.
            config.local_key = key //(string) Path to certificate key file for local HTTPS server.
        }
        let error
        this.tunnel = await localtunnel(this.#localport, config).catch(e => error = e)
        if(error){
            console.error(`lt-error: ${error}`)
        }else{
            this.tunnel.on('request', this.onOpen())
            this.tunnel.on('error', this.onError())
            this.tunnel.on('close', this.onClose())
            console.log(`lt-connect: [ localhost:${this.#localport} ] => [ ${this.tunnel.url} ]`);
        }
    }

    async close() {
        if(!this.tunnel) return
        await this.tunnel.close();
        this.tunnel = null
    }

    onOpen(func){
        if(typeof func === 'function'){
            this.#events.open = info => func(info)
            return this
        }
        if(typeof this.#events.open === 'function'){
            return this.#events.open
        }
        return info => console.log('lt-open:', info)
    }

    onError(func){
        if(typeof func === 'function'){
            this.#events.error = error => func(error)
            return this
        }
        if(typeof this.#events.error === 'function'){
            return this.#events.error
        }
        return error => console.log(`lt-error:\n${error}`)
    }

    onClose(func){
        if(typeof func === 'function'){
            this.#events.close = () => func()
            return this
        }
        if(typeof this.#events.close === 'function'){
            return this.#events.close
        }
        return () => console.log(`lt-close: tunnel "${this.#subdomain}" is closed`);
    }
}