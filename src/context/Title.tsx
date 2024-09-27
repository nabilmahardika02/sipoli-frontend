import { ReactNode, createContext, useContext, useState } from "react";

interface DocumentTitleContextType {
  title: string;
  setTitle: (title: string) => void;
}

const DocumentTitleContext = createContext<
  DocumentTitleContextType | undefined
>(undefined);

export const useDocumentTitle = () => {
  const context = useContext(DocumentTitleContext);
  if (!context) {
    throw new Error(
      "useDocumentTitle must be used within a DocumentTitleProvider"
    );
  }
  return context;
};

const DocumentTitleProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitle] = useState<string>("SIPOLI");

  const contextValue: DocumentTitleContextType = {
    title,
    setTitle,
  };

  return (
    <DocumentTitleContext.Provider value={contextValue}>
      {children}
    </DocumentTitleContext.Provider>
  );
};

export const DocumentTitle = DocumentTitleContext;
export default DocumentTitleProvider;
