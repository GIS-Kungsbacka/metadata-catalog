import { queryConfig } from "../lib/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

function App() {
  return <QueryClientProvider client={queryClient}></QueryClientProvider>;
}

export default App;
