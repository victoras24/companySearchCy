import { action, makeObservable, observable } from "mobx";
import CompaniesApi, {
  CompaniesApi as ICompaniesApi,
} from "../../api/companiesApi";

class SearchModel {
  @observable organisationData: any[] = [];
  @observable isLoading: boolean = false;
  @observable organisationName: string;
  CompaniesApi: ICompaniesApi;
  /**
   *
   */
  constructor(organisationName: string) {
    makeObservable(this);
    this.CompaniesApi = CompaniesApi;
    this.organisationName = organisationName;
  }

  @action
  onInput = () => {
    this.getOrganisation();
  };

  @action
  getOrganisation = async () => {
    if (!this.organisationName.trim()) {
      this.setOrganisationData([]);
      return;
    }
    try {
      const res = await CompaniesApi.getOrganisation(this.organisationName);
      this.setOrganisationData(res);
    } catch (error) {
      console.error("Error fetching organisation:", error);
    } finally {
      this.setLoading(false);
    }
  };

  @action
  setOrganisationData = (organisationData) => {
    this.organisationData = organisationData;
  };

  @action
  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = (event.target as HTMLInputElement).value;
    console.log(input);
    this.setOrganisationName(input);
  };

  @action
  setOrganisationName = (organisationName: string) => {
    this.organisationName = organisationName;
  };

  @action
  setLoading = (isLoading: boolean) => {
    this.isLoading = isLoading;
  };
}

export default SearchModel;
