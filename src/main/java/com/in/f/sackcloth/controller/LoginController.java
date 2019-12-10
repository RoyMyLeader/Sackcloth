package com.in.f.sackcloth.controller;

import com.in.f.sackcloth.dto.SysUserDTO;
import com.in.f.sackcloth.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/login")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @RequestMapping(value = "/in" ,method = RequestMethod.POST)
    public String Login(@RequestBody SysUserDTO user, HttpServletRequest request){

        return "hello word!";
    }

}
