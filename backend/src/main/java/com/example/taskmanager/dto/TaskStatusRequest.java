package com.example.taskmanager.dto;

import jakarta.validation.constraints.NotNull;

public record TaskStatusRequest(
        @NotNull(message = "Completed must be true or false")
        Boolean completed
) {
}
