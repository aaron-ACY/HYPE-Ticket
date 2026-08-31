package com.huudan.hypeapi.service;

import com.huudan.hypeapi.dto.CreateReportRequest;
import com.huudan.hypeapi.dto.ResolveViolationRequest;
import com.huudan.hypeapi.dto.ViolationDto;
import com.huudan.hypeapi.mapper.ViolationMapper;
import com.huudan.hypeapi.model.*;
import com.huudan.hypeapi.repository.UserRepository;
import com.huudan.hypeapi.repository.ViolationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ViolationService {

    private final ViolationRepository violationRepository;
    private final UserRepository userRepository;
    private final ViolationMapper violationMapper;

    @Autowired
    public ViolationService(ViolationRepository violationRepository,
                            UserRepository userRepository,
                            ViolationMapper violationMapper) {
        this.violationRepository = violationRepository;
        this.userRepository = userRepository;
        this.violationMapper = violationMapper;
    }

    @Transactional(readOnly = true)
    public List<ViolationDto> getAllViolations(String status) {
        List<Violation> list;
        if (status != null && !status.trim().isEmpty() && !status.equalsIgnoreCase("all")) {
            list = violationRepository.findByStatus(ViolationStatus.valueOf(status.toUpperCase()));
        } else {
            list = violationRepository.findAllByOrderByCreatedAtDesc();
        }
        return violationMapper.toDtoList(list);
    }

    @Transactional
    public ViolationDto resolveViolation(Long id, ResolveViolationRequest req) {
        Violation violation = violationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cảnh báo vi phạm"));

        if ("BAN_USER".equalsIgnoreCase(req.getAction())) {
            userRepository.findByEmail(violation.getTarget()).ifPresent(u -> {
                u.setStatus(UserStatus.BANNED);
                userRepository.save(u);
            });
            violation.setStatus(ViolationStatus.RESOLVED);
        } else if ("DISMISSED".equalsIgnoreCase(req.getAction())) {
            violation.setStatus(ViolationStatus.DISMISSED);
        } else {
            violation.setStatus(ViolationStatus.RESOLVED);
        }

        return violationMapper.toDto(violationRepository.save(violation));
    }

    @Transactional
    public ViolationDto createReport(CreateReportRequest req) {
        ViolationType type;
        try {
            type = ViolationType.valueOf(req.getType().toUpperCase());
        } catch (Exception e) {
            type = ViolationType.EVENT_DISPUTE;
        }

        ViolationSeverity severity;
        try {
            severity = req.getSeverity() != null ? ViolationSeverity.valueOf(req.getSeverity().toUpperCase()) : ViolationSeverity.MEDIUM;
        } catch (Exception e) {
            severity = ViolationSeverity.MEDIUM;
        }

        String typeLabel = switch (type) {
            case BOT_SCALPER -> "Bot Phe Vé / Đầu Cơ";
            case EVENT_DISPUTE -> "Khiếu Nại Tranh Chấp";
            case FAKE_TICKET -> "Vé Giả / Lừa Đảo";
            case COPYRIGHT -> "Vi Phạm Bản Quyền";
        };

        Violation violation = Violation.builder()
                .type(type)
                .typeLabel(typeLabel)
                .severity(severity)
                .title(req.getTitle())
                .target(req.getTarget())
                .targetType(req.getTargetType() != null ? req.getTargetType() : "EVENT")
                .evidence(req.getEvidence())
                .status(ViolationStatus.PENDING)
                .build();

        return violationMapper.toDto(violationRepository.save(violation));
    }
}
