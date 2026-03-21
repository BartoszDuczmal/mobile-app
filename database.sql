-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 21, 2026 at 06:34 PM
-- Wersja serwera: 10.4.28-MariaDB
-- Wersja PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mobile_app`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `comments`
--

CREATE TABLE `comments` (
  `id` int(11) UNSIGNED NOT NULL,
  `author_id` int(11) UNSIGNED DEFAULT NULL,
  `post_id` int(11) UNSIGNED NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `author_id`, `post_id`, `content`, `created_at`) VALUES
(18, 6, 23, 'skibisi', '2026-03-18 19:49:17'),
(24, 11, 23, 'Nice post', '2026-03-19 21:18:40'),
(27, 11, 23, 'I like it', '2026-03-19 21:19:39');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `comments_likes`
--

CREATE TABLE `comments_likes` (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `comment_id` int(11) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments_likes`
--

INSERT INTO `comments_likes` (`id`, `user_id`, `comment_id`, `created_at`) VALUES
(13, 6, 18, '2026-03-18 19:49:19'),
(23, 11, 27, '2026-03-19 21:28:04');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `pass_resets`
--

CREATE TABLE `pass_resets` (
  `id` int(11) UNSIGNED NOT NULL,
  `jti` varchar(255) NOT NULL,
  `user_id` int(11) UNSIGNED NOT NULL,
  `used` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `expires_at` datetime NOT NULL DEFAULT (current_timestamp() + interval 15 minute)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pass_resets`
--

INSERT INTO `pass_resets` (`id`, `jti`, `user_id`, `used`, `created_at`, `expires_at`) VALUES
(34, 'd6f6e84a-e8fa-43a4-bdb6-2f88a0679f4b', 6, 0, '2025-11-04 21:39:41', '2025-11-04 21:54:41'),
(35, '8f275685-4223-4009-8d12-7fb028a80c46', 6, 1, '2025-11-06 16:32:12', '2025-11-06 16:47:12'),
(36, '1d53ca8f-09d0-48f0-a794-8ed959f2abbf', 6, 0, '2025-12-08 16:35:33', '2025-12-08 16:50:33'),
(37, 'ab64571b-1bb9-451f-87c4-61741fd46231', 10, 0, '2025-12-22 19:48:14', '2025-12-22 20:03:14');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `posts`
--

CREATE TABLE `posts` (
  `id` int(11) UNSIGNED NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `author` int(11) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `title`, `description`, `author`, `created_at`) VALUES
(2, 'Szymon gra w mc', 'Szymon napierdziela w Minecraft od samego rana.', 6, '2025-06-12 09:52:39'),
(3, 'Einahur', 'Sigma?', 6, '2025-06-12 09:52:39'),
(11, 'lava chicken', 'Steve\'s lava chicken is tasty so heeel so mamacita is ringing the bell', 6, '2025-06-26 15:44:46'),
(12, 'Skibidi glowa', 'skibidi toaleta', NULL, '2025-07-23 15:47:54'),
(13, 'Sigma?', 'Nie, to Bartosz Duczmal!', NULL, '2025-07-23 15:49:37'),
(14, 'Ligmy', 'się chowają ', NULL, '2025-07-23 15:51:06'),
(19, 'Co jest', 'Co brat robi na kalkulatorze?', 6, '2025-12-01 13:20:54'),
(23, 'Day One', 'I just started using this app today and I have to say, the interface is really clean and easy to understand. Looking forward to using it more.', NULL, '2026-01-21 19:15:24'),
(24, 'Any Tips for Beginners?', 'Hi everyone! I am new here and still learning how everything works. Do you have any tips or features I should check out first?', NULL, '2026-01-21 19:15:24'),
(25, 'Opinion', 'I have been using this platform for a few days now and everything works smoothly. I especially like how fast the pages load.', NULL, '2026-01-21 19:15:24'),
(26, 'Small Bug I Noticed', 'Sometimes the page does not refresh correctly after adding a new post. It is not a big problem, but I wanted to report it.', NULL, '2026-01-21 19:15:24'),
(27, 'What Features Would You Like to See?', 'If you could add one new feature to this app, what would it be? I think a comment section would be really useful.', NULL, '2026-01-21 19:15:24');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `posts_likes`
--

CREATE TABLE `posts_likes` (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) UNSIGNED DEFAULT NULL,
  `post_id` int(11) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posts_likes`
--

INSERT INTO `posts_likes` (`id`, `user_id`, `post_id`, `created_at`) VALUES
(59, 6, 12, '2025-07-23 15:48:17'),
(60, 6, 11, '2025-07-23 17:34:21'),
(77, 6, 13, '2025-11-13 15:48:40'),
(92, 6, 19, '2026-03-12 10:12:03'),
(99, 6, 25, '2026-03-17 20:03:08'),
(105, 6, 23, '2026-03-18 20:13:29'),
(127, 11, 24, '2026-03-19 21:27:48'),
(130, 6, 2, '2026-03-21 14:21:27');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(11) UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(50) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `perms` varchar(25) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `pass`, `perms`, `created_at`) VALUES
(5, '', 'bartoszduczmal@gmail.com', '$2b$10$FpGaztNYj4DffeEx0oKnbOe9Pzqf0FF0X1XPZRKGxakBE8P9kEtyq', NULL, '2025-06-26 11:47:08'),
(6, 'SigmaBartosz', 'bartoszduczmal09@gmail.com', '$2b$10$VJFwooEYisEJN1dFA1rM9.MvNrG24YKR38xHs/eom07l85NJXp8HK', 'admin', '2025-06-26 11:49:19'),
(7, '', 'szymix@gmail.com', '$2b$10$4uW55HKIRM0mDnemqKvrm.7.lr.KUVjCRBn99UNkMoBlqOTanLpmm', NULL, '2025-06-26 15:56:40'),
(10, 'Szymix2115', 'szymonduczmal5@gmail.com', '$2b$10$i0do8p.RopiG71Y3S7l66e.tYarY6jtsYanPRDPVbLlEzjy3qJNoi', NULL, '2025-12-22 18:46:54'),
(11, 'IAmNotAdmin', 'sigma@gmail.com', '$2b$10$SGRQb/UBB.xxM0vDf8Q2jukLI16PWepYuJzSzV.eJr/UjYp0AviMW', NULL, '2026-03-18 19:51:11');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_comments_users` (`author_id`),
  ADD KEY `fk_comments_posts` (`post_id`);

--
-- Indeksy dla tabeli `comments_likes`
--
ALTER TABLE `comments_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_comment_user` (`user_id`,`comment_id`),
  ADD KEY `fk_likes_comments` (`comment_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeksy dla tabeli `pass_resets`
--
ALTER TABLE `pass_resets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_resets_users` (`user_id`);

--
-- Indeksy dla tabeli `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_posts_users` (`author`),
  ADD KEY `idx_posts_created` (`created_at`);

--
-- Indeksy dla tabeli `posts_likes`
--
ALTER TABLE `posts_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_post_user` (`user_id`,`post_id`) USING BTREE,
  ADD KEY `fk_likes_posts` (`post_id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_user_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `comments_likes`
--
ALTER TABLE `comments_likes`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `pass_resets`
--
ALTER TABLE `pass_resets`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `posts_likes`
--
ALTER TABLE `posts_likes`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=131;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `fk_comments_posts` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_comments_users` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `comments_likes`
--
ALTER TABLE `comments_likes`
  ADD CONSTRAINT `fk_likes_comments` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_likes_users_comments` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pass_resets`
--
ALTER TABLE `pass_resets`
  ADD CONSTRAINT `fk_resets_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `fk_posts_users` FOREIGN KEY (`author`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `posts_likes`
--
ALTER TABLE `posts_likes`
  ADD CONSTRAINT `fk_likes_posts` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_likes_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
