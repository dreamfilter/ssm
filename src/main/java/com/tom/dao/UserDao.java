package com.tom.dao;

import com.tom.model.User;



public interface UserDao {

    // 根据 id 寻找对应的 User
    User findUserById(int id);
}
