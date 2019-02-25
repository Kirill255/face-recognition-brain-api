# face-recognition-brain-api

## Frontend

https://github.com/Kirill255/react-face-recognition-brain

## PostgreSQL

https://postgrespro.ru/windows - скачал базу PostgreSQL 10.5 32-разрядная

https://www.enterprisedb.com/download-postgresql-binaries - или тут Binaries from installer Version 10.6 Win x86-32

https://www.pgadmin.org/download/pgadmin-4-windows/ - pgAdmin 4 v4.2 (released Feb. 7, 2019)

https://www.techonthenet.com/postgresql/datatypes.php - типов данных, доступных в PostgreSQL

Сначала мы установили базу на компьютер, пароль при установке не ставили, выбрали пункт «Использовать параметры по умолчанию», чтобы СУБД не занимала много оперативной памяти.

Дальше запустили службу сервера базы данных, если не запущена.

Дальше через pgAdmin создали базу smart-brain, и создали в ней таблицы через Query tool:

```sql
CREATE TABLE users(
id serial PRIMARY KEY,
name VARCHAR(100),
email text UNIQUE NOT NULL,
entries BIGINT DEFAULT 0,
joined TIMESTAMP NOT NULL
);
```

```sql
CREATE TABLE login(
id serial PRIMARY KEY,
hash VARCHAR(100) NOT NULL,
email text UNIQUE NOT NULL
);
```

## Connecting To The Database

https://www.npmjs.com/package/pg

https://www.npmjs.com/package/pg-promise

https://www.npmjs.com/package/knex

https://www.npmjs.com/package/sequelize

Сдесь мы будем использовать knex с pg `npm install knex pg --save`

### Query Builder

[.select()](https://knexjs.org/#Builder-select)

[.insert()](https://knexjs.org/#Builder-insert)

[.returning()](https://knexjs.org/#Builder-returning)

[.where()](https://knexjs.org/#Builder-where)

[.update()](https://knexjs.org/#Builder-update)

[.increment()](https://knexjs.org/#Builder-increment)

[.transaction()](https://knexjs.org/#Transactions)
