$(function(){
	var speed = 1000;
	var score = 0;
	var start;
	var rn1, rn2, rm1, rm2;
	var block_now, block_next;
	var slide = []; //获取右边的下一个形状的显示框
	for(var i = 0;i<4;i++){
		slide[i]= $($('.footer tr')[i]).find('td');
	}
	var beforeBlock = [];// 方块上一时刻的位置
        for (var i = 0; i < 16; i++) {
                beforeBlock[i] = new Array();
            }  
    var allBlock = [];//16*10的方块 已完成方块
        for (var i = 0; i < 16; i++) {
                allBlock[i] = new Array();
            }
    var ground = [];//16*10的画布 移动的方块
        for (var i = 0; i < 16; i++) {
            ground[i]= $($(".pannel tr")[i]).find("td");
        }
	function Block(){
		this.end = 0;
		this.pos = [0,3];
		this.shape = new Array();
		for(var i = 0; i<4; i++){
			this.shape[i] = []
		}
		this.dir = 40;
		this.color = ['#64363C','#D0104C','#FFC408','#24936E','#574C57'];
	}
	Block.prototype = {
            //打印方块
        printBlock : function() {
                //判断是否超出边界
                //右
                var q; 
                loop1:
                for (var i = 3; i >= 0; i--) {
                    for (var j = 0; j < 4; j++) {
                        if (this.shape[j][i]) {
                            q = i+1;
                            break loop1;
                        }
                    }
                }
                if ((this.pos[1]+q-10) >= 0) {
                    this.pos[1] = 10-q;
                }
                //下
                var p;
                loop2:
                for (var i = 3; i >= 0; i--) {
                    for (var j = 0; j < 4; j++) {
                        if (this.shape[i][j]) {
                            p = i+1;
                            break loop2;
                        }
                    }
                }
                if (this.pos[0] > 16-p) {
                    this.end = 1;
                    clear(beforeBlock);
                    return;
                }
                clearBefore();
                //判断左右是否有方块
                for (var i = 0; i < 4; i++) {
                    for (var j = 0; j < 4; j++) {
                        if(this.shape[i][j] == 1){
                            if ($(ground[i + this.pos[0]][j + this.pos[1]]).css("z-index") == "1" && this.dir == 39) {
                                   this.pos[1]--;
                                } else if ($(ground[i + this.pos[0]][j + this.pos[1]]).css("z-index") == "1" && this.dir == 37){
                                    this.pos[1]++;
                                }
                        }    
                    }
                }
                //绘制方块
                for (var i = 0; i < 4; i++) {
                    for (var j = 0; j < 4; j++) {
                        if(this.shape[i][j] == 1) {
                            var x = i + this.pos[0];
                            var y = j + this.pos[1];
                            if (x < 15) {
                                if ($(ground[x+1][y]).css("z-index") == "1") {
                                    this.end = 1;
                                }
                            } else {
                                this.end = 1; 
                            }
                            $(ground[x][y]).css({"background" : this.color, "z-index" : 1});
                            beforeBlock[x][y] = 1;
                            //}
                        }
                    }
                }
                //若方块下落完毕，将方块加入到已下落方块矩阵中
                if (this.end == 1) {
                    for (var i = 0; i < 4; i++) {
                        for (var j = 0; j < 4; j++) {
                            if(this.shape[i][j]) {
                                allBlock[i + this.pos[0]][j + this.pos[1]] = 1;
                            }
                        }
                    } 
                }
            },
    changeBlock : function() { 
                var tmp = new Array();
                for (var i = 0; i < 4; i++) {
                    tmp[i] = new Array();
                }
                //顺时针旋转矩阵90度 
                for(var i = 0,dst = 3;i < 4;i++, dst--){
                    for(var j = 0;j < 4;j++)  
                        tmp[j][dst] = this.shape[i][j]; 
                }
                //将旋转后的图像移到矩阵左上角
          /*      var tmp = [
                     [0,0,0,0],
                     [0,0,0,1],
                     [0,0,1,1],
                    [0,0,0,1]]*/
                for(var i = 0;i < 4;i++){
                    var flag = 1;
                    for(var j = 0;j < 4;j++){
                        if (tmp[j][0]) {
                            flag = 0;
                        }
                    }
                    if (flag) {
                        for(var j = 0;j < 4;j++){
                            tmp[j].shift();
                            tmp[j].push(0);
                        }
                    }
                   
                } 
    
                //将旋转后的矩阵保存回原来的矩阵  
                for(var i = 0;i < 4;i++)  
                    for(var j = 0;j < 4;j++)  
                        this.shape[i][j] = tmp[i][j];   
            },
            // 左(37) 上(38) 右(39) 下(40)
    moveBlock : function(keyCode) {
                if (!this.end) {
                    switch (keyCode) {
                        case 38 : {
                            this.dir = 38;
                            this.changeBlock();
                            this.printBlock();
                            break;
                        }
                        case 37 : {
                            this.dir = 37;
                            if (this.pos[1] > 0) {
                                this.pos[1]--;
                                this.printBlock();
                            }
                            break;
                        }
                        case 39 : {
                            this.dir = 39;
                            this.pos[1]++;
                            this.printBlock();
                            break;
                        }
                        case 40 : {
                            this.dir = 40;
                            this.goToEnd();
                            this.printBlock();
                            break;
                        }
                    }
                }
            },
        goToEnd : function(){
                if (!this.end) {
                    var l,b,y1;
                    //得出方块的右边界
                    loop5:
                    for (var i = 3; i >= 0; i--) {
                        for (var j = 0; j < 4; j++) {
                            if (this.shape[j][i]) {
                                l = i;
                                break loop5;
                            }
                        }
                    }
                    //得出方块的下边界及最下的部分的列数
                    loop6:
                    for (var i = 3; i >= 0; i--) {
                        for (var j = 0; j < 4; j++) {
                            if (this.shape[i][j]) {
                                b = i;
                                y1 = j;
                                break loop6;
                            }
                        }
                    }
                    var x1 = this.pos[1];
                    var x2 = l + this.pos[1];
                    var x3 = -1;
                    var x4;
                    // test();
                    loop7:
                    //下方有方块时，下方方块最顶的块的行列
                    for (var i = 0; i < 16; i++) {
                        for (var j = x1; j <= x2; j++) {
                            if (allBlock[i][j]) {
                                x3 = i;//第几行已有方块
                                x2 = j;
                                break loop7;
                            }
                        }
                    }
                    //下方有方块时，上方块最底的块对应下方的块的行列
                    for (var i = 0; i < 16; i++) {
                        if (allBlock[i][y1+this.pos[1]]) {
                            x4 = i;
                            break;
                        } else {
                            x4 = 16;
                        }
                    }
                    //console.log("y1:"+y1,"x4:"+x4,"b:"+b,this.pos[0],this.pos[1])
                    //方块下方没有方块时
                    if (x3 == -1) {
                        this.pos[0] = 15 - b;
                        this.end = 1;
                        return;
                    }
                    //算出下方最顶方块距离上方块对应位置距离
                    for (var i = 3; i >= 0; i--) {
                        if (this.shape[i][x2-this.pos[1]]){
                            x2 = x3 - i-this.pos[0] -1;
                            break;
                        }
                    }
                    //取较小距离，后者为上方方块最底距离下方对应方块距离
                    var x5 = Math.min(x2, (x4-b-1-this.pos[0]))
                    // this.pos[0] = x2+this.pos[0];
                    // console.log(x4,b,x4-b-1-this.pos[0],x5)
                    //将方块移动至该位置
                    this.pos[0] = x5+this.pos[0];
                    this.end = 1;
                }
            }
        };
    //清零16*10的矩阵（beforeBlock和allBlock）
        function clear(clearBlock) {
            for (var i = 0; i < 16; i++) {
                for (var j = 0; j < 10; j++) {
                    clearBlock[i][j] = 0;
                }
            }
        }
        function clearBefore() {
            for (var i = 0; i < 16; i++) {
                for (var j = 0; j < 10; j++) {
                    if (beforeBlock[i][j]) {
                        $(ground[i][j]).css({"background" : "white", "z-index" : 0});
                        beforeBlock[i][j] = 0;   
                    }
                }
            }
        }
        //得到分数
        function getScore() {
            var s;
            for (var i = 0; i < 16; i++) {
                s = 0;
                for (var j = 0; j < 10; j++) {
                    if (allBlock[i][j]) {
                        s++;
                    }
                }
                if (s == 10) {
                    
                    
                    score = score+10;
                    allBlock.splice(i, 1);
                    allBlock.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
                    clearBefore();
                    for (var k = i; k > 0; k--) {
                        for (var l = 0; l < 10; l++) {
                            $(ground[k][l]).css({"background":$(ground[k-1][l]).css("background"),
                                "z-index":$(ground[k-1][l]).css("z-index")});
                        }
                    }
                }
            }
            $("#score").html(score);
           
        }
        
	//===========================================七种形状
	function block_i(){
		Block.call(this)
		this.shape =
			  [[1,1,1,1],
			  [0,0,0,0],
			  [0,0,0,0],
			  [0,0,0,0],
			 ];
	}	
	block_i.prototype = new Block();

	function block_s(){
		Block.call(this);
		this.shape =
			  [[0,1,1,0],
			  [1,1,0,0],
			  [0,0,0,0],
			  [0,0,0,0],
			 ];
	}
	block_s.prototype = new Block();

	function block_fs(){
		Block.call(this);
		this.shape =
			  [[1,1,0,0],
			  [0,1,1,0],
			  [0,0,0,0],
			  [0,0,0,0],
			 ];
	
	}
	block_fs.prototype = new Block();
	function block_l(){
		Block.call(this);
		this.shape =
			  [[1,0,0,0],
			  [1,0,0,0],
			  [1,1,0,0],
			  [0,0,0,0],
			 ];
	
	}
	block_l.prototype = new Block();
	function block_fl(){
		Block.call(this);
		this.shape =
			  [[0,1,0,0],
			  [0,1,0,0],
			  [1,1,0,0],
			  [0,0,0,0],
			 ];

	}
	block_fl.prototype = new Block();
	function block_t(){
		Block.call(this);
		this.shape =
			  [[0,1,0,0],
			  [1,1,1,0],
			  [0,0,0,0],
			  [0,0,0,0],
			 ];
	
	}
	block_t.prototype = new Block();
	function block_fang(){
		Block.call(this)
		this.shape =
			[[1,1,0,0],
			  [1,1,0,0],
			  [0,0,0,0],
			  [0,0,0,0],
			 ];

	}
	block_fang.prototype = new Block();
	
	//=========================================清除下一个的画布
	function cleanNext(){
		for(var i =0;i<4;i++){
			for(var j= 0;j<4;j++){
				$(slide[i][j]).css({'background':'#FFF'});
			}
		}
	}
	//=====================================显示下一个形状
	function slideShow(newBlock){
		cleanNext()
		for(var i = 0;i<4;i++){
			for(var j = 0;j<4;j++){
				//console.log(slide[1][3])
				if(newBlock.shape[i][j]){
					$(slide[i][j]).css({'background': newBlock.color})//显示对应的方块
				}
			}
		}
	}
	// ================================创建新的block
	function createBlock(r1,r2){
		
		//形状
		var newBlock;
		switch(r1){
			case 0: newBlock = new block_i();break;
			case 1: newBlock = new block_s();break;
			case 2: newBlock = new block_fs();break;
			case 3: newBlock = new block_l();break;
			case 4: newBlock = new block_fl();break;
			case 5: newBlock = new block_t();break;
			case 6: newBlock = new block_fang();break;
		}
		//颜色
		//console.log(r2)
        console.log(newBlock)
		newBlock.color = newBlock.color[r2];
	
		console.log(newBlock.color);
		return newBlock;
	}
	
	
	/*setInterval(function(){
		cleanNext();
		var a = createBlock();
		slideShow(a);	

	},1000);*/
    function init(){
            clear(allBlock);
            rn1 = Math.floor(Math.random()*7)
            rn2 = Math.floor(Math.random()*5);
        }
	function play(){
            clear(beforeBlock);
            rm1 = rn1;
            rm2 = rn2;
            console.log("rn1:"+rn1)
            console.log("rn2:"+rn2)
            block_now = createBlock(rm1, rm2);
            
            block_now.printBlock();
            rn1 = Math.floor(Math.random()*7);
            rn2 = Math.floor(Math.random()*5);
            block_next = createBlock(rn1,rn2);
            slideShow(block_next);
            start = setInterval(function(){
                block_now.printBlock();
                if (block_now.end) {
                    clearInterval(start);
                    if (block_now.pos[0] == 1) {
                        alert("Game Over !!");
                        location.reload();
                    } else {
                        play();
                    }
                }
                getScore()
                block_now.pos[0]++;
            },speed);
        }


    //事件绑定
    //---------------------------事件绑定------------------------------
        $(window).keydown(function(event){
            if ( 36 < event.keyCode && event.keyCode < 41 ) {
                block_now.moveBlock(event.keyCode);
            }
        })
        $(".start").click(function(){
            if ($(this).html() == "开始游戏") {
            	//console.log(3)
                init();
                play();
                $(this).html("暂停");
            }else if ($(this).html() == "暂停") {
                clearInterval(start);
                $(this).html("继续");
            }else if ($(this).html() == "继续") {
                start = setInterval(function(){
                block_now.printBlock();
                if (block_now.end) {
                    clearInterval(start);
                    if (block_now.pos[0] == 1) {
                        alert("Game Over !!");
                        location.reload();
                    } else {
                        play();
                    }
                }
                getScore();
                block_now.pos[0]++;
            },speed);
                $(this).html("暂停");
            }
        });
        
})
	

