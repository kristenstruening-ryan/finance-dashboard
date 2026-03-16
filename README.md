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

- **Vault Lab (Strategy Simulator):** A deterministic "sandbox" for portfolio rebalancing. Users can simulate allocation changes and visualize real-time risk/return impact before committing to trades.
- **Real-time Portfolio Performance:** Dynamic line charts showing 30-day value snapshots via Recharts.
- **Intelligent Asset Entry:** Automated weighted-average price calculations for multiple buy-ins of the same asset.
- **Execution History:** Full audit log of transactions with custom-built confirmation modals and weighted ROI tracking.
- **Secure Auth:** JWT-based authentication with custom middleware for protected routes and bcrypt password hashing.

---

## 🛠 Engineering Challenges & Solutions

### 1. The "Weighted Average" Logic

**The Problem:** Simply adding a new purchase price to an existing asset ruins performance metrics and ROI calculations.
**The Solution:** I implemented a custom `upsert` logic in the backend. When a user adds more of an asset they already own, the system calculates a new **Weighted Average Cost Basis**:

$$NewPrice = \frac{(CurrentShares \times CurrentPrice) + (NewShares \times NewPrice)}{TotalShares}$$

### 2. Balancing API Limits vs. Data Freshness

**The Problem:** Financial APIs have strict rate limits. Refreshing prices on every component mount is inefficient.
**The Solution:** Built a **stale-data detection layer**. Prices are only fetched if the `updatedAt` timestamp is older than 15 minutes; otherwise, the system serves the cached price from PostgreSQL.

### 3. Visual Stability & Skeleton Loading

**The Problem:** Fetching complex portfolio simulations created "layout jumps" where components popped in unevenly, hurting the perceived performance.
**The Solution:** Developed a custom **Skeleton Loading** system. I engineered a `LabSkeleton` component that mirrors the exact grid dimensions of the dashboard using Tailwind’s `animate-pulse`, ensuring zero layout shift during data hydration.

---

## 📸 Gallery

### 🖥 The Dashboard

A high-density view of market performance, asset distribution, and real-time ROI tracking.
![Dashboard Overview](./assets/screenshots/dark_mode_dash.png)

### 🧪 Vault Lab Simulator

Interactive portfolio rebalancing with real-time risk diagnostics and "Strategy Commit" workflow.
![Vault Lab Simulator](./assets/screenshots/strategy_sim.png)

### 📱 Responsive Design

Optimized mobile experience ensuring financial data is readable on any device size.
![Mobile View](./assets/screenshots/mobile_portfolio.png)

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

- **Prisma 7 Transition:** Gained experience migrating to Prisma 7 and implementing the new Driver Adapter system for optimized performance.
- **Data Visualization:** Learned how to transform raw database snapshots into time-series data compatible with Recharts.
- **API Design:** Developed a RESTful API that handles both local database records and external third-party data fetches concurrently.
- **UI Architecture:** Learned to manage highly interactive state (sliders, gauges) while maintaining 60fps performance and smooth loading transitions.

---

Developed by [Kristen Struening-Ryan](https://github.com/kristenstruening-ryan)
