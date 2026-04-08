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
        };
    }
}
