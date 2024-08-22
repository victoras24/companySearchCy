import { useEffect, useState } from "react"

export default function Search() {
    const [companyData, setCompanyData] = useState([])
    const [loading, setLoading] = useState(false)
    const [companySearchInput, setCompanySearchInput] = useState("")
    const corsAnywhereUrl = 'http://localhost:8080/';
    const apiURL = `https://www.data.gov.cy/api/action/datastore/search.json?resource_id=b48bf3b6-51f2-4368-8eaa-63d61836aaa9&q=${companySearchInput}`


    useEffect(() => {
        if (companySearchInput.trim() !== "") {
            setLoading(true)
            const debouce = setTimeout(() => {
                fetchData()
            }, 300)

            return () => {
                clearTimeout(debouce)
            }
        } else {
            setCompanyData([])
            setLoading(false)
        }
    }, [companySearchInput])

    const fetchData = async () => {
        try {
            console.log("Fetching data for:", companySearchInput)
            const res = await fetch(`${corsAnywhereUrl}${apiURL}`)
            const data = await res.json()
            console.log("Received data:", data)
            setCompanyData(data.result.records)
        } catch (err) {
            console.error("Error fetching data:", err)
            setCompanyData([])
        } finally {
            setLoading(false)
        }
    }


    const companyDataElements = companyData.map((data) => {
        return (
            <div key={data.registration_no} className="result-container-data">
                <p className="result-container-company">
                    {data.organisation_name}
                </p>
                <p className="result-container-address">
                    {data.street}{data.territory}
                </p>
            </div>
        )
    })

    const handleInputChange = (event) => {
        setCompanySearchInput(event.target.value)
    }

    return (
        <div>
            <div className="header-container">
                <h3 className="logo-text">companySearch</h3>
            </div>
            <div className="search-container">
                <input
                    type="text"
                    onChange={handleInputChange}
                    value={companySearchInput}
                    className="search-container-input"
                    placeholder="Enter company's name"
                />
                {loading ? (
                    <p>Loading...</p>
                ) : companyData.length > 0 ? (
                    <div className="result-container">
                        {companyDataElements}
                    </div>
                ) : companySearchInput.trim() !== ""}
            </div>
        </div>
    )
}


