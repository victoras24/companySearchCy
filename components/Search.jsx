import { useEffect, useState } from "react"

export default function Search() {
    const [companyData, setCompanyData] = useState([])
    const [loading, setLoading] = useState(true)
    const [companySearchInput, setCompanySearchInput] = useState("")

    useEffect(() => {
        const debouce = setTimeout(() => {
            const fetchData = async () => {
                try {
                    const res = await fetch(`https://www.data.gov.cy/api/action/datastore/search.json?resource_id=a1deb65d-102b-4e8e-9b9c-5b357d719477&q=${companySearchInput}`)
                    const data = await res.json()
                    setCompanyData(data.result.records)
                } catch (err) {
                    console.log(err)
                } finally {
                    setLoading(false)
                }
            }
            fetchData()
        }, 300)

        return () => {
            clearTimeout(debouce)
        }

    }, [companySearchInput])


    //cleaning data in order to avoid dublication
    const cleanCompanyData = companyData.reduce((acc, record) => {
        if (!acc.some(item => item.organisation_name === record.organisation_name)) {
            acc.push(record)
        }
        return acc
    }, [])

    const companyDataElements = cleanCompanyData.map((data) => {
        return (
            <div key={data.entry_id}>
                <p>
                    {data.organisation_name}
                </p>
            </div>
        )
    })


    const handleInputChange = (event) => {
        setCompanySearchInput(event.target.value)
        console.log(companySearchInput)
    }

    return (
        <div>
            <h1>Company search</h1>
            <input
                type="text"
                onChange={handleInputChange}
                value={companySearchInput}
            />
            {companySearchInput === "" ? <p>Enter company's name</p> : companyDataElements}
        </div>
    )
}