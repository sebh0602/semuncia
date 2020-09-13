# setup
This is a guide for those, who want to set up semuncia themselves.

## required software
* nginx (or other webserver with similar functionality)
* nodejs

## nginx
WebSockets
1. Add ` map $http_upgrade $connection_upgrade {default upgrade;
'' close;}` outside of the `server` block.
2. Add `  upstream websocket {server localhost:8080;}` outside of the
`server` block.
3. Add `location /ws/ {
	proxy_pass http://websocket;
	proxy_http_version 1.1;
	proxy_set_header Upgrade $http_upgrade;
	proxy_set_header Connection $connection_upgrade;
}` in the `server`
block.
4. Run `sudo nginx -t` to check the syntax in the configuration file.
