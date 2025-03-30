import axios from "axios";

export class CompaniesApi {
  controller: string = "http://localhost:5066/api/company";

  /**
   *
   */
  constructor() {}

  getOrganisation = async (organisationName: string) => {
    const req = await axios.get(`${this.controller}/${organisationName}`);
    return req.data;
  };

  getDetailedOrganisation = async (registrationNo: string) => {
    const req = await axios.get(
      `${this.controller}/${registrationNo}/detailed`
    );
    return req.data;
  };
}

const instance = new CompaniesApi();
export default instance;
