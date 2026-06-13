# API Documentation

Base URL: https://sales-dashboard-production-b5f1.up.railway.app/api

Health Check: https://sales-dashboard-production-b5f1.up.railway.app/api/health

## Endpoints

### GET /transactions
Get paginated, filtered, sorted transactions.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 20 | Records per page |
| sortBy | string | transaction_date | Column to sort |
| sortOrder | ASC/DESC | DESC | Sort direction |
| startDate | date | - | Filter from date (YYYY-MM-DD) |
| endDate | date | - | Filter to date (YYYY-MM-DD) |
| category | string | - | Filter by category |
| region | string | - | Filter by region |
| status | string | - | Filter by order status |
| customerSegment | string | - | Filter by customer segment |
| salesChannel | string | - | Filter by sales channel |
| paymentMethod | string | - | Filter by payment method |
| search | string | - | Search by ID, customer, product |

### GET /transactions/summary
Returns all KPI summary cards.

Response fields:
- total_revenue
- total_tax
- total_discount
- total_shipping
- total_orders
- avg_order_value
- total_customers
- top_category
- best_region

### GET /transactions/charts
Returns all chart data.

Response fields:
- revenueTrend (month, revenue, orders)
- byCategory (category, revenue, orders)
- byRegion (region, revenue, orders)
- byStatus (status, count)

### GET /transactions/filters
Returns all available filter options.

Response fields:
- categories
- regions
- statuses
- customerSegments
- salesChannels
- paymentMethods

### GET /transactions/export
Downloads filtered transactions as CSV file.

CSV columns: transaction_id, customer_name, customer_segment, product_name, category, region, sales_channel, payment_method, amount, tax, discount, shipping, status, transaction_date

All filter parameters from GET /transactions are supported.