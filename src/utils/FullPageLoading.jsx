import { CSpinner } from '@coreui/react';

export default function FullPageLoading({ loading }) {
  if (loading) {
    return (
      <div
        className="position-fixed top-0 d-flex justify-content-center align-items-center vw-100 vh-100 bg-white bg-opacity-75"
        style={{ zIndex: 15000 }}
      >
        <CSpinner className="text-danger mx-auto" />
      </div>
    );
  }
}
