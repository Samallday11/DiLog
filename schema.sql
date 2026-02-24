CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    profile VARCHAR(255),
    preferences JSON
);

CREATE TABLE glucose_ranges (
    id SERIAL PRIMARY KEY,
    min FLOAT NOT NULL,
    max FLOAT NOT NULL,
    label VARCHAR(50)
);

CREATE TABLE glucose_entries (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    value FLOAT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    glucose_range_id INT REFERENCES glucose_ranges(id)
);

CREATE TABLE meals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    macros JSON,
    calories INT,
    type VARCHAR(50),
    tags TEXT[]
);

CREATE TABLE meal_glucose_map (
    id SERIAL PRIMARY KEY,
    meal_id INT REFERENCES meals(id),
    glucose_range_id INT REFERENCES glucose_ranges(id),
    priority INT
);
