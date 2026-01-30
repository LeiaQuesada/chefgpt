import styles from './HomePage.module.css'
import avocadoImg from '../assets/avocado.png'
import baguetteImg from '../assets/baguette.png'
import tomatoImg from '../assets/tomato.png'
import steakImg from '../assets/steak.png'
import cookingImg from '../assets/cooking.png'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
    const navigate = useNavigate()
    return (
        <section className={styles.heroContainer}>
            <div className={styles.contentWrapper}>
                {/* Left Side: Typography */}
                <div className={styles.textSide}>
                    <div className="logo-chefgpt">
                        ChefGPT{' '}
                        <span>
                            <img
                                src={cookingImg}
                                alt="cooking"
                                className="logo-img"
                            />
                        </span>
                    </div>

                    <h1 className={styles.title}>
                        LESS THINKING, <br /> MORE EATING.
                    </h1>
                    <p className={styles.subtitle}>
                        AI-powered meals, fit for you.
                    </p>

                    <div className={styles.buttonGroup}>
                        <button
                            className={styles.btnPrimary}
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </button>
                        <button
                            className={styles.btnSecondary}
                            onClick={() => navigate('/register')}
                        >
                            Sign Up
                        </button>
                    </div>
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
