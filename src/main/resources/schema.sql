CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
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
    user_id INT REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    macros JSON,
    calories INT,
    type VARCHAR(50) NOT NULL,
    tags TEXT[],
    notes VARCHAR(500),
    logged_at TIMESTAMP NOT NULL
);

CREATE TABLE medications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    medication_name VARCHAR(255) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    time_taken TIMESTAMP NOT NULL,
    route VARCHAR(80),
    notes VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    activity_type VARCHAR(80) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE meal_glucose_map (
    id SERIAL PRIMARY KEY,
    meal_id INT REFERENCES meals(id),
    glucose_range_id INT REFERENCES glucose_ranges(id),
    priority INT
);
