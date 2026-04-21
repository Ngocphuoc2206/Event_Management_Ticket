package com.envenHub.backend.common;

import java.time.LocalDateTime;

public record TimeRange(
        LocalDateTime from,
        LocalDateTime to
) {}