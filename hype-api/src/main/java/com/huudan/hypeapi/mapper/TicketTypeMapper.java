package com.huudan.hypeapi.mapper;

import com.huudan.hypeapi.dto.TicketTypeDto;
import com.huudan.hypeapi.model.TicketType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface TicketTypeMapper {

    @Mapping(target = "capacity", source = "quantity")
    @Mapping(target = "sold", source = "soldQuantity")
    @Mapping(target = "status", expression = "java(ticketType.getStatus() != null ? ticketType.getStatus().name() : null)")
    TicketTypeDto toDto(TicketType ticketType);

    List<TicketTypeDto> toDtoList(List<TicketType> ticketTypes);
}
