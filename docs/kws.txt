-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 08, 2025 at 03:06 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kws`
--

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `wallet_id` int(11) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `module` varchar(100) DEFAULT NULL,
  `timestamp` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `user_id`, `wallet_id`, `action`, `module`, `timestamp`) VALUES
(1, 1, 10, 'Add Wallet', NULL, '2025-01-26 16:01:36'),
(2, 1, 10, 'Delete Wallet', NULL, '2025-01-26 16:16:22'),
(3, 1, 8, 'Update Wallet Status', NULL, '2025-01-26 16:23:54'),
(4, 1, 11, 'Add Wallet', NULL, '2025-01-26 16:26:10'),
(5, 1, NULL, 'User logged in', NULL, '2025-01-30 14:12:05'),
(6, 1, NULL, 'User logged in', NULL, '2025-01-30 14:14:08'),
(7, 1, NULL, '5', 'User Created', '2025-01-30 14:21:24'),
(8, 1, NULL, '5', 'User Deleted', '2025-01-30 14:22:39'),
(9, 1, NULL, '1', 'Cryptocurrency Deleted', '2025-01-30 14:56:29'),
(10, 1, NULL, '3', 'Cryptocurrency Added', '2025-01-30 14:57:41'),
(11, 1, NULL, '4', 'Cryptocurrency Added', '2025-01-30 15:20:20');

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `iso_code` char(3) NOT NULL,
  `timezone` varchar(50) NOT NULL,
  `currency` varchar(10) NOT NULL,
  `kyc_requirements` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`id`, `name`, `iso_code`, `timezone`, `currency`, `kyc_requirements`, `created_at`, `updated_at`) VALUES
(1, 'United States', 'USA', 'America/New_York', 'USD', 'ID verification, Address verification', '2025-01-30 18:46:48', '2025-01-30 18:46:48'),
(2, 'India', 'IND', 'Asia/Kolkata', 'INR', 'Aadhaar, PAN verification', '2025-01-30 18:46:48', '2025-01-30 18:46:48'),
(3, 'United Kingdom', 'GBR', 'Europe/London', 'GBP', 'ID verification, Proof of address', '2025-01-30 18:46:48', '2025-01-30 18:46:48'),
(4, 'Singapore', 'SGP', 'Asia/Singapore', 'SGD', 'Passport, Address proof', '2025-01-30 18:46:48', '2025-01-30 18:46:48');

-- --------------------------------------------------------

--
-- Table structure for table `cryptocurrencies`
--

CREATE TABLE `cryptocurrencies` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `symbol` varchar(10) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `rate_limit_per_second` int(11) DEFAULT 0,
  `rate_limit_per_minute` int(11) DEFAULT 0,
  `api_key` text DEFAULT NULL,
  `api_provider` varchar(255) DEFAULT NULL,
  `rpc_url` varchar(255) DEFAULT NULL,
  `contract_address` varchar(255) DEFAULT NULL,
  `symbol_link` varchar(255) DEFAULT NULL,
  `enabled` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cryptocurrencies`
--

INSERT INTO `cryptocurrencies` (`id`, `name`, `symbol`, `type`, `createdAt`, `updatedAt`, `rate_limit_per_second`, `rate_limit_per_minute`, `api_key`, `api_provider`, `rpc_url`, `contract_address`, `symbol_link`, `enabled`) VALUES
(2, 'Ethereum', 'ETH', 'Coin', '0000-00-00 00:00:00', '0000-00-00 00:00:00', 10, 120, 'api_key_eth', 'etherscan', NULL, NULL, NULL, 1),
(3, 'Litecoin', 'LTC', 'Coin', '2025-01-30 14:57:41', '2025-01-30 14:57:41', 5, 50, NULL, NULL, 'https://litecoin.org', '', 'https://explorer.litecoin.net', 1),
(4, 'Updated Coin Name', 'UCN', 'Token', '2025-01-30 15:20:20', '2025-01-30 15:30:42', 10, 100, 'new_api_key', 'updated_provider', 'https://new-rpc.url', '0xnewcontractaddress', 'https://newlogo.png', 1);

