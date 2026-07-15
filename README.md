# 🏨 Hotel Booking Logic Engine & Concurrency Control Matrix

A robust backend software application built with Node.js and MySQL designed to handle high-concurrency room reservations. The primary objective of this project is to solve a core software engineering challenge: **preventing race conditions and database collisions** when multiple application threads or users attempt to book the identical resource simultaneously.

---

## 💻 Core Technical Competencies Demonstrated
* **Relational Database Management (RDBMS):** Implemented schema design with strict data normalization, Primary/Foreign Key constraints, and referential integrity.
* **Concurrency Control & Transaction Safety:** Utilized SQL ACID transactions (`BEGIN TRANSACTION`, `COMMIT`, `ROLLBACK`) to eliminate data collisions.
* **Asynchronous API Architecture:** Designed scalable, non-blocking REST endpoints using Node.js and Express to manage application runtime states efficiently.
* **Defensive Server-Side Validation:** Programmed strict data-handling checks to guarantee data cleanliness before hitting storage layers.

---

## 🛠️ System Architecture & Tech Stack

| Component | Technology | Architecture Role |
| :--- | :--- | :--- |
| **Runtime Environment** | Node.js | Non-blocking, asynchronous event-driven JavaScript runtime. |
| **Application Layer** | Express.js | Micro-framework handling RESTful routing and server-side logic validation. |
| **Database Layer** | MySQL | Relational data persistence engine utilizing Connection Pooling for resource optimization. |
| **Interface Layer** | HTML5 / CSS3 / JS | Companion client layer designed to trigger API endpoints and handle dynamic responses. |

---

## 📂 System File Architecture

| File / Path | Component | Description / Technical Role |
| :--- | :--- | :--- |
| `public/index.html` | Client Interface | Core UI Layout and form structure for user input collection. |
| `public/style.css` | Client Interface | UI Aesthetic styling and retro-cinematic layout presentation. |
| `public/script.js` | Client Interface | Client-side API payload handler utilizing async Fetch operations. |
| `server.js` | Application Layer | Primary Application Entry Point containing core routing and transaction logic. |
| `database.js` | Database Layer | MySQL Connection Pool driver initialization and configuration engine. |
| `schema.sql` | Database Layer | Relational Database Schema blueprint and structural data definition (DDL). |
| `package.json` | Configuration | Application Manifest tracking project meta-data and external dependencies. |

---

## ⚙️ Installation & How to Run the Project

Follow these structured steps to install, configure, and execute this software application locally on your workstation.

### Step 1: Install System Prerequisites
Ensure you have the following software engines installed on your operating system:
* **Node.js Environment:** [Download Node.js](https://nodejs.org/) (v16.0.0 or higher recommended).
* **MySQL Database Server:** [Download MySQL](https://dev.mysql.com/downloads/) (v8.0 or higher recommended).

### Step 2: Install Project Dependencies.
Open your project directory inside your terminal and run the installation script. This reads your `package.json` file and downloads the necessary drivers automatically:
```bash
npm install.
