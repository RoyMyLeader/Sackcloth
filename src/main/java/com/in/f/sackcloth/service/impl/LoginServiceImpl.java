package com.in.f.sackcloth.service.impl;

import com.in.f.sackcloth.dto.SysUserDTO;
import com.in.f.sackcloth.mapper.LoginMapper;
import com.in.f.sackcloth.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;

@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    private LoginMapper loginMapper;

    @Override
    public Boolean login(SysUserDTO user, HttpServletRequest request) {
//        loginMapper.login();
        return true;
    }
}
