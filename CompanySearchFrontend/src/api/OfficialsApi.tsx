import axios from "axios";

export class OfficialsApi {
  controller: string = "http://localhost:5066/api/officials";

  /**
   *
   */
  constructor() {}

  getOfficial = async (officialName: string) => {
    const req = await axios.get(`${this.controller}/${officialName}`);
    return req.data;
  };

  getDetailedOfficial = async (registrationNo: string) => {
    const req = await axios.get(
      `${this.controller}/${registrationNo}/detailed`
    );
    console.log(req);
    return req.data;
  };
}

const instance = new OfficialsApi();
export default instance;
