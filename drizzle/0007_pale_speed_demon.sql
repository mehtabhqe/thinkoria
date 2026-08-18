CREATE TABLE `articleAssetVersions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`articleId` int NOT NULL,
	`manuscriptUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `articleAssetVersions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categoryImageVersions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`categoryId` int NOT NULL,
	`imageUrl` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categoryImageVersions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notificationHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`kind` varchar(64) NOT NULL,
	`title` varchar(240) NOT NULL,
	`content` text NOT NULL,
	`status` enum('sent','failed') NOT NULL DEFAULT 'sent',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notificationHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `articleAssetVersions` ADD CONSTRAINT `articleAssetVersions_articleId_articles_id_fk` FOREIGN KEY (`articleId`) REFERENCES `articles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `categoryImageVersions` ADD CONSTRAINT `categoryImageVersions_categoryId_categories_id_fk` FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE no action ON UPDATE no action;