FROM wordpress:latest

RUN apt update \
  && apt upgrade -y \
  && apt install -y libapache2-mod-security2 fail2ban iproute2 vim nano

COPY mod_security.conf /etc/modsecurity/mod_security.conf
COPY jail.local /etc/fail2ban/jail.d/jail.local
COPY route.conf /etc/fail2ban/action.d/route.conf
COPY apache_403.local /etc/fail2ban/filter.d/apache_403.local
COPY docker-entry-cmd.sh /usr/local/bin/docker-entry-cmd.sh

RUN service apache2 restart

# The logfiles are automatically created as symlinks to stdout/stderr, which cannot be parsed by fail2ban
RUN rm -f /var/log/apache2/access.log && touch /var/log/apache2/access.log && chown www-data:www-data /var/log/apache2/access.log \
  && rm -f /var/log/apache2/error.log && touch /var/log/apache2/error.log && chown www-data:www-data /var/log/apache2/error.log \
  && rm -f /var/log/apache2/other_vhosts_access.log && touch /var/log/apache2/other_vhosts_access.log && chown www-data:www-data /var/log/apache2/other_vhosts_access.log

ENTRYPOINT ["docker-entrypoint.sh"]
CMD /bin/bash docker-entry-cmd.sh && apache2-foreground
