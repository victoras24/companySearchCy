import { action, makeObservable, observable } from "mobx";
import { v4 as uuidv4 } from "uuid";

export class OrganizerModel {
	@observable groupName: string = "";
	@observable groups: any[] = [];

	/**
	 *
	 */
	constructor() {
		makeObservable(this);
	}

	@action
	createGroup = () => {
		if (this.groupName == "") {
			return;
		}
		this.groups.push({
			id: uuidv4(),
			name: this.groupName,
		});
		this.groupName = "";
	};

	@action
	handleInputChange = (e) => {
		this.groupName = e.target.value;
	};

	@action
	deleteGroup = (groupId) => {
		const updatedGroupList = this.groups.filter(
			(group) => group.id !== groupId
		);
		this.groups = updatedGroupList;
	};
}
