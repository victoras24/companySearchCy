import React, { useEffect, useState } from "react";
import { AccountaDetailsModel } from "./AccountDetails_model";
import { useAuth } from "../../context/AuthStoreContext";
import { observer } from "mobx-react";

const AccountDetails = observer(() => {
	const [model] = useState(() => new AccountaDetailsModel());
	const { user } = useAuth();

	useEffect(() => {
		model.calculateGroupCount(user.uid);
		model.calculateFavoritesCount(user.uid);
	}, []);

	if (model.isLoading) return <p>Loading....</p>;

	return (
		<div className="accountDetail-page container px-2 py-1">
			<h1 className="mb-5">Account Details</h1>
			<div>
				<p>Full Name: {user.fullName}</p>
				<p>Email: {user.email}</p>
				<p>Username: {user.username}</p>
			</div>
			<div className="row gap-2 mt-5">
				<div className="acountDetail-summary col d-flex flex-column justify-content-center align-items-center align-items-center text-center border rounded p-3 mx-3">
					<h3>Total companies saved</h3>
					<span className="accountDetail-count">{model.favoriteCount}</span>
				</div>
				<div className="acountDetail-summary col d-flex flex-column justify-content-center align-items-center align-items-center text-center border rounded p-3 mx-3">
					<h3>Total groups created</h3>
					<span className="accountDetail-count">{model.groupCount}</span>
				</div>
			</div>
		</div>
	);
});

export default AccountDetails;
