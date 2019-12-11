package com.in.f.sackcloth.exception;

import com.in.f.sackcloth.common.constant.ResultCode;

public class BusinessException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    private final int resultCode;
    private final Object[] args;
    private final Object errorData;

    public BusinessException(int resultCode) {
        this.resultCode = resultCode;
        this.args = null;
        this.errorData = null;
    }

    public BusinessException(int resultCode, Object[] args) {
        this.resultCode = resultCode;
        this.args = args;
        this.errorData = null;
    }

    public BusinessException(int resultCode, Object errorData) {
        this.resultCode = resultCode;
        this.args = null;
        this.errorData = errorData;
    }

    public BusinessException(int resultCode, Object[] args, Object errorData) {
        this.resultCode = resultCode;
        this.args = args;
        this.errorData = errorData;
    }

    public BusinessException(String s) {
        super(s);
        this.resultCode = ResultCode.FAIL_MSG;
        this.args = new String[]{s};
        this.errorData = null;
    }

    public BusinessException(Throwable throwable) {
        super(throwable);
        this.resultCode = ResultCode.FAIL_MSG;
        this.args = new String[]{throwable.getMessage()};
        this.errorData = null;
    }

    public int getResultCode() {
        return this.resultCode;
    }

    public Object[] getArgs() {
        return this.args;
    }

    public Object getErrorData() {
        return this.errorData;
    }
}