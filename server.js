import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new pg.Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'Pawy-Meal',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.connect((err, client, done) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Successfully connected to database');
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  console.log('Login request received:', req.body); // Debug log
  
  try {
    const { email, password } = req.body;
    
    const query = `
      SELECT employee_id, name, email, role 
      FROM Employee 
      WHERE email = $1 AND password = $2
    `;
    
    const result = await pool.query(query, [email, password]);
    console.log('Query result:', result.rows); // Debug log

    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({ 
        success: true, 
        user: {
          id: user.employee_id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + error.message 
    });
  }
});

// GET endpoint for customers
app.get('/api/customers', async (req, res) => {
  try {
    const query = `
      SELECT 
        c.customer_id,
        c.name,
        c.mobile_no,
        c.email,
        c.address,
        ARRAY_AGG(p.pet_id) as pets
      FROM 
        Customer c
        LEFT JOIN Pet p ON c.customer_id = p.customer_id
      GROUP BY 
        c.customer_id, c.name, c.mobile_no, c.email, c.address
      ORDER BY 
        c.customer_id;
    `;
    
    const result = await pool.query(query);
    console.log('Customers fetched:', result.rows); // Debug log
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch customers',
      details: error.message 
    });
  }
});

// DELETE endpoint for customers
app.delete('/api/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // First delete associated pets
    await pool.query('DELETE FROM Pet WHERE customer_id = $1', [id]);
    
    // Then delete the customer
    const result = await pool.query(
      'DELETE FROM Customer WHERE customer_id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      error: 'Failed to delete customer',
      details: error.message 
    });
  }
});

// GET endpoint for employees
app.get('/api/employees', async (req, res) => {
  try {
    const query = `
      SELECT 
        employee_id,
        name,
        role,
        mobile_no,
        email
      FROM 
        Employee
      ORDER BY 
        employee_id;
    `;
    
    const result = await pool.query(query);
    console.log('Employees fetched:', result.rows); // Debug log
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch employees',
      details: error.message 
    });
  }
});

// DELETE endpoint for employees
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM Employee WHERE employee_id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      error: 'Failed to delete employee',
      details: error.message 
    });
  }
});

// GET all orders
app.get('/api/orders', async (req, res) => {
  try {
    const query = `
      SELECT 
        o.order_id,
        o.plan,
        o.quantity,
        o.price,
        o.date_order,
        c.name AS customer_name,
        e1.name AS cook_name,
        o.order_status,
        e2.name AS admin_name
      FROM 
        Order_Item o
        JOIN Customer c ON o.customer_id = c.customer_id
        LEFT JOIN Employee e1 ON o.cook_employee_id = e1.employee_id
        LEFT JOIN Employee e2 ON o.admin_employee_id = e2.employee_id
      ORDER BY 
        o.date_order DESC;
    `;
    
    const result = await pool.query(query);
    console.log('Orders fetched:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch orders',
      details: error.message 
    });
  }
});

// UPDATE order status
app.put('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await pool.query(
      'UPDATE Order_Item SET order_status = $1 WHERE order_id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      error: 'Failed to update order',
      details: error.message 
    });
  }
});

// DELETE order
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM Order_Item WHERE order_id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      error: 'Failed to delete order',
      details: error.message 
    });
  }
});

// GET order counts for chef dashboard
app.get('/api/chef/order-counts', async (req, res) => {
  try {
    console.log('Fetching order counts...'); // Debug log
    const query = `
      SELECT 
        COUNT(CASE WHEN order_status = 'Pending' THEN 1 END) as pending,
        COUNT(CASE WHEN order_status = 'Cooking' THEN 1 END) as cooking,
        COUNT(CASE WHEN order_status = 'Completed' 
                   AND date_order::date = CURRENT_DATE THEN 1 END) as completed
      FROM Order_Item;
    `;
    
    const result = await pool.query(query);
    console.log('Order counts result:', result.rows[0]); // Debug log
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch order counts' });
  }
});

// GET recent orders for chef dashboard
app.get('/api/chef/recent-orders', async (req, res) => {
  try {
    console.log('Fetching recent orders...'); // Debug log
    const query = `
      SELECT 
        o.order_id,
        c.name as customer_name,
        o.plan,
        o.date_order,
        o.order_status
      FROM 
        Order_Item o
        JOIN Customer c ON o.customer_id = c.customer_id
      ORDER BY 
        o.date_order DESC
      LIMIT 5;
    `;
    
    const result = await pool.query(query);
    console.log('Recent orders result:', result.rows); // Debug log
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch recent orders' });
  }
});

// GET chef orders
app.get('/api/chef/orders', async (req, res) => {
  try {
    const query = `
      SELECT 
        o.order_id,
        c.name as customer_name,
        o.plan,
        o.date_order,
        o.order_status
      FROM 
        Order_Item o
        JOIN Customer c ON o.customer_id = c.customer_id
      WHERE 
        o.order_status IN ('Pending', 'Cooking', 'Completed')
      ORDER BY 
        CASE 
          WHEN o.order_status = 'Pending' THEN 1
          WHEN o.order_status = 'Cooking' THEN 2
          ELSE 3
        END,
        o.date_order DESC;
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch chef orders' });
  }
});

// UPDATE chef order status
app.put('/api/chef/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await pool.query(
      'UPDATE Order_Item SET order_status = $1 WHERE order_id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      error: 'Failed to update order status',
      details: error.message 
    });
  }
});

// GET meal queue
app.get('/api/chef/meal-queue', async (req, res) => {
  try {
    const query = `
      SELECT 
        o.order_id as meal_id,
        c.name as customer_name,
        o.plan as plan_name,
        o.date_order as order_time,
        o.order_status as status
      FROM 
        Order_Item o
        JOIN Customer c ON o.customer_id = c.customer_id
      WHERE 
        o.order_status IN ('Pending', 'Preparing')
      ORDER BY 
        o.date_order ASC;
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch meal queue' });
  }
});

