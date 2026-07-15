#!/bin/bash
set -e
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE "gourmet-auth";
    CREATE DATABASE "gourmet-user";
    CREATE DATABASE "gourmet-restaurant";
    CREATE DATABASE "gourmet-menu";
    CREATE DATABASE "gourmet-cart";
    CREATE DATABASE "gourmet-order";
    CREATE DATABASE "gourmet-payment";
    CREATE DATABASE "gourmet-delivery";
EOSQL
