import  {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
// 1. Definimos el tipo de dato para TypeScript
interface UIContextType {
  showLogs: boolean;
  toggleLogs: () => void;
  setShowLogs: (value: boolean) => void;
}

// 2. Creamos el contexto con un valor por defecto inicial
const UIContext = createContext<UIContextType | undefined>(undefined);

// 3. El Provider que envolverá la App
export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [showLogs, setShowLogs] = useState(false);

  const toggleLogs = () => setShowLogs((prev) => !prev);

  return (
    <UIContext.Provider value={{ showLogs, toggleLogs, setShowLogs }}>
      {children}
    </UIContext.Provider>
  );
};

// 4. Hook personalizado para usar el contexto fácilmente
export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI debe usarse dentro de un UIProvider");
  }
  return context;
};
