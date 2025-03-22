package com.binhphuc.musicapp.services;

import com.binhphuc.musicapp.dtos.LoginDTO;
import com.binhphuc.musicapp.dtos.UserDTO;
import com.binhphuc.musicapp.exceptions.DataExistException;
import com.binhphuc.musicapp.exceptions.NotFoundException;
import com.binhphuc.musicapp.exceptions.PasswordMachingException;
import com.binhphuc.musicapp.models.User;
import com.binhphuc.musicapp.responses.LoginResponse;

public interface IUserService {
    User createUser(UserDTO userDTO) throws DataExistException;
    LoginResponse login(LoginDTO loginDTO) throws NotFoundException, PasswordMachingException;
}
