import { observable } from "mobx";
import CompaniesApi, {
  CompaniesApi as ICompaniesApi,
} from "../../api/companiesApi";

class SearchModel {
  @observable organisationData: any[];
  @observable isLoading: boolean;
  CompaniesApi: ICompaniesApi;
  /**
   *
   */
  constructor() {
    this.CompaniesApi = CompaniesApi;
  }
}
