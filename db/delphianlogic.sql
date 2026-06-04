-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 04, 2026 at 07:20 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `delphianlogic`
--

-- --------------------------------------------------------

--
-- Table structure for table `slides`
--

CREATE TABLE `slides` (
  `id` int(11) NOT NULL,
  `tab_id` int(11) NOT NULL,
  `badge_text` varchar(120) DEFAULT NULL,
  `title` text NOT NULL,
  `learn_more_url` varchar(255) NOT NULL DEFAULT '#',
  `bg_image_url` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `slides`
--

INSERT INTO `slides` (`id`, `tab_id`, `badge_text`, `title`, `learn_more_url`, `bg_image_url`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 'DIGITAL LEARNING INFRASTRUCTURE', 'Usability enhancement and Training for Transaction Portal for Customers', '#', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&amp;q=80', 1, 1, '2026-05-23 03:16:53', '2026-05-23 03:44:00'),
(2, 1, 'E-LEARNING SOLUTIONS', 'Custom LMS Development and Deployment for Enterprise Teams', '#', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80', 2, 1, '2026-05-23 03:16:53', '2026-05-23 03:16:53'),
(3, 1, 'KNOWLEDGE MANAGEMENT', 'Centralized Knowledge Base for Streamlined Employee Onboarding', '#', 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80', 3, 1, '2026-05-23 03:16:53', '2026-05-23 03:16:53'),
(4, 2, 'CLOUD INFRASTRUCTURE', 'Scalable Cloud Migration and DevOps Automation for Modern Enterprises', '#', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80', 1, 1, '2026-05-23 03:16:53', '2026-05-23 03:16:53'),
(5, 2, 'AI & MACHINE LEARNING', 'Intelligent Data Pipelines and Predictive Analytics Platforms', '#', 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&q=80', 2, 1, '2026-05-23 03:16:53', '2026-05-23 03:16:53'),
(6, 2, 'CYBERSECURITY', 'End-to-End Security Audits and Zero Trust Architecture Implementation', '#', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80', 3, 1, '2026-05-23 03:16:53', '2026-05-23 03:16:53'),
(7, 3, 'UNIFIED COMMUNICATIONS', 'Omnichannel Communication Platform for Remote and Hybrid Teams', '#', 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80', 1, 1, '2026-05-23 03:16:53', '2026-05-23 03:16:53'),
(8, 3, 'DIGITAL SIGNAGE', 'Dynamic Content Distribution across Multi-Location Display Networks', '#', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', 2, 1, '2026-05-23 03:16:53', '2026-05-23 03:16:53'),
(9, 3, 'COLLABORATION TOOLS', 'Integrated Workflow and Real-Time Collaboration Suite Deployment', '#', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80', 3, 1, '2026-05-23 03:16:53', '2026-05-23 03:16:53');

-- --------------------------------------------------------

--
-- Table structure for table `tabs`
--

CREATE TABLE `tabs` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `icon_key` varchar(50) NOT NULL DEFAULT 'Learning' COMMENT 'Matches JS ICONS object key',
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tabs`
--

INSERT INTO `tabs` (`id`, `title`, `icon_key`, `sort_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Learning', 'Learning', 1, 1, '2026-05-23 03:16:53', '2026-05-23 15:24:18'),
(2, 'Technology', 'Technology', 2, 1, '2026-05-23 03:16:53', '2026-05-23 03:16:53'),
(3, 'Communication', 'Communication', 3, 1, '2026-05-23 03:16:53', '2026-05-23 03:16:53');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `slides`
--
ALTER TABLE `slides`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_slide_tab` (`tab_id`);

--
-- Indexes for table `tabs`
--
ALTER TABLE `tabs`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `slides`
--
ALTER TABLE `slides`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tabs`
--
ALTER TABLE `tabs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `slides`
--
ALTER TABLE `slides`
  ADD CONSTRAINT `fk_slide_tab` FOREIGN KEY (`tab_id`) REFERENCES `tabs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
