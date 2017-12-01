$(function(){
	console.log(1)
	var slide = [];
	for(var i = 0;i<4;i++){
		slide[i]= $($('.footer tr')[i]).find('td');
	}
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
	Block.prototype.slideShow = function(){
		for(var i = 0;i<4;i++){
			for(var j = 0;j<4;j++){
				if(slide[i][j]){
					$(slide[i][j]).css({'background':'#64363C'})//显示对应的方块
				}
			}
		}
	}
	var i = new Block();
	i.shape =[[1,1,1,1],
			  [0,0,0,0],
			  [0,0,0,0],
			  [0,0,0,0],
			 ];
	i.slideShow();
})
	

