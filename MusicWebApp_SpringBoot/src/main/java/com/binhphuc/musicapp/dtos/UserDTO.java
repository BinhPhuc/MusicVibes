package com.binhphuc.musicapp.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class UserDTO {
    @NotEmpty(message = "Email is required!")
    private String email;
    @NotEmpty(message = "Name is required!")
    @JsonProperty("username")
    private String userName;
    @NotEmpty(message = "Password is required!")
    private String password;
    @NotEmpty(message = "Retype password is required!")
    @JsonProperty("retype_password")
    private String retypePassword;
}
