/*
listerr - gestionnaire de listes et tâches
Copyright (C) 2025 Mathieu Fagot

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

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

