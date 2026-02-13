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
                    <h1 className={styles.title}>What's on the menu, Chef?</h1>
                    <p className={styles.subtitle}>
                        Custom AI-inspired meals, just for you.
                    </p>
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
                <div className={styles.imageSide}>
                    <img
                        src={steakImg}
                        alt="Frosted"
                        className={`${styles.cookie} ${styles.top} ${styles.steak}`}
                    />

                    <div className={styles.middleWrapper}>
                        <img
                            src={baguetteImg}
                            alt="Monster"
                            className={`${styles.cookie} ${styles.middle} ${styles.baguette}`}
                        />
                    </div>

                    <img
                        src={avocadoImg}
                        alt="Drizzled"
                        className={`${styles.cookie} ${styles.bottom} ${styles.avocado}`}
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
