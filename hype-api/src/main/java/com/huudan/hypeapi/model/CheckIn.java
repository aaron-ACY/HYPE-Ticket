package com.huudan.hypeapi.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "check_ins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckIn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(columnDefinition = "BIGINT UNSIGNED")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false, unique = true)
    private Ticket ticket;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "checked_in_by", nullable = false)
    private User checkedInBy;

    @Column(name = "checked_in_at", nullable = false)
    private LocalDateTime checkedInAt;

    @PrePersist
    protected void onCreate() {
        if (checkedInAt == null) {
            checkedInAt = LocalDateTime.now();
        }
    }
}
