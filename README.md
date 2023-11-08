# pm2-gelf-pro

## Installation

### First installation

#### production

```shell
pm2 install @amplement/pm2-gelf-pro
```

#### development

Go to your local directory

```shell
pm2 install .
```

### Update

It should work if you do `pm2 install @amplement/pm2-gelf-pro` but if you get an error like:

```
Error: ENOENT: no such file or directory, mkdir '/tmp/@amplement/pm2-gelf-pro'
```

Do:

```shell
pm2 uninstall @amplement/pm2-gelf-pro
pm2 install @amplement/pm2-gelf-pro
```

### Setup module environment variables

Bind environment vars to the module process:

```shell
pm2 set @amplement/pm2-gelf-pro:<param> <value>
```

For OVH provider use case. Send the private token from header + TLS cert

```shell
pm2 set @amplement/pm2-gelf-pro:gelf_adapterOptions_certpath client-cert.pem
pm2 set @amplement/pm2-gelf-pro:gelf_fields '{"X-OVH-TOKEN":"this-is-my-token"}'
```

Gelf pro default config is :

```json
{
    "adapterName": "tcp-tls",
    "adapterOptions": {
        "host": "gra2.logs.ovh.com",
        "port": 12202
    }
}
```
