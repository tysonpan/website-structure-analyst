'use strict';

const Controller = require('egg').Controller;

class GetUrlController extends Controller {
  async index() {
    const { ctx } = this;

    // 获取url文档内容
    const result = await ctx.curl(ctx.query.url);

    // 解析内容
    const cheerio = require('cheerio')
    const $ = cheerio.load(result.data);
    
    let links = [];

    $('a').each(function(i,elem){
      const link = $(this).attr('href');
      if(!link) return;

      // 查找
      const text = $(this).contents().filter(function(){
        return this.nodeType == 3;
      }).text();

      // 去掉不是超链接的和指向自己的
      if(link.indexOf('javascript') !== 0 && link !== '/'){
        links.push({
          'link' : link,
          'text' : text,
        });
      }

    });
    
    ctx.body = {
      code:0,
      masg:'get url success',
      data:links,
      length:links.length
    };
  }
}

module.exports = GetUrlController;
