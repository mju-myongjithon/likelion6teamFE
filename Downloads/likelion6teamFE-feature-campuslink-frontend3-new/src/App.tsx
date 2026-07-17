import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { SavedItemsProvider } from "./context/SavedItemsContext";

function App() {
  return (
    <SavedItemsProvider>
      <RouterProvider router={router} />
    </SavedItemsProvider>
  );
}

export default App;