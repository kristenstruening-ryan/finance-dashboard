# 📈 FinVault: Modern Asset Dashboard

**FinVault** is a full-stack asset management application designed for the modern investor. Built with a focus on high-performance data visualization and clean UI, it allows users to track diversified holdings across stocks, crypto, and ETFs in a single, unified view.

---

## 🚀 The Tech Stack

| Layer           | Technology             | Why I chose it                                                                                                                         |
| :-------------- | :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| **Language**    | **TypeScript**         | Ensures end-to-end type safety. Interface sharing between the Backend and Frontend prevents "undefined" errors during API integration. |
| **Frontend**    | React 18, Tailwind CSS | To create a responsive, design-heavy UI with a focus on "Data Density" and readability.                                                |
| **Backend**     | Node.js, Express       | For a lightweight, scalable REST API that handles asynchronous price fetching efficiently.                                             |
| **Database**    | PostgreSQL             | Relational integrity is non-negotiable for financial data; handles complex queries for history tracking.                               |
| **ORM**         | Prisma 7               | Type-safety from the database to the frontend, preventing runtime errors during data mapping.                                          |
| **Market Data** | Finnhub API            | Reliable, real-time quotes for both traditional equities and major crypto pairs.                                                       |

---

## 💎 Core Features

- **Real-time Portfolio Performance:** Dynamic line charts showing 30-day value snapshots via Recharts.
- **Intelligent Asset Entry:** Automated weighted-average price calculations for multiple buy-ins of the same asset.
- **Execution History:** Full audit log of BUY/SELL transactions with a custom-built confirmation modal for clearing logs.
- **Responsive Analytics:** Asset distribution breakdown and individual ROI tracking.
- **Secure Auth:** JWT-based authentication with custom middleware for protected routes and bcrypt password hashing.

---

## 🛠 Engineering Challenges & Solutions

### 1. The "Weighted Average" Logic

**The Problem:** Simply adding a new purchase price to an existing asset would ruin performance metrics and ROI calculations.
**The Solution:** I implemented a custom `upsert` logic in the backend. When a user adds more of an asset they already own, the system calculates a new **Weighted Average Cost Basis** using the following formula:

$$NewPrice = \frac{(CurrentShares \times CurrentPrice) + (NewShares \times NewPrice)}{TotalShares}$$

### 2. Balancing API Limits vs. Data Freshness

**The Problem:** Financial APIs have strict rate limits. Refreshing prices on every component mount is inefficient and leads to 429 errors.
**The Solution:** I built a **stale-data detection layer**. Prices are only fetched from the external API if the `updatedAt` timestamp is older than 15 minutes; otherwise, the system serves the last cached price from the PostgreSQL database.

### 3. Maintaining UI State Consistency

**The Problem:** When a user clears their trade history or updates an asset, multiple dashboard components (Chart, Activity, Stats) need to reflect that instantly.
**The Solution:** Leveraged **React Context** to manage global user state and **Axios Interceptors** to handle token expiration and unauthorized access gracefully.

---

## 🐳 Docker Architecture

To ensure a consistent development and production environment, this application is fully containerized.

- **Multi-Stage Builds:** Optimized Dockerfiles to keep production images lightweight.
- **Orchestration:** Used `docker-compose` to manage the lifecycle of three separate services: **Frontend** (Nginx), **Backend** (Node.js), and **Database** (PostgreSQL).
- **Development Parity:** Docker ensures that the app runs identically on my MacBook Air as it would on a production AWS server, eliminating "works on my machine" issues.

---

## 📸 Screenshots

_(Add your screenshots here after deployment)_
![Dashboard Overview](https://via.placeholder.com/800x450?text=Dashboard+Preview)

---

## 🏗 Setup & Installation

**The Quick Way (Docker):**

```bash
docker-compose up --build
```

**The Manual Way:**

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/kristenstruening-ryan/dashboard.git](https://github.com/kristenstruening-ryan/dashboard.git)
    cd dashboard
    ```

2.  **Environment Setup:**
    Create a `.env` file in the root directory:

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/dashboard"
    JWT_SECRET="your_secret_key"
    FINNHUB_KEY="your_api_key"
    ```

3.  **Install Dependencies:**

    ```bash
    # Install backend dependencies
    npm install

    # Install frontend dependencies
    cd client && npm install
    ```

4.  **Database Migration:**

    ```bash
    npx prisma migrate dev
    ```

5.  **Run the Application:**
    ```bash
    # From the root directory
    npm run dev
    ```

---

## 📜 Key Learnings

- **Prisma 7 Transition:** Gained experience migrating to Prisma 7 and implementing the new Driver Adapter system for better performance.
- **Data Visualization:** Learned how to transform raw database snapshots into time-series data compatible with Recharts.
- **API Design:** Developed a RESTful API that handles both local database records and external third-party data fetches concurrently.

---

Developed by [Kristen Struening-Ryan](https://github.com/kristenstruening-ryan)