-- --------------------------------------------------------

--
-- Table structure for table `encrypted_data`
--

CREATE TABLE `encrypted_data` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `encrypted_private_key` text NOT NULL,
  `encrypted_user_passkey` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `encrypted_keys`
--

CREATE TABLE `encrypted_keys` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `wallet_id` int(11) NOT NULL,
  `encrypted_private_key` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `encrypted_keys`
--

INSERT INTO `encrypted_keys` (`id`, `user_id`, `wallet_id`, `encrypted_private_key`, `created_at`, `updated_at`) VALUES
(3, 1, 11, 'b1hiOtLQV/WQ5egU/Ty1pCQ4bZ9ePNoe+tFX+RcbTz06a55GDgp2CEDXk/5/SXi5yBVKY6e4D7GS3vhQuigCRL+GVcGTfcsItdTtPkrjP0KUOFXBG7B7J8Z+GBPLEfgiBzs8FsHdQ/pDf8N/RKQsm90AqlqcFKaH5ARMLIhTw5EkgFPboMe1DYcN7bnqCCcg2YXC4caUB6Yl0iCT1C0+nwtz62FOrA2L3NDuNZWbRwpzHSpRIFdjEPbacITaWoCXComz3mfduEtEVhfc+4LtkRCWgf02je+mBCID1Ml6WYxBZ99C99nZyD5pZ7x4aXtaxfcpvk3L+XdckG3+TiXwJonRQwX1LNW6cKxZAAS1KjtD6eQzf7wWe5WUQYno2fRCIefEap9uojC82ihFN0Nj841g/74VEHR6lg+r6yjJwWnNUL0Q+jpNsro94MIPa1kZOwAHfNkKsrzDaeyrG3FU5sFTKNRc6kIVOdhs+9S4vqDhKw9LYGVmWBURi1VE22yGMtJ+6GEdgm+iFsclMHdSblsiVz7suCtkMC6ukmy24DH7uEeXclG5N4j6rY8kS3tKR/s2dzeRYBpBjQqTsQd5akK22O2/VRoAb0BQaqpKrsoTUWwr5meZYarNTy7EIYos+06XhQf5Pmg9h0kWwCjuq3Y/G5UgeuZIb+N9SWNS3pk=', '2025-01-26 16:26:10', '2025-01-26 16:26:10');

-- --------------------------------------------------------

--
-- Table structure for table `gateway_config`
--

