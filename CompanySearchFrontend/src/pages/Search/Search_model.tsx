import { action, makeObservable, observable, set } from "mobx";
import CompaniesApi from "../../api/companiesApi";
import OfficialsApi from "../../api/OfficialsApi";

type api = "Organisation" | "Official";

interface apiconfig {
  api: typeof CompaniesApi | typeof OfficialsApi;
  method: string;
  dataField: string;
}

const api_config: Record<api, apiconfig> = {
  Organisation: {
    api: CompaniesApi,
    method: "getOrganisation",
    dataField: "organisationData",
  },
  Official: {
    api: OfficialsApi,
    method: "getOfficial",
    dataField: "officialData",
  },
};

class SearchModel {
  @observable searchData: any[] = [];
  @observable searchQuery: string = "";
  @observable isLoading: boolean;
  @observable isFilterOpen: boolean;
  @observable selectedFilter: number = 3;
  @observable selectedOption: keyof typeof api_config = "Organisation";
  /**
   *
   */
  constructor() {
    makeObservable(this);
  }

  @action
  handleSearch = async () => {
    if (!this.searchQuery.trim()) {
      this.setSearchData([]);
      return;
    }

    try {
      this.setLoading(true);
      const config = api_config[this.selectedOption];
      const res = await config.api[config.method](this.searchQuery);
      this.setSearchData(res);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      this.setLoading(false);
    }
  };

  @action
  setSearchData = (searchData: any[]) => {
    this.searchData = searchData;
  };

  @action
  handleInputChange = (event) => {
    const inputValue = (event.target as HTMLInputElement).value;
    this.setSearchQuery(inputValue);
  };

  @action
  setSearchQuery = (input: string) => {
    this.searchQuery = input;
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
