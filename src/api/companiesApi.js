export const fetchCompanyData = async (input, companyApiUrl) => {
  try {
    console.log("Search Input:", input);
    console.log("API URL being called:", companyApiUrl);

    const response = await fetch(companyApiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Parsed Response Data:", data);

    // The data comes in data.companies array
    const companies = data.companies || [];
    console.log("Final Companies:", companies);

    return companies; // Return the companies array directly
  } catch (error) {
    console.error("Error in fetchCompanyData:", error);
    return [];
  }
};
