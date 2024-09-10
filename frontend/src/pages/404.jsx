import { Link } from "react-router-dom";

export default function _404() {
  return (
    <center style={{ color: "white" }}>
      <h1>Page Not Found</h1>

      <Link to="/" className="primary-link">
        Go back
      </Link>
    </center>
  );
}
