const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const { Parser } = require('json2csv');

function buildWhere(filters) {
  const conditions = [];
  const params = [];
  let idx = 1;

  if (filters.startDate) { conditions.push(`transaction_date >= $${idx++}`); params.push(filters.startDate); }
  if (filters.endDate) { conditions.push(`transaction_date <= $${idx++}`); params.push(filters.endDate); }
  if (filters.category && filters.category !== 'all') { conditions.push(`category = $${idx++}`); params.push(filters.category); }
  if (filters.region && filters.region !== 'all') { conditions.push(`region = $${idx++}`); params.push(filters.region); }
  if (filters.status && filters.status !== 'all') { conditions.push(`status = $${idx++}`); params.push(filters.status); }
  if (filters.customerSegment && filters.customerSegment !== 'all') { conditions.push(`customer_segment = $${idx++}`); params.push(filters.customerSegment); }
  if (filters.salesChannel && filters.salesChannel !== 'all') { conditions.push(`sales_channel = $${idx++}`); params.push(filters.salesChannel); }
  if (filters.paymentMethod && filters.paymentMethod !== 'all') { conditions.push(`payment_method = $${idx++}`); params.push(filters.paymentMethod); }
  if (filters.search) {
    conditions.push(`(LOWER(customer_name) LIKE $${idx} OR LOWER(product_name) LIKE $${idx} OR LOWER(transaction_id) LIKE $${idx})`);
    params.push(`%${filters.search.toLowerCase()}%`);
    idx++;
  }

  return {
    where: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    params,
    nextIdx: idx,
  };
}

router.get('/', async (req, res) => {
  try {
    const {
      page = 1, limit = 20,
      sortBy = 'transaction_date', sortOrder = 'DESC',
      startDate, endDate, category, region, status,
      customerSegment, salesChannel, paymentMethod, search
    } = req.query;

    const allowedSort = ['transaction_id', 'customer_name', 'product_name', 'category', 'region', 'amount', 'tax', 'discount', 'shipping', 'status', 'transaction_date', 'customer_segment', 'sales_channel', 'payment_method'];
    const safeSort = allowedSort.includes(sortBy) ? sortBy : 'transaction_date';
    const safeOrder = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    const { where, params, nextIdx } = buildWhere({ startDate, endDate, category, region, status, customerSegment, salesChannel, paymentMethod, search });
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const countResult = await pool.query(`SELECT COUNT(*) FROM transactions ${where}`, params);
    const total = parseInt(countResult.rows[0].count);

    const dataParams = [...params, parseInt(limit), offset];
    const dataResult = await pool.query(
      `SELECT * FROM transactions ${where} ORDER BY ${safeSort} ${safeOrder} LIMIT $${nextIdx} OFFSET $${nextIdx + 1}`,
      dataParams
    );

    res.json({
      data: dataResult.rows,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

router.get('/summary', async (req, res) => {
  try {
    const { startDate, endDate, category, region, status, customerSegment, salesChannel, paymentMethod, search } = req.query;
    const { where, params } = buildWhere({ startDate, endDate, category, region, status, customerSegment, salesChannel, paymentMethod, search });

    const result = await pool.query(
      `SELECT
        COALESCE(SUM(amount), 0) AS total_revenue,
        COALESCE(SUM(tax), 0) AS total_tax,
        COALESCE(SUM(discount), 0) AS total_discount,
        COALESCE(SUM(shipping), 0) AS total_shipping,
        COUNT(*) AS total_orders,
        COALESCE(AVG(amount), 0) AS avg_order_value,
        COUNT(DISTINCT customer_name) AS total_customers
       FROM transactions ${where}`,
      params
    );

    const topCategory = await pool.query(
      `SELECT category, SUM(amount) AS revenue FROM transactions ${where} GROUP BY category ORDER BY revenue DESC LIMIT 1`, params
    );
    const topRegion = await pool.query(
      `SELECT region, SUM(amount) AS revenue FROM transactions ${where} GROUP BY region ORDER BY revenue DESC LIMIT 1`, params
    );

    res.json({
      ...result.rows[0],
      top_category: topCategory.rows[0]?.category || 'N/A',
      best_region: topRegion.rows[0]?.region || 'N/A',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

router.get('/charts', async (req, res) => {
  try {
    const { startDate, endDate, category, region, status, customerSegment, salesChannel, paymentMethod, search } = req.query;
    const { where, params } = buildWhere({ startDate, endDate, category, region, status, customerSegment, salesChannel, paymentMethod, search });

    const [revenueTrend, byCategory, byRegion, byStatus] = await Promise.all([
      pool.query(`SELECT TO_CHAR(transaction_date, 'YYYY-MM') AS month, SUM(amount) AS revenue, COUNT(*) AS orders FROM transactions ${where} GROUP BY month ORDER BY month`, params),
      pool.query(`SELECT category, SUM(amount) AS revenue, COUNT(*) AS orders FROM transactions ${where} GROUP BY category ORDER BY revenue DESC`, params),
      pool.query(`SELECT region, SUM(amount) AS revenue, COUNT(*) AS orders FROM transactions ${where} GROUP BY region ORDER BY revenue DESC`, params),
      pool.query(`SELECT status, COUNT(*) AS count FROM transactions ${where} GROUP BY status`, params),
    ]);

    res.json({
      revenueTrend: revenueTrend.rows,
      byCategory: byCategory.rows,
      byRegion: byRegion.rows,
      byStatus: byStatus.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
});

router.get('/export', async (req, res) => {
  try {
    const { startDate, endDate, category, region, status, customerSegment, salesChannel, paymentMethod, search } = req.query;
    const { where, params } = buildWhere({ startDate, endDate, category, region, status, customerSegment, salesChannel, paymentMethod, search });

    const result = await pool.query(
      `SELECT transaction_id, customer_name, customer_segment, product_name, category, region, sales_channel, payment_method, amount, tax, discount, shipping, status, transaction_date
       FROM transactions ${where} ORDER BY transaction_date DESC`,
      params
    );

    const fields = ['transaction_id', 'customer_name', 'customer_segment', 'product_name', 'category', 'region', 'sales_channel', 'payment_method', 'amount', 'tax', 'discount', 'shipping', 'status', 'transaction_date'];
    const parser = new Parser({ fields });
    const csv = parser.parse(result.rows);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

router.get('/filters', async (req, res) => {
  try {
    const [categories, regions, statuses, segments, channels, payments] = await Promise.all([
      pool.query('SELECT DISTINCT category FROM transactions ORDER BY category'),
      pool.query('SELECT DISTINCT region FROM transactions ORDER BY region'),
      pool.query('SELECT DISTINCT status FROM transactions ORDER BY status'),
      pool.query('SELECT DISTINCT customer_segment FROM transactions ORDER BY customer_segment'),
      pool.query('SELECT DISTINCT sales_channel FROM transactions ORDER BY sales_channel'),
      pool.query('SELECT DISTINCT payment_method FROM transactions ORDER BY payment_method'),
    ]);
    res.json({
      categories: categories.rows.map(r => r.category),
      regions: regions.rows.map(r => r.region),
      statuses: statuses.rows.map(r => r.status),
      customerSegments: segments.rows.map(r => r.customer_segment),
      salesChannels: channels.rows.map(r => r.sales_channel),
      paymentMethods: payments.rows.map(r => r.payment_method),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch filters' });
  }
});

module.exports = router;