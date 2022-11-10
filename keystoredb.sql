PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE Keys     (KeyId       INTEGER NOT NULL PRIMARY KEY,                                                              Key         TEXT    NOT NULL,                                                              ExchangeId  INTEGER NOT NULL,                                                              Secret      TEXT    NOT NULL,                                                              FOREIGN KEY (ExchangeId) REFERENCES Exchanges (Id),                                                                      UNIQUE(Key)                                                             );
INSERT INTO Keys VALUES(1,'1ITYVIumBb8A7vPrkeA23NR699DBnaJzXRHyq9AT',1,'nJb0y4C1a8MMPUw48Sea8O%ajGiIcd2QVLo#bI0N');
INSERT INTO Keys VALUES(2,'h1Yg1qdKrW4zO9j771GVceAHEXvrDcFmshcRnI0E',2,'6Z@nJzE32v^elr77V94VnFu$!K1AMcWHR^E1VIOi');
INSERT INTO Keys VALUES(3,'QfGirjLfgpkrs7FcZSkQKmPUl0spiCDMFSKYXqwr',3,'g2*y!5I3WTB13WtVxnHPVYI%dXKERzXRiCjT$MqM');
INSERT INTO Keys VALUES(4,'lVG73CrnrmHomyon673r2W8y0p8X7iEfr17joBCx',4,'@$!j546SO$blK4fgk*rEQKogf26VK2U^ihpHY7BV');
CREATE TABLE Exchanges (Id         INTEGER NOT NULL PRIMARY KEY,                                                               Name       TEXT    NOT NULL,                                                               Url        TEXT    NOT NULL,                                                               Subaccount TEXT,                                                                          DirectionIn BOOLEAN NOT NULL,                                                                           UNIQUE(Name,DirectionIn)                                                              );
INSERT INTO Exchanges VALUES(1,'ftx','https://ftx.com/','napbots',1);
INSERT INTO Exchanges VALUES(2,'binance','https://binance.com/','',1);
INSERT INTO Exchanges VALUES(3,'kraken','https://kraken.com/','',1);
INSERT INTO Exchanges VALUES(4,'ftx','https://ftx.com/','main',0);
CREATE UNIQUE INDEX "ExchangeIdx" ON "Exchanges" (
	"Id",
	"Name",
	"DirectionIn"
);
CREATE UNIQUE INDEX "KeysIdx" ON "Keys" (
	"KeyId",
	"Key"
);
COMMIT;
