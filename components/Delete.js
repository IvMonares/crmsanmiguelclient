import Swal from "sweetalert2";

const Delete = ({ deleteMessage, deleteFunction }) => {
  // Confirm deletion
  const confirmDeletion = () => {
    Swal.fire({
      title: deleteMessage,
      text: "This action is irreversible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        deleteFunction();
      }
    });
  };

  return (
    <button
      type="button"
      className="bg-red-700 hover:bg-red-800 py-2 px-5 my-3 inline-block text-white rounded text-sm uppercase font-bold flex justify-center items-center w-full text-xs uppercase"
      onClick={() => confirmDeletion()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
          clipRule="evenodd"
        />
      </svg>
      Delete
    </button>
  );
};

export default Delete;
