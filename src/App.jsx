import { Outlet } from "react-router-dom";

function App() {
    return (
        <div className="">
            <main className="">
                <Outlet />
            </main>
        </div>
    );
}

export default App;
