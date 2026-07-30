/**
 * API Backend Database Routes
 * Generic routes for database operations
 */

import { Router, Request, Response } from 'express';
import apiDatabaseConnector from '../services/apiDatabase';

const router = Router();

// ==========================================
// Health & Status Routes
// ==========================================

/**
 * GET /api/database/health
 * Get database health status
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    const health = await apiDatabaseConnector.getHealth();
    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    console.error('Error getting database health:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get database health'
    });
  }
});

/**
 * GET /api/database/status
 * Get database status (version, size, etc.)
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const [version, size] = await Promise.all([
      apiDatabaseConnector.getVersion(),
      apiDatabaseConnector.getSize()
    ]);
    
    res.json({
      success: true,
      data: {
        version,
        size,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error getting database status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get database status'
    });
  }
});

// ==========================================
// Table Routes
// ==========================================

/**
 * GET /api/database/tables
 * List all tables
 */
router.get('/tables', async (req: Request, res: Response) => {
  try {
    const tables = await apiDatabaseConnector.getTables();
    res.json({
      success: true,
      data: tables,
      count: tables.length
    });
  } catch (error) {
    console.error('Error listing tables:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list tables'
    });
  }
});

/**
 * GET /api/database/tables/:name
 * Get table information
 */
router.get('/tables/:name', async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const tableInfo = await apiDatabaseConnector.getTableInfo(name);
    
    if (!tableInfo) {
      return res.status(404).json({
        success: false,
        error: 'Table not found'
      });
    }
    
    res.json({
      success: true,
      data: tableInfo
    });
  } catch (error) {
    console.error('Error getting table info:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get table information'
    });
  }
});

// ==========================================
// CRUD Generic Routes
// ==========================================

/**
 * GET /api/database/:table
 * List records from a table
 */
router.get('/:table', async (req: Request, res: Response) => {
  try {
    const { table } = req.params;
    const { limit, offset, orderBy, orderDir, ...conditions } = req.query;
    
    const records = await apiDatabaseConnector.find(
      table,
      conditions as Record<string, unknown>,
      {
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
        orderBy: orderBy as string,
        orderDir: (orderDir as 'ASC' | 'DESC') || 'ASC'
      }
    );
    
    res.json({
      success: true,
      data: records,
      count: records.length
    });
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch records'
    });
  }
});

/**
 * GET /api/database/:table/:id
 * Get single record by ID
 */
router.get('/:table/:id', async (req: Request, res: Response) => {
  try {
    const { table, id } = req.params;
    
    const record = await apiDatabaseConnector.findById(table, id);
    
    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }
    
    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Error fetching record:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch record'
    });
  }
});

/**
 * POST /api/database/:table
 * Insert new record into table
 */
router.post('/:table', async (req: Request, res: Response) => {
  try {
    const { table } = req.params;
    
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Request body is required'
      });
    }
    
    const id = await apiDatabaseConnector.insert(table, req.body);
    
    res.status(201).json({
      success: true,
      data: { id },
      message: 'Record created successfully'
    });
  } catch (error) {
    console.error('Error inserting record:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to insert record'
    });
  }
});

/**
 * PUT /api/database/:table/:id
 * Update record by ID
 */
router.put('/:table/:id', async (req: Request, res: Response) => {
  try {
    const { table, id } = req.params;
    
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Request body is required'
      });
    }
    
    const updated = await apiDatabaseConnector.update(table, id, req.body);
    
    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Record updated successfully'
    });
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update record'
    });
  }
});

/**
 * DELETE /api/database/:table/:id
 * Delete record by ID
 */
router.delete('/:table/:id', async (req: Request, res: Response) => {
  try {
    const { table, id } = req.params;
    
    const deleted = await apiDatabaseConnector.delete(table, id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete record'
    });
  }
});

/**
 * GET /api/database/:table/:id/exists
 * Check if record exists
 */
router.get('/:table/:id/exists', async (req: Request, res: Response) => {
  try {
    const { table, id } = req.params;
    
    const exists = await apiDatabaseConnector.exists(table, id);
    
    res.json({
      success: true,
      data: { exists }
    });
  } catch (error) {
    console.error('Error checking record existence:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check record existence'
    });
  }
});

/**
 * GET /api/database/:table/count
 * Count records in table
 */
router.get('/:table/count', async (req: Request, res: Response) => {
  try {
    const { table } = req.params;
    const { ...conditions } = req.query;
    
    const count = await apiDatabaseConnector.count(table, conditions as Record<string, unknown>);
    
    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Error counting records:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to count records'
    });
  }
});

// ==========================================
// Query Routes
// ==========================================

/**
 * POST /api/database/query
 * Execute custom query
 */
router.post('/query', async (req: Request, res: Response) => {
  try {
    const { sql, params } = req.body;
    
    if (!sql) {
      return res.status(400).json({
        success: false,
        error: 'SQL query is required'
      });
    }
    
    const result = await apiDatabaseConnector.executeRaw(sql, params);
    
    res.json({
      success: true,
      data: result,
      rowCount: result.rowCount
    });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to execute query'
    });
  }
});

/**
 * POST /api/database/views
 * Create a view
 */
router.post('/views', async (req: Request, res: Response) => {
  try {
    const { viewName, query: viewQuery } = req.body;
    
    if (!viewName || !viewQuery) {
      return res.status(400).json({
        success: false,
        error: 'viewName and query are required'
      });
    }
    
    const created = await apiDatabaseConnector.createView(viewName, viewQuery);
    
    if (created) {
      res.status(201).json({
        success: true,
        message: `View ${viewName} created successfully`
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to create view'
      });
    }
  } catch (error) {
    console.error('Error creating view:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create view'
    });
  }
});

export default router;
