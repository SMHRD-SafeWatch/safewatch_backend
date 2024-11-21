package com.sw.sw.controller;

import com.sw.sw.service.WarningService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/warnings")
public class WarningController {

    private final WarningService warningService;

    public WarningController(WarningService warningService) {
        this.warningService = warningService;
    }

    @GetMapping("/unresolved")
    public ResponseEntity<Boolean> hasUnresolvedWarnings() {
        boolean hasUnresolved = warningService.hasUnresolvedWarnings();
        return ResponseEntity.ok(hasUnresolved);
    }

    @GetMapping("/unresolved/count")
    public ResponseEntity<Long> countUnresolvedWarnings() {
        long unresolvedCount = warningService.countUnresolvedWarnings();
        return ResponseEntity.ok(unresolvedCount);
    }
}
