# Lab 7 - Wordpress + Fail2Ban + ModSecurity2

## Setup
Mainly taken from https://docs.docker.com/samples/wordpress/

## Stack
- Apache
    - ModSecurity (WAF)
    - Fail2Ban IDS
- Wordpress
- MySQL
- Docker

## How to run
1. Modify `compose.yml` wordpress service to start with standard `wordpress` image once
    - `docker compose up`, go to `localhost:8080` and setup wordpress
2. Change wordpress image back to custom `hannesolszewski/wordpress-modsecurity` image 
3. Build docker image `docker build -t hannesolszewski/wordpress-modsecurit .` It will be build from `Dockerfile` and
    - sets up ModSecurity2
    - sets up Fail2Ban and filter for 403's
4. Use `docker compose up`
5. Wordpress is now available under `localhost:8080`
6. Doing any XSS will trigger ip-ban after 3 retries, scripts below.

## Shutdown / cleanup
- `docker compose down` removes container/default network, preserves wp db
- `docker compose down --volumes` removes everything

## Additional
- `docker exec -it wordpress-modsecurity-fail2ban-wordpress-1 bash` to connect to container via ssh
- `http://localhost:8080/?page_id=<script>alert(document.cookie)</script>` - not encded
- `http://localhost:8080/?page_id=%3cscript%3ealert(document.cookie)%3c/script%3e` - encoded

## Configurations

### Fail2Ban

`jail.local` - locally changed values that differ from `jail.conf` [docs](https://wiki.ubuntuusers.de/fail2ban/#jail-local)

We are setting a custom jail handling, active SSH-Filter, as well as a custom filter-file and actions.

- `apache_403.local` - custom filter file, searches log-files for 403 errors [docs](https://wiki.ubuntuusers.de/fail2ban/#Filter-local)
- `route.conf` - our actions, here we define what commands are run when `actionban` and `actionunban` are caused
- Ip banning, when 3x 403 was caused
- output banned ip-address `sudo zgrep 'Ban' /var/log/fail2ban.log*`
- output fail2ban status `fail2ban-client status apache_403`

### ModSecurity2

Standard Web-Application-Firewall, will be installed into custom-docker image. Package name `libapache2-mod-security2`. Prevents XSS etc. Configuration & setup from [here](https://www.ionos.de/digitalguide/server/konfiguration/modsecurity-apache-module-auf-einem-cloud-server-mit-ubuntu/).

