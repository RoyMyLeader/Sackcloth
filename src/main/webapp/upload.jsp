<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<script type="text/javascript">
    function showPreview(source) {
        var file = source.files[0];
        if(window.FileReader) {
            var fr = new FileReader();
            fr.onloadend = function(e) {
                document.getElementById("portrait").src = e.target.result;
            };
            fr.readAsDataURL(file);
        }
    }
</script>

<input type="file" name="file" onchange="showPreview(this)" />
<img id="portrait" src="./电子政务博涛3.png" width="70" height="75">