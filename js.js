$(function(){
	console.log(1)
	var slide = []; //获取右边的下一个形状的显示框
	for(var i = 0;i<4;i++){
		slide[i]= $($('.footer tr')[i]).find('td');
	}
/*	console.log(slide[][])*/
	function Block(){
		this.end = 0;
		this.pos = [3,0];
		this.shape = new Array();
		for(var i = 0; i<4; i++){
			this.shape[i] = []
		}
		this.direction = 40;
		this.color = ['#64363C','#D0104C','#FFC408','#24936E','#574C57'];
	}
	//七种形状
	var block_i = new Block();
	block_i.shape =
			  [[1,1,1,1],
			  [0,0,0,0],
			  [0,0,0,0],
			  [0,0,0,0],
			 ];

	var block_s = new Block();
	block_s.shape =
			  [[0,1,1,0],
			  [1,1,0,0],
			  [0,0,0,0],
			  [0,0,0,0],
			 ];

	var block_fs = new Block();
	block_fs.shape =
			  [[1,1,0,0],
			  [0,1,1,0],
			  [0,0,0,0],
			  [0,0,0,0],
			 ];

	var block_l = new Block();
	block_l.shape =
			  [[1,0,0,0],
			  [1,0,0,0],
			  [1,1,0,0],
			  [0,0,0,0],
			 ];

	var block_fl = new Block();
	block_fl.shape =
			  [[0,1,0,0],
			  [0,1,0,0],
			  [1,1,0,0],
			  [0,0,0,0],
			 ];

	var block_t = new Block();
	block_t.shape =
			  [[0,1,0,0],
			  [1,1,1,0],
			  [0,0,0,0],
			  [0,0,0,0],
			 ];

	var block_fang = new Block();
	block_fang.shape =
			[[1,1,0,0],
			  [1,1,0,0],
			  [0,0,0,0],
			  [0,0,0,0],
			 ];

	//console.log(block_i)
	function slideShow(){
		for(var i = 0;i<4;i++){
			for(var j = 0;j<4;j++){
				//console.log(slide[1][3])
				if(block_i.shape[i][j]){
					$(slide[i][j]).css({'background':'#64363C'})//显示对应的方块
				}
			}
		}
	}
	

	slideShow();
})
	

