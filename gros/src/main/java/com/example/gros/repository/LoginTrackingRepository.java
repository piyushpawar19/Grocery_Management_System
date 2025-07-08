package com.example.gros.repository;

import com.example.gros.model.LoginTracking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoginTrackingRepository extends JpaRepository<LoginTracking, Integer> {
} 