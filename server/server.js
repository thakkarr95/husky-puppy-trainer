import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Server version: 1.1.0 - Added active nap tracking endpoints
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, 'data');

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data directory exists
async function initDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Helper function to read data file
async function readDataFile(filename) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null; // File doesn't exist yet
    }
    throw error;
  }
}

// Helper function to write data file
async function writeDataFile(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ===== TRAINING TASKS ENDPOINTS =====

// Get all training tasks
app.get('/api/training-tasks', async (req, res) => {
  try {
    const tasks = await readDataFile('training-tasks.json');
    res.json(tasks || {});
  } catch (error) {
    console.error('Error reading training tasks:', error);
    res.status(500).json({ error: 'Failed to read training tasks' });
  }
});

// Update training tasks
app.post('/api/training-tasks', async (req, res) => {
  try {
    const tasks = req.body;
    await writeDataFile('training-tasks.json', tasks);
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error saving training tasks:', error);
    res.status(500).json({ error: 'Failed to save training tasks' });
  }
});

// ===== FOOD ENTRIES ENDPOINTS =====

// Get all food entries
app.get('/api/food-entries', async (req, res) => {
  try {
    const entries = await readDataFile('food-entries.json');
    res.json(entries || []);
  } catch (error) {
    console.error('Error reading food entries:', error);
    res.status(500).json({ error: 'Failed to read food entries' });
  }
});

// Add food entry
app.post('/api/food-entries', async (req, res) => {
  try {
    const newEntry = req.body;
    const entries = await readDataFile('food-entries.json') || [];
    entries.push(newEntry);
    await writeDataFile('food-entries.json', entries);
    res.json({ success: true, data: newEntry });
  } catch (error) {
    console.error('Error adding food entry:', error);
    res.status(500).json({ error: 'Failed to add food entry' });
  }
});

// Update food entry
app.put('/api/food-entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEntry = req.body;
    const entries = await readDataFile('food-entries.json') || [];
    const index = entries.findIndex(e => e.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    
    entries[index] = updatedEntry;
    await writeDataFile('food-entries.json', entries);
    res.json({ success: true, data: updatedEntry });
  } catch (error) {
    console.error('Error updating food entry:', error);
    res.status(500).json({ error: 'Failed to update food entry' });
  }
});

// ===== POTTY ENTRIES ENDPOINTS =====

// Get all potty entries
app.get('/api/potty-entries', async (req, res) => {
  try {
    const entries = await readDataFile('potty-entries.json');
    res.json(entries || []);
  } catch (error) {
    console.error('Error reading potty entries:', error);
    res.status(500).json({ error: 'Failed to read potty entries' });
  }
});

// Add potty entry
app.post('/api/potty-entries', async (req, res) => {
  try {
    const newEntry = req.body;
    const entries = await readDataFile('potty-entries.json') || [];
    entries.push(newEntry);
    await writeDataFile('potty-entries.json', entries);
    res.json({ success: true, data: newEntry });
  } catch (error) {
    console.error('Error adding potty entry:', error);
    res.status(500).json({ error: 'Failed to add potty entry' });
  }
});

// Update potty entry
app.put('/api/potty-entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEntry = req.body;
    const entries = await readDataFile('potty-entries.json') || [];
    const index = entries.findIndex(e => e.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Potty entry not found' });
    }
    
    entries[index] = updatedEntry;
    await writeDataFile('potty-entries.json', entries);
    res.json({ success: true, data: updatedEntry });
  } catch (error) {
    console.error('Error updating potty entry:', error);
    res.status(500).json({ error: 'Failed to update potty entry' });
  }
});

// Delete potty entry
app.delete('/api/potty-entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const entries = await readDataFile('potty-entries.json') || [];
    const filteredEntries = entries.filter(e => e.id !== id);
    
    if (filteredEntries.length === entries.length) {
      return res.status(404).json({ error: 'Potty entry not found' });
    }
    
    await writeDataFile('potty-entries.json', filteredEntries);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting potty entry:', error);
    res.status(500).json({ error: 'Failed to delete potty entry' });
  }
});

// ===== PUPPY INFO ENDPOINTS =====

