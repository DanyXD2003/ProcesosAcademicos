import AppRouter from "./router/AppRouter";
import { AcademicDemoProvider } from "./context/AcademicDemoContext";

export default function App() {
  return (
    <AcademicDemoProvider>
      <AppRouter />
    </AcademicDemoProvider>
  );
}
