# Activate foreign keys
PRAGMA foreign_keys = ON;
# Create Keys table
CREATE TABLE IF NOT EXISTS Keys (KeyId INTEGER NOT NULL PRIMARY KEY, Key TEXT NOT NULL, ExchangeId INTEGER NOT NULL, Secret TEXT NOT NULL, FOREIGN KEY (ExchangeId) REFERENCES Exchanges (Id), UNIQUE(Key));
# Create Exchanges table
CREATE TABLE IF NOT EXISTS Exchanges (Id INTEGER NOT NULL PRIMARY KEY, Name TEXT NOT NULL, Url TEXT NOT NULL, Subaccount TEXT, UNIQUE(Name));
# Populate Exchanges table
INSERT INTO Exchanges (Name, Url, Subaccount) VALUES ('ftx', 'https://ftx.com/', 'napbots'), ('binance', 'https://binance.com/', ''), ('kraken', 'https://kraken.com/', '');
