package com.in.f.sackcloth.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 *
 * @author: lj
 * @date: 2019/08/02
 */
public class SecurityUtils {

    private static Logger logger = LoggerFactory.getLogger(SecurityUtils.class);

    private SecurityUtils(){};

    /**
     * md5加密
     * @param value
     * @return
     */
    public static String md5Encode(String value)throws NoSuchAlgorithmException{
        MessageDigest md5=MessageDigest.getInstance("MD5");
        md5.update(value.getBytes());
        return new BigInteger(1, md5.digest()).toString(16);
    }



}
