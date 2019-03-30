const app = getApp();
import { citys, cityAZ } from "../../../utils/city";
import { AK } from "../../../utils/index";
console.log(app);

Page({
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const that = this;
        that.setData({
            cityResults: that.data.cityResults === null ? that.data.citys : "北京"
        });
    },
    clickAddress: function(e) {
        const that = this;
        this.setData({
            address: e.currentTarget.dataset.cityname
        });
        wx.request({
            url: `https://api.map.baidu.com/geocoder/v2/?address=${this.data.address}&output=json&ak=${AK}`, //仅为示例，并非真实的接口地址
            success(res) {
                app.changeLocation(res.data.result.location);
                wx.navigateBack({
                    delta: 1,
                    url: "../../pages/index/index",
                    success: function(e) {
                        var page = getCurrentPages().pop();
                        if (page == undefined || page == null) return;
                        page.onLoad();
                        that.setData({
                            inputVal: "",
                            scrollAZ: null,
                            scrollNow: 0,
                            cityResults: that.data.citys
                        });
                    }
                });
            }
        });
    },
    bindAZ: function(e) {
        var currentCityName = e.currentTarget.dataset.id;
        var that = this;
        //放入A-Z的scrollTop参数
        if (that.data.scrollAZ == null) {
            wx.createSelectorQuery()
                .selectAll(".city-item-A-Z")
                .fields({
                        dataset: true,
                        size: true,
                        rect: true
                    },
                    function(res) {
                        res.forEach(function(re) {
                            if (currentCityName == re.dataset.cityname) {
                                wx.pageScrollTo({
                                    scrollTop: re.top + that.data.scrollNow - 55.5,
                                    duration: 0
                                });
                            }
                        });
                    }
                )
                .exec();
        } else {
            this.data.scrollAZ.forEach(function(re) {
                if (currentCityName == re.dataset.cityname) {
                    wx.pageScrollTo({
                        scrollTop: re.top + that.data.scrollNow - 55.5,
                        duration: 0
                    });
                }
            });
        }
    },
    onPageScroll: function(e) {
        // 获取滚动条当前位置
        this.setData({
            scrollNow: e.scrollTop
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    bindSarchInput: function(e) {
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
        });

        this.data.inputVal = e.detail.value;
        var cityResultsTemp = new Array();
        var citys = this.data.citys;

        if (this.data.inputVal === null || this.data.inputVal.trim() === "") {
            this.setData({
                cityResults: citys
            });
            return;
        }
        for (var i = 0; i < citys.length; i++) {
            if (
                citys[i].cityName.indexOf(this.data.inputVal) == 0 ||
                citys[i].cityPY.indexOf(this.data.inputVal.toLowerCase()) == 0 ||
                citys[i].cityPinYin.indexOf(this.data.inputVal.toLowerCase()) == 0
            ) {
                //去除热门城市
                if (citys[i].cityPY.indexOf("#") != -1) {
                    continue;
                }
                var ifHas = false;
                for (var j = 0; j < cityResultsTemp.length; j++) {
                    if (cityResultsTemp[j] == citys[i]) {
                        ifHas = true;
                        break;
                    }
                }
                if (!ifHas) {
                    cityResultsTemp.push(citys[i]);
                }
            }
        }
        this.setData({
            cityResults: cityResultsTemp
        });
    },
    data: {
        scrollAZ: null,
        scrollNow: 0,
        cityResults: null,
        cityAZ: cityAZ,
        citys: citys,
        address: "",
        inputVal: ""
    }
});