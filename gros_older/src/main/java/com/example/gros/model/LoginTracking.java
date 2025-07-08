package com.example.gros.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "login_tracking")
public class LoginTracking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User user;
    private LocalDateTime lastLogin;


    
    private LocalDateTime lastLogout;
    private String updatedPassword;
    private String oldPassword;
    private String isNowLoggedIn = "N";

    // Getters and setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
    public LocalDateTime getLastLogout() { return lastLogout; }
    public void setLastLogout(LocalDateTime lastLogout) { this.lastLogout = lastLogout; }
    public String getUpdatedPassword() { return updatedPassword; }
    public void setUpdatedPassword(String updatedPassword) { this.updatedPassword = updatedPassword; }
    public String getOldPassword() { return oldPassword; }
    public void setOldPassword(String oldPassword) { this.oldPassword = oldPassword; }
    public String getIsNowLoggedIn() { return isNowLoggedIn; }
    public void setIsNowLoggedIn(String isNowLoggedIn) { this.isNowLoggedIn = isNowLoggedIn; }
    
}