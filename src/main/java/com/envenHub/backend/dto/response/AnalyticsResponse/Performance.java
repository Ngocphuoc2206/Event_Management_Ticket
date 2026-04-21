package com.envenHub.backend.dto.response.AnalyticsResponse;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Performance {
    private Long checkedIn;
    private Long notCheckedIn;
}
