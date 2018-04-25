package com.tom.service.impl;


import com.tom.dao.UserDao;
import com.tom.model.User;
import com.tom.service.UserService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service("userService")
public class UserServiceImpl implements UserService {

    @Resource
    private UserDao userDao;

    public User findUserById(int id) {
        return userDao.findUserById(id);
    }
}
