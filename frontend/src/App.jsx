import { Navigate, Route, Routes } from "react-router-dom"
import { NavBarComponent } from "./components/NavBarComponent"
import { CrearCuentaPage } from "./pages/CrearCuentaPage"
import { IniciarSesionPage } from "./pages/IniciarSesionPage"
import { HomePage } from "./pages/HomePage"
import { FooterComponent } from "./components/FooterComponent"
import { AdminPage } from "./pages/admin/AdminPage"
import { ProductDetailComponent } from "./components/ProductDetailComponent"
import { PrivateRouteAdmin } from "./components/routes/PrivateRouteAdmin";
import { FavoritesPage } from "./pages/FavoritesPage";
import { ReservationFormComponent } from "./components/ReservationFormComponent";
import { ReservationPage } from "./pages/ReservationPage";
import { ReservationSuccessPage } from "./pages/ReservationSuccessPage";
import { ReservationHistoryPage } from "./pages/ReservationHistoryPage";
import { ToastContainer } from "react-toastify";
import { PoliticaDePrivacidad } from "./components/PoliticaDePrivacidad";

export const App = () => {

    return (
        <>
            <NavBarComponent />
            <div className="main-container">
                <Routes>
                    <Route path="/" element={<HomePage />}></Route>
                    <Route path="/CrearCuenta" element={<CrearCuentaPage />}></Route>
                    <Route path="/IniciarSesion" element={<IniciarSesionPage />}></Route>
                    <Route path="/Favoritos" element={<FavoritesPage />}></Route>
                    <Route path="/Mis-Reservas" element={<ReservationHistoryPage />}></Route>
                    <Route path="/Administracion/*" element={
                        <PrivateRouteAdmin>
                            <AdminPage />
                            </PrivateRouteAdmin>
                    }>
                    </Route>
                    <Route path="/product/:id" element={<ProductDetailComponent />}></Route>
                    <Route path="/reservas/:productId" element={<ReservationFormComponent />}></Route>
                    <Route path="/reservar/:productId/confirmar" element={<ReservationPage />}></Route>
                    <Route path="/reserva-exitosa" element={<ReservationSuccessPage />}></Route>
                    <Route path="/politica-privacidad" element={<PoliticaDePrivacidad />}></Route>
                    <Route path="/*" element={<Navigate to='/' />}> </Route>
                </Routes>
            </div>
            <FooterComponent />
            <ToastContainer />
        </>
    )
}