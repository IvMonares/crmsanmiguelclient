import Router from "next/router";

const Edit = ({ id, href }) => {
  // Function to redirect user to editor
  const editRedirect = () => {
    Router.push({
      pathname: href,
      query: { id },
    });
  };

  return (
    <button
      type="button"
      className="bg-orange-700 hover:bg-orange-800 py-2 px-5 my-3 inline-block text-white rounded text-sm uppercase font-bold flex justify-center items-center w-full text-xs uppercase"
      onClick={() => editRedirect()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
      </svg>
      Edit
    </button>
  );
};

export default Edit;
