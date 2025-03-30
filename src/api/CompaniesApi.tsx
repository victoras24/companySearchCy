import axios from "axios";

export class CompaniesApi {
  controller: string = "http://localhost:5066/api/company";

  /**
   *
   */
  constructor() {}

  getOrganisation = async (companyApiUrl: string) => {
    try {
      const res = await fetch(companyApiUrl);
      const data = await res.json();

      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error("Error fetching company data:", err);
      return [];
    }
  };

  getDetailedOrganisation = async (registrationNo: string) => {
    const req = await axios.get(
      `${this.controller}/${registrationNo}/detailed`
    );
    console.log(req);
    return req.data;
  };
}

const instance = new CompaniesApi();
export default instance;
