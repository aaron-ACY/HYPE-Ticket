package com.huudan.hypeapi.mapper;

import com.huudan.hypeapi.dto.VenueDto;
import com.huudan.hypeapi.model.Venue;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface VenueMapper {
    VenueDto toDto(Venue venue);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Venue toEntity(VenueDto dto);

    List<VenueDto> toDtoList(List<Venue> venues);
}
