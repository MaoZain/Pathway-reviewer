const fn_query = require("../middlewares/query")

let fn_selectFigureByName = async(ctx, next) =>{
    console.log(1231231)
    let dataset = ctx.request.body.dataset;
    let name = ctx.request.body.name;
    let result = await fn_query(
      `SELECT fig_id,fig_name,review_status,reviewer_name\
       FROM Figure\
       WHERE review_status = 0 AND reviewer_name = '${name}' AND fig_path like 'static/imgs/${dataset}/%';`
    )
    ctx.response.body = await result;
}

  module.exports ={
    'POST /selectFigureByName': fn_selectFigureByName
  };