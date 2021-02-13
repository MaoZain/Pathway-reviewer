const fn_query = require("../middlewares/query")

let fn_selectDataStatu = async(ctx, next) =>{
    let statu = ctx.request.body.statu;
    let result = await fn_query(
      `SELECT fig_id,fig_name,review_status\
       FROM Figure\
       WHERE review_status = ${statu};`
    )
    ctx.response.body = await result;
}

  module.exports ={
    'POST /selectDataStatu': fn_selectDataStatu
  };