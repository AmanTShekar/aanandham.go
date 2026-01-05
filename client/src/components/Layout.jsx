import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
    const location = useLocation();
    const hideNavRoutes = ['/login', '/signup', '/admin'];
    const shouldHide = hideNavRoutes.some(route => location.pathname.startsWith(route));

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {!shouldHide && <Navbar />}
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>
            {!shouldHide && <Footer />}
        </div>
    );
};

export default Layout;
