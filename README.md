# nasa-mission-control

## 部署

```bash
# 登陆
heroku login -i
# 创建remote heroku
heroku create cyh-nasa
# 更新
git subtree push --prefix server heroku main
```

## 行星数据

csv 文件下载地址： https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=cumulative
