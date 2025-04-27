import {
	arrayRemove,
	collection,
	doc,
	getDoc,
	getDocs,
	updateDoc,
} from "firebase/firestore";
import { action, makeObservable, observable } from "mobx";
import { firestore } from "../../Firebase/firebase";

export class FavoritesModel {
	@observable isLoading: boolean;
	@observable favorites: any[] = [];

	/**
	 *
	 */
	constructor() {
		makeObservable(this);
	}

	@action
	onMount = async () => {
		this.setIsLoading(true);
		await this.getFavorites();
	};

	@action
	getFavorites = async () => {
		try {
			const groupSnapshot = await getDocs(collection(firestore, "users"));
			groupSnapshot.forEach((company) => {
				this.setFavorite(company.data().savedCompanies);
			});
		} catch (error) {
			console.log(error);
		} finally {
			this.setIsLoading(false);
		}
	};

	@action
	deleteCompanyFromFavorites = async (user, company) => {
		const userRef = doc(firestore, "users", user.uid);

		await updateDoc(userRef, {
			savedCompanies: arrayRemove(company),
		});

		await this.getFavorites();
	};

	@action
	addCompanyInGroup = async (company, userId, groupId) => {
		const userRef = doc(firestore, "users", userId);
		const querySnapshot = await getDoc(userRef);
		const data = querySnapshot.data();
		const groups = data?.groups || [];

		const updatedGroups = groups.map((group) => {
			if (group.id != groupId) return group;
			const companyExistsInGroup = group.companies.some(
				(c) => c.id === company.id
			);
			if (companyExistsInGroup) return group;

			return {
				...group,
				companies: [
					...group.companies,
					{ name: company.organisationName, id: company.id },
				],
			};
		});

		await updateDoc(userRef, { groups: updatedGroups });
	};

	@action
	setFavorite = (favorites) => {
		this.favorites = favorites;
	};

	setIsLoading = (isLoading) => {
		this.isLoading = isLoading;
	};
}
