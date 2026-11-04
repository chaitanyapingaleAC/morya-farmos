-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: localhost    Database: morya_farmos
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `breeding_records`
--

DROP TABLE IF EXISTS `breeding_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `breeding_records` (
  `record_id` int NOT NULL AUTO_INCREMENT,
  `cow_id` varchar(30) NOT NULL,
  `insemination_date` date NOT NULL,
  `pregnancy_status` enum('Pending','Confirmed','Not Pregnant') NOT NULL DEFAULT 'Pending',
  `confirmation_date` date DEFAULT NULL,
  `expected_delivery_date` date DEFAULT NULL,
  `actual_delivery_date` date DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`record_id`),
  KEY `fk_breeding_cow` (`cow_id`),
  CONSTRAINT `fk_breeding_cow` FOREIGN KEY (`cow_id`) REFERENCES `cows` (`cow_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `breeding_records`
--

LOCK TABLES `breeding_records` WRITE;
/*!40000 ALTER TABLE `breeding_records` DISABLE KEYS */;
/*!40000 ALTER TABLE `breeding_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cows`
--

DROP TABLE IF EXISTS `cows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cows` (
  `cow_id` varchar(30) NOT NULL,
  `cow_name` varchar(100) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `birth_date_is_estimated` tinyint(1) NOT NULL DEFAULT '0',
  `breed` varchar(100) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`cow_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cows`
--

LOCK TABLES `cows` WRITE;
/*!40000 ALTER TABLE `cows` DISABLE KEYS */;
INSERT INTO `cows` VALUES ('101','Chaitanya','2026-11-03',0,'Gir',NULL);
/*!40000 ALTER TABLE `cows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses` (
  `expense_id` int NOT NULL AUTO_INCREMENT,
  `expense_date` date NOT NULL,
  `category` varchar(60) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_mode` varchar(30) NOT NULL,
  `description` text,
  PRIMARY KEY (`expense_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
INSERT INTO `expenses` VALUES (1,'2026-10-31','Feed',1250.50,'Cash','API update test expense'),(3,'2026-10-31','Medicines',1300.00,'UPI','Updated feed purchased\n\n');
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-03 19:25:24
