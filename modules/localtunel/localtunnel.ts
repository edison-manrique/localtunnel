import localtunnel from "localtunnel";

interface TunnelEvent {
    open: (info: any) => void;
    error: (error: any) => void;
    close: () => void;
}

interface TunnelConfig {
    port?: number;
    subdomain?: string;
    local_https?: boolean;
    local_host?: string;
    allow_invalid_cert?: boolean;
    local_cert?: string;
    local_key?: string;
}

export default class LocalTunnel {

    private events: TunnelEvent = {
        open: function (info: any): void {
            throw new Error("Function not implemented.")
        },
        error: function (error: any): void {
            throw new Error("Function not implemented.")
        },
        close: function (): void {
            throw new Error("Function not implemented.")
        }
    }
    private localport: number
    private subdomain: string
    private tunnel: any

    constructor(localport: number, subdomain: string) {
        this.localport = localport
        this.subdomain = subdomain
    }

    setPort(num: number) {
        this.localport = num
        return this
    }

    setSubdomain(sub: string) {
        this.subdomain = sub
        return this
    }

    async open(
        localhost?: string, 
        cert?: string,
        key?: string
    ): Promise<void> {
        const config : TunnelConfig = {
			port: this.localport, //(number) [required] The local port number to expose through localtunnel.
			subdomain: this.subdomain, //(string) Request a specific subdomain on the proxy server. Note You may not actually receive this name depending on availability.
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
		this.tunnel = await localtunnel(this.localport, config).catch((e :string) => error = e)
		if(error){
			console.error(`lt-error: ${error}`)
		}else{
			this.tunnel.on('request', this.onOpen())
			this.tunnel.on('error', this.onError())
			this.tunnel.on('close', this.onClose())
			console.log(`lt-connect: [ localhost:${this.localport} ] => [ ${this.tunnel.url} ]`);
		}
    }

    async close(): Promise<void> {
        if(!this.tunnel) return
		await this.tunnel.close()
		this.tunnel = null
    }

    onOpen(fn?: (info: any) => void) {
        if(typeof fn === 'function'){
			this.events.open = info => fn(info)
			return this
		}
		if(typeof this.events.open === 'function') return this.events.open
		return (info: any) => console.log('lt-open:', info)
    }

    onError(fn?: (error: any) => void) {
        if(typeof fn === 'function'){
			this.events.error = error => fn(error)
			return this
		}
		if(this.events.error) return this.events.error
		return (error: any) => console.log(`lt-error:\n${error}`)
    }

    onClose(fn?: () => void) {
        if(typeof fn === 'function'){
			this.events.close = () => fn()
			return this
		}
        if(this.events.close) return this.events.close
        return () => console.log(`lt-close: tunnel "${this.subdomain}" is closed`);
    }

}