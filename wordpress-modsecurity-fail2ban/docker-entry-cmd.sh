#!/bin/bash
set -e

# service fail2ban stop
rm -rf /var/run/fail2ban/fail2ban.sock
service fail2ban start
