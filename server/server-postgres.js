import express from 'express';
import cors from 'cors';
import pg from 'pg';

const { Pool } = pg;

const app = express();
const PORT = process.env.PORT || 3001;

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database tables
async function initDatabase() {
  const client = await pool.connect();
  try {
    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS training_tasks (
        id SERIAL PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS food_entries (
        id VARCHAR(255) PRIMARY KEY,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS potty_entries (
        id VARCHAR(255) PRIMARY KEY,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS puppy_info (
        id INTEGER PRIMARY KEY DEFAULT 1,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS todo_entries (
        id VARCHAR(255) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

// ===== TRAINING TASKS ENDPOINTS =====

app.get('/api/training-tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT data FROM training_tasks ORDER BY id DESC LIMIT 1');
    res.json(result.rows.length > 0 ? result.rows[0].data : {});
  } catch (error) {
    console.error('Error reading training tasks:', error);
    res.status(500).json({ error: 'Failed to read training tasks' });
  }
});

app.post('/api/training-tasks', async (req, res) => {
  try {
    const tasks = req.body;
    await pool.query(
      'INSERT INTO training_tasks (data) VALUES ($1) ON CONFLICT DO NOTHING',
      [JSON.stringify(tasks)]
    );
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error saving training tasks:', error);
    res.status(500).json({ error: 'Failed to save training tasks' });
  }
});

// ===== FOOD ENTRIES ENDPOINTS =====

app.get('/api/food-entries', async (req, res) => {
  try {
    const result = await pool.query('SELECT data FROM food_entries ORDER BY created_at ASC');
    const entries = result.rows.map(row => row.data);
    res.json(entries);
  } catch (error) {
    console.error('Error reading food entries:', error);
    res.status(500).json({ error: 'Failed to read food entries' });
  }
});

app.post('/api/food-entries', async (req, res) => {
  try {
    const newEntry = req.body;
    await pool.query(
      'INSERT INTO food_entries (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2',
      [newEntry.id, JSON.stringify(newEntry)]
    );
    res.json({ success: true, data: newEntry });
  } catch (error) {
    console.error('Error adding food entry:', error);
    res.status(500).json({ error: 'Failed to add food entry' });
  }
});

app.put('/api/food-entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEntry = req.body;
    await pool.query(
      'UPDATE food_entries SET data = $1 WHERE id = $2',
      [JSON.stringify(updatedEntry), id]
    );
    res.json({ success: true, data: updatedEntry });
  } catch (error) {
    console.error('Error updating food entry:', error);
    res.status(500).json({ error: 'Failed to update food entry' });
  }
});

// ===== POTTY ENTRIES ENDPOINTS =====

app.get('/api/potty-entries', async (req, res) => {
  try {
    const result = await pool.query('SELECT data FROM potty_entries ORDER BY created_at ASC');
    const entries = result.rows.map(row => row.data);
    res.json(entries);
  } catch (error) {
    console.error('Error reading potty entries:', error);
    res.status(500).json({ error: 'Failed to read potty entries' });
  }
});

app.post('/api/potty-entries', async (req, res) => {
  try {
    const newEntry = req.body;
    await pool.query(
      'INSERT INTO potty_entries (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2',
      [newEntry.id, JSON.stringify(newEntry)]
    );
    res.json({ success: true, data: newEntry });
  } catch (error) {
    console.error('Error adding potty entry:', error);
    res.status(500).json({ error: 'Failed to add potty entry' });
  }
});

app.put('/api/potty-entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEntry = req.body;
    await pool.query(
      'UPDATE potty_entries SET data = $1 WHERE id = $2',
      [JSON.stringify(updatedEntry), id]
    );
    res.json({ success: true, data: updatedEntry });
  } catch (error) {
    console.error('Error updating potty entry:', error);
    res.status(500).json({ error: 'Failed to update potty entry' });
  }
});

app.delete('/api/potty-entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM potty_entries WHERE id = $1', [id]);
    res.json({ success: true, message: 'Potty entry deleted' });
  } catch (error) {
    console.error('Error deleting potty entry:', error);
    res.status(500).json({ error: 'Failed to delete potty entry' });
  }
});

