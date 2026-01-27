from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

user_passwords = {
    "leiaquesada143": "leia_password",
    "cosimaoctavia720": "cosima_password",
    "chelsealee98": "chelsea_password"
}

for username, password in user_passwords.items():
    hashed = pwd_context.hash(password)
    print(f"{username}: {hashed}")
