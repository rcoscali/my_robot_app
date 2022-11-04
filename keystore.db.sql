BEGIN TRANSACTION;
DROP TABLE IF EXISTS "Keys";
CREATE TABLE IF NOT EXISTS "Keys" (
	"KeyId"	INTEGER NOT NULL,
	"Key"	TEXT NOT NULL,
	"ExchangeId"	INTEGER NOT NULL,
	"Secret"	TEXT NOT NULL,
	FOREIGN KEY("ExchangeId") REFERENCES "Exchanges"("Id"),
	PRIMARY KEY("KeyId"),
	UNIQUE("Key")
);
DROP TABLE IF EXISTS "Exchanges";
CREATE TABLE IF NOT EXISTS "Exchanges" (
	"Id"	INTEGER NOT NULL,
	"Name"	TEXT NOT NULL,
	"Url"	TEXT NOT NULL,
	"Subaccount"	TEXT,
	PRIMARY KEY("Id"),
	UNIQUE("Name")
);
INSERT INTO "Keys" ("KeyId","Key","ExchangeId","Secret") VALUES (1,'HhZ6qJAbUtQ3l8iRGlLddGx1L3QTvigwUvcBOq1Q2T92EImIpmaqfTp0gaGbJTpy',2,'fSczOeQTS62uV7Fn3ZnDoFndbvi6P4eCN7U1QpfbzqwOHlNItRQcNQHZwto3HpPQ'),
 (2,'YJ4FLbB7Zb3IJeNgxbF0tLbhWdn6XCSFeu0wyM_d',1,'lo8RfIB4j_qSmEQ5Kv1etNFLYscnog68BnRqhsl4'),
 (3,'rztreztzretzertze',3,'azerazerazreazer');
INSERT INTO "Exchanges" ("Id","Name","Url","Subaccount") VALUES (1,'ftx','https://ftx.com/','napbots'),
 (2,'binance','https://binance.com/',''),
 (3,'kraken','https://kraken.com/','');
COMMIT;
