const express = require("express");
const router = express.Router();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// Company search route
router.get("/company/search", async function (req, res) {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: "Search query 'q' is required" });
  }

  try {
    const response = await fetch(
      `https://www.data.gov.cy/api/action/datastore/search.json?resource_id=b48bf3b6-51f2-4368-8eaa-63d61836aaa9&q=${q}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch company data");
    }

    const data = await response.json();
    const companies = data.result?.records || [];

    if (companies.length === 0) {
      return res.status(404).json({ message: "No companies found" });
    }

    return res.status(200).json({ companies });
  } catch (error) {
    console.error("Error fetching company data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// // Address route
// router.get("/company/address", async function (req, res) {
//   // Log to verify query parameter is correctly captured
//   console.log("Received query parameters:", req.query);

//   const address_seq_no = req.query;

//   if (!address_seq_no) {
//     return res.status(400).json({
//       error: "Address sequence number 'filters[address_seq_no]' is required",
//     });
//   }

//   try {
//     const response = await fetch(
//       `https://www.data.gov.cy/api/action/datastore/search.json?resource_id=31d675a2-4335-40ba-b63c-d830d6b5c55d&filters[address_seq_no]=${address_seq_no}`
//     );

//     if (!response.ok) {
//       throw new Error("Failed to fetch address data");
//     }

//     const data = await response.json();
//     const addresses = data.result?.records || [];

//     if (addresses.length === 0) {
//       return res.status(404).json({ message: "No address found" });
//     }

//     return res.status(200).json({ addresses });
//   } catch (error) {
//     console.error("Error fetching address data:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

// // People route
// router.get("/company/persons", async function (req, res) {
//   // Log all query parameters to troubleshoot
//   console.log("Received query parameters:", req.query);

//   // Capture 'filters[registration_no]' from the query parameters
//   const registration_no = req.query["filters[registration_no]"];

//   if (!registration_no) {
//     return res.status(400).json({
//       error: "Registration number 'filters[registration_no]' is required",
//     });
//   }

//   try {
//     // Fetch data from the external API with the correct registration number filter
//     const response = await fetch(
//       `https://data.gov.cy/api/action/datastore/search.json?resource_id=a1deb65d-102b-4e8e-9b9c-5b357d719477&filters[registration_no]=${registration_no}`
//     );

//     if (!response.ok) {
//       throw new Error("Failed to fetch people data");
//     }

//     // Parse the data received from the API
//     const data = await response.json();
//     const people = data.result?.records || [];

//     if (people.length === 0) {
//       return res.status(404).json({ message: "No people found" });
//     }

//     // Return the filtered data
//     return res.status(200).json({ people });
//   } catch (error) {
//     console.error("Error fetching people data:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });

module.exports = router;
