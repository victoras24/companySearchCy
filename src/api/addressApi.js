export const fetchAddressData = async (
  corsUrl,
  addressApiUrl,
  companyAddressSeqNo
) => {
  try {
    const res = await fetch(
      `${corsUrl}${addressApiUrl}&filters[address_seq_no]=${companyAddressSeqNo}`
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

  // for some companies the address is not found. For some reason the filter method of the dKan api is not working. Find solution.
  // for example address_seq_no 49716
};
