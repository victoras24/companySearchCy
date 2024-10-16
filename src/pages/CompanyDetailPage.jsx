import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { fetchCompanyData } from "../api/companiesApi";
import { fetchAddressData } from "../api/addressApi";
import { fetchPersonData } from "../api/personsApi";

export default function CompanyDetailPage() {
  const { companyId } = useParams();
  const { state } = useLocation();
  const [companyData, setCompanyData] = useState(state?.company || null);
  const [loading, setLoading] = useState(!state?.company);
  const [error, setError] = useState(false);

  // Translation dictionary
  const translations = {
    Εγγεγραμμένη: "Registered",
    Γραμματέας: "Secretary",
    Διευθυντής: "Director",
    Εταιρεία: "Company",
    Ιδιωτική: "Private",

    Λευκωσία: "Nicosia",
    Λεμεσός: "Limassol",
    Λάρνακα: "Larnaca",
    Πάφος: "Paphos",
    Αμμόχωστος: "Famagusta",
    Κερύνεια: "Kyrenia",

    Κύπρος: "Cyprus",
  };

  // Translation function
  const translate = (text) => {
    return translations[text] || text;
  };

  // Greek to English transliteration map
  const greekToEnglishMap = {
    Α: "A",
    Β: "V",
    Γ: "G",
    Δ: "D",
    Ε: "E",
    Ζ: "Z",
    Η: "I",
    Θ: "TH",
    Ι: "I",
    Κ: "K",
    Λ: "L",
    Μ: "M",
    Ν: "N",
    Ξ: "X",
    Ο: "O",
    Π: "P",
    Ρ: "R",
    Σ: "S",
    Τ: "T",
    Υ: "Y",
    Φ: "F",
    Χ: "CH",
    Ψ: "PS",
    Ω: "O",
    α: "a",
    β: "v",
    γ: "g",
    δ: "d",
    ε: "e",
    ζ: "z",
    η: "i",
    θ: "th",
    ι: "i",
    κ: "k",
    λ: "l",
    μ: "m",
    ν: "n",
    ξ: "x",
    ο: "o",
    π: "p",
    ρ: "r",
    σ: "s",
    τ: "t",
    υ: "y",
    φ: "f",
    χ: "ch",
    ψ: "ps",
    ω: "o",
    ς: "s",
    Ά: "A",
    Έ: "E",
    Ή: "I",
    Ί: "I",
    Ό: "O",
    Ύ: "Y",
    Ώ: "O",
    ά: "a",
    έ: "e",
    ή: "i",
    ί: "i",
    ό: "o",
    ύ: "y",
    ώ: "o",
    ϊ: "i",
    ϋ: "y",
    ΐ: "i",
    ΰ: "y",
  };

  // Transliteration function
  const transliterate = (text) => {
    return text
      .split("")
      .map((char) => greekToEnglishMap[char] || char)
      .join("");
  };

  useEffect(() => {
    if (!companyData) {
      fetchCompanyDetail(companyId);
    }
  }, [companyId, companyData]);

  const fetchCompanyDetail = async (id) => {
    try {
      setLoading(true);
      const corsAnywhereUrl = "http://localhost:8080/";
      const companyUrl = `https://www.data.gov.cy/api/action/datastore/search.json?resource_id=b48bf3b6-51f2-4368-8eaa-63d61836aaa9&q=${id}`;
      const addressApiUrl = `https://www.data.gov.cy/api/action/datastore/search.json?resource_id=31d675a2-4335-40ba-b63c-d830d6b5c55d`;
      const officialPersonsUrl = `https://data.gov.cy/api/action/datastore/search.json?resource_id=a1deb65d-102b-4e8e-9b9c-5b357d719477`;

      const [company] = await fetchCompanyData(id, corsAnywhereUrl, companyUrl);
      if (!company) {
        throw new Error("Company not found");
      }

      const addressArray = await fetchAddressData(
        corsAnywhereUrl,
        addressApiUrl,
        company.address_seq_no
      );
      console.log("Address Array:", addressArray); // Debugging line

      const personArray = await fetchPersonData(
        corsAnywhereUrl,
        officialPersonsUrl,
        company.registration_no
      );
      console.log("Person Array:", personArray); // Debugging line

      const address = addressArray[0] || {};
      const person = personArray || [];
      setCompanyData({ ...company, address, person });
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

  const { organisation_name, organisation_status, address, person } =
    companyData;
  // Ensure we access the first element in the address array.
  const addressDetails = Array.isArray(address) ? address[0] : address;

  return (
    <div>
      <h1>{transliterate(organisation_name)}</h1>
      <p>Status: {translate(organisation_status)}</p>

      <h2>Address</h2>
      {addressDetails ? (
        <>
          <p>Street: {addressDetails.street}</p>
          <p>Building: {addressDetails.building}</p>
          <p>Territory: {addressDetails.territory}</p>
        </>
      ) : (
        <p>No address available</p>
      )}

      <h2>Persons</h2>
      {Array.isArray(person) && person.length > 0 ? (
        <ul>
          {person.map((p, index) => (
            <li key={index}>
              <p>Name: {transliterate(p.person_or_organisation_name)}</p>
              <p>Position: {translate(p.official_position)}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No person data available</p>
      )}
    </div>
  );
}
