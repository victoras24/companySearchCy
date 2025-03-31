import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
} from "react";

const AddToGroupContext = createContext();

export function AddToGroupProvider({ children }) {
  const [openGroup, setOpenGroup] = useState({});
  const plusBtnRef = useRef();
  const groupListRef = useRef();

  useEffect(() => {
    function closeAddToGroup(e) {
      if (
        plusBtnRef.current &&
        !plusBtnRef.current.contains(e.target) &&
        groupListRef.current &&
        !groupListRef.current.contains(e.target)
      ) {
        setOpenGroup({});
      }
    }

    document.body.addEventListener("click", closeAddToGroup);

    return () => {
      document.body.removeEventListener("click", closeAddToGroup);
    };
  }, []);

  const handleOpenGroup = (id) => {
    setOpenGroup((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleAddCompanyToGroup = (groupId) => {
    addCompanyToGroup(data, groupId);
    setOpenGroup({});
  };

  return (
    <AddToGroupContext.Provider
      value={{
        plusBtnRef,
        handleOpenGroup,
        groupListRef,
        handleAddCompanyToGroup,
      }}
    >
      {children}
    </AddToGroupContext.Provider>
  );
}

export function useAddToGroupContext() {
  return useContext(AddToGroupContext);
}
