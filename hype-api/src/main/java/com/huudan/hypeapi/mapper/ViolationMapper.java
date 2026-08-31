package com.huudan.hypeapi.mapper;

import com.huudan.hypeapi.dto.ViolationDto;
import com.huudan.hypeapi.model.Violation;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ViolationMapper {

    @Mapping(target = "type", expression = "java(violation.getType() != null ? violation.getType().name() : null)")
    @Mapping(target = "severity", expression = "java(violation.getSeverity() != null ? violation.getSeverity().name() : null)")
    @Mapping(target = "status", expression = "java(violation.getStatus() != null ? violation.getStatus().name() : null)")
    @Mapping(target = "time", source = "createdAt", qualifiedByName = "formatDateTime")
    ViolationDto toDto(Violation violation);

    List<ViolationDto> toDtoList(List<Violation> violations);

    @Named("formatDateTime")
    default String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) return "";
        return dateTime.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
    }
}
