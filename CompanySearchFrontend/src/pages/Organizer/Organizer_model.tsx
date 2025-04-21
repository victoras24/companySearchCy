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
}
