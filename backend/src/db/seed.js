const pool = require('./db');

const categories = ['Electronics', 'Clothing', 'Food & Beverages', 'Books', 'Sports', 'Home & Garden', 'Toys', 'Automotive'];
const regions = ['North', 'South', 'East', 'West', 'Central'];
const statuses = ['Completed', 'Pending', 'Cancelled', 'Refunded'];

const firstNames = ['Aarav', 'Priya', 'Rohit', 'Sneha', 'Karthik', 'Divya', 'Arjun', 'Meera', 'Vikram', 'Ananya', 'Suresh', 'Lakshmi', 'Rahul', 'Kavya', 'Deepak', 'Nisha', 'Arun', 'Pooja', 'Manoj', 'Riya'];
const lastNames = ['Kumar', 'Sharma', 'Patel', 'Reddy', 'Singh', 'Nair', 'Iyer', 'Gupta', 'Mehta', 'Joshi', 'Rao', 'Pillai', 'Verma', 'Shah', 'Das', 'Mishra', 'Bose', 'Chatterjee', 'Mukherjee', 'Ghosh'];

const products = {
  'Electronics': ['Laptop Pro X1', 'Wireless Earbuds', 'Smart Watch Series 5', 'Bluetooth Speaker', 'Gaming Mouse', 'Mechanical Keyboard', '4K Monitor', 'USB Hub', 'Webcam HD', 'Power Bank 20000mAh'],
  'Clothing': ['Cotton T-Shirt', 'Denim Jeans', 'Formal Shirt', 'Ethnic Kurta', 'Sports Jacket', 'Casual Hoodie', 'Saree Silk', 'Salwar Kameez', 'Trousers Slim Fit', 'Winter Coat'],
  'Food & Beverages': ['Organic Green Tea', 'Dark Chocolate Box', 'Protein Powder Vanilla', 'Honey Raw 500g', 'Olive Oil Extra Virgin', 'Quinoa Premium', 'Almond Milk', 'Coffee Beans Arabica', 'Energy Drink Pack', 'Dry Fruits Mix'],
  'Books': ['Clean Code', 'The Pragmatic Programmer', 'Atomic Habits', 'Deep Work', 'Design Patterns', 'System Design Interview', 'The Psychology of Money', 'Rich Dad Poor Dad', 'Ikigai', 'Zero to One'],
  'Sports': ['Yoga Mat Premium', 'Dumbbells Set 10kg', 'Running Shoes Nike', 'Cricket Bat Kashmir Willow', 'Football Official', 'Badminton Racket', 'Cycling Gloves', 'Swimming Goggles', 'Jump Rope Pro', 'Resistance Bands Set'],
  'Home & Garden': ['Air Purifier', 'Robot Vacuum', 'Smart LED Bulb', 'Indoor Plant Pot', 'Kitchen Knife Set', 'Coffee Maker', 'Bed Sheet Cotton', 'Curtain Blackout', 'Wall Clock Wooden', 'Scented Candles Set'],
  'Toys': ['LEGO City Set', 'Remote Control Car', 'Barbie Dreamhouse', 'Action Figure Set', 'Board Game Monopoly', 'Puzzle 1000 Pieces', 'Building Blocks', 'Stuffed Teddy Bear', 'Science Kit Kids', 'Playdoh Mega Set'],
  'Automotive': ['Car Phone Mount', 'Dash Camera 4K', 'Car Vacuum Cleaner', 'Seat Cover Set', 'Car Freshener Pack', 'Steering Wheel Cover', 'Tyre Inflator', 'LED Car Lights', 'Car Polish Kit', 'Jump Starter Pack'],
};

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start, end) {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateAmount(category) {
  const ranges = {
    'Electronics': [999, 89999],
    'Clothing': [299, 4999],
    'Food & Beverages': [99, 2999],
    'Books': [199, 999],
    'Sports': [299, 9999],
    'Home & Garden': [499, 19999],
    'Toys': [199, 4999],
    'Automotive': [299, 7999],
  };
  const [min, max] = ranges[category];
  return (randomBetween(min * 100, max * 100) / 100).toFixed(2);
}

async function seed() {
  console.log('🌱 Seeding 10,000 transactions...');

  const batchSize = 500;
  const totalRecords = 10000;
  const startDate = new Date('2026-01-01');
  const endDate = new Date('2026-06-10');

  for (let batch = 0; batch < totalRecords / batchSize; batch++) {
    const values = [];
    const params = [];
    let paramIndex = 1;

    for (let i = 0; i < batchSize; i++) {
      const globalIndex = batch * batchSize + i + 1;
      const category = randomChoice(categories);
      const product = randomChoice(products[category]);
      const firstName = randomChoice(firstNames);
      const lastName = randomChoice(lastNames);

      values.push(`($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`);
      params.push(
        `TXN${String(globalIndex).padStart(6, '0')}`,
        `${firstName} ${lastName}`,
        product,
        category,
        randomChoice(regions),
        generateAmount(category),
        randomChoice(statuses),
        randomDate(startDate, endDate)
      );
    }

    await pool.query(
      `INSERT INTO transactions (transaction_id, customer_name, product_name, category, region, amount, status, transaction_date) VALUES ${values.join(',')}`,
      params
    );

    console.log(`✅ Inserted batch ${batch + 1}/${totalRecords / batchSize}`);
  }

  console.log('🎉 Seeding complete! 10,000 records inserted.');
  await pool.end();
}

seed().catch(console.error);