package com.dilog.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.dilog.backend.entity")
@EnableJpaRepositories("com.dilog.backend.repository")
public class DiLogApplication {

    public static void main(String[] args) {
        SpringApplication.run(DiLogApplication.class, args);
    }
}
