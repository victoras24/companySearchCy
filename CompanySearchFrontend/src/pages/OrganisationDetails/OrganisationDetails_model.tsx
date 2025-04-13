import { makeObservable, observable, action } from "mobx";
import CompaniesApi, {
  CompaniesApi as ICompaniesApi,
} from "../../api/companiesApi";
import OfficialsApi, {
  OfficialsApi as IOfficialsApi,
} from "../../api/OfficialsApi";

interface OrganisationDetails {
  building: string;
  id: number;
  nameStatus: string;
  officials: string;
  organisationName: string;
  organisationStatus: string;
  organisationStatusDate: string;
  organisationType: string;
  organisationTypeCode: string;
  registrationDate: string;
  registrationNo: string;
  street: string;
  territory: string;
}

class OrganisationDetailsModel {
  @observable isLoading: boolean = true;
  @observable detailedData?: OrganisationDetails;
  @observable detailedOfficialsData?: any;
  CompaniesApi: ICompaniesApi;
  OfficialsApi: IOfficialsApi;
  registrationNo: string;

  constructor(registrationNo) {
    makeObservable(this);
    this.CompaniesApi = CompaniesApi;
    this.OfficialsApi = OfficialsApi;
    this.registrationNo = registrationNo;
  }

  @action
  onMount = async () => {
    await this.getDetailedOrganisation();
    await this.getDetailedOrganisationOfficial();
    this.setIsLoading(false);
  };

  @action
  getDetailedOrganisation = async () => {
    try {
      const res = await CompaniesApi.getDetailedOrganisation(
        this.registrationNo
      );
      if (res) {
        this.setDetailData(res);
      }
    } catch (error) {
      console.error("Error fetching detail data:", error);
    }
  };

  @action
  getDetailedOrganisationOfficial = async () => {
    try {
      const res = await OfficialsApi.getDetailedOfficial(this.registrationNo);
      this.setDetailOfficialsData(res);
    } catch (error) {
      console.error("Error fetching detail data:", error);
    }
  };

  @action
  setDetailData = (detailedData: OrganisationDetails) => {
    this.detailedData = detailedData;
  };

  @action
  setDetailOfficialsData = (detailedData) => {
    this.detailedOfficialsData = detailedData;
  };

  @action
  setIsLoading = (isLoading: boolean) => {
    this.isLoading = isLoading;
  };
}

export default OrganisationDetailsModel;