// Get puppy info (birth date, etc.)
app.get('/api/puppy-info', async (req, res) => {
  try {
    const info = await readDataFile('puppy-info.json');
    res.json(info || {});
  } catch (error) {
    console.error('Error reading puppy info:', error);
    res.status(500).json({ error: 'Failed to read puppy info' });
  }
});

// Update puppy info
app.post('/api/puppy-info', async (req, res) => {
  try {
    const info = req.body;
    await writeDataFile('puppy-info.json', info);
    res.json({ success: true, data: info });
  } catch (error) {
    console.error('Error saving puppy info:', error);
    res.status(500).json({ error: 'Failed to save puppy info' });
  }
});

// ===== TODO ENTRIES ENDPOINTS =====

// Get all todo entries
app.get('/api/todo-entries', async (req, res) => {
  try {
    const entries = await readDataFile('todo-entries.json');
    res.json(entries || []);
  } catch (error) {
    console.error('Error reading todo entries:', error);
    res.status(500).json({ error: 'Failed to read todo entries' });
  }
});

// Add or update todo entry
app.post('/api/todo-entries', async (req, res) => {
  try {
    const newEntry = req.body;
    const entries = await readDataFile('todo-entries.json') || [];
    
    // Remove existing entry for same date if exists
    const filteredEntries = entries.filter(e => e.id !== newEntry.id);
    filteredEntries.push(newEntry);
    
    await writeDataFile('todo-entries.json', filteredEntries);
    res.json({ success: true, data: newEntry });
  } catch (error) {
    console.error('Error saving todo entry:', error);
    res.status(500).json({ error: 'Failed to save todo entry' });
  }
});

// ===== SYNC ENDPOINT =====

// Get all data at once for initial sync
app.get('/api/sync', async (req, res) => {
  try {
    const [trainingTasks, foodEntries, pottyEntries, puppyInfo, todoEntries] = await Promise.all([
      readDataFile('training-tasks.json'),
      readDataFile('food-entries.json'),
      readDataFile('potty-entries.json'),
      readDataFile('puppy-info.json'),
      readDataFile('todo-entries.json')
    ]);

    res.json({
      trainingTasks: trainingTasks || {},
      foodEntries: foodEntries || [],
      pottyEntries: pottyEntries || [],
      puppyInfo: puppyInfo || {},
      todoEntries: todoEntries || []
    });
  } catch (error) {
    console.error('Error syncing data:', error);
    res.status(500).json({ error: 'Failed to sync data' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ===== ACTIVE NAP ENDPOINTS =====

// Get active nap
app.get('/api/active-nap', async (req, res) => {
  try {
    const activeNap = await readDataFile('active-nap.json');
    res.json(activeNap || null);
  } catch (error) {
    console.error('Error reading active nap:', error);
    res.status(500).json({ error: 'Failed to read active nap' });
  }
});

// Start nap
app.post('/api/active-nap/start', async (req, res) => {
  try {
    const activeNap = {
      id: Date.now().toString(),
      startTime: new Date().toISOString()
    };
    await writeDataFile('active-nap.json', activeNap);
    res.json({ success: true, data: activeNap });
  } catch (error) {
    console.error('Error starting nap:', error);
    res.status(500).json({ error: 'Failed to start nap' });
  }
});

// Stop nap (clears active nap)
app.post('/api/active-nap/stop', async (req, res) => {
  try {
    await writeDataFile('active-nap.json', null);
    res.json({ success: true });
  } catch (error) {
    console.error('Error stopping nap:', error);
    res.status(500).json({ error: 'Failed to stop nap' });
  }
});

// Cancel nap (clears active nap without logging)
app.post('/api/active-nap/cancel', async (req, res) => {
  try {
    await writeDataFile('active-nap.json', null);
    res.json({ success: true });
  } catch (error) {
    console.error('Error canceling nap:', error);
    res.status(500).json({ error: 'Failed to cancel nap' });
  }
});

// Start server
async function startServer() {
  await initDataDir();
  app.listen(PORT, () => {
    console.log(`🚀 Husky Puppy Trainer API server running on port ${PORT}`);
    console.log(`📁 Data directory: ${DATA_DIR}`);
  });
}

startServer().catch(console.error);
