// export const fetchAddressData = async (addressApiUrl, companyAddressSeqNo) => {
//   try {
//     const response = await fetch(
//       `${addressApiUrl}?filters[address_seq_no]=${companyAddressSeqNo}`
//     );

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log("Address data:", data);

//     // Since the API returns data.result.records
//     return data.result?.records || [];
//   } catch (error) {
//     console.error("Error fetching address data:", error);
//     return [];
//   }
// };
