package com.binhphuc.musicapp.controllers;

import com.binhphuc.musicapp.dtos.LoginDTO;
import com.binhphuc.musicapp.dtos.UserDTO;
import com.binhphuc.musicapp.exceptions.DataExistException;
import com.binhphuc.musicapp.exceptions.NotFoundException;
import com.binhphuc.musicapp.exceptions.PasswordMachingException;
import com.binhphuc.musicapp.models.User;
import com.binhphuc.musicapp.responses.LoginResponse;
import com.binhphuc.musicapp.services.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequestMapping("api/v1/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
    private final IUserService userService;

    @GetMapping("/test")
    public ResponseEntity<?> getUser() {
        return ResponseEntity.ok("hilo");
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserDTO userDTO) throws PasswordMachingException, DataExistException {
        if (!Objects.equals(userDTO.getPassword(), userDTO.getRetypePassword())) {
            throw new PasswordMachingException("Password and retype password are not match");
        }
        User user = userService.createUser(userDTO);
        return ResponseEntity.ok(user);
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDTO loginDTO) throws NotFoundException, PasswordMachingException {
        LoginResponse loginResponse = userService.login(loginDTO);
        return ResponseEntity.ok(loginResponse);
    }
}
