import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { GithubRepos } from "./pages/index.js";
import store from "./store/store.js";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme.js";
import "bootstrap/dist/css/bootstrap.css";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <GithubRepos />,
            },
            {
                path: "/post/:slug",
                element: <GithubRepos />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <RouterProvider router={router} />
        </ThemeProvider>
    </Provider>
);
