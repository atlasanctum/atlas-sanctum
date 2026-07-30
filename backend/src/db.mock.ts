
// Mock database for testing purposes
import { Pool } from 'pg';

// In-memory storage
const users: any[] = [];
const transactions: any[] = [];
const tokens: any[] = [];
const rius: any[] = [];
const carbonProjects: any[] = [
  {
    id: '1',
    title: 'Amazon Rainforest Protection',
    description: 'Protecting and restoring the Amazon rainforest to sequester carbon and preserve biodiversity',
    location: 'Amazonas Region',
    country: 'Brazil',
    project_type: 'reforestation',
    status: 'active',
    price_per_credit: 24.50,
    total_credits: 100000,
    available_credits: 88000,
    vintage_year: 2024,
    certification: 'Verra',
    methodology: 'VM0004',
    co2_offset_per_credit: 1,
    image_url: 'https://images.unsplash.com/photo-1542601906990-61b07816b324?w=800',
    developer_name: 'Amazon Conservation Association',
    start_date: '2024-01-01',
    end_date: '2030-12-31',
    measurement_data_id: '1',
    bioregional_zone_id: '1',
    regenerative_metrics_id: '1',
    valuation_model_id: '1',
    geometry: null,
    verified_by_system_at: new Date().toISOString(),
    last_measurement_at: new Date().toISOString(),
    impact_score: 95,
    confidence_level: 0.98,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Kenyan Wind Farm',
    description: 'Building wind turbines in Turkana County to provide clean renewable energy',
    location: 'Turkana County',
    country: 'Kenya',
    project_type: 'renewable_energy',
    status: 'active',
    price_per_credit: 18.75,
    total_credits: 50000,
    available_credits: 41500,
    vintage_year: 2024,
    certification: 'Gold Standard',
    methodology: 'GS0001',
    co2_offset_per_credit: 1,
    image_url: 'https://images.unsplash.com/photo-1509395062183-67c5ad6ee6fe?w=800',
    developer_name: 'Kenyan Wind Energy Ltd',
    start_date: '2024-03-15',
    end_date: '2035-03-14',
    measurement_data_id: '2',
    bioregional_zone_id: '2',
    regenerative_metrics_id: '2',
    valuation_model_id: '2',
    geometry: null,
    verified_by_system_at: new Date().toISOString(),
    last_measurement_at: new Date().toISOString(),
    impact_score: 88,
    confidence_level: 0.95,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Plastic-to-Value Micro-Factories',
    description: 'Converting plastic waste to fuel and building materials in informal settlements',
    location: 'Mathare',
    country: 'Kenya',
    project_type: 'methane_capture',
    status: 'active',
    price_per_credit: 20.00,
    total_credits: 30000,
    available_credits: 30000,
    vintage_year: 2024,
    certification: 'Climate Action Reserve',
    methodology: 'CAR0001',
    co2_offset_per_credit: 1,
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
    developer_name: 'Plastic Bank',
    start_date: '2024-02-01',
    end_date: '2029-01-31',
    measurement_data_id: '3',
    bioregional_zone_id: '3',
    regenerative_metrics_id: '3',
    valuation_model_id: '3',
    geometry: null,
    verified_by_system_at: new Date().toISOString(),
    last_measurement_at: new Date().toISOString(),
    impact_score: 92,
    confidence_level: 0.96,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
const measurementData: any[] = [];
const featureFlagsStorage: any[] = [];

// Mock query function
export async function query(text: string, params: any[] = []) {
  console.log('Mock query:', text, params);
  
  // Mock user creation
  if (text.includes('INSERT INTO users')) {
    const email = params[0];
    const displayName = params[2];
    const role = params[4];
    
    const user = {
      id: Date.now().toString(),
      email: email,
      display_name: displayName,
      role: role,
      password_hash: params[3],
      email_verified: params[5],
      mfa_enabled: false,
      login_attempts: 0,
      locked_until: null,
      account_locked: false,
      created_at: new Date(),
      updated_at: new Date(),
      preferences: {}
    };
    
    users.push(user);
    
    return {
      rows: [user],
      rowCount: 1
    };
  }
  
  // Mock user lookup
  if (text.includes('SELECT') && text.includes('FROM users')) {
    // Handle different select scenarios
    if (text.includes('WHERE email =')) {
      const email = params[0];
      const user = users.find(u => u.email === email);
      return {
        rows: user ? [user] : [],
        rowCount: user ? 1 : 0
      };
    }
    
    if (text.includes('WHERE id =')) {
      const id = params[0];
      const user = users.find(u => u.id === id);
      return {
        rows: user ? [user] : [],
        rowCount: user ? 1 : 0
      };
    }
    
    return {
      rows: users,
      rowCount: users.length
    };
  }
  
  // Mock update user login attempts
  if (text.includes('UPDATE users SET login_attempts')) {
    const userId = params[params.length - 1];
    const user = users.find(u => u.id === userId);
    
    if (user) {
      user.login_attempts = params[0];
      if (params.length > 2) {
        user.locked_until = params[1];
      }
    }
    
    return {
      rows: [],
      rowCount: 1
    };
  }
  
  // Mock refresh token storage
  if (text.includes('INSERT INTO refresh_tokens')) {
    const token = {
      id: Date.now().toString(),
      user_id: params[0],
      token: params[1],
      expires_at: params[2],
      created_at: new Date(),
      updated_at: new Date()
    };
    
    tokens.push(token);
    
    return {
      rows: [token],
      rowCount: 1
    };
  }
  
  // Mock refresh token lookup and counting
  if (text.includes('SELECT') && text.includes('refresh_tokens')) {
    if (text.includes('COUNT')) {
      // Handle count query
      return {
        rows: [{ count: '0' }],
        rowCount: 1
      };
    }
    
    const token = tokens.find(t => t.user_id === params[0]);
    return {
      rows: token ? [token] : [],
      rowCount: token ? 1 : 0
    };
  }
  
   // Mock carbon projects queries
   if (text.includes('SELECT') && text.includes('FROM carbon_projects')) {
     // Handle different select scenarios
     if (text.includes('WHERE id =')) {
       const id = params[0];
       const project = carbonProjects.find(p => p.id === id);
       return {
         rows: project ? [project] : [],
         rowCount: project ? 1 : 0
       };
     }
     
     if (text.includes('WHERE status =')) {
       const status = params[0];
       const projects = carbonProjects.filter(p => p.status === status);
       return {
         rows: projects,
         rowCount: projects.length
       };
     }
     
     if (text.includes('WHERE project_type =')) {
       const type = params[0];
       const projects = carbonProjects.filter(p => p.project_type === type);
       return {
         rows: projects,
         rowCount: projects.length
       };
     }
     
     return {
       rows: carbonProjects,
       rowCount: carbonProjects.length
     };
   }

  // Mock feature_flags queries
  if (text.includes('FROM feature_flags')) {
    return {
      rows: featureFlagsStorage.map((f) => ({ key: f.key, value: f.value })),
      rowCount: featureFlagsStorage.length
    };
  }

  if (text.includes('INSERT INTO feature_flags')) {
    const key = params[0];
    const value = params[1];
    const existing = featureFlagsStorage.find((f) => f.key === key);
    if (existing) {
      existing.value = value;
      existing.updated_at = new Date();
    } else {
      featureFlagsStorage.push({ key, value, created_at: new Date(), updated_at: new Date() });
    }
    return { rows: [{ key, value }], rowCount: 1 };
  }

   // Mock default response
   return {
     rows: [],
     rowCount: 0
   };
}

// Mock pool
export const pool = {} as Pool;
