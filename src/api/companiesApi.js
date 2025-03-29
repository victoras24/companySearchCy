export const fetchCompanyData = async (input, companyApiUrl) => {
  try {
    const res = await fetch(companyApiUrl);
    const data = await res.json();

    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error fetching company data:", err);
    return [];
  }
};
