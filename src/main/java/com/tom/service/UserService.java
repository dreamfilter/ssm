package com.tom.service;

import com.tom.model.User;

public interface UserService {


    // 根据 id 寻找对应的 User
    public User findUserById(int id);
}
