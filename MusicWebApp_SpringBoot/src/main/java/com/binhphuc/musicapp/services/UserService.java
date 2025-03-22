package com.binhphuc.musicapp.services;

import com.binhphuc.musicapp.dtos.LoginDTO;
import com.binhphuc.musicapp.dtos.UserDTO;
import com.binhphuc.musicapp.exceptions.DataExistException;
import com.binhphuc.musicapp.exceptions.NotFoundException;
import com.binhphuc.musicapp.exceptions.PasswordMachingException;
import com.binhphuc.musicapp.models.User;
import com.binhphuc.musicapp.repositories.UserRepository;
import com.binhphuc.musicapp.responses.LoginResponse;
import lombok.RequiredArgsConstructor;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final UserRepository userRepository;
    @Override
    public User createUser(UserDTO userDTO) throws DataExistException {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new DataExistException("Email is exist");
        }
        User newUser = User.builder()
                .userName(userDTO.getUserName())
                .email(userDTO.getEmail())
                .build();
        String password = userDTO.getPassword();
        String encodedPassword = BCrypt.hashpw(password, BCrypt.gensalt(12));
        newUser.setPassword(encodedPassword);
        return userRepository.save(newUser);
    }

    @Override
    public LoginResponse login(LoginDTO loginDTO) throws NotFoundException, PasswordMachingException {
        Optional<User> optionalUser = userRepository.findByEmail(loginDTO.getEmail());
        if (optionalUser.isEmpty()) {
            throw new NotFoundException("User not found!");
        }
        User user = optionalUser.get();
        if (!BCrypt.checkpw(loginDTO.getPassword(), user.getPassword())) {
            throw new PasswordMachingException("Wrong email or password");
        }
        LoginResponse loginResponse = LoginResponse.builder()
                .message("Login succesfully!")
                .username(user.getUserName())
                .build();
        return loginResponse;
    }
}