// Bulk delete all entries
app.delete('/api/potty-entries', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM potty_entries');
    res.json({ success: true, message: `Deleted ${result.rowCount} potty entries` });
  } catch (error) {
    console.error('Error deleting all potty entries:', error);
    res.status(500).json({ error: 'Failed to delete all potty entries' });
  }
});

app.delete('/api/food-entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM food_entries WHERE id = $1', [id]);
    res.json({ success: true, message: 'Food entry deleted' });
  } catch (error) {
    console.error('Error deleting food entry:', error);
    res.status(500).json({ error: 'Failed to delete food entry' });
  }
});

app.delete('/api/food-entries', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM food_entries');
    res.json({ success: true, message: `Deleted ${result.rowCount} food entries` });
  } catch (error) {
    console.error('Error deleting all food entries:', error);
    res.status(500).json({ error: 'Failed to delete all food entries' });
  }
});

// ===== PUPPY INFO ENDPOINTS =====

app.get('/api/puppy-info', async (req, res) => {
  try {
    const result = await pool.query('SELECT data FROM puppy_info WHERE id = 1');
    res.json(result.rows.length > 0 ? result.rows[0].data : {});
  } catch (error) {
    console.error('Error reading puppy info:', error);
    res.status(500).json({ error: 'Failed to read puppy info' });
  }
});

app.post('/api/puppy-info', async (req, res) => {
  try {
    const info = req.body;
    await pool.query(
      'INSERT INTO puppy_info (id, data) VALUES (1, $1) ON CONFLICT (id) DO UPDATE SET data = $1',
      [JSON.stringify(info)]
    );
    res.json({ success: true, data: info });
  } catch (error) {
    console.error('Error saving puppy info:', error);
    res.status(500).json({ error: 'Failed to save puppy info' });
  }
});

// ===== TODO ENTRIES ENDPOINTS =====

app.get('/api/todo-entries', async (req, res) => {
  try {
    const result = await pool.query('SELECT data FROM todo_entries ORDER BY updated_at DESC');
    const entries = result.rows.map(row => row.data);
    res.json(entries);
  } catch (error) {
    console.error('Error reading todo entries:', error);
    res.status(500).json({ error: 'Failed to read todo entries' });
  }
});

app.post('/api/todo-entries', async (req, res) => {
  try {
    const newEntry = req.body;
    await pool.query(
      'INSERT INTO todo_entries (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2',
      [newEntry.id, JSON.stringify(newEntry)]
    );
    res.json({ success: true, data: newEntry });
  } catch (error) {
    console.error('Error saving todo entry:', error);
    res.status(500).json({ error: 'Failed to save todo entry' });
  }
});

// ===== SYNC ENDPOINT =====

app.get('/api/sync', async (req, res) => {
  try {
    const [trainingTasksResult, foodEntriesResult, pottyEntriesResult, puppyInfoResult, todoEntriesResult] = await Promise.all([
      pool.query('SELECT data FROM training_tasks ORDER BY id DESC LIMIT 1'),
      pool.query('SELECT data FROM food_entries ORDER BY created_at ASC'),
      pool.query('SELECT data FROM potty_entries ORDER BY created_at ASC'),
      pool.query('SELECT data FROM puppy_info WHERE id = 1'),
      pool.query('SELECT data FROM todo_entries ORDER BY updated_at DESC')
    ]);

    res.json({
      trainingTasks: trainingTasksResult.rows.length > 0 ? trainingTasksResult.rows[0].data : {},
      foodEntries: foodEntriesResult.rows.map(row => row.data),
      pottyEntries: pottyEntriesResult.rows.map(row => row.data),
      puppyInfo: puppyInfoResult.rows.length > 0 ? puppyInfoResult.rows[0].data : {},
      todoEntries: todoEntriesResult.rows.map(row => row.data)
    });
  } catch (error) {
    console.error('Error syncing data:', error);
    res.status(500).json({ error: 'Failed to sync data' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: pool.totalCount > 0 ? 'connected' : 'connecting'
  });
});

// Start server
async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Husky Puppy Trainer API server running on port ${PORT}`);
      console.log(`🗄️  PostgreSQL database connected`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
