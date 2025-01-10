
IF NOT EXISTS(
    SELECT NULL
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE table_name = 'reservation'
    AND table_schema = 'listerr'
    AND column_name = 'name'
    )
THEN

ALTER TABLE `reservation` CHANGE `guestName` `name` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL;


END IF;

IF NOT EXISTS(
    SELECT NULL
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE table_name = 'reservation'
    AND table_schema = 'listerr'
    AND column_name = 'list_id'
    )
THEN

ALTER TABLE `reservation` ADD `list_id` INT NOT NULL AFTER `user_id`;

ALTER TABLE `reservation` ADD FOREIGN KEY (`list_id`) REFERENCES `list`(`id`);

END IF;

