package com.envenHub.backend.filter;

import com.envenHub.backend.entity.Event;
import com.envenHub.backend.enums.EventStatus;
import com.envenHub.backend.enums.EventVisibility;
import org.springframework.data.jpa.domain.Specification;

public class EventSpecification {
    public static Specification<Event> isPublishedAndPublic(){
        return ((root, query, cb) -> cb.and(
                cb.equal(root.get("status"), EventStatus.APPROVED),
                cb.equal(root.get("visibility"), EventVisibility.PUBLIC)
        ));
    }

    public static Specification<Event> hasSearch(String search){
        return ((root, query, cb) -> {
            if (search == null || search.isBlank()) return null;

            String keyword = "%" + search.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("title")), keyword),
                    cb.like(cb.lower(root.get("venueName")), keyword),
                    cb.like(cb.lower(root.get("city")), keyword)
            );
        });
    }

    public static Specification<Event> hasCategory(String category){
        return ((root, query, cb) -> (
                category == null || category.isBlank() ? null :
                        cb.equal(root.get("category"), category)
                ));
    }

    public static Specification<Event> hasCity(String city){
        return ((root, query, cb) -> (
                city == null || city.isBlank()
                        ? null
                        : cb.like(cb.lower(root.get("city")), "%" + city.toLowerCase() + "%")
                ));
    }

    public static Specification<Event> hasStatus(String status) {
        return (root, query, cb) -> {
            if (status == null || status.isBlank()) {
                return null;
            }
            try {
                EventStatus eventStatus = EventStatus.valueOf(status.toUpperCase());
                return cb.equal(root.get("status"), eventStatus);
            } catch (IllegalArgumentException e) {
                return null;
            }
        };
    }

    // Organizer
    public static Specification<Event> belongsToOrganizer(String organizerId) {
        return (root, query, cb) ->
                organizerId == null ? null :
                        cb.equal(root.get("organizerId"), organizerId);
    }


}
