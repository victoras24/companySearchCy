import { action, makeObservable, observable, set } from "mobx";
import CompaniesApi, {
  CompaniesApi as ICompaniesApi,
} from "../../api/companiesApi";

class SearchModel {
  @observable organisationData: any[] = [];
  @observable isLoading: boolean;
  @observable organisationName: string;
  @observable isFilterOpen: boolean;
  @observable selectedFilter: number = 3;
  @observable selectedOption: string = "Organisation";
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

  @action
  handleSelectFilter = (event) => {
    this.setSelectedFilter(event.target.id);
  };

  @action
  setSelectedFilter = (id: number) => {
    this.selectedFilter = id;
  };

  @action
  handleSelectOption = (event) => {
    this.setSelectedOption(event.target.value);
  };

  @action
  setSelectedOption = (option) => {
    this.selectedOption = option;
  };

  @action
  showFilter = (isFilterOpen: boolean) => {
    this.isFilterOpen = !isFilterOpen;
  };

  @action
  closeFilter = () => {
    this.isFilterOpen = false;
  };
}

export default SearchModel;
