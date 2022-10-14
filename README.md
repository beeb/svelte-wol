# Remote Wake-on-LAN with Node.js and svelte-kit

[![Docker Release](https://github.com/beeb/svelte-wol/actions/workflows/docker.yml/badge.svg)](https://github.com/beeb/svelte-wol/actions/workflows/docker.yml)

This Node.js application allows to connect to a web interface and trigger a magic packet that will wake another device
on the network through its ethernet adapter.

## Quick start

The easiest is probably to use the provided [docker image](https://hub.docker.com/repository/docker/vbersier/svelte-wol).
The image expects 3 environment variables to be present:

```shell
$ export WOL_TARGET_IP=192.168.0.123
$ export WOL_TARGET_MAC=00:00:00:00:00:00
$ export WOL_PASSPHRASE=your_l0ng_but_easy_to_remember_passphrase
```

The first is the local IP of the device to wake (for upstate monitoring). The second is the MAC address of the adapter
that will receive the magic packet and needs to wake up. Finally, the last one is the passphrase that will allow
anyone with access to the web interface to send this Wake-on-LAN command.

Choose a password that is long and complex enough.

### Example using `docker run`

`docker run --network="host" -p 3000:3000 -d vbersier/svelte-wol:latest`

### Example using docker-compose

```yaml
services:
  wol:
    image: vbersier/svelte-wol:latest
    restart: unless-stopped
    network_mode: host
    ports:
      - '3000:3000'
    environment:
      WOL_TARGET_IP: '192.168.0.123'
      WOL_TARGET_MAC: 00:00:00:00:00:00
      WOL_PASSPHRASE: your_l0ng_but_easy_to_remember_passphrase
```

## Accessing from the internet

This web interface is not automatically accessible through the internet. You could, for instance, forward port `3000` in
your firewall to the device running `svelte-wol`, and then accessing it through its public IP.

You could also use a dynDNS service to have a domain name always pointing to your device's public IP.

Finally, you could use something like [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
to setup a permanent tunnel to your local webserver through a custom domain.
