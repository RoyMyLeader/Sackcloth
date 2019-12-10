package com.in.f.sackcloth.dto;

import lombok.Data;

import java.util.Date;

@Data
public class SysUserDTO {
    // id，主键
    private Integer userId;
    // 用户名
    private String userName;
    // 创建用户ID
    private Integer createrUserId;
    // 姓名
    private String fullName;
    // 密码
    private String password;
    // 邮箱
    private String email;
    // 状态；1:正常，2:待确认，3:待审核
    private Integer status;
    // 最后登录时间
    private Date lastLoginTime;
    // IP地址
    private String internetProtocolAddress;
    // 通过IP获取地区
    private String addressByInternetProtocol;
    // 是否可以登录
    private Byte canLogin;
}
