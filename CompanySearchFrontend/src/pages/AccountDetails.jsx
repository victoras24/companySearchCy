export default function AccountDetails() {
  return (
    <div className="account-summary-page">
      <h1 className="account-summary-title ">Account summary</h1>
      <div className="account-summary-totals">
        <div className="account-summary-saved-companies">
          <h3>Total of saved companies</h3>
          <span>15</span>
        </div>
        <div className="account-summary-groups">
          <h3>Total of created groups</h3>
          <span>5</span>
        </div>
      </div>
      <div className="account-summary-history">
        History of searched companies
      </div>
    </div>
  );
}
