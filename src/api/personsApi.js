export const fetchPersonData = async (
  corsUrl,
  personApiUrl,
  companyRegistrationNumber
) => {
  try {
    const res = await fetch(
      `${corsUrl}${personApiUrl}&filters[registration_no]=${companyRegistrationNumber}`
    );
    const data = await res.json();
    if (!data || typeof data !== "object") {
      console.error("Unexpected response format from address API:", data);
      return [];
    }

    // Check for different possible structures
    const records = data.result?.records || data.records || [];

    return Array.isArray(records) ? records : [];
  } catch (err) {
    console.error("Error fetching address data:", err);
    return [];
  }
};
