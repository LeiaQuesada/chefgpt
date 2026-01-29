DROP TABLE IF EXISTS instructions;
DROP TABLE IF EXISTS ingredients;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS users;

-- in psql, run the following to import this file:
-- \i data/chefgpt.sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    image_url TEXT,
    session_token TEXT UNIQUE,
    session_expires_at TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE recipes (
    id SERIAL PRIMARY KEY ,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    image_url TEXT,
    total_time INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    recipe_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE TABLE instructions (
    id SERIAL PRIMARY KEY,
    recipe_id INTEGER NOT NULL,
    step_text TEXT NOT NULL,
    step_number INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);


INSERT INTO users (username, hashed_password, image_url) VALUES
    ('leiaquesada143', '$2b$12$ZIYIBOy3u66cLJNF5cMbquGPnY1ZE4x4Zb6NRFr0yIGCmA5VdB9q.', 'https://example.com/leia.jpg'),
    ('cosimaoctavia720', '$2b$12$1l1yZJlncGRg9t4h.MDfLe5KreHPNgwHtij8vsqiL3sW0LKuAu2SC', 'https://example.com/cosima.jpg'),
    ('chelsealee98', '$2b$12$wZIdFtt5iNhtB/N.jV85ze7QWQ3Mk/uBW8i5m2B5v7gla42W91632', NULL);

INSERT INTO recipes (user_id, title, total_time, image_url) VALUES
    (1, 'Spaghetti Bolognese', 45, 'https://i.pinimg.com/1200x/55/9d/f1/559df1ec224761eb78d6e24e382e9408.jpg'),
    (2, 'Pancakes', 20, 'https://i.pinimg.com/1200x/f4/05/49/f405496b8f292f22798bde1379ab49e2.jpg'),
    (3, 'Avocado Toast', 10, 'https://i.pinimg.com/1200x/a4/eb/fa/a4ebfa7d97a0cbad273f046153d61bb2.jpg');

INSERT INTO ingredients (recipe_id, name) VALUES
    (1, 'Spaghetti'),
    (1, 'Ground Beef'),
    (1, 'Tomato Sauce'),
    (2, 'Flour'),
    (2, 'Eggs'),
    (2, 'Milk'),
    (3, 'Bread'),
    (3, 'Avocado'),
    (3, 'Salt');

INSERT INTO instructions (recipe_id, step_text, step_number) VALUES
    (1, 'Boil spaghetti according to package instructions.', 1),
    (1, 'Cook ground beef until browned.', 2),
    (1, 'Add tomato sauce to beef and simmer.', 3),
    (2, 'Mix flour, eggs, and milk.', 1),
    (2, 'Pour batter onto hot griddle.', 2),
    (2, 'Flip pancakes when bubbles form.', 3),
    (3, 'Toast the bread.', 1),
    (3, 'Mash avocado and spread on toast.', 2),
    (3, 'Sprinkle with salt.', 3);
