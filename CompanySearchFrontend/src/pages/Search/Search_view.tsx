import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSearch,
	faTimes,
	faFilter,
	faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import { NavLink, useSearchParams } from "react-router-dom";
import useShowToast from "../../Hooks/useShowToast";
import Toast from "../../components/Toast";
import useSaveCompany from "../../Hooks/useSaveCompany";
import { useAuth } from "../../context/AuthStoreContext";
import { Input } from "../../components/Input";
import React, { useEffect, useState } from "react";
import SearchModel from "./Search_model";
import { observer } from "mobx-react";
import { Filter } from "../../components/Filter";

const Search = observer(() => {
	const [searchParams, setSearchParams] = useSearchParams();
	const { user } = useAuth();
	const { handleSaveCompany, isUpdating } = useSaveCompany();
	const { showToast, toastContent, displayToast } = useShowToast();

	const [model] = useState(() => new SearchModel());

	useEffect(() => {
		const debouseSearch = setTimeout(() => {
			model.handleSearch();
		}, 300);

		return () => clearTimeout(debouseSearch);
	}, [model.searchQuery, model.selectedOption]);

	useEffect(() => {
		const filter = searchParams.get("filter");
		if (filter) {
			model.setSelectedOption(filter);
		}
	}, [searchParams]);

	const handleSelectOption = (event) => {
		const option = event.target.value as "Organisation" | "Official";
		model.setSelectedOption(option);
		setSearchParams({ filter: option });
	};

	const isCompanySaved = (companyId) => {
		return user?.savedCompanies.some((saved) => saved.id === companyId.id);
	};

	return (
		<div className="search-page">
			<h1 className="search-title">Cyprus Company Search</h1>
			<p className="search-description">
				Find detailed information about companies registered in Cyprus.
			</p>

			<div className="search-container">
				<div className="input-container">
					<Input
						primaryIcon={faSearch}
						secondaryIcon={faFilter}
						cleanInputIcon={faTimes}
						showFilter={() => model.showFilter(model.isFilterOpen)}
						iconClass="search-input-icon"
						inputChange={model.handleInputChange}
						loading={model.isLoading}
						cleanInputEvent={() => model.cleanInput()}
						inputText={model.searchQuery}
						value={model.searchQuery}
						placeholder={`Enter ${model.selectedOption}'s name`}
					/>
				</div>
				<Filter
					officials={model.selectedOption == "Organisation" ? false : true}
					selectedOption={model.selectedOption}
					onOptionSelect={handleSelectOption}
					selectedFilter={model.selectedFilter}
					selectFilter={(e) => model.handleSelectFilter(e)}
					isFilterOpen={model.isFilterOpen}
					closeFilter={() => model.closeFilter()}
				/>
				{model.searchData.length === 0 && model.searchQuery.trim() === "" ? (
					<div className="search-tips">
						<h2>Search Tips:</h2>
						<ul>
							<li>Enter the full or partial name of the company</li>
							<li>Results will show company name, status, and address</li>
							<li>Click on a result to view more details</li>
							<li>Use the filter icon to refine your search</li>
						</ul>
					</div>
				) : (
					<div className="result-container">
						{model.searchData.map((data) => {
							return (
								<NavLink
									to={`/search/${data.registrationNo}`}
									key={data.registrationNo}
									state={{ registrationNo: data.registrationNo }}
									style={{ textDecoration: "none" }}
								>
									<div className="result-container-data">
										<div className="result-container-top-info">
											<h4 className="result-container-company m-0">
												{model.selectedOption === "Organisation"
													? data.organisationName
													: data.personOrOrganisationName}
											</h4>

											{model.selectedOption === "Organisation" && (
												<div className="status-bookmark-container">
													<p
														className={`result-container-company-status ${
															data.organisationStatus === "Εγγεγραμμένη"
																? "active"
																: "inactive"
														} m-0`}
													>
														{data.organisationStatus === "Εγγεγραμμένη"
															? "Active"
															: "Inactive"}
													</p>
													<FontAwesomeIcon
														icon={
															isCompanySaved(data)
																? faBookmark
																: faBookmarkRegular
														}
														size="lg"
														onClick={(e) => {
															e.preventDefault();
															handleSaveCompany(data, displayToast);
														}}
													/>
												</div>
											)}
										</div>
									</div>
								</NavLink>
							);
						})}
					</div>
				)}
			</div>
			{showToast && <Toast {...toastContent} />}
		</div>
	);
});

export default Search;
