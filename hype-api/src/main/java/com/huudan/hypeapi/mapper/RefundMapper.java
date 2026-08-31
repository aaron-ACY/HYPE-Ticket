package com.huudan.hypeapi.mapper;

import com.huudan.hypeapi.dto.RefundRequestDto;
import com.huudan.hypeapi.model.RefundRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface RefundMapper {

    @Mapping(target = "orderId", source = "order.id")
    @Mapping(target = "orderCode", source = "order.orderCode")
    @Mapping(target = "requestedAt", source = "createdAt", qualifiedByName = "formatDateTime")
    @Mapping(target = "resolvedAt", source = "resolvedAt", qualifiedByName = "formatDateTime")
    @Mapping(target = "status", expression = "java(refundRequest.getStatus() != null ? refundRequest.getStatus().name() : null)")
    RefundRequestDto toDto(RefundRequest refundRequest);

    List<RefundRequestDto> toDtoList(List<RefundRequest> refundRequests);

    @Named("formatDateTime")
    default String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) return null;
        return dateTime.format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
    }
}
