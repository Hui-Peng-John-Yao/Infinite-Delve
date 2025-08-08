import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClose: () => void;
}

const AlertDismissable = ({ children, onClose }: Props) => {
  return (
    <div className="alert alert-warning alert-dismissible" role="alert">
      <strong>{children}</strong>
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        onClick={onClose}
      ></button>
    </div>
  );
};

export default AlertDismissable;
