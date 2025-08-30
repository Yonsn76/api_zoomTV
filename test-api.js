const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    console.log('Testing API connection...');
    
    // Test health endpoint
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);
    
    // Test login
    console.log('\nTesting login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@zoomtv.com',
      password: 'admin123'
    });
    
    if (loginResponse.data.success) {
      console.log('✅ Login successful');
      const token = loginResponse.data.data.token;
      
      // Test creating a category
      console.log('\nTesting category creation...');
      const categoryData = {
        name: 'Actualidad',
        description: 'Noticias de actualidad',
        color: '#3B82F6',
        icon: 'newspaper',
        order: 1
      };
      
      const categoryResponse = await axios.post(`${API_BASE_URL}/categorias`, categoryData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Category created:', categoryResponse.data);
      
    } else {
      console.log('❌ Login failed');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testAPI();
