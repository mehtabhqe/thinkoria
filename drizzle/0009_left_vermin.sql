CREATE TABLE `emailDeliveries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventKey` varchar(240) NOT NULL,
	`kind` varchar(64) NOT NULL,
	`recipient` varchar(320) NOT NULL,
	`status` enum('sent','failed') NOT NULL DEFAULT 'sent',
	`providerId` varchar(128),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emailDeliveries_id` PRIMARY KEY(`id`),
	CONSTRAINT `emailDeliveries_eventKey_unique` UNIQUE(`eventKey`)
);
