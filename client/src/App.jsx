
import CowForm from "./components/CowForm";
import CowList from "./components/CowList";
import ExpensePage from "./pages/ExpensePage";

function App() {
    return (
        <div>
            <h1>Morya FarmCare</h1>
            <p>Cattle Lifecycle and Expense Management System</p>

            <h2>Cow Management</h2>
            <CowForm />
            <hr />
            <CowList />

            <hr />

            <h2>Expense Management</h2>
            <ExpensePage />
        </div>
    );
}

export default App;
