package com.example.backend.Configuration;

import java.util.Arrays;
import java.util.Properties;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import com.example.backend.jwtModule.services.MyUserDetailsService;
import com.example.backend.jwtModule.utils.JwtFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final MyUserDetailsService userDetailsService;

    public SecurityConfig(JwtFilter jwtFilter, MyUserDetailsService userDetailsService) {
        this.jwtFilter = jwtFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {
                }) // Utilise le bean corsFilter
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/login", "/register", "/forgot-password", "/reset-password", "/verify",
                                "/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**", "/v2/api-docs/**",
                                "/swagger-resources/**", "/webjars/**",
                                "/unites-recherche", "/ecoles-doctorales", "/", "/css/**", "/js/**",
                                "/api/doctorant/dashboard/**",
                                "/upload-file", "/api/files/upload", "/api/files/uploads",
                                "/api/files/download/**", "/api/files/view/**", "/api/files/list","/api/etablissements",
                                "/api/encadrants","/api/directeurs","/api/unites-recherche","/file/keywords.json","/api/theses/all","/api/encadrants/**","/**")
                        .permitAll()
                        .requestMatchers("/admin/**").hasRole("ADMINISTRATEUR")
                        .requestMatchers("/directeur/**").hasRole("DIRECTEUR")
                        .requestMatchers("/docteur/**").hasRole("DOCTEUR")
                        .requestMatchers("/encadrant/**").hasRole("ENCADRANT")
                        .requestMatchers("/doctorant/**").hasRole("DOCTORANT")
                        .anyRequest().authenticated())
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);
        mailSender.setUsername("smtpverif793@gmail.com");
        mailSender.setPassword("iflwykqjxtngmpoz");

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");

        mailSender.setJavaMailProperties(props);
        return mailSender;
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Arrays.asList("http://localhost:5173")); // Frontend React
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
