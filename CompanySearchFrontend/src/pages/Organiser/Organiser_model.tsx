import { action, makeObservable, observable } from "mobx";
import { v4 as uuidv4 } from "uuid";
import {
	arrayRemove,
	arrayUnion,
	collection,
	doc,
	getDoc,
	getDocs,
	updateDoc,
} from "firebase/firestore";
import { firestore } from "../../Firebase/firebase";

export class OrganiserModel {
	@observable groupName: string = "";
	@observable groups: any[] = [];
	@observable isLoading: boolean;
	@observable expandedGroups: { [key: string]: boolean } = {};

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
	createGroup = async (ref) => {
		if (this.groupName == "") {
			return;
		}

		await updateDoc(ref, {
			groups: arrayUnion({
				id: uuidv4(),
				name: this.groupName,
				companies: [],
			}),
		});

		await this.getGroups();

		this.groupName = "";
	};

	@action
	handleInputChange = (e) => {
		this.groupName = e.target.value;
	};

	@action
	deleteGroup = async (ref, group) => {
		await updateDoc(ref, {
			groups: arrayRemove(group),
		});

		await this.getGroups();
	};

	@action
	deleteCompanyAssignedInGroup = async (userId, companyId, groupId) => {
		const userRef = doc(firestore, "users", userId);
		const querySnapshot = await getDoc(userRef);
		const data = querySnapshot.data();
		const groups = data?.groups;

		const updatedGroup = groups.map((group) => {
			if (group.id !== groupId) return group;
			return {
				...group,
				companies: group.companies.filter((c) => c.id !== companyId),
			};
		});
		await updateDoc(userRef, { groups: updatedGroup });

		await this.getGroups();
	};

	@action
	extendGroup = async (groupId: string) => {
		this.expandedGroups[groupId] = !this.expandedGroups[groupId];
	};

	@action
	setGroups = (groups) => {
		this.groups = groups;
	};

	@action
	setIsLoading = (isLoading: boolean) => {
		this.isLoading = isLoading;
	};
}
