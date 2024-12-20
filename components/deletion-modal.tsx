type DeletionModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  //title: string;
};

const DeletionModal: React.FC<DeletionModalProps> = ({ isOpen, setIsOpen }) => {
  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    onDelete(e, request.request_id);
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={handleCancel}
              >
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">
              Are you sure you want to delete this?
            </h3>
            <p className="my-4">Request: {request.request_title}</p>
            <div className="modal-action gap-4">
              <button className="btn btn-neutral" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn btn-error" onClick={handleConfirm}>
                Delete
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={handleCancel}>close</button>
          </form>
        </dialog>
      )}
    </>
  );
};

export default DeletionModal;
