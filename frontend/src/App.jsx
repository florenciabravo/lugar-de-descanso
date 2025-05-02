import { Navigate, Route, Routes } from "react-router-dom"
import { NavBarComponent } from "./components/NavBarComponent"
import { CrearCuentaPage } from "./pages/CrearCuentaPage"
import { IniciarSesionPage } from "./pages/IniciarSesionPage"
import { HomePage } from "./pages/HomePage"
import { FooterComponent } from "./components/FooterComponent"
import { AdminPage } from "./pages/admin/AdminPage"
import { ProductDetailComponent } from "./components/ProductDetailComponent"

export const App = () => {

    return (
        <>
            <NavBarComponent />
            <div className="main-container">
                <Routes>
                    <Route path="/" element={<HomePage />}></Route>
                    <Route path="/CrearCuenta" element={<CrearCuentaPage />}></Route>
                    <Route path="/IniciarSesion" element={<IniciarSesionPage />}></Route>
                    <Route path="/Administracion/*" element={<AdminPage />}></Route>
                    <Route path="/product/:id" element={<ProductDetailComponent />}></Route>
                    <Route path="/*" element={<Navigate to='/' />}> </Route>
                </Routes>
            </div>
            <FooterComponent />
        </>
    )
}