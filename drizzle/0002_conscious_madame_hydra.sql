CREATE TABLE `clubApplications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('debator','mediator','jury','timekeeper','organizer','observer','other') NOT NULL,
	`otherRole` varchar(160),
	`note` text,
	`status` enum('pending','accepted','declined','waitlisted') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clubApplications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `clubApplications` ADD CONSTRAINT `clubApplications_eventId_clubEvents_id_fk` FOREIGN KEY (`eventId`) REFERENCES `clubEvents`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `clubApplications` ADD CONSTRAINT `clubApplications_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;