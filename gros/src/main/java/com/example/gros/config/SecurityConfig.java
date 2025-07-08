package com.example.gros.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.Customizer;

@Configuration 
@EnableWebSecurity
public class SecurityConfig {
	
	@Bean
	public BCryptPasswordEncoder passwordEncoder() {
	    return new BCryptPasswordEncoder();
	}


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(requests -> requests
            		 .requestMatchers("/api/users/register", "/api/users/login", "/h2-console/**").permitAll()
            		 .requestMatchers(HttpMethod.GET, "/api/products", "/api/products/**").permitAll()
            		 
            		 
            		 .requestMatchers(HttpMethod.GET, "/api/order", "/api/order/**").authenticated()

            	
            		 .requestMatchers(HttpMethod.POST, "/api/order", "/api/order/**").hasRole("CUSTOMER")

            		 .requestMatchers("/api/cart/**").hasRole("CUSTOMER")
            		 .requestMatchers(HttpMethod.PUT, "/api/users/me").hasAnyRole("CUSTOMER", "ADMIN")


 
            	     .requestMatchers(HttpMethod.POST, "/api/products").hasRole("ADMIN")
            		 .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("ADMIN")
            		 .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")
            		 .requestMatchers("/api/users/customers").hasRole("ADMIN")
            		 .requestMatchers("/api/users/customers/**").hasRole("ADMIN")

            		 .anyRequest().authenticated()
            		)
   
            

            .headers(headers -> headers.frameOptions(frame -> frame.disable())) 
            .formLogin(form -> form.disable())
            .httpBasic(Customizer.withDefaults());

        return http.build();
	
 
	}
}


