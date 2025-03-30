import { makeObservable, observable, action } from "mobx";
import CompaniesApi, {
  CompaniesApi as ICompaniesApi,
} from "../../api/companiesApi";

interface OrganisationDetails {
  registrationNo: any;
  name: string;
  status: string;
  incorporationDate: any;
  street: string;
  building: string;
  territory: string;
  officials: string;
}

class OrganisationDetailsModel {
  @observable isLoading: boolean = true;
  @observable detailedData?: OrganisationDetails;
  CompaniesApi: ICompaniesApi;
  registrationNo: any;

  constructor(registrationNo: any) {
    makeObservable(this);
    this.CompaniesApi = CompaniesApi;
    this.registrationNo = registrationNo;
  }

  @action
  onMount = () => {
    this.getDetailedOrganisation();
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
    } finally {
      this.setIsLoading(false);
    }
  };

  @action
  setDetailData = (detailedData: OrganisationDetails) => {
    this.detailedData = detailedData;
  };

  @action
  setIsLoading = (isLoading: boolean) => {
    this.isLoading = isLoading;
  };
}

export default OrganisationDetailsModel;
