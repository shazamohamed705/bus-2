// API Service for fetching sections and reviews
const BASE_URL = 'https://my-bus.storage-te.com/api';

export const fetchSections = async () => {
  try {
    const response = await fetch(`${BASE_URL}/sections`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sections: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sections:', error);
    // Return empty data structure on error to prevent crashes
    return {
      success: false,
      data: {
        sections: [],
        reviews: []
      }
    };
  }
};
