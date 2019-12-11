package com.in.f.sackcloth.common;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.in.f.sackcloth.common.constant.ResultCode;
import com.in.f.sackcloth.exception.BusinessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import java.util.Objects;

public class Result<T> {
    /**
     * 不需要返回 resultData 时，使用该常量返回，减少JVM创建对象的时间
     */
    public static final Result SUCCESS = of(ResultCode.SUCCESS, "操作成功");

    private static final Logger log = LoggerFactory.getLogger(Result.class);

    private int resultCode;
    private String resultMsg;
    private T resultData;

    /**
     * 推荐使用静态方法 success() failed() of() 创建对象
     */
    @Deprecated
    public Result() {
    }

    /**
     * 推荐使用静态方法 success() failed() of() 创建对象
     */
    @Deprecated
    public Result(T resultData) {
        this(SUCCESS.resultCode, SUCCESS.resultMsg, resultData);
    }

    /**
     * 推荐使用静态方法 success() failed() of() 创建对象
     */
    @Deprecated
    public Result(int resultCode, String resultMsg, T resultData) {
        this.resultCode = resultCode;
        this.resultMsg = resultMsg;
        this.resultData = resultData;
    }

    public int getResultCode() {
        return resultCode;
    }

    public void setResultCode(int resultCode) {
        this.resultCode = resultCode;
    }

    public String getResultMsg() {
        return resultMsg;
    }

    public void setResultMsg(String resultMsg) {
        this.resultMsg = resultMsg;
    }

    public T getResultData() {
        return resultData;
    }

    public void setResultData(T resultData) {
        this.resultData = resultData;
    }

    @Override
    public String toString() {
        return "Result{" +
                "resultCode=" + resultCode +
                ", resultMsg='" + resultMsg + '\'' +
                ", resultData=" + resultData +
                '}';
    }

    /**
     * 通过静态方法创建对象，推荐使用
     */
    public static <T> Result<T> of(int resultCode, String resultMsg) {
        return of(resultCode, resultMsg, null);
    }

    /**
     * 通过静态方法创建对象，推荐使用
     */
    public static <T> Result<T> of(int resultCode, String resultMsg, T resultData) {
        return new Result<>(resultCode, resultMsg, resultData);
    }

    /**
     * 成功时调用
     */
    public static <T> Result<T> success(T resultData) {
        return of(SUCCESS.resultCode, SUCCESS.resultMsg, resultData);
    }

    /**
     * 失败时调用
     */
    public static Result failed(String resultMsg) {
        return of(ResultCode.FAIL_MSG, resultMsg);
    }

    /**
     * 检查 Result 是否不为null
     *
     * @param result Result
     * @throws BusinessException e
     */
    public static void checkResultNotNull(Result result) throws BusinessException {
        if (Objects.isNull(result)) {
            throw new BusinessException(ResultCode.FAIL_MSG, new String[]{"返回结果为空"});
        }
        log.info("代理返回结果为：{}", JSONObject.toJSONString(result));
    }

    /**
     * 检查 Result 是否为成功操作
     *
     * @param result Result
     * @throws BusinessException e
     */
    public static void checkResultSuccess(Result result) throws BusinessException {
        checkResultNotNull(result);
        // 异常
        if (!Objects.equals(result.getResultCode(), ResultCode.SUCCESS)) {
            throw new BusinessException(ResultCode.FAIL_MSG, new String[]{result.getResultMsg()});
        }
    }

    /**
     * 检查 ResultData 是否不为空 并返回 ResultData
     *
     * @param result Result
     * @return ResultData
     * @throws BusinessException e
     */
    public static Object checkResultDataNotNull(Result result) throws BusinessException {
        checkResultNotNull(result);
        Object resultData = result.getResultData();
        if (Objects.isNull(resultData)) {
            String resultMsg = result.getResultMsg();

            throw new BusinessException(ResultCode.FAIL_MSG,
                    new String[]{StringUtils.isEmpty(resultMsg) ? "返回结果Data为空" : resultMsg});
        }
        return result.getResultData();
    }

    /**
     * 检查 ResultData 是否不为空 并返回 JSONObject
     *
     * @param result Result
     * @return JSONObject
     * @throws BusinessException e
     */
    public static JSONObject checkSuccessAndDataNotNull(Result result) throws BusinessException {
        checkResultSuccess(result);
        Object data = checkResultDataNotNull(result);
        return JSONObject.parseObject(JSONObject.toJSONString(data, SerializerFeature.WriteMapNullValue));
    }

    /**
     * 检查 ResultData 是否不为空 并返回 JSONArray
     *
     * @param result Result
     * @return JSONArray
     * @throws BusinessException e
     */
    public static JSONArray checkSuccessAndDataNotNullToArray(Result result) throws BusinessException {
        checkResultSuccess(result);
        Object data = checkResultDataNotNull(result);
        return JSONArray.parseArray(JSONObject.toJSONString(data, SerializerFeature.WriteMapNullValue));
    }
}
