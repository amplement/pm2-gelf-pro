Install pm2 module

```
pm2 install amplement/pm2-gelf-pro
```

Bind environment vars to the module process :
`pm2 set pm2-gelf:<param> <value>`

For OVH provider use case. Send the private token from header + TLS cert
```
pm2 set pm2-gelf-pro:gelf_adapterOptions_certpath client-cert.pem
pm2 set pm2-gelf-pro:gelf_fields '{"X-OVH-TOKEN":"this-is-my-token"}'
```

Gelf pro default config is :

```
{
    adapterName: 'tcp-tls',
    adapterOptions: {
        host: 'gra2.logs.ovh.com',
        port: 12202
    }
}
```
