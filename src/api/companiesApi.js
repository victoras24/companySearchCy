export const fetchCompanyData = async (input, corsUrl, companyApiUrl) => {
    try {
        console.log("Fetching company data for:", input)
        const res = await fetch(`${corsUrl}${companyApiUrl}`)
        const data = await res.json()
        console.log("Company API response:", data)

        if (!data || typeof data !== 'object') {
            console.error("Unexpected response format from company API:", data)
            return [];
        }

        // Check for different possible structures
        const records = data.result?.records || data.records || []

        return Array.isArray(records) ? records : []
    } catch (err) {
        console.error("Error fetching company data:", err)
        return []
    }
}