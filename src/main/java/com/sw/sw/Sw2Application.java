package com.sw.sw;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class Sw2Application {

	public static void main(String[] args) {

		SpringApplication.run(Sw2Application.class, args);
	}

}
