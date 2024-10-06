import { Dispatch, SetStateAction } from "react";

const ModalLayout = ({
  children,
  setShowModal,
}: {
  children: React.ReactNode;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const handleClose = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  return (
    <section
      onClick={handleClose}
      className="bg-black w-full h-screen fixed md:w-[93%] top-0 right-0 bg-opacity-50 z-10 flex items-center justify-center px-10 py-20"
    >
      {children}
    </section>
  );
};

export default ModalLayout;
