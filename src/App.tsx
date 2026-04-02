import { useEffect } from "react";
import AppRouter from "./router/Router";
import { useHabitStore } from "./store/habit/useHabitStore";

import "./App.css";

function App() {
  const subscribeToHabits = useHabitStore((s) => s.subscribeToHabits);

  useEffect(() => {
    const unsub = subscribeToHabits();

    return () => {
      unsub(); 
    };
  }, []);

  return <AppRouter />;
}

export default App;