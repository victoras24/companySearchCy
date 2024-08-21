import { useEffect, useState } from "react"

export default function Search() {
    const [companyData, setCompanyData] = useState([])
    const [loading, setLoading] = useState(false)
    const [companySearchInput, setCompanySearchInput] = useState("")

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
            const res = await fetch(`http://localhost:5000/api/organisations?keyword=${(companySearchInput)}`)
            const data = await res.json()
            console.log("Received data:", data)
            setCompanyData(data)
        } catch (err) {
            console.error("Error fetching data:", err)
            setCompanyData([])
        } finally {
            setLoading(false)
        }
    }

    const companyDataElements = companyData.map((data) => {
        return (
            <div className="result-container" key={data.registration_no}>
                <p className="result-container-company">
                    {data.organisation_name}
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
                />
                {loading ? (
                    <p>Loading...</p>
                ) : companyData.length > 0 ? (
                    companyDataElements
                ) : companySearchInput.trim() !== "" ? (
                    <p>No results found</p>
                ) : (
                    <p className="result-container-company">Enter company's name</p>
                )}
            </div>
        </div>
    )
}