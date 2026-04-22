package com.dilog.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DatabaseCompatibilityConfig {

    @Bean
    CommandLineRunner migrateLegacyUsersTable(JdbcTemplate jdbcTemplate) {
        return args -> {
            jdbcTemplate.execute("""
                    ALTER TABLE users
                    ADD COLUMN IF NOT EXISTS full_name VARCHAR(120),
                    ADD COLUMN IF NOT EXISTS email VARCHAR(255),
                    ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)
                    """);

            jdbcTemplate.execute("""
                    UPDATE users
                    SET
                        full_name = COALESCE(full_name, 'Temporary User'),
                        email = COALESCE(email, 'temp_' || id || '@example.com'),
                        password_hash = COALESCE(password_hash, 'temp')
                    """);

            jdbcTemplate.execute("""
                    ALTER TABLE users
                    ALTER COLUMN full_name SET NOT NULL,
                    ALTER COLUMN email SET NOT NULL,
                    ALTER COLUMN password_hash SET NOT NULL
                    """);

            Integer existingConstraint = jdbcTemplate.queryForObject("""
                    SELECT COUNT(*)
                    FROM information_schema.table_constraints
                    WHERE table_name = 'users'
                      AND constraint_name = 'users_email_unique'
                    """, Integer.class);

            if (existingConstraint != null && existingConstraint == 0) {
                jdbcTemplate.execute("""
                        ALTER TABLE users
                        ADD CONSTRAINT users_email_unique UNIQUE (email)
                        """);
            }

            jdbcTemplate.execute("""
                    ALTER TABLE meals
                    ADD COLUMN IF NOT EXISTS logged_at TIMESTAMP
                    """);

            jdbcTemplate.execute("""
                    UPDATE meals
                    SET logged_at = NOW()
                    WHERE logged_at IS NULL
                    """);

            jdbcTemplate.execute("""
                    CREATE TABLE IF NOT EXISTS medications (
                        id SERIAL PRIMARY KEY,
                        user_id INT REFERENCES users(id),
                        medication_name VARCHAR(255) NOT NULL,
                        dosage VARCHAR(100) NOT NULL,
                        time_taken TIMESTAMP NOT NULL,
                        route VARCHAR(80),
                        notes VARCHAR(500),
                        created_at TIMESTAMP NOT NULL DEFAULT NOW()
                    )
                    """);

            jdbcTemplate.execute("""
                    ALTER TABLE medications
                    ADD COLUMN IF NOT EXISTS route VARCHAR(80)
                    """);

            jdbcTemplate.execute("""
                    CREATE TABLE IF NOT EXISTS activities (
                        id SERIAL PRIMARY KEY,
                        user_id INT REFERENCES users(id),
                        activity_type VARCHAR(80) NOT NULL,
                        description VARCHAR(255),
                        created_at TIMESTAMP NOT NULL DEFAULT NOW()
                    )
                    """);

            Integer legacyMedicationTableCount = jdbcTemplate.queryForObject("""
                    SELECT COUNT(*)
                    FROM information_schema.tables
                    WHERE table_name = 'medication_entries'
                    """, Integer.class);
            Integer medicationCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM medications", Integer.class);

            if (legacyMedicationTableCount != null && legacyMedicationTableCount > 0
                    && medicationCount != null && medicationCount == 0) {
                jdbcTemplate.execute("""
                        INSERT INTO medications (id, user_id, medication_name, dosage, time_taken, route, notes, created_at)
                        SELECT id, user_id, medication_name, dosage, time_taken, route, notes, created_at
                        FROM medication_entries
                        """);
            }

            Integer legacyActivityTableCount = jdbcTemplate.queryForObject("""
                    SELECT COUNT(*)
                    FROM information_schema.tables
                    WHERE table_name = 'activity_entries'
                    """, Integer.class);
            Integer activityCount = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM activities", Integer.class);

            if (legacyActivityTableCount != null && legacyActivityTableCount > 0
                    && activityCount != null && activityCount == 0) {
                jdbcTemplate.execute("""
                        INSERT INTO activities (id, user_id, activity_type, description, created_at)
                        SELECT id, user_id, category, activity_name, logged_at
                        FROM activity_entries
                        """);
            }
        };
    }
}
