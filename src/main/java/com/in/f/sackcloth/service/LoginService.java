package com.in.f.sackcloth.service;

import com.in.f.sackcloth.dto.SysUserDTO;

import javax.servlet.http.HttpServletRequest;

public interface LoginService {
    Boolean login(SysUserDTO user, HttpServletRequest request);
}
