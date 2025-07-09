package com.example.gros.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.Customizer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

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
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(requests -> requests
            		 .requestMatchers("/api/users/register", "/api/users/login", "/h2-console/**").permitAll()
            		 .requestMatchers("/api/products", "/api/products/**").permitAll()
            		 
            		 // Open these three endpoints without authentication
            		 .requestMatchers(HttpMethod.GET, "/api/users/me").permitAll()
            		 .requestMatchers(HttpMethod.GET, "/api/users/me/*").permitAll()
            		 .requestMatchers(HttpMethod.PUT, "/api/users/me").permitAll()
            		 .requestMatchers(HttpMethod.PUT, "/api/users/me/*").permitAll()
            		 .requestMatchers(HttpMethod.PUT, "/api/users/*/password").permitAll()
            		 
            		 .requestMatchers(HttpMethod.GET, "/api/order", "/api/order/**").authenticated()
            		 .requestMatchers(HttpMethod.POST, "/api/order", "/api/order/**").hasRole("CUSTOMER")
            		 .requestMatchers("/api/cart/**").hasRole("CUSTOMER")
            		 
            		 .requestMatchers("/api/users/customers").hasRole("ADMIN")
            		 .requestMatchers("/api/users/customers/**").hasRole("ADMIN")

            		 .anyRequest().authenticated()
            		)
   
            

            .headers(headers -> headers.frameOptions(frame -> frame.disable())) 
            .formLogin(form -> form.disable())
            .httpBasic(Customizer.withDefaults());

        return http.build();
	
 
	}
	
	@Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(java.util.Arrays.asList("*"));
        configuration.setAllowedMethods(java.util.Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(java.util.Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}


