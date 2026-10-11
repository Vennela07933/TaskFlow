package com.taskflow.controller;

import com.taskflow.dto.DashboardSummaryDTO;
import com.taskflow.security.UserPrincipal;
import com.taskflow.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardSummaryDTO> getDashboardSummary(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        DashboardSummaryDTO summary = dashboardService.getDashboardSummary(userPrincipal.getId());
        return ResponseEntity.ok(summary);
    }
}
