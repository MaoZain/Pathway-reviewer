const fn_query = require("../middlewares/query")

let fn_loadData = async(ctx, next) =>{
    let result = await fn_query(
      `SELECT fig_id,fig_name,review_status\
       FROM Figure\
       WHERE review_status = 0;`
    )
    ctx.response.body = await result;
}

  module.exports ={
    'POST /loadData': fn_loadData
  };
