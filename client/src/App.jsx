
import CowForm from "./components/CowForm";
import CowList from "./components/CowList";

function App() {
    return (
        <div>
            <h1>Morya FarmCare</h1>
            <p>Cattle Lifecycle and Expense Management System</p>
            <CowForm />
            <hr />

            <CowList />
        </div>
    );
}

export default App;
