import {
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
	@observable groups;

	/**
	 *
	 */
	constructor() {
		makeObservable(this);
	}

	@action
	onMount = async () => {
		this.setIsLoading(true);
		await this.getGroups();
	};

	@action
	getGroups = async () => {
		try {
			const groupSnapshot = await getDocs(collection(firestore, "users"));
			groupSnapshot.forEach((group) => {
				this.setGroups(group.data().groups);
			});
		} catch (error) {
			console.log(error);
		} finally {
			this.setIsLoading(false);
		}
	};

	@action
	addCompanyInGroup = async (company, groupId, userId) => {
		const userRef = doc(firestore, "users", userId);
		const querySnapshot = await getDoc(userRef);
		const data = querySnapshot.data();
		const groups = data?.groups || [];

		const updatedGroups = groups.map((group) => {
			if (group.id === groupId) {
				return {
					...group,
					companies: [
						...group.companies,
						{ name: company.organisationName, id: company.id },
					],
				};
			}
			return group;
		});

		console.log(updatedGroups);

		await updateDoc(userRef, { groups: updatedGroups });
	};

	@action
	setGroups = (groups) => {
		this.groups = groups;
	};

	setIsLoading = (isLoading) => {
		this.isLoading = isLoading;
	};
}
