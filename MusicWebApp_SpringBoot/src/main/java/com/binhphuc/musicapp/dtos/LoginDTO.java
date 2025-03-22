package com.binhphuc.musicapp.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginDTO {
    @NotEmpty(message = "Email is required!")
    @JsonProperty("email")
    private String email;
    @NotEmpty(message = "Password is required!")
    @JsonProperty("password")
    private String password;
}
