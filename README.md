# Sales Analytics Dashboard

A full-stack analytics dashboard built with Next.js 14, Node.js, Express, and PostgreSQL.
Handles 10,000+ transaction records efficiently with server-side pagination, filtering, sorting, and CSV export.

## Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Recharts
- **Backend**: Node.js, Express.js, REST APIs
- **Database**: PostgreSQL 16

## Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL 16

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd sales-dashboard
```

### 2. Database Setup
```bash
psql -U postgres -c "CREATE DATABASE sales_dashboard;"
psql -U postgres -d sales_dashboard -f backend/src/db/schema.sql
```

### 3. Environment Variables

Create `backend/.env`: