define(function (require, exports, module) {
	//依赖模块
	var sendMsg = require('module_send_msg/send_msg');
	var common = require('module_common/common')
	var variable = require('module_variables/variables');

    //创建loading
    common.createLoadingDiv();
    
	//检查是否处于登陆状态
	common.checkLogin();

	//点击打包按钮
	$('form').submit(function(){
		var fileArr = document.getElementById('fileToUpload').files;

		if(!fileArr.length){
			alert('请上传压缩文件');
			return false;
		};

        var file = fileArr[0];
        uploadFile(file);
		return false;
	});

	//上传文件
	function uploadFile(file) {

        var fd = new FormData();
        var xhr = new XMLHttpRequest();
        var fileInput = document.getElementById('fileToUpload');

        for(var i=0; i<fileInput.files.length; i++){
        	var file_name = fileInput.files[i].name.split('.')[0];
        	fd.append('appName',fileInput.files[i]);
        };

        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", uploadComplete, false);
        xhr.addEventListener("error", uploadFailed, false);
        xhr.open("POST", variable.HTTP_PORT.BUILD_URL);
        xhr.send(fd);
    };

    function uploadComplete(evt) {
        var json = eval('('+evt.target.responseText+')');
        if(json.code === 0){
        	 alert('安装包生成完毕');
	        $('#downLoad').removeClass('disabled');
	        $('#downLoad').attr('href', variable.IP + json.msg.downloadPath);
            $('#release').removeClass('disabled');
            $('#release').click(releaseApp);
        }else{
        	alert('生成ipa失败');
        };
       
    }

    function uploadFailed(evt) {
        alert("发生错误");
    }


    /**
     *  发布客户端到应用服务中;
     */
    function releaseApp() {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load",  releaseComplete, false);
        xhr.addEventListener("error", releaseFailed, false);
        xhr.open("POST", variable.HTTP_PORT.RELEASE_URL);
        xhr.send();
    }

    /**
     * 发布请求响应成功
     */
     function releaseComplete(evt) {        
        var json = eval('('+evt.target.responseText+')');
        
        if(json.code === 0){
            alert('上传成功');
        }else{
            alert('上传失败');
        };
    }

    /**
     *  发布请求响应成功
     */
    function releaseFailed(evt) {
            alert('上传失败');
    }
});