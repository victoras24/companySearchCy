import { useEffect, useState } from "react"
import { fetchCompanyData } from "../api/companiesApi"
import { fetchAddressData } from "../api/addressApi"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark } from '@fortawesome/free-solid-svg-icons'
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons'


export default function Search() {
    const [companyData, setCompanyData] = useState([])
    const [loading, setLoading] = useState(false)
    const [companySearchInput, setCompanySearchInput] = useState("")
    const corsAnywhereUrl = 'http://localhost:8080/';
    const companiesApiUrl = `https://www.data.gov.cy/api/action/datastore/search.json?resource_id=b48bf3b6-51f2-4368-8eaa-63d61836aaa9&q=${companySearchInput}`
    const addressApiUrl = `https://www.data.gov.cy/api/action/datastore/search.json?resource_id=31d675a2-4335-40ba-b63c-d830d6b5c55d`

    useEffect(() => {
        if (companySearchInput.trim() !== "") {
            setLoading(true)
            const debouce = setTimeout(async () => {
                const companies = await fetchCompanyData(companySearchInput, corsAnywhereUrl, companiesApiUrl)

                const combinedData = await Promise.all(companies.map(async (company) => {
                    const address = await fetchAddressData(corsAnywhereUrl, addressApiUrl, company.address_seq_no)
                    return { ...company, address, isSaved: false }
                }))
                console.log(combinedData)
                setCompanyData(combinedData)
                setLoading(false)
            }, 300)
            return () => {
                clearTimeout(debouce)
            }
        } else {
            setCompanyData([])
            setLoading(false)
        }
    }, [companySearchInput, corsAnywhereUrl, companiesApiUrl, addressApiUrl])

    const toggleSavedStatus = (entryId) => {
        setCompanyData(prevCompanyData => (
            prevCompanyData.map((company) =>
                company.entry_id === entryId ?
                    { ...company, isSaved: !company.isSaved } :
                    company
            )
        ))
    }

    const companyDataElements = companyData.map((data) => {
        const addressInfo = data.address || []
        const fullAddress = addressInfo.map((address) =>
            `${address.street || ""}${address.territory || ""}`.trim()
        ).join(", ") || "Address not available"

        return (
            <div key={data.registration_no} className="result-container-data">
                <div className="result-container-top-info">
                    <h3 className="result-container-company">
                        {data.organisation_name}
                    </h3>
                    <div className="status-bookmark-container">
                        <p className={`result-container-company-status ${data.organisation_status === "Εγγεγραμμένη" ? "active" : "inactive"}`}>
                            {data.organisation_status === "Εγγεγραμμένη" ? "Active" : "Inactive"}
                        </p>
                        {
                            <FontAwesomeIcon
                                onClick={() => { toggleSavedStatus(data.entry_id) }}
                                icon={data.isSaved ? faBookmark : faBookmarkRegular}
                            />
                        }
                    </div>
                </div>
                <p className="result-container-address">
                    {fullAddress}
                </p>
            </div>
        )
    })

    const handleInputChange = (event) => {
        setCompanySearchInput(event.target.value)
    }

    return (
        <div className="search-container">
            <div className="input-container">
                <input
                    type="text"
                    onChange={handleInputChange}
                    value={companySearchInput}
                    className="search-container-input"
                    placeholder="Enter company's name"
                />
                {loading ? <span className="loader"></span> : ""}
            </div>
            {companyData.length > 0 ? (
                <div className="result-container">
                    {companyDataElements}
                </div>
            ) : companySearchInput.trim() !== ""}
        </div>
    )
}


