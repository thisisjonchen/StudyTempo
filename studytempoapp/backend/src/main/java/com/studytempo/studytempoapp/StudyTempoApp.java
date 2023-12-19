package com.studytempo.studytempoapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })
public class StudyTempoApp {

	public static void main(String[] args) {
		SpringApplication.run(StudyTempoApp.class, args);
	}
}
