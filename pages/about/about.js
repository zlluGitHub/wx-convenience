//获取应用实例    
var app = getApp()    
Page({  
    data:{  
        hiddenmodalput:true,  
        //可以通过hidden是否掩藏弹出框的属性，来指定那个弹出框  
    },  
    //点击按钮痰喘指定的hiddenmodalput弹出框  
    modalinput:function(){  
        this.setData({  
           hiddenmodalput: !this.data.hiddenmodalput  
        })  
    },  
    //取消按钮  
    cancel: function(){  
        this.setData({  
            hiddenmodalput: true  
        });  
    },  
    //确认  
    confirm: function(){  
        this.setData({  
            hiddenmodalput: true  
        })  
        wx.showToast({  
            title: '提交成功！',  
            icon: 'success',  
            duration: 2000  
        })  
    },
    modalcnt:function(){  
        wx.showModal({  
            title: '系统说明',  
            content: '版本号：1.1.1',  
            success: function(res) {  
                if (res.confirm) {  
                console.log('用户点击确定')  
                } else if (res.cancel) {  
                console.log('用户点击取消')  
                }  
            }  
        })  
    }    
      
})