CREATE TABLE `gateway_config` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `enabled` tinyint(1) DEFAULT 1,
  `config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`config`)),
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `gateway_config`
--

INSERT INTO `gateway_config` (`id`, `name`, `enabled`, `config`, `created_at`, `updated_at`) VALUES
(1, 'stripe', 1, '{\"publicKey\": \"your_stripe_public_key\", \"secretKey\": \"your_stripe_secret_key\"}', '2025-01-28 20:26:41', '2025-01-28 20:26:41'),
(2, 'paypal', 1, '{\"clientId\": \"your_paypal_client_id\", \"clientSecret\": \"your_paypal_client_secret\"}', '2025-01-28 20:26:41', '2025-01-28 20:26:41'),
(3, 'payoneer', 0, '{\"partnerId\": \"your_payoneer_partner_id\", \"apiToken\": \"your_payoneer_api_token\"}', '2025-01-28 20:26:41', '2025-01-28 20:26:41'),
(4, 'paynow', 1, '{\"merchantId\": \"your_paynow_merchant_id\", \"apiToken\": \"your_paynow_api_token\"}', '2025-01-28 20:26:41', '2025-01-28 20:26:41');

-- --------------------------------------------------------

--
-- Table structure for table `kyc_documents`
--

CREATE TABLE `kyc_documents` (
  `id` int(11) NOT NULL,
  `country_id` int(11) NOT NULL,
  `document_type` varchar(100) NOT NULL,
  `kyc_type` enum('personal','business','both') DEFAULT 'personal',
  `required` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `kyc_documents`
--

INSERT INTO `kyc_documents` (`id`, `country_id`, `document_type`, `kyc_type`, `required`) VALUES
(1, 1, 'Passport', 'personal', 1),
(2, 1, 'Utility Bill', 'personal', 1),
(3, 2, 'Aadhaar', 'personal', 1),
(4, 2, 'PAN Card', 'personal', 1),
(5, 3, 'National ID', 'personal', 1),
(6, 4, 'Proof of Address', 'personal', 1),
(7, 1, 'Passport', 'personal', 1),
(8, 1, 'Utility Bill', 'personal', 1),
(9, 1, 'Business Registration Certificate', 'business', 1),
(10, 1, 'Tax Identification Number (TIN)', 'business', 1),
(11, 2, 'Aadhaar', 'personal', 1),
(12, 2, 'PAN Card', 'personal', 1),
(13, 2, 'Company Registration Document', 'business', 1);

-- --------------------------------------------------------

--
-- Table structure for table `kyc_submissions`
--

CREATE TABLE `kyc_submissions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `document_type` varchar(100) NOT NULL,
  `kyc_type` enum('personal','business') DEFAULT 'personal',
  `document_path` varchar(255) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `submitted_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `login_audit`
--

CREATE TABLE `login_audit` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `vpn_detected` tinyint(1) DEFAULT 0,
  `login_time` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

CREATE TABLE `modules` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `enabled` tinyint(1) DEFAULT 1,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `modules`
--

INSERT INTO `modules` (`id`, `name`, `enabled`, `description`, `created_at`, `updated_at`) VALUES
(1, 'User Management', 1, 'Manage users and roles', '2025-01-30 16:41:08', '2025-01-30 16:41:08'),
(2, 'Cryptocurrency Management', 1, 'Manage cryptocurrencies dynamically', '2025-01-30 16:41:08', '2025-01-30 16:41:08'),
(3, 'Gateway Management', 1, 'Manage payment gateways dynamically', '2025-01-30 16:41:08', '2025-01-30 16:41:08');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `gateway_name` varchar(50) NOT NULL,
  `gateway_payment_id` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) NOT NULL,
  `payment_type` enum('one-time','subscription') NOT NULL,
  `status` enum('pending','completed','failed') NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `api_endpoint` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `description`, `createdAt`, `updatedAt`, `api_endpoint`) VALUES
(1, 'Manage Users', 'Can manage users', '2025-01-24 14:29:06', '2025-01-24 14:29:06', NULL),
(2, 'View Reports', 'Can view reports', '2025-01-24 14:29:06', '2025-01-24 14:29:06', NULL),
(5, 'manage_transactions', 'Can view and manage transactions', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(6, 'manage_kyc', 'Can approve/reject KYC submissions', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(17, 'manage_cryptocurrencies', 'Can manage cryptocurrencies', '2025-01-30 20:07:55', '2025-01-30 20:07:55', NULL),
(18, 'view_gateways', 'View all payment gateways', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(19, 'manage_gateways', 'Manage and configure payment gateways', '0000-00-00 00:00:00', '0000-00-00 00:00:00', NULL),
(20, 'manage_permissions', 'Permission to manage and assign permissions', '2025-02-08 12:33:40', '2025-02-08 12:33:40', NULL),
(21, 'manage_roles', 'Permission to manage roles and permissions', '2025-02-08 16:39:43', '2025-02-08 16:39:43', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `display_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `createdAt`, `updatedAt`, `display_name`) VALUES
(1, 'Admin', 'Administrator role', '2025-01-24 14:29:06', '2025-01-24 14:29:06', NULL),
(2, 'Super Admin', 'Super Administrator role', '2025-01-24 14:29:06', '2025-01-24 14:29:06', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`createdAt`, `updatedAt`, `role_id`, `permission_id`) VALUES
('2025-02-08 11:12:37', '2025-02-08 11:12:37', 1, 1),
('2025-02-08 11:12:37', '2025-02-08 11:12:37', 1, 21),
('2025-01-24 14:29:06', '2025-01-24 14:29:06', 2, 1),
('2025-01-24 14:29:06', '2025-01-24 14:29:06', 2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `amount` float NOT NULL,
  `cryptocurrency` varchar(50) NOT NULL,
  `status` enum('Pending','Completed','Failed') NOT NULL,
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`details`)),
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `from_wallet_address` varchar(255) DEFAULT NULL,
  `to_wallet_address` varchar(255) DEFAULT NULL,
  `chain` varchar(50) DEFAULT NULL,
  `gas_fee` float DEFAULT NULL,
  `contract_address` varchar(255) DEFAULT NULL,
  `explorer_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `userId`, `amount`, `cryptocurrency`, `status`, `details`, `created_at`, `updated_at`, `from_wallet_address`, `to_wallet_address`, `chain`, `gas_fee`, `contract_address`, `explorer_url`) VALUES
(1, 1, 0.5, 'ETH', 'Completed', NULL, '0000-00-00 00:00:00', '0000-00-00 00:00:00', '0x123...', '0x456...', 'Ethereum', 0.01, '0xcontract...', 'https://etherscan.io/tx/...');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL,
  `is_enabled` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `country_id` int(11) DEFAULT NULL,
  `timezone` varchar(50) DEFAULT 'UTC',
  `kyc_status` enum('pending','verified','rejected') DEFAULT 'pending',
  `last_login_ip` varchar(45) DEFAULT NULL,
  `vpn_detected` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role_id`, `is_enabled`, `createdAt`, `updatedAt`, `country_id`, `timezone`, `kyc_status`, `last_login_ip`, `vpn_detected`) VALUES