// UPDATE meal status
app.put('/api/chef/meal-queue/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await pool.query(
      'UPDATE Order_Item SET order_status = $1 WHERE order_id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Meal not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to update meal status' });
  }
});


// GET ingredients with their menu relationships
app.get('/api/chef/ingredients', async (req, res) => {
  try {
    const query = `
      SELECT 
        i.ingredient_id,
        i.name,
        i.amount,
        i.description,
        array_agg(m.name) as used_in_menus
      FROM 
        Ingredient i
      LEFT JOIN 
        Menu_Ingredient mi ON i.ingredient_id = mi.ingredient_id
      LEFT JOIN 
        Menu m ON mi.menu_id = m.menu_id
      GROUP BY 
        i.ingredient_id, i.name, i.amount, i.description
      ORDER BY 
        i.name ASC;
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch ingredients',
      details: error.message
    });
  }
});

// Add stock report
app.post('/api/chef/stock-reports', async (req, res) => {
  try {
    const { employee_reporter_id, ingredient_id, description } = req.body;
    
    // Log the incoming data
    console.log('Received report data:', {
      employee_reporter_id,
      ingredient_id,
      description
    });

    const query = `
      INSERT INTO Stock_Reports 
        (reported_date, employee_reporter_id, status, employee_solver_id)
      VALUES 
        (CURRENT_DATE, $1, 'Pending', NULL)
      RETURNING *;
    `;
    
    console.log('Executing query:', query);
    
    const result = await pool.query(query, [employee_reporter_id]);

    console.log('Query result:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Detailed database error:', error);
    res.status(500).json({ 
      error: 'Failed to create stock report',
      details: error.message
    });
  }
});

// Update stock report status
app.put('/api/chef/stock-reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, employee_solver_id } = req.body;
    
    const query = `
      UPDATE Stock_Reports 
      SET status = $1, employee_solver_id = $2
      WHERE report_id = $3
      RETURNING *;
    `;
    
    const result = await pool.query(query, [status, employee_solver_id, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stock report not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to update stock report' });
  }
});

// GET stock reports
app.get('/api/admin/stock-reports', async (req, res) => {
  try {
    const query = `
      SELECT 
        s.report_id,
        s.reported_date,
        e1.name AS reported_by,
        s.status,
        e2.name AS solved_by
      FROM 
        Stock_Reports s
      LEFT JOIN 
        Employee e1 ON s.employee_reporter_id = e1.employee_id
      LEFT JOIN 
        Employee e2 ON s.employee_solver_id = e2.employee_id
      ORDER BY 
        s.reported_date DESC;
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch stock reports' });
  }
});

// DELETE (solve) stock report
app.delete('/api/admin/stock-reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      DELETE FROM Stock_Reports 
      WHERE report_id = $1
      RETURNING *;
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.json({ message: 'Report solved successfully' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to solve report' });
  }
});

// Get counts for admin dashboard
app.get('/api/admin/orders/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as count FROM Orders');
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch orders count' });
  }
});

app.get('/api/admin/employees/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as count FROM Employee');
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch employees count' });
  }
});

app.get('/api/admin/customers/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as count FROM Customer');
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch customers count' });
  }
});

app.get('/api/admin/stock-reports/count', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as count FROM Stock_Reports WHERE status = \'Pending\'');
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch stock reports count' });
  }
});

// Add new employee
app.post('/api/employees', async (req, res) => {
  try {
    console.log('Received employee data:', req.body); // Debug log
    
    const { name, role, mobile_no, email, password } = req.body;
    
    const query = `
      INSERT INTO Employee 
        (name, role, mobile_no, email, password)
      VALUES 
        ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    
    console.log('Executing query:', query); // Debug log
    
    const result = await pool.query(query, [
      name,
      role,
      mobile_no,
      email,
      password
    ]);

    console.log('Query result:', result.rows[0]); // Debug log
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Detailed database error:', error);
    res.status(500).json({ 
      error: 'Failed to add employee',
      details: error.message
    });
  }
});

// Update employee email
app.put('/api/employees/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    
    console.log('Updating email for employee:', id, 'New email:', email); // Debug log

    const query = `
      UPDATE Employee 
      SET email = $1
      WHERE employee_id = $2
      RETURNING *;
    `;
    
    const result = await pool.query(query, [email, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    console.log('Updated employee:', result.rows[0]); // Debug log
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      error: 'Failed to update employee email',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Database connection details:', {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });
});

// On your backend
app.get('/api/chef/ingredients-with-reports', async (req, res) => {
  try {
    // Get the current user ID (you might get this from the request)
    const userId = req.user.id;
    
    // Query your database to join ingredients with reports
    const query = `
      SELECT i.*, 
             (SELECT COUNT(*) > 0 FROM stock_reports 
              WHERE ingredient_id = i.ingredient_id AND status = 'Pending') AS isReported
      FROM ingredients i
    `;
    
    const ingredients = await db.query(query);
    
    res.json(ingredients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});