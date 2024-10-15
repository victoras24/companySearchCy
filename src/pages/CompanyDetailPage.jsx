import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { fetchCompanyData } from "../api/companiesApi";
import { fetchAddressData } from "../api/addressApi";

export default function CompanyDetailPage() {
  const { companyId } = useParams();
  const { state } = useLocation();

  const [companyData, setCompanyData] = useState(state?.company || null);
  const [loading, setLoading] = useState(!state?.company);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!companyData) {
      fetchCompanyDetail(companyId);
    }
  }, [companyId]);

  const fetchCompanyDetail = async (id) => {
    try {
      setLoading(true);
      const corsAnywhereUrl = "http://localhost:8080/";
      const companyUrl = `https://www.data.gov.cy/api/action/datastore/search.json?resource_id=b48bf3b6-51f2-4368-8eaa-63d61836aaa9&q=${id}`;
      const addressApiUrl = `https://www.data.gov.cy/api/action/datastore/search.json?resource_id=31d675a2-4335-40ba-b63c-d830d6b5c55d`;

      const [company] = await fetchCompanyData(id, corsAnywhereUrl, companyUrl);
      console.log("Company Data:", companyData);

      if (!company) {
        throw new Error("Company not found");
      }

      const address = await fetchAddressData(
        corsAnywhereUrl,
        addressApiUrl,
        company.address_seq_no
      );
      setCompanyData({ ...company, address });
    } catch (err) {
      console.error("Error fetching company data:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Failed to load company data.</p>;
  if (!companyData) return <p>No data found for this company.</p>;

  const { organisation_name, organisation_status, address } = companyData;

  return (
    <div>
      <h1>{organisation_name}</h1>
      <p>Status: {organisation_status}</p>
      <h2>Address</h2>
      {address ? (
        <>
          <p>Street: {address.street}</p>
          <p>Building: {address.building}</p>
          <p>Territory: {address.territory}</p>
        </>
      ) : (
        <p>No address available</p>
      )}
    </div>
  );
}