(1, 'admin', 'admin@example.com', '$2a$10$lYeNbG29hj02.Zf046DTu.fjmIvQVBWEjUQB2Ihx9crTDxG.sCG72', 1, 1, '2025-01-24 14:29:06', '2025-01-30 13:56:02', NULL, 'UTC', 'pending', '::1', 0),
(2, 'newuser', 'newuser@examplee.com', '$2a$10$8B6dmSIYINyfMNtNkIusE.9Bk/MNsboQ.VsI3F092bdOUSbTsOCGa', 2, 1, '2025-01-25 10:05:56', '2025-01-25 10:07:01', NULL, 'UTC', 'pending', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `wallet_addresses`
--

CREATE TABLE `wallet_addresses` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `wallet_address` varchar(255) NOT NULL,
  `is_evm_compatible` tinyint(1) DEFAULT 0,
  `encrypted_passkey` text NOT NULL,
  `backup` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `wallet_type_id` int(11) NOT NULL,
  `enabled` tinyint(1) DEFAULT 1,
  `blocked` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `wallet_addresses`
--

INSERT INTO `wallet_addresses` (`id`, `user_id`, `wallet_address`, `is_evm_compatible`, `encrypted_passkey`, `backup`, `created_at`, `updated_at`, `wallet_type_id`, `enabled`, `blocked`) VALUES
(3, 1, '0x123456789abcdef123456789abcdef123456789a', 1, 'encrypted_passkey1', 'backup1', '2025-01-25 17:23:29', '2025-01-25 17:33:59', 1, 1, 0),
(4, 2, '0xabcdefabcdefabcdefabcdefabcdefabcdef', 0, 'encrypted_passkey2', 'backup2', '2025-01-25 17:23:29', '2025-01-25 17:34:03', 2, 1, 0),
(7, 1, '0x123456789abcdef123456789abcdef123446789a', 1, 'encrypted_passkey1', 'Backup details', '2025-01-26 13:17:54', '2025-01-26 13:17:54', 1, 1, 0),
(8, 1, '0x123456789abcdef123456789abcd5f123456789a', 1, 'f7c6ab4931c9127aa3d22730ba0a25fe:621779b5b6818e89c6063e3b8e278a13', 'Backup details', '2025-01-26 13:36:55', '2025-01-26 16:23:54', 1, 1, 0),
(11, 1, '0xabcdef123456789abcdef123456789abcdef2231', 1, '', 'Backup details', '2025-01-26 16:26:10', '2025-01-26 16:26:10', 1, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `wallet_types`
--

CREATE TABLE `wallet_types` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `enabled` tinyint(1) DEFAULT 1,
  `block` tinyint(1) DEFAULT 0,
  `visible_to_user` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `wallet_types`
--

INSERT INTO `wallet_types` (`id`, `name`, `enabled`, `block`, `visible_to_user`, `created_at`, `updated_at`) VALUES
(1, 'Funding', 1, 0, 1, '2025-01-25 17:24:40', '2025-01-25 17:24:40'),
(2, 'Trading', 1, 0, 1, '2025-01-25 17:24:40', '2025-01-25 17:24:40'),
(3, 'Margin', 1, 0, 1, '2025-01-25 17:24:40', '2025-01-25 17:24:40'),
(4, 'Future', 1, 0, 1, '2025-01-25 17:24:40', '2025-01-25 17:24:40');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `iso_code` (`iso_code`);

--
-- Indexes for table `cryptocurrencies`
--
ALTER TABLE `cryptocurrencies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `symbol` (`symbol`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `symbol_2` (`symbol`);

--
-- Indexes for table `encrypted_data`
--
ALTER TABLE `encrypted_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `encrypted_keys`
--
ALTER TABLE `encrypted_keys`
  ADD PRIMARY KEY (`id`),
  ADD KEY `wallet_id` (`wallet_id`);

--
-- Indexes for table `gateway_config`
--
ALTER TABLE `gateway_config`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `kyc_documents`
--
ALTER TABLE `kyc_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `country_id` (`country_id`);

--
-- Indexes for table `kyc_submissions`
--
ALTER TABLE `kyc_submissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `login_audit`
--
ALTER TABLE `login_audit`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `gateway_payment_id` (`gateway_payment_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`role_id`,`permission_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username_2` (`username`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `fk_country` (`country_id`);

--
-- Indexes for table `wallet_addresses`
--
ALTER TABLE `wallet_addresses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `wallet_address` (`wallet_address`);

--
-- Indexes for table `wallet_types`
--
ALTER TABLE `wallet_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `cryptocurrencies`
--
ALTER TABLE `cryptocurrencies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `encrypted_data`
--
ALTER TABLE `encrypted_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `encrypted_keys`
--
ALTER TABLE `encrypted_keys`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `gateway_config`
--
ALTER TABLE `gateway_config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `kyc_documents`
--
ALTER TABLE `kyc_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `kyc_submissions`
--
ALTER TABLE `kyc_submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `login_audit`
--
ALTER TABLE `login_audit`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `modules`
--
ALTER TABLE `modules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `wallet_addresses`
--
ALTER TABLE `wallet_addresses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `wallet_types`
--
ALTER TABLE `wallet_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `encrypted_keys`
--
ALTER TABLE `encrypted_keys`
  ADD CONSTRAINT `encrypted_keys_ibfk_1` FOREIGN KEY (`wallet_id`) REFERENCES `wallet_addresses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `kyc_documents`
--
ALTER TABLE `kyc_documents`
  ADD CONSTRAINT `kyc_documents_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`);

--
-- Constraints for table `kyc_submissions`
--
ALTER TABLE `kyc_submissions`
  ADD CONSTRAINT `kyc_submissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `login_audit`
--
ALTER TABLE `login_audit`
  ADD CONSTRAINT `login_audit_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_country` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`),
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
