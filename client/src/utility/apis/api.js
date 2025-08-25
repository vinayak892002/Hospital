const BASE_URL = 'http://localhost:1333/citius'; // Adjust based on your backend URL

const apiService = {
  // Billing API calls
  getBillings: async () => {
    const response = await fetch(`${BASE_URL}/billings`);
    if (!response.ok) throw new Error('Failed to fetch billing data');
    console.log("Billing data fetched:", await response.clone().json());
    const result = await response.json();
    return result.billing;
  },

  // Appointment API calls
  getAppointments: async () => {
    try {
        const response = await fetch(`${BASE_URL}/appointment`);
        if (!response.ok) throw new Error('Failed to fetch appointment data');
        console.log("Appointment data fetched:", await response.clone().json());
        return response.json();
    } catch (error) {
        console.error("Error fetching appointments:", error);
        throw error;
    }
  },

  // Department API calls
  getDepartments: async () => {
    const response = await fetch(`${BASE_URL}/getUsers`); // Based on your routes
    if (!response.ok) throw new Error('Failed to fetch department data');
    console.log("Department data fetched:", await response.clone().json());
    return response.json();
  },

  // Doctor API calls
  getDoctors: async () => {
    const response = await fetch(`${BASE_URL}/getdoctors`);
    if (!response.ok) throw new Error('Failed to fetch doctor data');
    console.log("Doctor data fetched:", await response.clone().json());
    return response.json();
  }
};

export default apiService;
