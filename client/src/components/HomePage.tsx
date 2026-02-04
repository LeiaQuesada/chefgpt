import styles from './HomePage.module.css'
import avocadoImg from '../assets/avocado.png'
import baguetteImg from '../assets/baguette.png'
import tomatoImg from '../assets/tomato.png'
import steakImg from '../assets/steak.png'
import { NavLink } from 'react-router-dom'
import { useUser } from '../authentication/useUser'

const HomePage = () => {
    const { user } = useUser()
    return (
        <section className={styles.heroContainer}>
            <div className={styles.contentWrapper}>
                <div>
                    {/* <div>
                        <img
                            src={logoImg}
                            alt="ChefGPT Logo"
                            className={styles.homeNavLogoImgFixed}
                        />
                    </div> */}

                    <h1 className={styles.title}>
                        LESS THINKING, <br /> MORE EATING.
                    </h1>
                    <p className={styles.subtitle}>
                        AI-powered meals, fit for you.
                    </p>
                    {/* this button section should only show if a user is not logged in.  */}
                    {!user && (
                        <div className={styles.buttonGroup}>
                            <NavLink to="/login" className={styles.btnPrimary}>
                                Login
                            </NavLink>
                            <NavLink
                                to="/register"
                                className={styles.btnSecondary}
                            >
                                Sign Up
                            </NavLink>
                        </div>
                    )}
                </div>
                {/* <div className={styles.annotation}>
                    <span className={styles.arrow}>⤴</span>
                    <h3>MONSTER</h3>
                    <p>
                        Gluten-friendly peanut butter oatmeal cookie with
                        semi-sweet chocolate chips & M&M's
                    </p>
                </div> */}
                {/* Right Side: Cookie Stack */}
                <div className={styles.imageSide}>
                    <img
                        src={steakImg}
                        alt="Frosted"
                        className={`${styles.cookie} ${styles.top} ${styles.steak}`}
                    />

                    <div className={styles.middleWrapper}>
                        <img
                            src={avocadoImg}
                            alt="Monster"
                            className={`${styles.cookie} ${styles.middle} ${styles.avocado}`}
                        />
                    </div>

                    <img
                        src={baguetteImg}
                        alt="Drizzled"
                        className={`${styles.cookie} ${styles.bottom} ${styles.baguette}`}
                    />
                    <img
                        src={tomatoImg}
                        alt="Extra Cookie"
                        className={`${styles.cookie} ${styles.bottom} ${styles.overlapBottom} ${styles.tomato}`}
                    />
                </div>
            </div>
        </section>
    )
}
export default HomePage
