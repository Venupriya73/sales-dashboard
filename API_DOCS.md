# API Documentation

Base URL: http://localhost:5000/api

## Endpoints

### GET /transactions
Get paginated, filtered, sorted transactions.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 20 | Records per page |
| sortBy | string | transaction_date | Column to sort |
| sortOrder | ASC/DESC | DESC | Sort direction |
| startDate | date | - | Filter from date |
| endDate | date | - | Filter to date |
| category | string | - | Filter by category |
| region | string | - | Filter by region |
| search | string | - | Search transactions |

### GET /transactions/summary
Returns total revenue, orders, avg order value, customers, top category, best region.

### GET /transactions/charts
Returns revenue trend, sales by category, sales by region, order status data.

### GET /transactions/filters
Returns available categories and regions for filter dropdowns.

### GET /transactions/export
Downloads filtered transactions as CSV file.