// export const fetchPersonData = async (baseUrl, registrationNo) => {
//   if (!registrationNo) {
//     console.log("No registration number provided");
//     return [];
//   }

//   try {
//     // Log the inputs for debugging
//     console.log("fetchPersonData inputs:", { baseUrl, registrationNo });

//     // Construct URL with registration_no parameter (not filters[])
//     const url = `${baseUrl}&filters[registration_no]=${registrationNo}`;
//     console.log("Fetching persons from URL:", url);

//     const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//       },
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Response error details:", {
//         status: response.status,
//         statusText: response.statusText,
//         body: errorText,
//         url: url,
//       });
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     console.log("Person data received:", data);
//     return data.people || [];
//   } catch (error) {
//     console.error("Error in fetchPersonData:", error);
//     return [];
//   }
// };
