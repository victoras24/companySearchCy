export const fetchCompanyData = async (input, companyApiUrl) => {
  try {
    console.log("Fetching company data for:", input);
    const res = await fetch(companyApiUrl);
    const data = await res.json();

    console.log(data);

    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error fetching company data:", err);
    return [];
  }
};
