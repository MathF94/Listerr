INSERT INTO `user` (`id`, `login`, `password`, `name`, `email`, `role_id`, `created_at`, `updated_at`) VALUES
(4, 'Math', 'truc', 'FAGOT', 'mathieu_fagot@hotmail.fr', 1, '2023-09-12 11:02:02', '2023-09-12 11:02:02'),
(5, 'Math94', '$2y$10$J5y8in2iSrO4yZGHe9b41OUP6Hu/7vdj3TIEwpY/JXfiqwYsv6AaC', 'FAGOT', 'mathieufagot@hotmail.fr', 1, '2023-09-12 14:33:38', '2023-09-12 14:33:38'),
(6, '  ', '$2y$10$.mKL/Vhc67iqpyPoUlpYP.AjJY819VoMYaDl1vdO16HnL6v0NdrkK', '  ', '    ', 1, '2023-09-12 15:55:00', '2023-09-12 15:55:00'),
(8, '<script>document.location.href=\"https://www.youtube.com/watch?v=17vFHKwq8B8\";</script>', '$2y$10$qnBIrs0y0I72.kgzlKioReHTHkrmygbnVS1hUHKb6KRg.8nw7drZe', 'FAGOT  ', 'fagot@hotmail.fr    ', 1, '2023-09-12 16:02:28', '2023-09-12 16:02:28'),
(24, 'Math_94', '$2y$10$MvWZBvAiQrlj0F5kRRzr1.d0TMT41E02/RQVxkmcDLd5cTnwjPxKm', 'FAGOT', 'fagotmathieu@gmail.com', 1, '2023-09-13 14:25:58', '2023-09-13 14:25:58'),
(26, 'Math_94500', '$2y$10$ZGJpek0YXCyHHaibzcAHZOe.2YDcc/wIWwrEXVyOuvrNC4Lz31ODq', 'Mathieu', 'math@hot.com', 1, '2023-09-13 15:25:39', '2023-09-13 15:25:39'),
(27, 'Math_94501', '$2y$10$77z.yryBHjRgk9bmgH5lTeOichWrKQW4Njm/KUtd/oJBB34/Lchfi', 'Mathieu', 'math@hotmail.com', 1, '2023-09-13 17:00:54', '2023-09-13 17:00:54'),
(28, 'Math_94502', '$2y$10$MFivFoxa.whL.33yCVeStu2G6.w5DSLlzj0NbpjLY0Ch.FJr7NKJu', 'Mathieu', 'mat@hotmail.com', 1, '2023-09-13 21:29:33', '2023-09-13 21:29:33'),
(29, 'Math_94503', 'eU9ST1NISUtVODcrKys=', 'Mathieu', 'matt@hotmail.com', 1, '2023-09-13 21:42:18', '2023-09-13 21:42:18'),
(30, 'Math_94505', '87eMKwAnDvZw2', 'Mathieu', 'matth@hotmail.io', 1, '2023-09-13 22:01:32', '2023-09-13 22:01:32'),
(31, 'Math_94506', '87eMKwAnDvZw2', 'Mathieu', 'matfag@hotmail.io', 1, '2023-09-13 22:32:51', '2023-09-13 22:32:51'),
(33, 'Math_94507', '87eMKwAnDvZw2', 'Mathieu', 'mathfag@hotmail.io', 1, '2023-09-13 22:33:44', '2023-09-13 22:33:44');

INSERT INTO `user` (`id`, `login`, `password`, `name`, `email`, `role_id`, `created_at`, `updated_at`) VALUES
(37, 'user_1', '87eMKwAnDvZw2', 'userone', 'user1@hotmail.com', 1, '2023-09-15 12:10:33', '2023-09-15 12:10:33'),
(38, 'user_2', '87pZSvn68W702', 'usertwo', 'user2@hotmail.com', 1, '2023-09-15 12:12:47', '2023-09-15 12:12:47'),
(39, 'user_3', '87PKvDy543r9k', 'userthree', 'user3@hotmail.com', 1, '2023-09-15 12:13:12', '2023-09-15 12:13:12');

INSERT INTO `role` (`id`, `name`) VALUES
(1, 'User'),
(2, 'Admin');