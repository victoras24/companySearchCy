export default function Toast({ text, status }) {
  return <div className={`toast toast-${status}`}>{text}</div>;
}
