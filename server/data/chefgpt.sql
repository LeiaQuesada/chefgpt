DROP TABLE IF EXISTS instructions;
DROP TABLE IF EXISTS ingredients;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	username VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
	image_url TEXT,
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
	FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);

CREATE TABLE instructions (
	id SERIAL PRIMARY KEY,
	recipe_id INTEGER NOT NULL,
    step_text TEXT NOT NULL,
	step_number INTEGER NOT NULL,
	created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
	updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
	FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);


INSERT INTO users (username, password_hash, image_url) VALUES
	('leiaquesada143', 'hash1', 'https://example.com/leia.jpg'),
	('cosimaoctavia720', 'hash2', 'https://example.com/cosima.jpg'),
	('chelsealee98', 'hash3', NULL);

INSERT INTO recipes (user_id, title, total_time) VALUES
	(1, 'Spaghetti Bolognese', 45),
	(2, 'Pancakes', 20),
	(3, 'Avocado Toast', 10);

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
