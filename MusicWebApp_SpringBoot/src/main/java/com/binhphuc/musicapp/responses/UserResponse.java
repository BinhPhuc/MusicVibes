package com.binhphuc.musicapp.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class UserResponse {
    @JsonProperty
    private Long id;
    @JsonProperty("email")
    private String email;
    @JsonProperty("username")
    private String userName;
    @JsonProperty("password")
    private String password;
}
