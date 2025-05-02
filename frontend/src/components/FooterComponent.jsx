import logoLD from '../assets/LogoLD.png';
import '../styles/FooterComponent.css'

export const FooterComponent = () => {
    return (
        <footer className='footer'>
            <div className='footer__copyright'>
                <img src={logoLD} alt="Logo Lugar de Descanso" className="footer__logo" />
                <p > ©2025 Lugar de Descanso</p>
            </div>

            <div className='footer__icons'>
                <ul className='footer__icons__list'>
                    <li>
                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                            <i className="ri-facebook-circle-fill"></i>
                        </a>
                    </li>
                    <li>
                        <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                            <i className="ri-linkedin-fill"></i>
                        </a>
                    </li>
                    <li>
                        <a href="https://www.x.com/" target="_blank" rel="noopener noreferrer">
                            <i className="ri-twitter-x-fill"></i>
                        </a>
                    </li>
                    <li>
                        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                            <i className="ri-instagram-line"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </footer>
    )
}
